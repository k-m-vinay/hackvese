# AI Expense & Budget Assistant - Project Report & Viva Preparation Guide

---

## 1. Project Overview & Documentation

### Problem Statement
Personal finance management is challenging for many individuals due to manual tracking errors, lack of spending category visibility, and an inability to forecast future expenses. Traditional budgeting tools require manual entry and static calculations, leading to budget overruns and poor savings rates.

### Existing System vs. Proposed System

| Parameter | Existing Traditional System | Proposed AI Assistant System |
| :--- | :--- | :--- |
| **Categorization** | Manual selection for every expense | Automatic NLP-based AI text categorization |
| **Prediction** | None (only past history viewing) | Time-Series Machine Learning predictions |
| **Alerts** | Static or missing | Real-time threshold warnings (85% warning, 100% exceeded) |
| **Recommendations** | Generic rules | Data-driven, personalized budget adjustments |
| **Interface** | Basic spreadsheets | Modern Green & White interactive Streamlit dashboard |

### Objectives
1. Provide automated expense entry and intelligent text categorization using NLP.
2. Deliver spending analytics (monthly, daily, category distributions, min/max metrics).
3. Compare actual spending against user-defined budgets and trigger real-time warning alerts.
4. Predict future end-of-month and next-month spending using regression ML models.
5. Generate data-driven budget recommendations derived directly from user spending patterns.

### Scope
The application is designed for personal expense tracking, small business budgeting, student finance management, and academic demonstration of practical ML integration.

### Technologies Used
- **Programming Language**: Python 3
- **Data Manipulation**: Pandas, NumPy
- **Machine Learning**: Scikit-Learn (TF-IDF Vectorizer, Logistic Regression, Naive Bayes, Random Forest Regressor, Linear Regression)
- **Data Visualization**: Matplotlib, Seaborn
- **User Interface**: Streamlit (with custom CSS Green + White financial styling)

---

## 2. Machine Learning Architecture & Pipeline

```text
Raw Expense Data (Description, Amount, Date)
                 ↓
Data Preprocessing (utils/data_cleaning.py)
   • Missing value imputation & currency formatting (₹)
   • Duplicate removal & schema validation
                 ↓
Feature Engineering (models/spending_model.py)
   • Time features (Day, Month, DayOfWeek, Is_Weekend)
   • Rolling 7-day averages & Lag-1 day amounts
                 ↓
Machine Learning Models
   • Categorization: TF-IDF (Unigrams + Bigrams) + Logistic Regression / Naive Bayes
   • Spending Prediction: Random Forest Regressor vs Linear Regression
                 ↓
Evaluation Metrics
   • Classification: Accuracy Score, Precision, Recall, F1-Score
   • Regression: MAE, MSE, RMSE, R² Score
                 ↓
Financial Analytics & Recommendation Engine (utils/budget.py)
                 ↓
Streamlit Green & White Financial Dashboard (app.py)
```

### Data Preprocessing Steps
1. **Currency Cleaning**: Converts raw strings such as `₹1,450.00` or `1450` into floating-point numbers.
2. **Missing Values**: Imputes missing descriptions with `"Unspecified Expense"`, missing payment methods with `"UPI"`, and filters rows missing mandatory dates or non-positive amounts.
3. **Duplicate Removal**: Identifies and drops exact duplicate transaction entries.
4. **Category Standardization**: Maps irregular category strings (e.g. `"dining"`, `"food & dining"`) to standardized standard categories.

### Feature Engineering
- **Date Components**: `Day`, `Month`, `DayOfWeek`, `Is_Weekend` (1 for Saturday/Sunday, 0 for weekdays).
- **Rolling Averages**: 7-day rolling window mean (`Rolling_7d_Avg`) to smooth out daily spending spikes.
- **Lag Amounts**: Previous day's total spending (`Lag_1d_Amount`) to capture daily temporal continuity.

### Model Evaluation Metrics Explained
- **MAE (Mean Absolute Error)**: Average absolute magnitude of prediction errors in rupees (₹).
- **MSE (Mean Squared Error)**: Average squared error, penalizing larger deviations.
- **RMSE (Root Mean Squared Error)**: Square root of MSE, measured in the original units (₹).
- **R² Score**: Coefficient of determination measuring how well the regression model explains variance (1.0 = perfect fit).

---

## 3. Viva Presentation Preparation (12 Key Q&A)

### Q1: What is the purpose of this project?
> **Answer**: The purpose of the **AI Expense & Budget Assistant** is to automate personal expense management. It automatically categorizes expenses using Machine Learning, predicts future spending trends, monitors budget health with real-time alerts, and provides personalized financial recommendations.

### Q2: Why did you use Pandas?
> **Answer**: Pandas is used for high-performance data manipulation, reading CSV files, handling missing data, filtering, aggregating monthly/daily totals, and computing category breakdowns efficiently.

### Q3: Why is Machine Learning used in an expense manager?
> **Answer**: Machine Learning solves two major problems:
> 1. **Automation**: NLP text classification eliminates manual category selection when entering expenses.
> 2. **Forecasting**: Regression models learn time-series spending patterns to predict end-of-month and next-month financial totals.

### Q4: Which ML algorithms did you use and why?
> **Answer**:
> - **Expense Categorization**: **TF-IDF Vectorizer + Logistic Regression / Naive Bayes**. TF-IDF converts text descriptions into numerical n-gram features, which linear/probabilistic classifiers categorize with high accuracy.
> - **Spending Prediction**: **Random Forest Regressor** and **Linear Regression**. Random Forest captures non-linear spending spikes and weekend patterns effectively.

### Q5: What is expense categorization?
> **Answer**: Expense categorization is the process of mapping raw transaction descriptions (e.g. *"Uber ride to college"*) to predefined functional categories like *"Transport"*, *"Food"*, or *"Bills & Utilities"*.

### Q6: How does spending prediction work?
> **Answer**: Spending prediction aggregates daily transaction amounts, creates time-series features (day of week, weekend flags, rolling 7-day averages, lag amounts), and feeds them into a regression model to estimate future daily and monthly expenditures.

### Q7: What is feature engineering in your project?
> **Answer**: Feature engineering creates new informative attributes from raw data. In our project, we extracted `DayOfWeek`, `Is_Weekend`, `Rolling_7d_Avg`, and `Lag_1d_Amount` to help the regression model learn daily spending patterns.

### Q8: How are personalized budget recommendations generated?
> **Answer**: Recommendations are calculated directly from historical spending data. If a category exceeds its budget, the system computes the exact percentage variance and suggests a revised budget limit or cut target based on actual spending.

### Q9: How did you handle missing or noisy data?
> **Answer**: In `utils/data_cleaning.py`, missing descriptions are imputed, invalid dates/amounts are filtered out, currency symbols (`₹`) are stripped, category names are standardized, and exact duplicate rows are removed.

### Q10: How did you evaluate the ML model performance?
> **Answer**:
> - For categorization: **Accuracy Score** and **Classification Report** (Precision/Recall).
> - For spending prediction: **MAE**, **MSE**, **RMSE**, and **R² Score**.

### Q11: What are the current limitations of the project?
> **Answer**:
> 1. Predictions rely on historical transaction data length; accuracy improves with longer dataset history.
> 2. Extremely rare or unique expense descriptions may require fallback keyword matching.

### Q12: What features can be added in the future?
> **Answer**:
> 1. Automatic receipt OCR scanning using computer vision.
> 2. Multi-currency support and live bank SMS parsing.
> 3. Cloud database synchronization (PostgreSQL / Firebase).

---

## 4. Conclusion
The **AI Expense & Budget Assistant** bridges the gap between raw personal transaction tracking and actionable financial intelligence. By combining automated NLP classification, regression-based predictive analytics, and a modern Green & White Streamlit UI, the application empowers users to achieve financial goals effectively.
