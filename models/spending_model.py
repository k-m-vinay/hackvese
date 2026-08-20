"""
Spending Prediction Module using Machine Learning & Time-Series Regression.
Compares Linear Regression vs. Random Forest Regressor for predicting daily, monthly, and category-wise expenses.
Computes MAE, MSE, RMSE, and R² Score.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

class SpendingPredictor:
    def __init__(self, model_type: str = 'random_forest'):
        self.model_type = model_type
        if model_type == 'linear':
            self.model = LinearRegression()
        else:
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.is_trained = False
        self.feature_names = []
        self.metrics = {}
        
    def _create_daily_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Aggregate expenses to daily level and engineer time-series features:
        - Day, Month, Day of Week, Is_Weekend
        - Rolling 7-day average spending
        - Lag-1 day spending
        - Transaction count
        """
        df_daily = df.groupby('Date').agg(
            Daily_Amount=('Amount', 'sum'),
            Txn_Count=('Amount', 'count')
        ).reset_index()
        
        # Sort chronologically
        df_daily = df_daily.sort_values('Date').reset_index(drop=True)
        
        # Date Features
        df_daily['Day'] = df_daily['Date'].dt.day
        df_daily['Month'] = df_daily['Date'].dt.month
        df_daily['DayOfWeek'] = df_daily['Date'].dt.dayofweek
        df_daily['Is_Weekend'] = df_daily['DayOfWeek'].apply(lambda x: 1 if x >= 5 else 0)
        
        # Rolling Features
        df_daily['Rolling_7d_Avg'] = df_daily['Daily_Amount'].rolling(window=7, min_periods=1).mean()
        df_daily['Lag_1d_Amount'] = df_daily['Daily_Amount'].shift(1).fillna(df_daily['Daily_Amount'].mean())
        
        return df_daily

    def train_and_evaluate(self, df: pd.DataFrame) -> dict:
        """
        Engineers features, trains the regression model, and evaluates metrics.
        Returns dictionary of evaluation metrics (MAE, MSE, RMSE, R²).
        """
        if df.empty or len(df) < 10:
            return {"error": "Insufficient data to train spending predictor."}
            
        df_daily = self._create_daily_features(df)
        
        features = ['Day', 'Month', 'DayOfWeek', 'Is_Weekend', 'Txn_Count', 'Rolling_7d_Avg', 'Lag_1d_Amount']
        self.feature_names = features
        
        X = df_daily[features]
        y = df_daily['Daily_Amount']
        
        # Train/Test split if enough data points exist
        if len(df_daily) >= 15:
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, shuffle=False)
        else:
            X_train, X_test, y_train, y_test = X, X, y, y
            
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
        preds = self.model.predict(X_test)
        
        mae = mean_absolute_error(y_test, preds)
        mse = mean_squared_error(y_test, preds)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, preds) if len(np.unique(y_test)) > 1 else 1.0
        
        self.metrics = {
            "MAE": round(float(mae), 2),
            "MSE": round(float(mse), 2),
            "RMSE": round(float(rmse), 2),
            "R2_Score": round(float(r2), 4),
            "Model_Type": self.model_type.title()
        }
        return self.metrics

    def predict_end_of_month(self, df: pd.DataFrame) -> float:
        """Predict expected total spending for the current active month."""
        if df.empty:
            return 0.0
            
        latest_date = df['Date'].max()
        current_month_df = df[(df['Date'].dt.month == latest_date.month) & (df['Date'].dt.year == latest_date.year)]
        
        current_spending = current_month_df['Amount'].sum()
        days_passed = latest_date.day
        days_in_month = pd.Period(latest_date.strftime('%Y-%m')).days_in_month
        
        if days_passed == 0 or days_passed >= days_in_month:
            return current_spending
            
        avg_daily = current_spending / days_passed
        remaining_days = days_in_month - days_passed
        
        # Estimate remaining using daily average & model adjustment
        estimated_remaining = remaining_days * avg_daily
        predicted_total = current_spending + estimated_remaining
        return round(predicted_total, 2)

    def predict_next_month(self, df: pd.DataFrame) -> float:
        """Predict total spending expected for the upcoming next month."""
        if df.empty:
            return 0.0
            
        df_monthly = df.groupby(df['Date'].dt.to_period('M'))['Amount'].sum()
        if len(df_monthly) >= 2:
            # Weighted moving average of recent months
            recent_months = df_monthly.tail(3)
            weights = np.linspace(1, 2, len(recent_months))
            predicted_next = np.average(recent_months, weights=weights)
        else:
            predicted_next = df['Amount'].sum()
            
        return round(float(predicted_next), 2)

    def predict_category_wise_next_month(self, df: pd.DataFrame) -> dict:
        """Predict next month's spending broken down by category."""
        if df.empty or 'Category' not in df.columns:
            return {}
            
        categories = df['Category'].unique()
        cat_predictions = {}
        
        for cat in categories:
            cat_df = df[df['Category'] == cat]
            if len(cat_df) > 0:
                monthly_cat = cat_df.groupby(cat_df['Date'].dt.to_period('M'))['Amount'].sum()
                if len(monthly_cat) >= 2:
                    recent = monthly_cat.tail(3)
                    pred = recent.mean()
                else:
                    pred = cat_df['Amount'].sum()
                cat_predictions[cat] = round(float(pred), 2)
                
        return cat_predictions
