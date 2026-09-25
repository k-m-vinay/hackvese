import os
import joblib
import numpy as np
import pandas as pd
from xgboost import XGBRegressor

class SpoilageEstimator:
    def __init__(self, model_path='models/spoilage_model.pkl'):
        self.model_path = model_path
        self.model = XGBRegressor(
            n_estimators=120,
            max_depth=6,
            learning_rate=0.08,
            random_state=42
        )
        self.crop_to_idx = {}
        self.category_to_idx = {'perishable': 1, 'semi-perishable': 2, 'durable': 3, '<unknown>': 0}
        self.feature_names = [
            'crop_idx', 'category_idx', 'shelf_life_days', 'spoilage_rate_per_day',
            'distance_km', 'travel_time_hours', 'temperature', 'humidity',
            'temp_stress', 'humidity_stress', 'days_since_harvest'
        ]
        self.is_trained = False
        self.metrics = {}

    def generate_domain_training_data(self, crop_info_df=None, n_samples=3500):
        np.random.seed(42)
        if crop_info_df is None or crop_info_df.empty:
            crop_rows = [
                ('tomato', 7, 10.0, 10, 15, 85, 95, 'perishable'),
                ('onion', 30, 2.0, 0, 4, 65, 70, 'semi-perishable'),
                ('potato', 60, 1.0, 4, 10, 85, 90, 'semi-perishable'),
                ('banana', 10, 8.0, 13, 15, 85, 95, 'perishable'),
                ('mango', 14, 5.0, 13, 15, 85, 90, 'perishable'),
                ('rice', 365, 0.1, 15, 20, 60, 65, 'durable'),
                ('wheat', 365, 0.1, 15, 20, 60, 65, 'durable'),
                ('chilli', 180, 0.5, 0, 10, 60, 70, 'durable'),
                ('coconut', 60, 1.0, 15, 25, 70, 80, 'semi-perishable'),
                ('brinjal', 7, 10.0, 10, 12, 90, 95, 'perishable')
            ]
            crop_info_df = pd.DataFrame(
                crop_rows,
                columns=['crop', 'shelf_life_days', 'spoilage_rate_per_day', 
                         'optimal_temp_min', 'optimal_temp_max', 'optimal_humidity_min', 
                         'optimal_humidity_max', 'category']
            )

        crop_info_df['crop_lower'] = crop_info_df['crop'].str.lower()
        records = []
        for _ in range(n_samples):
            crop_row = crop_info_df.sample(1).iloc[0]
            crop_name = crop_row['crop_lower']
            shelf_life = float(crop_row['shelf_life_days'])
            rate_per_day = float(crop_row['spoilage_rate_per_day'])
            opt_temp_max = float(crop_row['optimal_temp_max'])
            opt_humid_max = float(crop_row['optimal_humidity_max'])
            category = str(crop_row['category']).lower()

            distance = float(np.random.uniform(5, 550))
            travel_time_hours = distance / 40.0 # 40 km/h avg truck speed
            temperature = float(np.random.uniform(18, 42))
            humidity = float(np.random.uniform(35, 95))
            days_since_harvest = float(np.random.choice([0, 1, 2, 3, 4], p=[0.5, 0.25, 0.15, 0.07, 0.03]))

            # Domain physics calculation
            temp_stress = max(0.0, temperature - opt_temp_max)
            humidity_stress = max(0.0, humidity - opt_humid_max)

            # Total transit time in days
            transit_days = travel_time_hours / 24.0
            effective_elapsed_days = days_since_harvest + transit_days

            # Baseline spoilage based on crop shelf-life
            base_loss = (effective_elapsed_days / max(shelf_life, 1.0)) * (rate_per_day / 100.0) * 1.5

            # Thermal and environmental acceleration
            temp_mult = 1.0 + (temp_stress / 15.0) * (0.8 if category == 'perishable' else 0.3)
            humid_mult = 1.0 + (humidity_stress / 30.0) * 0.2

            # Transit physical damage (rough roads, vibration over long distance)
            transit_damage = (distance / 500.0) * 0.02 if category == 'perishable' else (distance / 500.0) * 0.005

            spoilage_rate = base_loss * temp_mult * humid_mult + transit_damage
            # Add small realistic sensor/sampling noise
            spoilage_rate += float(np.random.normal(0, 0.004))
            spoilage_rate = float(np.clip(spoilage_rate, 0.001, 0.40))

            records.append({
                'crop': crop_name,
                'category': category,
                'shelf_life_days': shelf_life,
                'spoilage_rate_per_day': rate_per_day,
                'distance_km': distance,
                'travel_time_hours': travel_time_hours,
                'temperature': temperature,
                'humidity': humidity,
                'temp_stress': temp_stress,
                'humidity_stress': humidity_stress,
                'days_since_harvest': days_since_harvest,
                'spoilage_rate': spoilage_rate
            })

        return pd.DataFrame(records)

    def _prepare_features(self, df, is_training=False):
        X = df.copy()
        if is_training:
            crops = sorted(X['crop'].astype(str).str.lower().unique())
            self.crop_to_idx = {c: i + 1 for i, c in enumerate(crops)}
            self.crop_to_idx['<unknown>'] = 0

        X['crop_idx'] = X['crop'].astype(str).str.lower().map(lambda c: self.crop_to_idx.get(c, 0))
        X['category_idx'] = X['category'].astype(str).str.lower().map(lambda cat: self.category_to_idx.get(cat, 0))

        defaults = {
            'shelf_life_days': 14.0,
            'spoilage_rate_per_day': 5.0,
            'distance_km': 50.0,
            'travel_time_hours': 1.25,
            'temperature': 28.0,
            'humidity': 65.0,
            'temp_stress': 5.0,
            'humidity_stress': 0.0,
            'days_since_harvest': 0.0
        }
        for col, default_val in defaults.items():
            if col not in X.columns:
                X[col] = default_val
            else:
                X[col] = X[col].fillna(default_val)

        return X[self.feature_names]

    def train(self, df=None, crop_info_df=None):
        if df is None or df.empty:
            df = self.generate_domain_training_data(crop_info_df=crop_info_df)

        X_feats = self._prepare_features(df, is_training=True)
        y = df['spoilage_rate']

        self.model.fit(X_feats, y)
        self.is_trained = True

        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        save_dict = {
            'model': self.model,
            'crop_to_idx': self.crop_to_idx,
            'category_to_idx': self.category_to_idx,
            'feature_names': self.feature_names,
            'metrics': self.metrics
        }
        joblib.dump(save_dict, self.model_path)
        return X_feats, y

    def load_model(self):
        if os.path.exists(self.model_path):
            data = joblib.load(self.model_path)
            self.model = data['model']
            self.crop_to_idx = data['crop_to_idx']
            self.category_to_idx = data.get('category_to_idx', self.category_to_idx)
            self.feature_names = data.get('feature_names', self.feature_names)
            self.metrics = data.get('metrics', {})
            self.is_trained = True
        else:
            raise FileNotFoundError(f"Model file not found at {self.model_path}")

    def predict(self, input_data):
        if not self.is_trained:
            self.load_model()

        if isinstance(input_data, dict):
            df = pd.DataFrame([input_data])
        else:
            df = input_data.copy()

        # Compute derived stress values if missing
        if 'travel_time_hours' not in df.columns and 'distance_km' in df.columns:
            df['travel_time_hours'] = df['distance_km'] / 40.0
        if 'temp_stress' not in df.columns:
            opt_temp = df.get('optimal_temp_max', pd.Series([20.0])).iloc[0]
            temp = df.get('temperature', pd.Series([28.0])).iloc[0]
            df['temp_stress'] = max(0.0, float(temp) - float(opt_temp))
        if 'humidity_stress' not in df.columns:
            opt_hum = df.get('optimal_humidity_max', pd.Series([85.0])).iloc[0]
            hum = df.get('humidity', pd.Series([65.0])).iloc[0]
            df['humidity_stress'] = max(0.0, float(hum) - float(opt_hum))

        X_feats = self._prepare_features(df, is_training=False)
        pred = self.model.predict(X_feats)[0]
        spoilage_rate = float(np.clip(pred, 0.005, 0.45))

        # Risk drivers
        drivers = []
        travel_hrs = float(df['travel_time_hours'].iloc[0])
        dist = float(df['distance_km'].iloc[0])
        temp = float(df['temperature'].iloc[0])
        shelf_life = float(df.get('shelf_life_days', pd.Series([14])).iloc[0])

        if shelf_life <= 7:
            drivers.append("Highly perishable crop")
        if dist > 150:
            drivers.append(f"Long transit distance ({round(dist)} km, ~{round(travel_hrs, 1)} hrs)")
        if temp > 32:
            drivers.append(f"High ambient heat ({round(temp, 1)}°C) accelerates decay")

        return {
            'spoilage_rate': round(spoilage_rate, 4),
            'spoilage_percentage': round(spoilage_rate * 100.0, 2),
            'travel_time_hours': round(travel_hrs, 1),
            'risk_drivers': drivers
        }
