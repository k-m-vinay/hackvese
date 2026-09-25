import os
import json
import datetime
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import shap
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

from price_predictor import PricePredictor
from spoilage_estimator import SpoilageEstimator

def prepare_historical_price_features(csv_path):
    print(f"Loading market prices from {csv_path}...")
    df = pd.read_csv(csv_path)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values(by=['crop', 'market_name', 'date']).reset_index(drop=True)

    # Compute lags and rolling averages grouped by crop and market
    grouped = df.groupby(['crop', 'market_name'])
    
    # Lags
    df['lag_7'] = grouped['modal_price'].shift(1).fillna(df['modal_price'])
    df['lag_14'] = grouped['modal_price'].shift(2).fillna(df['modal_price'])
    df['lag_30'] = grouped['modal_price'].shift(4).fillna(df['modal_price'])
    
    # Rolling 7-period average
    df['rolling_avg_7'] = grouped['modal_price'].transform(lambda s: s.rolling(3, min_periods=1).mean())

    # Temporal columns
    df['month'] = df['date'].dt.month
    df['day_of_week'] = df['date'].dt.dayofweek
    df['quarter'] = df['date'].dt.quarter

    print(f"Engineered features for {len(df)} records across {df['crop'].nunique()} crops and {df['market_name'].nunique()} markets.")
    return df

def train_and_evaluate_price_model(data_df, model_save_path, static_img_dir):
    print("\n--- Training Price Predictor (Random Forest) ---")
    train_df, test_df = train_test_split(data_df, test_size=0.2, random_state=42, shuffle=True)
    
    predictor = PricePredictor(model_path=model_save_path)
    X_train, y_train = predictor.train(train_df)
    
    # Evaluate on test set
    X_test = predictor._prepare_features(test_df, is_training=False)
    y_test = test_df['modal_price']
    y_pred = predictor.model.predict(X_test)
    
    mae = float(mean_absolute_error(y_test, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    r2 = float(r2_score(y_test, y_pred))
    mape = float(np.mean(np.abs((y_test - y_pred) / y_test)) * 100.0)

    print(f"Price Predictor Test Metrics:")
    print(f"  MAE:  ₹{mae:.2f} / quintal")
    print(f"  RMSE: ₹{rmse:.2f} / quintal")
    print(f"  MAPE: {mape:.2f}%")
    print(f"  R²:   {r2:.4f}")

    # Feature Importance Plot
    os.makedirs(static_img_dir, exist_ok=True)
    importances = predictor.model.feature_importances_
    features = predictor.feature_names
    sorted_idx = np.argsort(importances)[::-1]

    plt.figure(figsize=(9, 5))
    plt.barh([features[i] for i in sorted_idx[::-1]], [importances[i] for i in sorted_idx[::-1]], color='#2e7d32')
    plt.xlabel('Relative Feature Importance')
    plt.title('HarvestLink Price Prediction - Key Drivers')
    plt.tight_layout()
    plt.savefig(os.path.join(static_img_dir, 'price_feature_importance.png'), dpi=150)
    plt.close()

    # SHAP Summary Plot
    try:
        sample_X = X_train.sample(min(300, len(X_train)), random_state=42)
        explainer = shap.TreeExplainer(predictor.model)
        shap_values = explainer.shap_values(sample_X)
        plt.figure(figsize=(9, 5))
        shap.summary_plot(shap_values, sample_X, show=False)
        plt.tight_layout()
        plt.savefig(os.path.join(static_img_dir, 'price_shap_summary.png'), dpi=150)
        plt.close()
        print("  SHAP summary plot saved to static/images/price_shap_summary.png")
    except Exception as e:
        print(f"  Note on SHAP plot: {e}")

    predictor.metrics = {
        'mae': round(mae, 2),
        'rmse': round(rmse, 2),
        'mape': round(mape, 2),
        'r2': round(r2, 4),
        'test_samples': len(test_df),
        'feature_importances': {features[i]: round(float(importances[i]), 4) for i in sorted_idx}
    }
    
    # Resave with metrics
    predictor.train(train_df)
    return predictor.metrics

def train_and_evaluate_spoilage_model(crop_info_path, model_save_path, static_img_dir):
    print("\n--- Training Spoilage Estimator (XGBoost) ---")
    crop_info_df = pd.read_csv(crop_info_path) if os.path.exists(crop_info_path) else None

    estimator = SpoilageEstimator(model_path=model_save_path)
    synth_df = estimator.generate_domain_training_data(crop_info_df=crop_info_df, n_samples=4000)
    train_df, test_df = train_test_split(synth_df, test_size=0.2, random_state=42)

    X_train, y_train = estimator.train(train_df, crop_info_df=crop_info_df)
    
    # Evaluate on test set
    X_test = estimator._prepare_features(test_df, is_training=False)
    y_test = test_df['spoilage_rate']
    y_pred = estimator.model.predict(X_test)

    mae = float(mean_absolute_error(y_test, y_pred))
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    r2 = float(r2_score(y_test, y_pred))

    print(f"Spoilage Estimator Test Metrics:")
    print(f"  MAE:  {mae * 100:.2f}% spoilage rate")
    print(f"  RMSE: {rmse * 100:.2f}%")
    print(f"  R²:   {r2:.4f}")

    # Feature Importance Plot
    importances = estimator.model.feature_importances_
    features = estimator.feature_names
    sorted_idx = np.argsort(importances)[::-1]

    plt.figure(figsize=(9, 5))
    plt.barh([features[i] for i in sorted_idx[::-1]], [importances[i] for i in sorted_idx[::-1]], color='#e65100')
    plt.xlabel('Relative Feature Importance')
    plt.title('Post-Harvest Spoilage Risk Factors')
    plt.tight_layout()
    plt.savefig(os.path.join(static_img_dir, 'spoilage_feature_importance.png'), dpi=150)
    plt.close()
    print("  Spoilage feature importance saved to static/images/spoilage_feature_importance.png")

    estimator.metrics = {
        'mae_rate': round(mae, 4),
        'rmse_rate': round(rmse, 4),
        'r2': round(r2, 4),
        'test_samples': len(test_df),
        'feature_importances': {features[i]: round(float(importances[i]), 4) for i in sorted_idx}
    }
    estimator.train(train_df, crop_info_df=crop_info_df)
    return estimator.metrics

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'data')
    models_dir = os.path.join(base_dir, 'models')
    static_img_dir = os.path.join(base_dir, 'static', 'images')

    price_csv = os.path.join(data_dir, 'market_prices.csv')
    crop_csv = os.path.join(data_dir, 'crop_info.csv')

    price_model_path = os.path.join(models_dir, 'price_model.pkl')
    spoilage_model_path = os.path.join(models_dir, 'spoilage_model.pkl')

    # 1. Process data and train Price Predictor
    data_df = prepare_historical_price_features(price_csv)
    price_metrics = train_and_evaluate_price_model(data_df, price_model_path, static_img_dir)

    # 2. Train Spoilage Estimator
    spoilage_metrics = train_and_evaluate_spoilage_model(crop_csv, spoilage_model_path, static_img_dir)

    # 3. Export unified metadata
    metadata = {
        'project': 'HarvestLink PS-02 Decision Support System',
        'trained_at': datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'crops_supported': sorted(data_df['crop'].unique().tolist()),
        'markets_supported': sorted(data_df['market_name'].unique().tolist()),
        'price_model': {
            'algorithm': 'Random Forest Regressor (Ensemble of 120 Trees)',
            'metrics': price_metrics
        },
        'spoilage_model': {
            'algorithm': 'XGBoost Regressor (Domain Physics Calibrated)',
            'metrics': spoilage_metrics
        }
    }

    metrics_path = os.path.join(models_dir, 'model_metrics.json')
    with open(metrics_path, 'w') as f:
        json.dump(metadata, f, indent=2)

    print(f"\nAll models successfully trained and compiled.")
    print(f"Artifacts saved:")
    print(f"  1. {price_model_path}")
    print(f"  2. {spoilage_model_path}")
    print(f"  3. {metrics_path}")

if __name__ == '__main__':
    main()
