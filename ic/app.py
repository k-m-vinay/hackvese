import os
import json
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from decision_engine import HarvestLinkEngine

app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# Initialize Decision Engine with real data and ML models
base_dir = os.path.dirname(os.path.abspath(__file__))
engine = HarvestLinkEngine(
    data_dir=os.path.join(base_dir, 'data'),
    models_dir=os.path.join(base_dir, 'models')
)

@app.route('/')
def index():
    """Serves the main HarvestLink decision dashboard."""
    return render_template('index.html')

@app.route('/api/crops', methods=['GET'])
def get_crops():
    """Returns all supported crops along with their shelf life, category, and storage requirements."""
    try:
        if engine.crop_info_df is not None and not engine.crop_info_df.empty:
            crops = engine.crop_info_df.to_dict(orient='records')
        else:
            crops = [
                {'crop': 'Tomato', 'shelf_life_days': 7, 'category': 'perishable'},
                {'crop': 'Onion', 'shelf_life_days': 30, 'category': 'semi-perishable'},
                {'crop': 'Potato', 'shelf_life_days': 60, 'category': 'semi-perishable'},
                {'crop': 'Banana', 'shelf_life_days': 10, 'category': 'perishable'},
                {'crop': 'Mango', 'shelf_life_days': 14, 'category': 'perishable'},
                {'crop': 'Rice', 'shelf_life_days': 365, 'category': 'durable'},
                {'crop': 'Wheat', 'shelf_life_days': 365, 'category': 'durable'},
                {'crop': 'Chilli', 'shelf_life_days': 180, 'category': 'durable'},
                {'crop': 'Coconut', 'shelf_life_days': 60, 'category': 'semi-perishable'},
                {'crop': 'Brinjal', 'shelf_life_days': 7, 'category': 'perishable'}
            ]
        return jsonify({'crops': crops, 'count': len(crops)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/markets', methods=['GET'])
def get_markets():
    """Returns all APMC mandis / markets in Karnataka with coordinates and district info."""
    try:
        if engine.markets_df is not None and not engine.markets_df.empty:
            markets = engine.markets_df.to_dict(orient='records')
        else:
            markets = []
        return jsonify({'markets': markets, 'count': len(markets)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/price-history', methods=['GET'])
def get_price_history():
    """Fetches chronological price history for given crop and market."""
    crop = request.args.get('crop')
    market = request.args.get('market')
    
    if not crop:
        return jsonify({'error': 'Crop parameter is required.'}), 400

    try:
        if engine.price_history_df is not None and not engine.price_history_df.empty:
            query_df = engine.price_history_df[engine.price_history_df['crop'].str.lower() == crop.lower()]
            if market:
                query_df = query_df[query_df['market_name'] == market]
            
            query_df = query_df.sort_values(by='date')
            records = query_df[['date', 'market_name', 'crop', 'min_price', 'max_price', 'modal_price', 'arrivals_tonnes']].copy()
            records['date'] = records['date'].astype(str)
            return jsonify({'crop': crop, 'market': market, 'history': records.to_dict(orient='records')})
        return jsonify({'history': []})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Returns weather observation for given market."""
    market = request.args.get('market', 'Bangalore (Yeshwanthpur)')
    date = request.args.get('date')
    
    try:
        weather_info = engine.get_weather_for_market(market, target_date=date)
        return jsonify({
            'market': market,
            'date': date,
            **weather_info
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recommend', methods=['POST'])
def recommend():
    """Main decision support endpoint for HarvestLink PS-02."""
    try:
        data = request.get_json(force=True) or {}
        crop = data.get('crop', 'Tomato')
        quantity_kg = float(data.get('quantity_kg', 1000.0))
        quality = data.get('quality', 'A')
        farmer_lat = float(data.get('farmer_lat', 12.9716))
        farmer_lon = float(data.get('farmer_lon', 77.5946))
        harvest_date = data.get('harvest_date')
        
        temperature = float(data['temperature']) if data.get('temperature') not in (None, '') else None
        humidity = float(data['humidity']) if data.get('humidity') not in (None, '') else None
        days_since_harvest = float(data.get('days_since_harvest', 0.0))

        # Sensitivity multipliers
        t_mult = float(data.get('transport_cost_multiplier', 1.0))
        p_mult = float(data.get('price_multiplier', 1.0))
        s_mult = float(data.get('spoilage_multiplier', 1.0))

        result = engine.recommend(
            crop=crop,
            quantity_kg=quantity_kg,
            quality=quality,
            farmer_lat=farmer_lat,
            farmer_lon=farmer_lon,
            harvest_date=harvest_date,
            temperature=temperature,
            humidity=humidity,
            days_since_harvest=days_since_harvest,
            transport_cost_multiplier=t_mult,
            price_multiplier=p_mult,
            spoilage_multiplier=s_mult
        )
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/sensitivity', methods=['POST'])
def sensitivity_analysis():
    """Live scenario simulation for hackathon demo (testing what-if scenarios)."""
    try:
        data = request.get_json(force=True) or {}
        crop = data.get('crop', 'Tomato')
        quantity_kg = float(data.get('quantity_kg', 1000.0))
        quality = data.get('quality', 'A')
        farmer_lat = float(data.get('farmer_lat', 12.9716))
        farmer_lon = float(data.get('farmer_lon', 77.5946))
        harvest_date = data.get('harvest_date')
        
        t_mult = float(data.get('transport_cost_multiplier', 1.0))
        p_mult = float(data.get('price_multiplier', 1.0))
        s_mult = float(data.get('spoilage_multiplier', 1.0))

        result = engine.recommend(
            crop=crop,
            quantity_kg=quantity_kg,
            quality=quality,
            farmer_lat=farmer_lat,
            farmer_lon=farmer_lon,
            harvest_date=harvest_date,
            transport_cost_multiplier=t_mult,
            price_multiplier=p_mult,
            spoilage_multiplier=s_mult
        )
        return jsonify({
            'scenario': {
                'transport_mult': t_mult,
                'price_mult': p_mult,
                'spoilage_mult': s_mult
            },
            'recommended_market': result['recommendation']['market'],
            'net_realization': result['recommendation']['net_realization'],
            'top_5_markets': [
                {
                    'market': m['market_name'],
                    'net_realization': m['net_realization'],
                    'distance_km': m['distance_km'],
                    'transport_cost': m['transport_cost'],
                    'spoilage_pct': m['spoilage_percentage']
                } for m in result['markets'][:5]
            ]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/model-info', methods=['GET'])
def get_model_info():
    """Returns AI model validation metrics, SHAP summary stats, and architecture details."""
    metrics_path = os.path.join(base_dir, 'models', 'model_metrics.json')
    if os.path.exists(metrics_path):
        try:
            with open(metrics_path, 'r') as f:
                metrics_data = json.load(f)
            return jsonify(metrics_data)
        except Exception as e:
            return jsonify({'error': f"Failed reading metrics: {e}"}), 500
            
    return jsonify({
        'status': 'Model metrics file not generated yet',
        'price_model_loaded': engine.price_predictor is not None and engine.price_predictor.is_trained,
        'spoilage_model_loaded': engine.spoilage_estimator is not None and engine.spoilage_estimator.is_trained
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting HarvestLink Backend on http://0.0.0.0:{port}")
    app.run(debug=True, host='0.0.0.0', port=port)
