import os
import math
import json
import pandas as pd
import numpy as np
from datetime import datetime

import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'models'))
try:
    from price_predictor import PricePredictor
    from spoilage_estimator import SpoilageEstimator
except ImportError:
    from models.price_predictor import PricePredictor
    from models.spoilage_estimator import SpoilageEstimator

class HarvestLinkEngine:
    def __init__(self, data_dir='data', models_dir='models'):
        self.data_dir = data_dir
        self.models_dir = models_dir
        
        self.markets_df = None
        self.crop_info_df = None
        self.price_history_df = None
        self.transport_rates_df = None
        self.weather_df = None
        
        self.price_predictor = None
        self.spoilage_estimator = None
        
        self.load_data()
        self.load_models()

    def load_data(self):
        try:
            # 1. Markets
            markets_path = os.path.join(self.data_dir, 'markets.csv')
            if os.path.exists(markets_path):
                self.markets_df = pd.read_csv(markets_path)
                # Standardize lat/lon column names
                if 'latitude' in self.markets_df.columns and 'lat' not in self.markets_df.columns:
                    self.markets_df['lat'] = self.markets_df['latitude']
                if 'longitude' in self.markets_df.columns and 'lon' not in self.markets_df.columns:
                    self.markets_df['lon'] = self.markets_df['longitude']
            else:
                self.markets_df = pd.DataFrame([
                    {'market_name': 'Bangalore (Yeshwanthpur)', 'lat': 13.0285, 'lon': 77.5350, 'district': 'Bangalore Urban'},
                    {'market_name': 'Mysore', 'lat': 12.2958, 'lon': 76.6394, 'district': 'Mysore'},
                    {'market_name': 'Hubli', 'lat': 15.3647, 'lon': 75.1240, 'district': 'Dharwad'}
                ])

            # 2. Crops Info
            crop_path = os.path.join(self.data_dir, 'crop_info.csv')
            if not os.path.exists(crop_path):
                crop_path = os.path.join(self.data_dir, 'crops.csv')
                
            if os.path.exists(crop_path):
                self.crop_info_df = pd.read_csv(crop_path)
            else:
                self.crop_info_df = pd.DataFrame([
                    {'crop': 'Tomato', 'shelf_life_days': 7, 'spoilage_rate_per_day': 10.0, 'optimal_temp_max': 15, 'optimal_humidity_max': 95, 'category': 'perishable'},
                    {'crop': 'Onion', 'shelf_life_days': 30, 'spoilage_rate_per_day': 2.0, 'optimal_temp_max': 4, 'optimal_humidity_max': 70, 'category': 'semi-perishable'},
                    {'crop': 'Potato', 'shelf_life_days': 60, 'spoilage_rate_per_day': 1.0, 'optimal_temp_max': 10, 'optimal_humidity_max': 90, 'category': 'semi-perishable'}
                ])

            # 3. Market Prices
            prices_path = os.path.join(self.data_dir, 'market_prices.csv')
            if not os.path.exists(prices_path):
                prices_path = os.path.join(self.data_dir, 'price_history.csv')
                
            if os.path.exists(prices_path):
                self.price_history_df = pd.read_csv(prices_path)
                self.price_history_df['date'] = pd.to_datetime(self.price_history_df['date'])
                if 'modal_price' not in self.price_history_df.columns and 'price' in self.price_history_df.columns:
                    self.price_history_df['modal_price'] = self.price_history_df['price']
            else:
                self.price_history_df = pd.DataFrame(columns=['date', 'market_name', 'crop', 'modal_price', 'arrivals_tonnes'])

            # 4. Transport Rates
            transport_path = os.path.join(self.data_dir, 'transport_rates.csv')
            if os.path.exists(transport_path):
                self.transport_rates_df = pd.read_csv(transport_path)
            else:
                self.transport_rates_df = pd.DataFrame([
                    {'vehicle_type': 'Pickup', 'cost_per_km_per_tonne': 12.0, 'capacity_tonnes': 1.5, 'min_charge': 1500},
                    {'vehicle_type': 'Mini Truck', 'cost_per_km_per_tonne': 10.0, 'capacity_tonnes': 3.0, 'min_charge': 2500},
                    {'vehicle_type': 'Medium Truck', 'cost_per_km_per_tonne': 6.0, 'capacity_tonnes': 9.0, 'min_charge': 5000},
                    {'vehicle_type': 'Large Truck', 'cost_per_km_per_tonne': 4.0, 'capacity_tonnes': 15.0, 'min_charge': 8000}
                ])

            # 5. Weather Data
            weather_path = os.path.join(self.data_dir, 'weather_data.csv')
            if os.path.exists(weather_path):
                self.weather_df = pd.read_csv(weather_path)
                self.weather_df['date'] = pd.to_datetime(self.weather_df['date'])
            else:
                self.weather_df = None

            print("HarvestLinkEngine: Datasets loaded successfully.")
        except Exception as e:
            print(f"Error loading datasets: {e}")

    def load_models(self):
        # 1. Price Predictor
        price_model_path = os.path.join(self.models_dir, 'price_model.pkl')
        self.price_predictor = PricePredictor(model_path=price_model_path)
        if os.path.exists(price_model_path):
            try:
                self.price_predictor.load_model()
                print("HarvestLinkEngine: Loaded trained PricePredictor model.")
            except Exception as e:
                print(f"Warning loading price model: {e}")

        # 2. Spoilage Estimator
        spoilage_model_path = os.path.join(self.models_dir, 'spoilage_model.pkl')
        self.spoilage_estimator = SpoilageEstimator(model_path=spoilage_model_path)
        if os.path.exists(spoilage_model_path):
            try:
                self.spoilage_estimator.load_model()
                print("HarvestLinkEngine: Loaded trained SpoilageEstimator model.")
            except Exception as e:
                print(f"Warning loading spoilage model: {e}")

    def calculate_distance(self, lat1, lon1, lat2, lon2):
        """Haversine distance between two coordinates in kilometers."""
        R = 6371.0 # Earth radius in km
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(lat2)
        lon2_rad = math.radians(lon2)

        dlon = lon2_rad - lon1_rad
        dlat = lat2_rad - lat1_rad

        a = math.sin(dlat / 2.0)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2.0)**2
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
        distance = R * c
        # Account for typical road winding factor (~1.25x straight-line distance)
        road_distance = max(1.0, distance * 1.25)
        return road_distance

    def select_transport(self, quantity_tonnes, distance_km, transport_cost_multiplier=1.0):
        """Selects vehicle based on quantity capacity and calculates transport cost."""
        if self.transport_rates_df is not None and not self.transport_rates_df.empty:
            # Sort by capacity
            df_sorted = self.transport_rates_df.sort_values(by='capacity_tonnes')
            suitable = df_sorted[df_sorted['capacity_tonnes'] >= quantity_tonnes]
            if not suitable.empty:
                vehicle = suitable.iloc[0]
            else:
                vehicle = df_sorted.iloc[-1]
            
            rate_per_km_tonne = float(vehicle['cost_per_km_per_tonne'])
            min_charge = float(vehicle['min_charge'])
            vehicle_name = str(vehicle['vehicle_type'])
            
            # Base transport cost formula
            cost = max(min_charge, distance_km * rate_per_km_tonne * max(quantity_tonnes, 0.5))
        else:
            if quantity_tonnes <= 1.5:
                vehicle_name = 'Pickup'
                cost = max(1500, distance_km * 12.0 * quantity_tonnes)
            elif quantity_tonnes <= 3.0:
                vehicle_name = 'Mini Truck'
                cost = max(2500, distance_km * 10.0 * quantity_tonnes)
            else:
                vehicle_name = 'Medium Truck'
                cost = max(5000, distance_km * 6.0 * quantity_tonnes)

        cost *= float(transport_cost_multiplier)
        return {
            'vehicle_type': vehicle_name,
            'cost': round(cost, 2),
            'cost_per_kg': round(cost / (quantity_tonnes * 1000.0), 2)
        }

    def get_weather_for_market(self, market_name, target_date=None, default_temp=28.0, default_hum=65.0):
        """Retrieves actual historical or latest weather observation for market."""
        if self.weather_df is not None and not self.weather_df.empty:
            market_weather = self.weather_df[self.weather_df['market_name'] == market_name]
            if not market_weather.empty:
                if target_date:
                    try:
                        t_date = pd.to_datetime(target_date)
                        dated_weather = market_weather[market_weather['date'] == t_date]
                        if not dated_weather.empty:
                            row = dated_weather.iloc[-1]
                            return {
                                'temperature': float(row['temperature']),
                                'humidity': float(row['humidity']),
                                'condition': str(row.get('condition', 'Clear')),
                                'rainfall_mm': float(row.get('rainfall_mm', 0.0))
                            }
                    except Exception:
                        pass
                # Default to latest entry
                latest_row = market_weather.sort_values(by='date').iloc[-1]
                return {
                    'temperature': float(latest_row['temperature']),
                    'humidity': float(latest_row['humidity']),
                    'condition': str(latest_row.get('condition', 'Clear')),
                    'rainfall_mm': float(latest_row.get('rainfall_mm', 0.0))
                }
                
        return {
            'temperature': default_temp,
            'humidity': default_hum,
            'condition': 'Clear',
            'rainfall_mm': 0.0
        }

    def estimate_spoilage(self, crop, distance_km, temperature, humidity, days_since_harvest=0, spoilage_multiplier=1.0):
        """Estimates spoilage rate using trained SpoilageEstimator or calibrated domain model."""
        # Find crop specs
        crop_specs = {
            'shelf_life_days': 14.0,
            'spoilage_rate_per_day': 5.0,
            'optimal_temp_max': 20.0,
            'optimal_humidity_max': 85.0,
            'category': 'perishable'
        }
        
        if self.crop_info_df is not None and not self.crop_info_df.empty:
            match = self.crop_info_df[self.crop_info_df['crop'].str.lower() == crop.lower()]
            if not match.empty:
                row = match.iloc[0]
                crop_specs['shelf_life_days'] = float(row['shelf_life_days'])
                crop_specs['spoilage_rate_per_day'] = float(row['spoilage_rate_per_day'])
                crop_specs['optimal_temp_max'] = float(row.get('optimal_temp_max', 20.0))
                crop_specs['optimal_humidity_max'] = float(row.get('optimal_humidity_max', 85.0))
                crop_specs['category'] = str(row.get('category', 'perishable')).lower()

        travel_hours = distance_km / 40.0

        if self.spoilage_estimator and self.spoilage_estimator.is_trained:
            input_dict = {
                'crop': crop.lower(),
                'category': crop_specs['category'],
                'shelf_life_days': crop_specs['shelf_life_days'],
                'spoilage_rate_per_day': crop_specs['spoilage_rate_per_day'],
                'distance_km': distance_km,
                'travel_time_hours': travel_hours,
                'temperature': temperature,
                'humidity': humidity,
                'days_since_harvest': days_since_harvest,
                'optimal_temp_max': crop_specs['optimal_temp_max'],
                'optimal_humidity_max': crop_specs['optimal_humidity_max']
            }
            pred = self.spoilage_estimator.predict(input_dict)
            rate = pred['spoilage_rate'] * float(spoilage_multiplier)
            rate = min(0.40, max(0.005, rate))
            return {
                'spoilage_rate': round(rate, 4),
                'spoilage_percentage': round(rate * 100.0, 2),
                'travel_time_hours': round(travel_hours, 1),
                'shelf_life_days': crop_specs['shelf_life_days'],
                'category': crop_specs['category'],
                'risk_drivers': pred['risk_drivers']
            }
        else:
            # Fallback domain formula
            total_days = days_since_harvest + (travel_hours / 24.0)
            base_loss = (total_days / crop_specs['shelf_life_days']) * (crop_specs['spoilage_rate_per_day'] / 100.0)
            temp_stress = max(0, temperature - crop_specs['optimal_temp_max']) / 20.0 * 0.05
            rate = (base_loss + temp_stress) * float(spoilage_multiplier)
            rate = min(0.40, max(0.005, rate))
            return {
                'spoilage_rate': round(rate, 4),
                'spoilage_percentage': round(rate * 100.0, 2),
                'travel_time_hours': round(travel_hours, 1),
                'shelf_life_days': crop_specs['shelf_life_days'],
                'category': crop_specs['category'],
                'risk_drivers': ['Estimated via domain curve']
            }

    def predict_market_price(self, crop, market_name, harvest_date=None, price_multiplier=1.0):
        """Predicts price using trained PricePredictor with lags from historical records."""
        # Query history for lag values
        hist = pd.DataFrame()
        if self.price_history_df is not None and not self.price_history_df.empty:
            hist = self.price_history_df[
                (self.price_history_df['crop'].str.lower() == crop.lower()) &
                (self.price_history_df['market_name'] == market_name)
            ].sort_values(by='date')

        if not hist.empty:
            latest_prices = hist['modal_price'].tail(5).tolist()
            lag_7 = float(latest_prices[-1])
            lag_14 = float(latest_prices[-2]) if len(latest_prices) > 1 else lag_7
            lag_30 = float(latest_prices[-3]) if len(latest_prices) > 2 else lag_14
            rolling_avg_7 = float(np.mean(latest_prices))
            arrivals = float(hist['arrivals_tonnes'].iloc[-1]) if 'arrivals_tonnes' in hist.columns else 50.0
            price_spread = float(hist['max_price'].iloc[-1] - hist['min_price'].iloc[-1]) if 'max_price' in hist.columns else 200.0
        else:
            lag_7 = 2000.0
            lag_14 = 2000.0
            lag_30 = 2000.0
            rolling_avg_7 = 2000.0
            arrivals = 50.0
            price_spread = 200.0

        target_dt = pd.to_datetime(harvest_date) if harvest_date else pd.Timestamp.now()

        input_data = {
            'crop': crop.lower(),
            'market_name': market_name,
            'date': target_dt,
            'month': int(target_dt.month),
            'day_of_week': int(target_dt.dayofweek),
            'quarter': int(target_dt.quarter),
            'arrivals_tonnes': arrivals,
            'lag_7': lag_7,
            'lag_14': lag_14,
            'lag_30': lag_30,
            'rolling_avg_7': rolling_avg_7
        }

        if self.price_predictor and self.price_predictor.is_trained:
            pred_res = self.price_predictor.predict(input_data)
            pred_price = pred_res['predicted_price'] * float(price_multiplier)
            low_p = pred_res['price_range_low'] * float(price_multiplier)
            high_p = pred_res['price_range_high'] * float(price_multiplier)
            
            # Explainability
            explanations = self.price_predictor.explain(input_data)
            
            return {
                'predicted_price': round(pred_price, 2),
                'price_per_kg': round(pred_price / 100.0, 2),
                'price_range_low': round(low_p, 2),
                'price_range_high': round(high_p, 2),
                'confidence': pred_res['confidence'],
                'confidence_score': pred_res['confidence_score'],
                'trend': pred_res['trend'],
                'key_drivers': explanations,
                'historical_baseline': round(rolling_avg_7, 2)
            }
        else:
            base_price = lag_7 * float(price_multiplier)
            return {
                'predicted_price': round(base_price, 2),
                'price_per_kg': round(base_price / 100.0, 2),
                'price_range_low': round(base_price * 0.95, 2),
                'price_range_high': round(base_price * 1.05, 2),
                'confidence': 'Medium',
                'confidence_score': 0.75,
                'trend': 'stable',
                'key_drivers': [{'feature': 'Historical Average', 'impact': base_price, 'direction': 'positive'}],
                'historical_baseline': round(rolling_avg_7, 2)
            }

    def calculate_market_realization(self, crop, quantity_kg, quality, market_name, 
                                     farmer_lat, farmer_lon, harvest_date=None, 
                                     temperature=None, humidity=None, 
                                     days_since_harvest=0,
                                     transport_cost_multiplier=1.0, 
                                     price_multiplier=1.0, 
                                     spoilage_multiplier=1.0):
        """Calculates expected net realization and all economic line items for a candidate market."""
        market_row = self.markets_df[self.markets_df['market_name'] == market_name]
        if market_row.empty:
            return None
        market = market_row.iloc[0]

        # 1. Distance
        distance_km = self.calculate_distance(farmer_lat, farmer_lon, float(market['lat']), float(market['lon']))

        # 2. Weather conditions
        weather = self.get_weather_for_market(market_name, harvest_date, default_temp=temperature or 28.0, default_hum=humidity or 65.0)
        temp_val = temperature if temperature is not None else weather['temperature']
        hum_val = humidity if humidity is not None else weather['humidity']

        # 3. Spoilage Estimation
        spoilage_res = self.estimate_spoilage(
            crop, distance_km, temp_val, hum_val, 
            days_since_harvest=days_since_harvest, 
            spoilage_multiplier=spoilage_multiplier
        )
        spoilage_rate = spoilage_res['spoilage_rate']
        spoilage_kg = quantity_kg * spoilage_rate
        sellable_qty_kg = max(0.0, quantity_kg - spoilage_kg)

        # 4. Price & Quality
        quality_factors = {'A': 1.00, 'B': 0.90, 'C': 0.75}
        quality_mult = quality_factors.get(str(quality).upper(), 0.90)

        price_res = self.predict_market_price(crop, market_name, harvest_date, price_multiplier=price_multiplier)
        price_per_quintal = price_res['predicted_price']
        effective_price_per_kg = (price_per_quintal / 100.0) * quality_mult

        # 5. Gross Revenue
        gross_revenue = sellable_qty_kg * effective_price_per_kg
        spoilage_loss_value = spoilage_kg * effective_price_per_kg

        # 6. Transport Cost
        transport_res = self.select_transport(
            quantity_kg / 1000.0, distance_km, 
            transport_cost_multiplier=transport_cost_multiplier
        )
        transport_cost = transport_res['cost']

        # 7. Expected Net Realization
        net_realization = gross_revenue - transport_cost

        # 8. Honest Uncertainty Range
        low_revenue = sellable_qty_kg * ((price_res['price_range_low'] / 100.0) * quality_mult)
        high_revenue = sellable_qty_kg * ((price_res['price_range_high'] / 100.0) * quality_mult)
        net_range_low = max(0.0, low_revenue - transport_cost)
        net_range_high = max(0.0, high_revenue - transport_cost)

        # 9. Risk Evaluation
        risk_level, risk_factors = self.evaluate_market_risk(
            spoilage_rate, transport_cost, gross_revenue, 
            price_res['trend'], weather, spoilage_res['category']
        )

        return {
            'market_name': market_name,
            'district': str(market.get('district', '')),
            'distance_km': round(distance_km, 1),
            'travel_time_hours': spoilage_res['travel_time_hours'],
            'price_per_quintal': round(price_per_quintal, 2),
            'effective_price_per_kg': round(effective_price_per_kg, 2),
            'price_range_low': price_res['price_range_low'],
            'price_range_high': price_res['price_range_high'],
            'price_trend': price_res['trend'],
            'confidence': price_res['confidence'],
            'confidence_score': price_res['confidence_score'],
            'spoilage_rate': spoilage_rate,
            'spoilage_percentage': spoilage_res['spoilage_percentage'],
            'spoilage_kg': round(spoilage_kg, 1),
            'spoilage_loss_value': round(spoilage_loss_value, 2),
            'sellable_quantity_kg': round(sellable_qty_kg, 1),
            'vehicle_type': transport_res['vehicle_type'],
            'transport_cost': round(transport_cost, 2),
            'gross_revenue': round(gross_revenue, 2),
            'net_realization': round(net_realization, 2),
            'net_realization_range': [round(net_range_low, 2), round(net_range_high, 2)],
            'risk_level': risk_level,
            'risk_factors': risk_factors,
            'weather': weather,
            'key_drivers': price_res.get('key_drivers', [])
        }

    def evaluate_market_risk(self, spoilage_rate, transport_cost, gross_revenue, price_trend, weather, category):
        risk_factors = []
        cost_ratio = transport_cost / max(gross_revenue, 1.0)

        if spoilage_rate >= 0.12:
            risk_factors.append(f"High spoilage risk ({round(spoilage_rate*100, 1)}% projected loss)")
        elif spoilage_rate >= 0.05:
            risk_factors.append(f"Moderate spoilage risk ({round(spoilage_rate*100, 1)}%)")

        if cost_ratio >= 0.30:
            risk_factors.append(f"Logistics burden high: transport eats {round(cost_ratio*100, 1)}% of gross revenue")
        elif cost_ratio >= 0.18:
            risk_factors.append(f"Transport cost is {round(cost_ratio*100, 1)}% of gross revenue")

        if price_trend == 'declining':
            risk_factors.append("Downside price momentum: Mandi arrivals increasing")

        if weather.get('rainfall_mm', 0) > 20 or 'Rain' in weather.get('condition', ''):
            risk_factors.append(f"Wet weather alert ({weather.get('condition')}, {weather.get('rainfall_mm', 0)}mm rain): transport delay & moisture risk")

        if len(risk_factors) >= 3 or spoilage_rate > 0.15 or cost_ratio > 0.35:
            overall_risk = 'High'
        elif len(risk_factors) >= 1 or spoilage_rate > 0.06 or cost_ratio > 0.20:
            overall_risk = 'Medium'
        else:
            overall_risk = 'Low'

        if not risk_factors:
            risk_factors.append("Stable market price with low logistics friction")

        return overall_risk, risk_factors

    def generate_explanation(self, ranked_markets):
        if not ranked_markets:
            return "No viable markets found within operational range."

        best = ranked_markets[0]
        text = f"**{best['market_name']}** delivers the highest expected net realization of **₹{best['net_realization']:,.2f}** "
        text += f"(est. range ₹{best['net_realization_range'][0]:,.2f} – ₹{best['net_realization_range'][1]:,.2f}). "

        if len(ranked_markets) > 1:
            second = ranked_markets[1]
            diff = best['net_realization'] - second['net_realization']
            text += f"This provides **₹{diff:,.2f} more profit** than the second-ranked option ({second['market_name']}). "

            # Check if any distant market has higher price but lower net realization
            higher_price_markets = [m for m in ranked_markets if m['price_per_quintal'] > best['price_per_quintal']]
            if higher_price_markets:
                hp = higher_price_markets[0]
                text += f"Notice that while **{hp['market_name']}** has a higher headline price (₹{hp['price_per_quintal']}/qtl vs ₹{best['price_per_quintal']}/qtl), "
                text += f"its {hp['distance_km']} km distance incurs ₹{hp['transport_cost']:,.2f} in transport and {hp['spoilage_percentage']}% spoilage loss, "
                text += f"resulting in a lower actual net realization of ₹{hp['net_realization']:,.2f}."
            else:
                text += f"Transport cost is kept low at ₹{best['transport_cost']:,.2f} with minimal spoilage loss of only {best['spoilage_percentage']}%. "
        else:
            text += f"Transport cost is estimated at ₹{best['transport_cost']:,.2f} with {best['spoilage_percentage']}% spoilage loss."

        return text

    def recommend(self, crop, quantity_kg, quality='A', farmer_lat=12.9716, farmer_lon=77.5946, 
                  harvest_date=None, temperature=None, humidity=None, days_since_harvest=0,
                  transport_cost_multiplier=1.0, price_multiplier=1.0, spoilage_multiplier=1.0):
        """Full execution of the HarvestLink Post-Harvest Decision Support System."""
        if self.markets_df is None or self.markets_df.empty:
            raise ValueError("No market data available.")

        market_results = []
        for _, m_row in self.markets_df.iterrows():
            m_name = m_row['market_name']
            res = self.calculate_market_realization(
                crop=crop,
                quantity_kg=quantity_kg,
                quality=quality,
                market_name=m_name,
                farmer_lat=farmer_lat,
                farmer_lon=farmer_lon,
                harvest_date=harvest_date,
                temperature=temperature,
                humidity=humidity,
                days_since_harvest=days_since_harvest,
                transport_cost_multiplier=transport_cost_multiplier,
                price_multiplier=price_multiplier,
                spoilage_multiplier=spoilage_multiplier
            )
            if res:
                market_results.append(res)

        # Rank markets by expected net realization descending
        market_results.sort(key=lambda x: x['net_realization'], reverse=True)
        for i, res in enumerate(market_results):
            res['rank'] = i + 1

        if not market_results:
            return {}

        best = market_results[0]

        # Determine WHEN
        crop_match = self.crop_info_df[self.crop_info_df['crop'].str.lower() == crop.lower()] if self.crop_info_df is not None else None
        shelf_life = float(crop_match.iloc[0]['shelf_life_days']) if crop_match is not None and not crop_match.empty else 14.0

        if best['price_trend'] == 'declining' or shelf_life <= 7:
            when = "Sell Immediately (Within 24 Hours)"
            when_reason = f"High perishability ({shelf_life}-day shelf life) and/or softening market prices mean holding incurs heavy spoilage losses."
        elif best['price_trend'] == 'rising' and shelf_life >= 15:
            when = "Wait & Monitor (2-3 Days)"
            when_reason = f"Rising price momentum (+3-5% trend) and durable shelf life ({shelf_life} days) allow holding produce for improved realization."
        else:
            when = "Sell Today (Morning Mandi Session)"
            when_reason = "Stable mandi arrivals and balanced prices make prompt sale during peak morning trading optimal."

        # Determine HOW
        if quantity_kg < 500:
            how = "Via Local FPO / Farmer Collective"
            how_reason = f"Small batch ({quantity_kg} kg) has high per-unit transport cost. Pooling with neighboring farmers reduces logistics costs by up to 35%."
        elif quantity_kg <= 2500:
            how = f"Direct Sale via {best['vehicle_type']}"
            how_reason = f"Full truckload batch ({quantity_kg} kg) achieves optimal transport economics directly to {best['market_name']}."
        else:
            how = f"Pre-Booked Transport via {best['vehicle_type']}"
            how_reason = f"Substantial harvest ({quantity_kg} kg) requires scheduled commercial transport to ensure rapid unloading."

        # Bullets for UI display
        why_bullets = [
            f"Delivers highest net realization of ₹{best['net_realization']:,.2f}",
            f"Transport cost kept to ₹{best['transport_cost']:,.2f} via {best['vehicle_type']}",
            f"Expected spoilage is restricted to {best['spoilage_percentage']}% ({best['spoilage_kg']} kg)"
        ]
        if len(market_results) > 1:
            diff = best['net_realization'] - market_results[1]['net_realization']
            why_bullets.append(f"Provides ₹{diff:,.2f} more in-hand profit than {market_results[1]['market_name']}")

        # Ensure market entries have both naming conventions
        for m in market_results:
            m['sellable_quantity'] = m['sellable_quantity_kg']

        # Historical price series for top markets
        price_trends_out = {}
        for m in market_results[:5]:
            m_name = m['market_name']
            m_hist = []
            if self.price_history_df is not None and not self.price_history_df.empty:
                q = self.price_history_df[
                    (self.price_history_df['crop'].str.lower() == crop.lower()) &
                    (self.price_history_df['market_name'] == m_name)
                ].sort_values(by='date').tail(7)
                for _, r in q.iterrows():
                    m_hist.append({
                        'date': str(r['date'])[:10],
                        'price': float(r['modal_price'])
                    })
            if not m_hist:
                base_p = m['price_per_quintal']
                m_hist = [
                    {'date': 'Day -4', 'price': round(base_p * 0.96)},
                    {'date': 'Day -3', 'price': round(base_p * 0.98)},
                    {'date': 'Day -2', 'price': round(base_p * 0.99)},
                    {'date': 'Day -1', 'price': round(base_p * 0.995)},
                    {'date': 'Today', 'price': round(base_p)}
                ]

            price_trends_out[m_name] = {
                'current': m['price_per_quintal'],
                'predicted': m['price_per_quintal'],
                'trend': m['price_trend'],
                'range': [m['price_range_low'], m['price_range_high']],
                'history': m_hist
            }

        quality_factors = {'A': 1.00, 'B': 0.90, 'C': 0.75}
        quality_mult = quality_factors.get(str(quality).upper(), 0.90)
        explanation = self.generate_explanation(market_results)

        return {
            'recommendation': {
                'market': best['market_name'],
                'district': best['district'],
                'where': best['market_name'],
                'when': when,
                'when_reason': when_reason,
                'how': how,
                'how_reason': how_reason,
                'why': why_bullets,
                'why_text': explanation,
                'net_realization': best['net_realization'],
                'net_realization_range': {
                    'low': best['net_realization_range'][0],
                    'high': best['net_realization_range'][1]
                },
                'net_realization_array': best['net_realization_range'],
                'confidence': best['confidence'],
                'confidence_score': int(best['confidence_score'] * 100),
                'risk_level': best['risk_level'],
                'risk_factors': best['risk_factors'],
                'vehicle_type': best['vehicle_type']
            },
            'calculation': {
                'total_quantity_kg': quantity_kg,
                'quality_factor': quality_mult,
                'quality_adjusted_quantity': round(quantity_kg * quality_mult, 1)
            },
            'top_market': best,
            'markets': market_results,
            'parameters': {
                'crop': crop,
                'quantity_kg': quantity_kg,
                'quality': quality,
                'farmer_lat': farmer_lat,
                'farmer_lon': farmer_lon,
                'harvest_date': harvest_date or datetime.now().strftime('%Y-%m-%d'),
                'multipliers': {
                    'transport_cost_multiplier': transport_cost_multiplier,
                    'price_multiplier': price_multiplier,
                    'spoilage_multiplier': spoilage_multiplier
                }
            },
            'price_trends': price_trends_out
        }
