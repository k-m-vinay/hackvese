"""
Automated Test Suite for AI Expense & Budget Assistant
Verifies the 5 required test scenarios:
1. Normal monthly spending
2. Exceeding Food category budget
3. Exceeding Total monthly budget
4. Data cleaning of missing values
5. Data cleaning of duplicate transactions
"""

import sys
import os
import pandas as pd
import numpy as np

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.data_cleaning import clean_expense_data, handle_missing_values, remove_duplicates
from utils.analytics import calculate_spending_summary
from utils.budget import compare_spending_with_budget
from models.category_model import ExpenseCategorizer
from models.spending_model import SpendingPredictor

def run_tests():
    print("==================================================")
    print("🧪 RUNNING AI EXPENSE & BUDGET ASSISTANT TEST SUITE")
    print("==================================================\n")

    # ---------------------------------------------------------
    # Scenario 1: Normal Monthly Spending
    # ---------------------------------------------------------
    print("Scenario 1: Normal Monthly Spending...")
    normal_data = pd.DataFrame([
        {"Date": "2026-08-01", "Description": "Groceries BigBasket", "Amount": 1200, "Payment_Method": "UPI", "Category": "Groceries"},
        {"Date": "2026-08-02", "Description": "Uber ride to college", "Amount": 200, "Payment_Method": "UPI", "Category": "Transport"},
        {"Date": "2026-08-03", "Description": "Electricity Bill", "Amount": 1500, "Payment_Method": "Net Banking", "Category": "Bills & Utilities"}
    ])
    df_clean, _ = clean_expense_data(normal_data)
    summary = calculate_spending_summary(df_clean)
    budget_result = compare_spending_with_budget(df_clean, monthly_income=30000, monthly_budget=25000, category_budgets={"Food": 5000, "Transport": 3000})
    
    assert summary['total_spending'] == 2900, "Total spending calculation mismatch"
    assert budget_result['remaining_budget'] == 22100, "Remaining budget calculation mismatch"
    print("  ✅ Scenario 1 PASSED: Normal spending calculated correctly.\n")

    # ---------------------------------------------------------
    # Scenario 2: Exceeding Food Category Budget
    # ---------------------------------------------------------
    print("Scenario 2: User Exceeds Food Budget...")
    food_data = pd.DataFrame([
        {"Date": "2026-08-01", "Description": "Restaurant Dinner", "Amount": 3000, "Payment_Method": "Card", "Category": "Food"},
        {"Date": "2026-08-05", "Description": "Dominos Pizza Party", "Amount": 3000, "Payment_Method": "UPI", "Category": "Food"}
    ])
    df_food, _ = clean_expense_data(food_data)
    budget_food = compare_spending_with_budget(df_food, monthly_income=30000, monthly_budget=25000, category_budgets={"Food": 5000})
    
    # Check if food alert is present
    food_alerts = [a for a in budget_food['alerts'] if "Food budget has been exceeded" in a['message']]
    assert len(food_alerts) > 0, "Food budget exceeded alert was not triggered!"
    print(f"  ✅ Scenario 2 PASSED: Alert triggered successfully -> '{food_alerts[0]['message']}'\n")

    # ---------------------------------------------------------
    # Scenario 3: Exceeding Total Monthly Budget
    # ---------------------------------------------------------
    print("Scenario 3: User Exceeds Total Monthly Budget...")
    over_data = pd.DataFrame([
        {"Date": "2026-08-01", "Description": "Flight to Dubai", "Amount": 20000, "Payment_Method": "Card", "Category": "Travel"},
        {"Date": "2026-08-05", "Description": "Laptop Buy", "Amount": 30000, "Payment_Method": "Card", "Category": "Shopping"}
    ])
    df_over, _ = clean_expense_data(over_data)
    budget_over = compare_spending_with_budget(df_over, monthly_income=30000, monthly_budget=25000, category_budgets={"Travel": 5000})
    
    total_alerts = [a for a in budget_over['alerts'] if "Total monthly budget exceeded" in a['message']]
    assert len(total_alerts) > 0, "Total monthly budget exceeded alert was not triggered!"
    print(f"  ✅ Scenario 3 PASSED: Alert triggered successfully -> '{total_alerts[0]['message']}'\n")

    # ---------------------------------------------------------
    # Scenario 4: CSV with Missing Values
    # ---------------------------------------------------------
    print("Scenario 4: CSV with Missing Values...")
    missing_data = pd.DataFrame([
        {"Date": "2026-08-01", "Description": None, "Amount": "₹1200.00", "Payment_Method": None, "Category": None},
        {"Date": None, "Description": "Invalid Date Item", "Amount": 500, "Payment_Method": "UPI", "Category": "Other"},
        {"Date": "2026-08-03", "Description": "Uber Ride", "Amount": None, "Payment_Method": "UPI", "Category": "Transport"}
    ])
    df_missing_clean, report = clean_expense_data(missing_data)
    
    # Valid row should remain, missing date/amount should be handled cleanly
    assert len(df_missing_clean) == 1, "Missing values handling did not filter invalid rows cleanly"
    assert df_missing_clean.iloc[0]['Description'] == "Unspecified Expense", "Missing description was not imputed"
    print("  ✅ Scenario 4 PASSED: Missing values imputed & sanitized successfully.\n")

    # ---------------------------------------------------------
    # Scenario 5: CSV Containing Duplicate Transactions
    # ---------------------------------------------------------
    print("Scenario 5: CSV Containing Duplicate Transactions...")
    dupe_data = pd.DataFrame([
        {"Date": "2026-08-01", "Description": "Coffee Starbucks", "Amount": 350, "Payment_Method": "UPI", "Category": "Food"},
        {"Date": "2026-08-01", "Description": "Coffee Starbucks", "Amount": 350, "Payment_Method": "UPI", "Category": "Food"},
        {"Date": "2026-08-01", "Description": "Coffee Starbucks", "Amount": 350, "Payment_Method": "UPI", "Category": "Food"}
    ])
    df_dupe_clean, report = clean_expense_data(dupe_data)
    
    assert len(df_dupe_clean) == 1, "Duplicate transactions were not removed"
    assert report['duplicates_removed'] == 2, "Duplicate count mismatch"
    print(f"  ✅ Scenario 5 PASSED: Removed {report['duplicates_removed']} duplicate transactions successfully.\n")

    print("==================================================")
    print("🎉 ALL 5 TEST SCENARIOS PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == '__main__':
    run_tests()
