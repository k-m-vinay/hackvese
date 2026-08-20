"""
AI Expense & Budget Assistant - Main Streamlit Application
A modern financial management dashboard with ML categorization, time-series prediction,
budget health tracking, and custom Green & White theme.
"""

import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import datetime
import os

# Import custom project modules
from utils.data_cleaning import clean_expense_data, VALID_CATEGORIES, validate_expense_schema
from utils.analytics import calculate_spending_summary, get_category_breakdown, get_monthly_trend, get_daily_trend
from utils.budget import compare_spending_with_budget, generate_default_category_budgets, generate_personalized_recommendations
from models.category_model import ExpenseCategorizer, train_category_model
from models.spending_model import SpendingPredictor

# Set page config
st.set_page_config(
    page_title="AI Expense & Budget Assistant",
    page_icon="💸",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Apply Custom Green + White Theme CSS
CUSTOM_CSS = """
<style>
    /* Global Page Styling */
    .main {
        background-color: #FAFAFA;
        color: #1F2937;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    /* Header Styling */
    h1, h2, h3 {
        color: #1B4D3E !important;
        font-weight: 700;
    }
    
    /* KPI Metric Cards */
    .kpi-card {
        background-color: #FFFFFF;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 4px 12px rgba(27, 77, 62, 0.06);
        border-left: 6px solid #2E7D32;
        border-top: 1px solid #E8F5E9;
        border-right: 1px solid #E8F5E9;
        border-bottom: 1px solid #E8F5E9;
        text-align: center;
        transition: transform 0.2s ease;
    }
    .kpi-card:hover {
        transform: translateY(-2px);
    }
    .kpi-title {
        font-size: 0.9rem;
        color: #558B2F;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
    }
    .kpi-value {
        font-size: 1.8rem;
        color: #1B4D3E;
        font-weight: 800;
    }
    
    /* Buttons */
    .stButton>button {
        background-color: #2E7D32 !important;
        color: white !important;
        font-weight: 600 !important;
        border-radius: 8px !important;
        border: none !important;
        padding: 0.5rem 1.2rem !important;
        box-shadow: 0 2px 5px rgba(46, 125, 50, 0.2);
    }
    .stButton>button:hover {
        background-color: #1B4D3E !important;
        box-shadow: 0 4px 10px rgba(27, 77, 62, 0.3);
    }
    
    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: #F1F8E9;
        border-right: 1px solid #C8E6C9;
    }
    
    /* Custom Alert Cards */
    .alert-box {
        padding: 14px 18px;
        border-radius: 8px;
        margin-bottom: 12px;
        font-weight: 500;
    }
    .alert-danger {
        background-color: #FFEBEE;
        color: #C62828;
        border-left: 5px solid #D32F2F;
    }
    .alert-warning {
        background-color: #FFF8E1;
        color: #F57F17;
        border-left: 5px solid #FBC02D;
    }
    .alert-success {
        background-color: #E8F5E9;
        color: #1B5E20;
        border-left: 5px solid #2E7D32;
    }
    
    /* Recommendations Box */
    .rec-card {
        background-color: #FFFFFF;
        border-left: 5px solid #43A047;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
</style>
"""
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

# Helper function to load dataset
@st.cache_data
def load_initial_data():
    file_path = 'data/expenses.csv'
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
        df_clean, report = clean_expense_data(df)
        return df_clean
    else:
        # Create empty fallback
        return pd.DataFrame(columns=['Date', 'Description', 'Amount', 'Payment_Method', 'Category'])

# Initialize Session State
if 'expenses_df' not in st.session_state:
    st.session_state['expenses_df'] = load_initial_data()

if 'categorizer' not in st.session_state:
    st.session_state['categorizer'] = train_category_model(st.session_state['expenses_df'])

# Sidebar Configuration & Input Forms
st.sidebar.markdown("## 🌿 Financial Settings")

# Income & Budget Controls
monthly_income = st.sidebar.number_input("Monthly Income (₹)", min_value=1000.0, value=30000.0, step=1000.0)
monthly_budget = st.sidebar.number_input("Monthly Total Budget (₹)", min_value=1000.0, value=25000.0, step=1000.0)

st.sidebar.markdown("---")
st.sidebar.markdown("### 🎯 Category Budgets")
default_cat_budgets = generate_default_category_budgets(monthly_budget)
user_cat_budgets = {}

with st.sidebar.expander("Customize Category Budgets"):
    for cat in VALID_CATEGORIES:
        user_cat_budgets[cat] = st.number_input(
            f"{cat} Budget (₹)",
            min_value=0.0,
            value=float(default_cat_budgets.get(cat, 2000.0)),
            step=500.0
        )

st.sidebar.markdown("---")
st.sidebar.markdown("### ➕ Quick Add Expense")

with st.sidebar.form("quick_add_form", clear_on_submit=True):
    entry_date = st.date_input("Date", value=datetime.date.today())
    entry_desc = st.text_input("Description", placeholder="e.g. Uber ride to college")
    entry_amount = st.number_input("Amount (₹)", min_value=1.0, value=250.0, step=50.0)
    entry_payment = st.selectbox("Payment Method", ["UPI", "Card", "Cash", "Net Banking"])
    
    # Auto-predict category button / selection
    auto_cat, conf = st.session_state['categorizer'].predict_single(entry_desc) if entry_desc else ("Other", 0.0)
    cat_index = VALID_CATEGORIES.index(auto_cat) if auto_cat in VALID_CATEGORIES else 9
    entry_cat = st.selectbox("Category (AI Auto-Selected)", VALID_CATEGORIES, index=cat_index)
    
    if auto_cat != "Other" and entry_desc:
        st.caption(f"🤖 AI suggestion: **{auto_cat}** (Confidence: {conf*100:.0f}%)")
        
    submit_add = st.form_submit_button("Add Expense")
    
    if submit_add:
        if entry_desc.strip():
            new_row = pd.DataFrame([{
                'Date': pd.to_datetime(entry_date),
                'Description': entry_desc.strip(),
                'Amount': float(entry_amount),
                'Payment_Method': entry_payment,
                'Category': entry_cat
            }])
            st.session_state['expenses_df'] = pd.concat([st.session_state['expenses_df'], new_row], ignore_index=True)
            st.session_state['expenses_df'], _ = clean_expense_data(st.session_state['expenses_df'])
            # Retrain AI categorizer with new data
            st.session_state['categorizer'].fit(st.session_state['expenses_df']['Description'], st.session_state['expenses_df']['Category'])
            st.sidebar.success(f"Added expense: {entry_desc} (₹{entry_amount})")
            st.rerun()
        else:
            st.sidebar.error("Please enter a valid description.")

st.sidebar.markdown("---")
st.sidebar.markdown("### 📁 Upload CSV Dataset")
uploaded_file = st.sidebar.file_uploader("Upload Expense CSV", type=["csv"])

if uploaded_file is not None:
    try:
        raw_df = pd.read_csv(uploaded_file)
        cleaned_df, report = clean_expense_data(raw_df)
        st.session_state['expenses_df'] = cleaned_df
        st.session_state['categorizer'].fit(cleaned_df['Description'], cleaned_df['Category'])
        st.sidebar.success(f"Successfully processed {len(cleaned_df)} transactions!")
        st.sidebar.info(f"Removed {report.get('duplicates_removed', 0)} duplicates.")
    except Exception as e:
        st.sidebar.error(f"Error parsing file: {e}")


# Main Header
st.title("💸 AI Expense & Budget Assistant")
st.markdown("##### *Smart Expense Categorization, Predictive Analytics & Budget Management*")

df_current = st.session_state['expenses_df'].copy()

# Filter Bar (Category & Date Range)
col_f1, col_f2, col_f3 = st.columns([2, 2, 3])
with col_f1:
    selected_category = st.selectbox("Filter Category", ["All Categories"] + VALID_CATEGORIES)
with col_f2:
    if not df_current.empty:
        min_d = df_current['Date'].min().date()
        max_d = df_current['Date'].max().date()
        date_range = st.date_input("Date Range", value=(min_d, max_d))
    else:
        date_range = (datetime.date.today(), datetime.date.today())
with col_f3:
    search_query = st.text_input("🔍 Search Description", placeholder="Search expenses...")

# Apply Filters to View
df_filtered = df_current.copy()
if selected_category != "All Categories":
    df_filtered = df_filtered[df_filtered['Category'] == selected_category]

if len(date_range) == 2 and not df_filtered.empty:
    start_date, end_date = pd.to_datetime(date_range[0]), pd.to_datetime(date_range[1])
    df_filtered = df_filtered[(df_filtered['Date'] >= start_date) & (df_filtered['Date'] <= end_date)]

if search_query.strip() and not df_filtered.empty:
    df_filtered = df_filtered[df_filtered['Description'].str.contains(search_query, case=False, na=False)]


# Calculations for Top Cards
summary = calculate_spending_summary(df_filtered)
budget_comp = compare_spending_with_budget(df_filtered, monthly_income, monthly_budget, user_cat_budgets)

# Top KPI Cards Display
st.markdown("<br>", unsafe_allow_html=True)
kpi1, kpi2, kpi3, kpi4 = st.columns(4)

with kpi1:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-title">💰 Total Income</div>
        <div class="kpi-value">₹{monthly_income:,.0f}</div>
    </div>
    """, unsafe_allow_html=True)

with kpi2:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-title">💸 Total Expenses</div>
        <div class="kpi-value">₹{summary['total_spending']:,.0f}</div>
    </div>
    """, unsafe_allow_html=True)

with kpi3:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-title">💵 Remaining Budget</div>
        <div class="kpi-value">₹{budget_comp['remaining_budget']:,.0f}</div>
    </div>
    """, unsafe_allow_html=True)

with kpi4:
    st.markdown(f"""
    <div class="kpi-card">
        <div class="kpi-title">📊 Savings Rate</div>
        <div class="kpi-value">{budget_comp['savings_rate']:.1f}%</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# Main Application Tabs
tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
    "📊 Overview & Alerts",
    "📈 Visual Analytics",
    "🤖 AI & Predictions",
    "💡 Smart Suggestions",
    "📋 Expense History",
    "⚙️ Data Pipeline"
])


# TAB 1: OVERVIEW & ALERTS
with tab1:
    st.subheader("🔔 Budget Alerts & Spending Health")
    
    # Display Alert Cards
    for alert in budget_comp['alerts']:
        alert_class = "alert-success"
        if alert['type'] == 'danger':
            alert_class = "alert-danger"
        elif alert['type'] == 'warning':
            alert_class = "alert-warning"
            
        st.markdown(f"""
        <div class="alert-box {alert_class}">
            {alert['message']}
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<br>", unsafe_allow_html=True)
    
    col_a, col_b = st.columns(2)
    
    with col_a:
        st.markdown("### 📌 Financial Highlights")
        st.markdown(f"- **Total Transactions**: `{summary['transaction_count']}`")
        st.markdown(f"- **Average Daily Expense**: `₹{summary['avg_daily_spending']:,.2f}`")
        st.markdown(f"- **Most Expensive Category**: `{summary['most_expensive_category']}` (₹{summary['most_expensive_category_amount']:,.2f})")
        st.markdown(f"- **Highest Single Expense**: `{summary['highest_expense']['description']}` - `₹{summary['highest_expense']['amount']:,.2f}` ({summary['highest_expense']['category']})")
        st.markdown(f"- **Lowest Single Expense**: `{summary['lowest_expense']['description']}` - `₹{summary['lowest_expense']['amount']:,.2f}` ({summary['lowest_expense']['category']})")

    with col_b:
        st.markdown("### ⚖️ Budget vs Actual Summary")
        st.dataframe(
            budget_comp['category_comparison'].style.format({
                'Budget': '₹{:,.2f}',
                'Actual': '₹{:,.2f}',
                'Remaining': '₹{:,.2f}',
                'Percentage_Used': '{:.1f}%'
            }),
            use_container_width=True
        )


# TAB 2: VISUAL ANALYTICS
with tab2:
    st.subheader("📈 Spending Visualizations")
    
    if df_filtered.empty:
        st.warning("No expense data available for the selected filters.")
    else:
        # Plot styling setup
        plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
        green_palette = ['#1B4D3E', '#2E7D32', '#43A047', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9', '#388E3C', '#1B5E20', '#4CAF50']
        
        c1, c2 = st.columns(2)
        
        with c1:
            st.markdown("#### 1. Category-Wise Expense Distribution")
            cat_df = get_category_breakdown(df_filtered)
            fig1, ax1 = plt.subplots(figsize=(6, 5))
            ax1.pie(
                cat_df['Amount'],
                labels=cat_df['Category'],
                autopct='%1.1f%%',
                startangle=140,
                colors=green_palette[:len(cat_df)],
                textprops={'fontsize': 9, 'color': '#1B4D3E', 'weight': 'bold'}
            )
            ax1.axis('equal')
            st.pyplot(fig1)
            
        with c2:
            st.markdown("#### 2. Monthly Spending Bar Chart")
            monthly_df = get_monthly_trend(df_filtered)
            fig2, ax2 = plt.subplots(figsize=(6, 5))
            sns.barplot(data=monthly_df, x='Month_Year', y='Amount', ax=ax2, palette='Greens_r')
            ax2.set_ylabel("Spending (₹)", color='#1B4D3E', fontweight='bold')
            ax2.set_xlabel("Month", color='#1B4D3E', fontweight='bold')
            plt.xticks(rotation=45)
            st.pyplot(fig2)

        st.markdown("<br>", unsafe_allow_html=True)
        c3, c4 = st.columns(2)
        
        with c3:
            st.markdown("#### 3. Daily Spending Trend Line")
            daily_df = get_daily_trend(df_filtered)
            fig3, ax3 = plt.subplots(figsize=(6, 5))
            ax3.plot(daily_df['Date'], daily_df['Amount'], marker='o', color='#2E7D32', linewidth=2, markersize=4)
            ax3.set_ylabel("Daily Amount (₹)", color='#1B4D3E', fontweight='bold')
            ax3.set_xlabel("Date", color='#1B4D3E', fontweight='bold')
            plt.xticks(rotation=45)
            st.pyplot(fig3)
            
        with c4:
            st.markdown("#### 4. Budget vs. Actual Comparison Chart")
            comp_df = budget_comp['category_comparison']
            fig4, ax4 = plt.subplots(figsize=(6, 5))
            x = np.arange(len(comp_df))
            width = 0.35
            ax4.bar(x - width/2, comp_df['Budget'], width, label='Budget', color='#A5D6A7')
            ax4.bar(x + width/2, comp_df['Actual'], width, label='Actual', color='#1B4D3E')
            ax4.set_xticks(x)
            ax4.set_xticklabels(comp_df['Category'], rotation=45, ha='right', fontsize=8)
            ax4.set_ylabel("Amount (₹)", color='#1B4D3E', fontweight='bold')
            ax4.legend()
            st.pyplot(fig4)


# TAB 3: AI & PREDICTIONS
with tab3:
    st.subheader("🤖 Machine Learning Categorization & Prediction Engine")
    
    st.markdown("### 1. Interactive Expense Categorizer Test")
    test_desc = st.text_input("Enter any transaction description to test AI classification:", "Uber ride to railway station")
    if test_desc:
        pred_cat, confidence = st.session_state['categorizer'].predict_single(test_desc)
        st.success(f"**Predicted Category**: `{pred_cat}` | **Confidence Score**: `{confidence*100:.1f}%`")
        st.info("**ML Algorithm Used**: TF-IDF Vectorizer (Unigrams + Bigrams) + Logistic Regression / Naive Bayes Classifier.")

    st.markdown("---")
    st.markdown("### 2. Time-Series Spending Predictions")
    
    model_choice = st.selectbox("Select ML Prediction Algorithm", ["Random Forest Regressor", "Linear Regression"])
    model_key = 'random_forest' if model_choice == "Random Forest Regressor" else 'linear'
    
    predictor = SpendingPredictor(model_type=model_key)
    metrics = predictor.train_and_evaluate(st.session_state['expenses_df'])
    
    if "error" not in metrics:
        m1, m2, m3, m4 = st.columns(4)
        m1.metric("MAE (Mean Abs Error)", f"₹{metrics['MAE']}")
        m2.metric("MSE (Mean Sq Error)", f"₹{metrics['MSE']}")
        m3.metric("RMSE (Root Mean Sq)", f"₹{metrics['RMSE']}")
        m4.metric("R² Accuracy Score", f"{metrics['R2_Score']}")
        
        st.markdown("<br>", unsafe_allow_html=True)
        p_col1, p_col2 = st.columns(2)
        
        end_month_pred = predictor.predict_end_of_month(st.session_state['expenses_df'])
        next_month_pred = predictor.predict_next_month(st.session_state['expenses_df'])
        cat_next_month = predictor.predict_category_wise_next_month(st.session_state['expenses_df'])
        
        with p_col1:
            st.markdown("#### 🔮 Forecasted Totals")
            st.markdown(f"- **Expected End-of-Month Total Spending**: `₹{end_month_pred:,.2f}`")
            st.markdown(f"- **Expected Next Month Total Spending**: `₹{next_month_pred:,.2f}`")
            
        with p_col2:
            st.markdown("#### 📊 Predicted Next Month Category Breakdown")
            cat_pred_df = pd.DataFrame(list(cat_next_month.items()), columns=['Category', 'Predicted_Spending'])
            st.dataframe(cat_pred_df.style.format({'Predicted_Spending': '₹{:,.2f}'}), use_container_width=True)
    else:
        st.warning(metrics["error"])


# TAB 4: SMART SUGGESTIONS
with tab4:
    st.subheader("💡 Data-Driven Budget Recommendations")
    st.markdown("Personalized financial insights generated by analyzing your actual spending history.")
    
    recommendations = generate_personalized_recommendations(df_filtered, user_cat_budgets)
    
    for rec in recommendations:
        st.markdown(f"""
        <div class="rec-card">
            <h4>{rec.get('icon', '💡')} {rec.get('category', 'Category Insight')}</h4>
            <p>{rec.get('text', '')}</p>
            <p style="color: #2E7D32; font-weight: 600;">👉 {rec.get('action', '')}</p>
        </div>
        """, unsafe_allow_html=True)


# TAB 5: EXPENSE HISTORY
with tab5:
    st.subheader("📋 Transaction History & Management")
    
    st.dataframe(
        df_filtered[['Date', 'Description', 'Amount', 'Payment_Method', 'Category']].style.format({
            'Amount': '₹{:,.2f}',
            'Date': lambda x: x.strftime('%Y-%m-%d')
        }),
        use_container_width=True
    )
    
    st.markdown("### 🗑️ Delete Transaction")
    if not df_filtered.empty:
        df_filtered['Select_Label'] = df_filtered.apply(lambda r: f"{r['Date'].strftime('%Y-%m-%d')} | {r['Description']} | ₹{r['Amount']}", axis=1)
        selected_to_delete = st.selectbox("Select Expense to Delete", df_filtered['Select_Label'].tolist())
        
        if st.button("Delete Selected Expense"):
            idx_to_remove = df_filtered[df_filtered['Select_Label'] == selected_to_delete].index
            st.session_state['expenses_df'] = st.session_state['expenses_df'].drop(idx_to_remove).reset_index(drop=True)
            st.success("Expense deleted successfully!")
            st.rerun()


# TAB 6: DATA PIPELINE
with tab6:
    st.subheader("⚙️ Data Cleaning & ML Pipeline Architecture")
    
    st.markdown("""
    ```text
    Raw CSV / Entry Input Data
               ↓
    Data Cleaning & Validation (utils/data_cleaning.py)
       • Handles Missing Values & Invalid Currency Formatting
       • Sanitizes Dates & Removes Duplicate Transactions
               ↓
    Feature Engineering (models/spending_model.py)
       • Lag Features, Rolling 7-day Averages, Date Components
               ↓
    Machine Learning Engine
       • NLP Text Classification (models/category_model.py): TF-IDF + Logistic Regression
       • Time-Series Forecasting (models/spending_model.py): Random Forest / Linear Regression
               ↓
    Financial Analytics & Budget Manager (utils/analytics.py, utils/budget.py)
       • Alert Threshold Triggers (85% warning, 100% exceeded)
       • Data-Driven Recommendation System
               ↓
    Streamlit Financial Dashboard (app.py)
    ```
    """)
    
    st.markdown("### 📊 Dataset Health Summary")
    st.markdown(f"- **Total Active Records**: `{len(st.session_state['expenses_df'])}`")
    st.markdown(f"- **Earliest Record Date**: `{st.session_state['expenses_df']['Date'].min().strftime('%Y-%m-%d') if not st.session_state['expenses_df'].empty else 'N/A'}`")
    st.markdown(f"- **Latest Record Date**: `{st.session_state['expenses_df']['Date'].max().strftime('%Y-%m-%d') if not st.session_state['expenses_df'].empty else 'N/A'}`")
