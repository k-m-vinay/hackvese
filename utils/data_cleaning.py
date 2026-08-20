"""
Data Cleaning Module for AI Expense & Budget Assistant
Provides preprocessing functions to clean, sanitize, and validate expense datasets.
"""

import pandas as pd
import numpy as np
import re

# Standard allowed categories
VALID_CATEGORIES = [
    "Food", "Shopping", "Transport", "Entertainment",
    "Bills & Utilities", "Education", "Healthcare",
    "Travel", "Groceries", "Other"
]

def clean_currency_string(val):
    """Clean currency strings like '₹250', '2,500.00' into numeric float."""
    if pd.isna(val):
        return np.nan
    if isinstance(val, (int, float)):
        return float(val)
    
    val_str = str(val).strip()
    # Remove currency symbols ₹, $, commas, etc.
    cleaned = re.sub(r'[^\d.-]', '', val_str)
    try:
        return float(cleaned)
    except ValueError:
        return np.nan

def validate_expense_schema(df: pd.DataFrame) -> tuple[bool, str]:
    """Validate if the DataFrame contains required columns."""
    required_cols = {'Date', 'Description', 'Amount'}
    df_cols = set(df.columns)
    if not required_cols.issubset(df_cols):
        missing = required_cols - df_cols
        return False, f"Missing required columns: {missing}"
    return True, "Schema valid"

def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Handle missing values across expense dataset columns."""
    df = df.copy()
    
    # Description: Fill missing with 'Unspecified Expense'
    if 'Description' in df.columns:
        df['Description'] = df['Description'].fillna('Unspecified Expense').astype(str).str.strip()
        
    # Amount: Drop rows where Amount is missing or invalid
    if 'Amount' in df.columns:
        df['Amount'] = df['Amount'].apply(clean_currency_string)
        df = df.dropna(subset=['Amount'])
        df = df[df['Amount'] > 0]  # Filter non-positive values
        
    # Date: Convert to datetime, drop invalid dates
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        df = df.dropna(subset=['Date'])
        
    # Payment Method: Fill missing with 'Other'
    if 'Payment_Method' in df.columns:
        df['Payment_Method'] = df['Payment_Method'].fillna('UPI').astype(str).str.strip()
    else:
        df['Payment_Method'] = 'UPI'
        
    # Category: Fill missing with 'Other'
    if 'Category' in df.columns:
        df['Category'] = df['Category'].fillna('Other').astype(str).str.strip()
    else:
        df['Category'] = 'Other'
        
    return df

def standardize_categories(df: pd.DataFrame) -> pd.DataFrame:
    """Standardize category names to match predefined standard categories."""
    df = df.copy()
    if 'Category' not in df.columns:
        return df
        
    category_map = {
        'food & dining': 'Food',
        'food': 'Food',
        'dining': 'Food',
        'restaurant': 'Food',
        'canteen': 'Food',
        'groceries': 'Groceries',
        'grocery': 'Groceries',
        'transport': 'Transport',
        'transportation': 'Transport',
        'cab': 'Transport',
        'travel': 'Travel',
        'trips': 'Travel',
        'shopping': 'Shopping',
        'clothes': 'Shopping',
        'entertainment': 'Entertainment',
        'movies': 'Entertainment',
        'bills': 'Bills & Utilities',
        'bills & utilities': 'Bills & Utilities',
        'utilities': 'Bills & Utilities',
        'education': 'Education',
        'books': 'Education',
        'healthcare': 'Healthcare',
        'medical': 'Healthcare',
        'health': 'Healthcare'
    }
    
    def map_cat(cat):
        cat_lower = str(cat).strip().lower()
        if cat_lower in category_map:
            return category_map[cat_lower]
        # Match title case if valid
        title_cat = str(cat).strip().title()
        if title_cat in VALID_CATEGORIES:
            return title_cat
        return "Other"
        
    df['Category'] = df['Category'].apply(map_cat)
    return df

def remove_duplicates(df: pd.DataFrame) -> tuple[pd.DataFrame, int]:
    """Remove exact duplicate transactions."""
    initial_len = len(df)
    df_clean = df.drop_duplicates().copy()
    duplicates_removed = initial_len - len(df_clean)
    return df_clean, duplicates_removed

def detect_outliers_iqr(df: pd.DataFrame, threshold: float = 3.0) -> pd.DataFrame:
    """Identify potential expense outliers using Interquartile Range (IQR)."""
    if 'Amount' not in df.columns or df.empty:
        return df.assign(Is_Outlier=False)
        
    Q1 = df['Amount'].quantile(0.25)
    Q3 = df['Amount'].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - (threshold * IQR)
    upper_bound = Q3 + (threshold * IQR)
    
    df_out = df.copy()
    df_out['Is_Outlier'] = (df_out['Amount'] < lower_bound) | (df_out['Amount'] > upper_bound)
    return df_out

def clean_expense_data(df: pd.DataFrame) -> tuple[pd.DataFrame, dict]:
    """
    Main Data Preprocessing Pipeline.
    Applies all cleaning steps sequentially and returns clean DataFrame and report log.
    """
    report = {}
    initial_count = len(df)
    report['initial_count'] = initial_count
    
    # 1. Validate Schema
    is_valid, msg = validate_expense_schema(df)
    if not is_valid:
        raise ValueError(msg)
        
    # 2. Handle missing values & format conversions
    df_clean = handle_missing_values(df)
    report['after_missing_count'] = len(df_clean)
    
    # 3. Standardize categories
    df_clean = standardize_categories(df_clean)
    
    # 4. Remove duplicates
    df_clean, dupes_removed = remove_duplicates(df_clean)
    report['duplicates_removed'] = dupes_removed
    
    # 5. Sort by Date
    df_clean = df_clean.sort_values(by='Date').reset_index(drop=True)
    report['final_count'] = len(df_clean)
    
    return df_clean, report
