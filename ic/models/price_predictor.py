import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import shap

class PricePredictor:
    def __init__(self, model_path='models/price_model.pkl'):
        self.model_path = model_path
        self.model = RandomForestRegressor(n_estimators=120, max_depth=12, random_state=42, n_jobs=-1)
        self.crop_to_idx = {}
        self.market_to_idx = {}
        self.feature_names = [
            'crop_idx', 'market_idx', 'month', 'day_of_week', 'quarter', 
            'sin_month', 'cos_month', 'arrivals_tonnes', 
            'lag_7', 'lag_14', 'lag_30', 'rolling_avg_7'
        ]
        self.is_trained = False
        self.explainer = None
        self.metrics = {}

    def _prepare_features(self, df, is_training=False):
        X = df.copy()
        
        # Ensure date features
        if 'date' in X.columns:
            X['date'] = pd.to_datetime(X['date'])
            X['month'] = X['date'].dt.month
            X['day_of_week'] = X['date'].dt.dayofweek
            X['quarter'] = X['date'].dt.quarter
        else:
            if 'month' not in X.columns:
                X['month'] = 6
            if 'day_of_week' not in X.columns:
                X['day_of_week'] = 2
            if 'quarter' not in X.columns:
                X['quarter'] = 2

        X['sin_month'] = np.sin(2 * np.pi * X['month'] / 12.0)
        X['cos_month'] = np.cos(2 * np.pi * X['month'] / 12.0)

        # Encoders
        if is_training:
            crops = sorted(X['crop'].astype(str).str.lower().unique())
            self.crop_to_idx = {c: i + 1 for i, c in enumerate(crops)}
            self.crop_to_idx['<unknown>'] = 0

            markets = sorted(X['market_name'].astype(str).unique())
            self.market_to_idx = {m: i + 1 for i, m in enumerate(markets)}
            self.market_to_idx['<unknown>'] = 0

        X['crop_idx'] = X['crop'].astype(str).str.lower().map(lambda c: self.crop_to_idx.get(c, 0))
        X['market_idx'] = X['market_name'].astype(str).map(lambda m: self.market_to_idx.get(m, 0))

        # Fill default numeric columns if missing
        default_cols = {
            'arrivals_tonnes': 50.0,
            'lag_7': 2000.0,
            'lag_14': 2000.0,
            'lag_30': 2000.0,
            'rolling_avg_7': 2000.0
        }
        for col, default_val in default_cols.items():
            if col not in X.columns:
                X[col] = default_val
            else:
                X[col] = X[col].fillna(default_val)

        return X[self.feature_names]

    def train(self, df):
        if df.empty:
            raise ValueError("Training DataFrame is empty.")
            
        X_feats = self._prepare_features(df, is_training=True)
        y = df['modal_price'] if 'modal_price' in df.columns else df['price']

        self.model.fit(X_feats, y)
        self.is_trained = True

        # Initialize SHAP explainer
        try:
            self.explainer = shap.TreeExplainer(self.model)
        except Exception as e:
            print(f"Warning initializing SHAP explainer: {e}")
            self.explainer = None

        # Save model artifact
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        save_dict = {
            'model': self.model,
            'crop_to_idx': self.crop_to_idx,
            'market_to_idx': self.market_to_idx,
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
            self.market_to_idx = data['market_to_idx']
            self.feature_names = data.get('feature_names', self.feature_names)
            self.metrics = data.get('metrics', {})
            self.is_trained = True
            try:
                self.explainer = shap.TreeExplainer(self.model)
            except Exception:
                self.explainer = None
        else:
            raise FileNotFoundError(f"Model file not found at {self.model_path}")

    def predict(self, input_data):
        if not self.is_trained:
            self.load_model()

        if isinstance(input_data, dict):
            df = pd.DataFrame([input_data])
        else:
            df = input_data.copy()

        X_feats = self._prepare_features(df, is_training=False)
        pred = self.model.predict(X_feats)[0]

        # Ensemble tree predictions for honest uncertainty intervals
        tree_preds = [tree.predict(X_feats.values)[0] for tree in self.model.estimators_]
        std_dev = float(np.std(tree_preds))
        price_low = float(np.percentile(tree_preds, 10))
        price_high = float(np.percentile(tree_preds, 90))

        # Confidence based on spread
        rel_uncertainty = std_dev / (pred + 1e-6)
        if rel_uncertainty < 0.05:
            confidence = 'High'
            confidence_score = 0.90
        elif rel_uncertainty < 0.12:
            confidence = 'Medium'
            confidence_score = 0.78
        else:
            confidence = 'Low'
            confidence_score = 0.65

        # Trend estimation
        lag_val = df.get('lag_7', pd.Series([pred])).iloc[0]
        if pred > lag_val * 1.03:
            trend = 'rising'
        elif pred < lag_val * 0.97:
            trend = 'declining'
        else:
            trend = 'stable'

        return {
            'predicted_price': round(float(pred), 2),
            'price_range_low': round(price_low, 2),
            'price_range_high': round(price_high, 2),
            'std_dev': round(std_dev, 2),
            'confidence': confidence,
            'confidence_score': confidence_score,
            'trend': trend
        }

    def explain(self, input_data):
        if not self.is_trained:
            self.load_model()

        if isinstance(input_data, dict):
            df = pd.DataFrame([input_data])
        else:
            df = input_data.copy()

        X_feats = self._prepare_features(df, is_training=False)
        
        explanation_items = []
        if self.explainer is not None:
            try:
                shap_vals = self.explainer.shap_values(X_feats)
                vals = shap_vals[0] if isinstance(shap_vals, (list, np.ndarray)) else shap_vals
                for feat, val in zip(self.feature_names, vals):
                    explanation_items.append({
                        'feature': feat,
                        'impact': round(float(val), 2),
                        'direction': 'positive' if val >= 0 else 'negative'
                    })
                explanation_items.sort(key=lambda x: abs(x['impact']), reverse=True)
            except Exception as e:
                print(f"Error computing SHAP values: {e}")

        # Fallback to feature importances if SHAP fails
        if not explanation_items:
            importances = self.model.feature_importances_
            for feat, imp in zip(self.feature_names, importances):
                explanation_items.append({
                    'feature': feat,
                    'impact': round(float(imp * 100), 2),
                    'direction': 'positive'
                })
            explanation_items.sort(key=lambda x: x['impact'], reverse=True)

        return explanation_items[:5]
