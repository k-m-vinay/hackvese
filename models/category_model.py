"""
Expense Categorization Module using NLP & Machine Learning.
Combines TF-IDF vectorization with Naive Bayes / Logistic Regression classifier
and a rule-based fallback system.
"""

import pandas as pd
import numpy as np
import re
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

KEYWORD_RULES = {
    "Food": ["pizza", "burger", "restaurant", "swiggy", "zomato", "dinner", "lunch", "breakfast", "cafe", "starbucks", "subway", "kfc", "dominos", "food", "tiffin", "chai", "coffee", "canteen", "bakery"],
    "Groceries": ["groceries", "bigbasket", "zepto", "blinkit", "supermarket", "vegetables", "fruits", "milk", "eggs", "nature basket", "reliance smart", "more supermarket"],
    "Transport": ["uber", "ola", "rapido", "cab", "auto", "metro", "bus", "petrol", "fuel", "rickshaw", "fare", "bike ride"],
    "Shopping": ["amazon", "myntra", "flipkart", "zara", "uniqlo", "shoes", "clothes", "shirt", "t-shirt", "jacket", "headphones", "smartwatch", "sunglasses", "decathlon", "westside"],
    "Bills & Utilities": ["electricity", "water", "bill", "recharge", "jio", "airtel", "broadband", "wifi", "piped gas", "lpg", "cylinder", "dth", "postpaid", "maintenance"],
    "Entertainment": ["movie", "pvr", "netflix", "spotify", "prime video", "concert", "ipl", "gaming", "bowling", "theater", "tickets", "park"],
    "Education": ["college", "textbook", "book", "course", "udemy", "exam fee", "tuition", "notebook", "stationery", "bootcamp", "skillshare", "library"],
    "Healthcare": ["doctor", "pharmacy", "medicine", "dental", "clinic", "hospital", "gym", "blood test", "physiotherapy", "multivitamin", "protein", "glasses"],
    "Travel": ["flight", "hotel", "resort", "goa", "outstation", "irctc", "train", "airport", "trip", "tour"]
}

class ExpenseCategorizer:
    def __init__(self):
        self.model = Pipeline([
            ('tfidf', TfidfVectorizer(ngram_range=(1, 2), stop_words='english', lowercase=True)),
            ('clf', LogisticRegression(C=1.0, max_iter=200, random_state=42))
        ])
        self.is_trained = False
        
    def _rule_based_categorize(self, description: str) -> tuple[str, float]:
        """Fallback keyword rule matcher with confidence heuristic."""
        desc_lower = str(description).lower()
        for cat, keywords in KEYWORD_RULES.items():
            for kw in keywords:
                if re.search(r'\b' + re.escape(kw) + r'\b', desc_lower):
                    return cat, 0.90
        return "Other", 0.30

    def fit(self, descriptions, categories):
        """Train the TF-IDF + Classifier pipeline on text descriptions."""
        if len(descriptions) < 5:
            return self
            
        df_train = pd.DataFrame({'desc': descriptions, 'cat': categories})
        df_train = df_train.dropna()
        
        if len(df_train) > 5:
            self.model.fit(df_train['desc'], df_train['cat'])
            self.is_trained = True
        return self

    def predict_single(self, description: str) -> tuple[str, float]:
        """
        Predict category for a single expense description.
        Returns predicted category name and confidence score (0.0 to 1.0).
        """
        if not description or not str(description).strip():
            return "Other", 0.0
            
        # First check rule-based keyword match for high confidence
        rule_cat, rule_conf = self._rule_based_categorize(description)
        
        if not self.is_trained:
            return rule_cat, rule_conf

        try:
            probs = self.model.predict_proba([description])[0]
            max_idx = np.argmax(probs)
            ml_cat = self.model.classes_[max_idx]
            ml_conf = probs[max_idx]
            
            # If rule has high confidence, combine or prioritize rule
            if rule_conf >= 0.90:
                return rule_cat, max(rule_conf, ml_conf)
            elif ml_conf >= 0.40:
                return ml_cat, float(ml_conf)
            else:
                return rule_cat, rule_conf
        except Exception:
            return rule_cat, rule_conf

    def predict_batch(self, descriptions: pd.Series) -> pd.Series:
        """Predict categories for a Pandas Series of descriptions."""
        return pd.Series([self.predict_single(d)[0] for d in descriptions])

    def evaluate(self, descriptions, categories) -> dict:
        """Evaluate classifier metrics on test split."""
        if not self.is_trained or len(descriptions) < 10:
            return {"accuracy": 0.0, "report": "Insufficient data to evaluate."}
            
        preds = self.predict_batch(descriptions)
        acc = accuracy_score(categories, preds)
        rep = classification_report(categories, preds, output_dict=True, zero_division=0)
        return {"accuracy": float(acc), "report": rep}


def train_category_model(df: pd.DataFrame) -> ExpenseCategorizer:
    """Utility helper to instantiate and train categorizer from dataframe."""
    categorizer = ExpenseCategorizer()
    if 'Description' in df.columns and 'Category' in df.columns:
        categorizer.fit(df['Description'], df['Category'])
    return categorizer
