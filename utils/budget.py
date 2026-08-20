"""
Budget Management & Recommendation Module.
Handles budget calculations, alert threshold checks, and data-driven budget recommendations.
"""

import pandas as pd

# Default Recommended Budget Breakdown Percentages (50/30/20 Rule adapted)
DEFAULT_CATEGORY_BUDGET_RATIOS = {
    "Groceries": 0.15,
    "Bills & Utilities": 0.20,
    "Food": 0.15,
    "Shopping": 0.10,
    "Transport": 0.10,
    "Healthcare": 0.08,
    "Education": 0.07,
    "Entertainment": 0.05,
    "Travel": 0.05,
    "Other": 0.05
}

def generate_default_category_budgets(total_budget: float) -> dict:
    """Generate default category budgets based on total monthly budget."""
    return {cat: round(total_budget * ratio, 2) for cat, ratio in DEFAULT_CATEGORY_BUDGET_RATIOS.items()}

def compare_spending_with_budget(df: pd.DataFrame, monthly_income: float, monthly_budget: float, category_budgets: dict) -> dict:
    """
    Compares total & category-wise spending against user budgets.
    Returns status indicators, percentage used, remaining amounts, and alerts.
    """
    total_spent = df['Amount'].sum() if not df.empty else 0.0
    remaining_budget = monthly_budget - total_spent
    savings_rate = ((monthly_income - total_spent) / monthly_income * 100) if monthly_income > 0 else 0.0
    
    # Category level analysis
    cat_spent_series = df.groupby('Category')['Amount'].sum() if not df.empty else pd.Series(dtype=float)
    
    category_status = []
    alerts = []
    
    # Check total budget alert
    total_percent = (total_spent / monthly_budget * 100) if monthly_budget > 0 else 0.0
    if total_percent >= 100:
        alerts.append({
            "type": "danger",
            "message": f"⚠️ Total monthly budget exceeded! Spent ₹{total_spent:,.2f} of ₹{monthly_budget:,.2f} ({total_percent:.1f}%)"
        })
    elif total_percent >= 85:
        alerts.append({
            "type": "warning",
            "message": f"⚠️ Overall spending has reached {total_percent:.1f}% of your total budget (₹{total_spent:,.2f} / ₹{monthly_budget:,.2f})."
        })
    else:
        alerts.append({
            "type": "success",
            "message": f"✓ Overall spending is healthy at {total_percent:.1f}% of your total budget."
        })
        
    for cat, budget_limit in category_budgets.items():
        actual = float(cat_spent_series.get(cat, 0.0))
        pct = (actual / budget_limit * 100) if budget_limit > 0 else 0.0
        rem = budget_limit - actual
        
        if pct >= 100:
            status = "EXCEEDED"
            alert_msg = f"⚠️ {cat} budget has been exceeded! Spent ₹{actual:,.2f} against limit of ₹{budget_limit:,.2f}."
            alerts.append({"type": "danger", "message": alert_msg})
        elif pct >= 85:
            status = "WARNING"
            alert_msg = f"⚠️ {cat} spending has reached {pct:.1f}% of your budget (₹{actual:,.2f} / ₹{budget_limit:,.2f})."
            alerts.append({"type": "warning", "message": alert_msg})
        else:
            status = "OK"
            alert_msg = f"✓ {cat} spending is within budget ({pct:.1f}% used)."
            
        category_status.append({
            "Category": cat,
            "Budget": budget_limit,
            "Actual": actual,
            "Remaining": rem,
            "Percentage_Used": round(pct, 1),
            "Status": status
        })
        
    return {
        "monthly_income": monthly_income,
        "monthly_budget": monthly_budget,
        "total_spent": total_spent,
        "remaining_budget": remaining_budget,
        "savings_rate": round(savings_rate, 2),
        "total_budget_percentage": round(total_percent, 1),
        "category_comparison": pd.DataFrame(category_status),
        "alerts": alerts
    }

def generate_personalized_recommendations(df: pd.DataFrame, category_budgets: dict) -> list[dict]:
    """
    Analyzes historical spending patterns to output personalized budget recommendations.
    Calculated directly from actual spending data rather than fixed text.
    """
    if df.empty or 'Category' not in df.columns:
        return [{"title": "No Expense Data", "suggestion": "Add expenses to get personalized budget recommendations."}]
        
    recommendations = []
    
    # 1. Category overspending analysis
    cat_spent = df.groupby('Category')['Amount'].sum()
    total_spent = cat_spent.sum()
    
    for cat, actual in cat_spent.items():
        budget = category_budgets.get(cat, 0.0)
        cat_ratio = (actual / total_spent * 100) if total_spent > 0 else 0
        
        if budget > 0 and actual > budget:
            suggested_budget = round(actual * 1.05, -2)  # 5% buffer above actual
            diff_pct = ((actual - budget) / budget * 100)
            recommendations.append({
                "category": cat,
                "type": "overspending",
                "icon": "⚠️",
                "text": f"You exceeded your **{cat}** budget by **{diff_pct:.1f}%** (Spent ₹{actual:,.2f} vs Budget ₹{budget:,.2f}).",
                "action": f"Suggested revised {cat} budget: **₹{suggested_budget:,.2f}** or reduce spending by **₹{actual - budget:,.2f}** next month."
            })
        elif cat_ratio > 30 and cat not in ["Groceries", "Bills & Utilities"]:
            # High discretionary spending
            target_cut = actual * 0.15
            recommendations.append({
                "category": cat,
                "type": "high_discretionary",
                "icon": "💡",
                "text": f"**{cat}** accounts for **{cat_ratio:.1f}%** of your total expenses.",
                "action": f"Cutting non-essential {cat} spending by 15% could save you **₹{target_cut:,.2f}** monthly."
            })
            
    # 2. Check savings capacity
    if total_spent > 0:
        groceries_bills = cat_spent.get("Groceries", 0) + cat_spent.get("Bills & Utilities", 0)
        discretionary = total_spent - groceries_bills
        if discretionary > groceries_bills:
            potential_savings = discretionary * 0.20
            recommendations.append({
                "category": "Overall Savings",
                "type": "savings_boost",
                "icon": "📈",
                "text": "Discretionary expenses (Dining, Shopping, Entertainment) exceed essential bills.",
                "action": f"Potential monthly savings boost of **₹{potential_savings:,.2f}** by capping discretionary buys."
            })
            
    if not recommendations:
        recommendations.append({
            "category": "Overall",
            "type": "healthy",
            "icon": "🌟",
            "text": "Great financial discipline! All category spending is within planned budget limits.",
            "action": "Maintain current spending habits and direct excess remaining budget to high-yield savings."
        })
        
    return recommendations
