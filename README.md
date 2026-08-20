# 💸 AI Expense & Budget Assistant

An intelligent personal finance and expense management application built using **Python, Pandas, Machine Learning (Scikit-Learn), Data Visualization (Matplotlib & Seaborn), and Streamlit** with a modern **Green & White Financial Dashboard Theme**.

---

## 🌿 Project Overview

The **AI Expense & Budget Assistant** helps users understand where their money goes, automatically categorizes transaction descriptions using Natural Language Processing (NLP), forecasts end-of-month and next-month spending using time-series Machine Learning models, and delivers data-driven budget recommendations.

---

## 🚀 Key Features

1. **Automatic Expense Categorization**:
   - Uses **TF-IDF + Logistic Regression / Naive Bayes** to automatically categorize transaction descriptions into categories such as *Food*, *Transport*, *Shopping*, *Bills & Utilities*, *Groceries*, *Healthcare*, *Entertainment*, *Education*, *Travel*, and *Other*.
2. **Spending Predictions & Forecasts**:
   - Predicts total expected end-of-month spending, next month's total spending, and expected category breakdowns using **Random Forest Regressor** and **Linear Regression**.
   - Computes evaluation metrics: **MAE**, **MSE**, **RMSE**, and **R² Score**.
3. **Budget Tracking & Alert System**:
   - Visual indicators and real-time alert widgets triggered when spending reaches **85% (Warning)** or **100% (Exceeded)** of total or category budgets.
4. **Data-Driven Budget Recommendations**:
   - Calculates personalized budget adjustments derived directly from historical spending patterns rather than static text.
5. **Interactive Green & White Dashboard**:
   - Responsive UI built with Streamlit and styled with a clean white background, dark green headings, light green KPI cards, and custom visual charts.
6. **Robust Data Preprocessing Pipeline**:
   - Cleans currency strings (`₹`), handles missing values, standardizes categories, removes duplicate rows, and detects potential expense outliers.
7. **Searchable Transaction History & CSV Upload**:
   - Upload custom CSV expense files, search transactions, filter by category/date range, and manage entries dynamically.

---

## 📁 Project Architecture & Directory Structure

```text
AI_Expense_Budget_Assistant/
├── app.py                      # Main Streamlit Financial Dashboard (Green & White Theme)
├── requirements.txt            # Python Package Dependencies
├── README.md                   # Complete Documentation & macOS Execution Guide
├── viva_prep_and_report.md     # Detailed Academic Report & Viva Q&A Guide
│
├── data/
│   └── expenses.csv            # Primary realistic dataset (100+ transactions in ₹)
│
├── assets/
│   └── sample_data.csv         # Sample dataset for CSV upload testing
│
├── models/
│   ├── category_model.py       # Automatic NLP Categorization Model (TF-IDF + Classifier)
│   └── spending_model.py       # Time-Series Spending Prediction ML Model
│
├── utils/
│   ├── data_cleaning.py        # Data Preprocessing, Cleaning & Validation
│   ├── analytics.py            # Financial Calculations & Stat Generation
│   └── budget.py               # Budget Comparisons, Alerts & Smart Suggestions
│
└── tests/
    └── test_scenarios.py       # Automated Verification Suite for 5 Test Scenarios
```

---

## ⚙️ Installation & Running on macOS (Python 3)

Follow these step-by-step instructions to set up and run the application on macOS:

### Step 1: Open Terminal and Navigate to Project Directory
```bash
cd /Users/kmvinay/Desktop/ibm_Bhumika
```

### Step 2: (Optional but Recommended) Create & Activate Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Run Automated Test Suite (Verify Everything Works)
```bash
python3 tests/test_scenarios.py
```

### Step 5: Launch the Streamlit Financial Dashboard
```bash
streamlit run app.py
```

*The application will automatically open in your default browser at `http://localhost:8501`.*

---

## 📊 Machine Learning Pipeline & Pipeline Explanation

```text
Expense Data Input (Date, Description, Amount)
                       ↓
Data Cleaning & Formatting (utils/data_cleaning.py)
   • Currency Sanitization (₹) & Missing Value Imputation
   • Duplicate Transaction Removal
                       ↓
Feature Engineering (models/spending_model.py)
   • Day, Month, DayOfWeek, Is_Weekend
   • 7-Day Rolling Average Spending & Lag-1 Amounts
                       ↓
Machine Learning Execution
   • NLP Text Classification (models/category_model.py): TF-IDF + Logistic Regression
   • Regression Forecasting (models/spending_model.py): Random Forest Regressor
                       ↓
Evaluation & Analytics (utils/analytics.py, utils/budget.py)
   • MAE, MSE, RMSE, R² Score Calculation
   • Real-Time Alert Triggers & Personalized Budget Recommendations
                       ↓
Streamlit Financial Dashboard Output (app.py)
```

---

## 🔒 Security & Privacy Considerations

1. **Local Execution**: All transaction processing, data cleaning, and ML model training occur strictly locally on your machine.
2. **No External Data Transmission**: Financial entries and CSV uploads are never transmitted to third-party APIs or external cloud services.
3. **Data Sanitization**: CSV uploads undergo strict validation and cleaning before being loaded into session memory.

---

## 🧪 Testing Scenarios Summary

The system has been verified against 5 core testing scenarios in `tests/test_scenarios.py`:
1. **Normal Monthly Spending**: Accurate calculation of totals, daily averages, and savings rates.
2. **Exceeding Category Budget**: Triggers category warning alert when spending surpasses budget limits.
3. **Exceeding Total Budget**: Triggers prominent red banner when total monthly budget is exceeded.
4. **Missing Values**: Imputes missing descriptions and handles missing fields without crashing.
5. **Duplicate Transactions**: Identifies and removes duplicate entries automatically.

---

## 🎓 Academic Documentation & Viva Preparation
For complete BCA-level documentation, system data flow, module breakdown, and 12 Viva Questions & Answers, refer to [`viva_prep_and_report.md`](viva_prep_and_report.md).
