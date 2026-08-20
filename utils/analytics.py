"""
Analytics Module for AI Expense & Budget Assistant
Calculates core financial metrics, spending distributions, and category breakdowns.
"""

import pandas as pd
import numpy as np

def calculate_spending_summary(df: pd.DataFrame) -> dict:
    """Calculate key financial metrics and statistics from the cleaned dataset."""
    if df.empty:
        return {
            "total_spending": 0.0,
            "transaction_count": 0,
            "avg_daily_spending": 0.0,
            "highest_expense": {"description": "N/A", "amount": 0.0, "category": "N/A"},
            "lowest_expense": {"description": "N/A", "amount": 0.0, "category": "N/A"},
            "most_expensive_category": "N/A",
            "most_expensive_category_amount": 0.0
        }
        
    total_spending = df['Amount'].sum()
    txn_count = len(df)
    
    min_date = df['Date'].min()
    max_date = df['Date'].max()
    days_range = (max_date - min_date).days + 1
    days_range = max(days_range, 1)
    
    avg_daily_spending = total_spending / days_range
    
    max_row = df.loc[df['Amount'].idxmax()]
    min_row = df.loc[df['Amount'].idxmin()]
    
    cat_summary = df.groupby('Category')['Amount'].sum()
    top_cat = cat_summary.idxmax() if not cat_summary.empty else "N/A"
    top_cat_amount = cat_summary.max() if not cat_summary.empty else 0.0
    
    return {
        "total_spending": float(total_spending),
        "transaction_count": int(txn_count),
        "avg_daily_spending": float(avg_daily_spending),
        "highest_expense": {
            "description": str(max_row['Description']),
            "amount": float(max_row['Amount']),
            "category": str(max_row['Category']),
            "date": max_row['Date'].strftime('%Y-%m-%d')
        },
        "lowest_expense": {
            "description": str(min_row['Description']),
            "amount": float(min_row['Amount']),
            "category": str(min_row['Category']),
            "date": min_row['Date'].strftime('%Y-%m-%d')
        },
        "most_expensive_category": str(top_cat),
        "most_expensive_category_amount": float(top_cat_amount)
    }

def get_category_breakdown(df: pd.DataFrame) -> pd.DataFrame:
    """Get category-wise total spending, percentage share, and transaction counts."""
    if df.empty:
        return pd.DataFrame(columns=['Category', 'Amount', 'Percentage', 'Count'])
        
    cat_df = df.groupby('Category').agg(
        Amount=('Amount', 'sum'),
        Count=('Amount', 'count')
    ).reset_index()
    
    total = cat_df['Amount'].sum()
    cat_df['Percentage'] = (cat_df['Amount'] / total * 100).round(2) if total > 0 else 0.0
    cat_df = cat_df.sort_values(by='Amount', ascending=False).reset_index(drop=True)
    return cat_df

def get_monthly_trend(df: pd.DataFrame) -> pd.DataFrame:
    """Get monthly aggregated spending trend."""
    if df.empty:
        return pd.DataFrame(columns=['Month_Year', 'Amount', 'Count'])
        
    df_temp = df.copy()
    df_temp['Month_Year'] = df_temp['Date'].dt.strftime('%b %Y')
    df_temp['YearMonthSort'] = df_temp['Date'].dt.to_period('M')
    
    monthly_df = df_temp.groupby(['YearMonthSort', 'Month_Year']).agg(
        Amount=('Amount', 'sum'),
        Count=('Amount', 'count')
    ).reset_index()
    
    monthly_df = monthly_df.sort_values(by='YearMonthSort').reset_index(drop=True)
    return monthly_df[['Month_Year', 'Amount', 'Count']]

def get_daily_trend(df: pd.DataFrame) -> pd.DataFrame:
    """Get daily aggregated spending trend."""
    if df.empty:
        return pd.DataFrame(columns=['Date', 'Amount'])
        
    daily_df = df.groupby('Date')['Amount'].sum().reset_index()
    daily_df = daily_df.sort_values(by='Date').reset_index(drop=True)
    return daily_df
