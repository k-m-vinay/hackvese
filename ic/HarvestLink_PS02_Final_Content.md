# HarvestLink — PS-02
## Post-Harvest & Market Decision Support System

> **An Explainable AI-Based Post-Harvest Market Decision Support System for Farmers**

**Track:** 06 — AgriTech  
**Problem Statement:** PS-02 — HarvestLink  
**Event:** Innovators Conclave 2026 — Karnataka Pre-Launch

---

## 1. Introduction

Farmers often choose where to sell their produce based mainly on the visible market price.

However, the **highest selling price does not necessarily mean the highest profit**.

A farmer's actual realization depends on several factors:

- Market price
- Quantity available
- Produce quality/grade
- Distance to market
- Transportation cost
- Expected spoilage
- Shelf life
- Weather conditions
- Expected price movement
- Market risk

### Core Insight

**HarvestLink converts scattered post-harvest information into a practical selling decision.**

Instead of simply showing market prices, the system answers:

> **Where should the farmer sell, when should they sell, and why?**

---

# 2. Problem Statement

## PS-02 — HarvestLink: Post-Harvest & Market

Develop a post-harvest decision-support system that weighs:

- Price
- Distance
- Transport cost
- Quantity
- Expected spoilage

to recommend:

- **Where to sell**
- **When to sell**
- **How to sell**

The recommendation should also explain the economics behind the decision.

### Challenge

Farmers may have access to market prices, but raw information does not automatically provide the best economic decision.

### Our Goal

Convert:

**Market Data → Economic Analysis → Risk Assessment → Actionable Selling Decision**

---

# 3. Proposed Solution

## HarvestLink

HarvestLink is an explainable decision engine that compares multiple selling options and calculates the **expected net realization** for the farmer.

### Input

- Crop
- Quantity
- Quality/grade
- Current market prices
- Historical prices
- Market location
- Distance
- Transport cost
- Shelf life
- Expected spoilage
- Weather
- Market risk

### Processing

The system:

1. Collects market and contextual data.
2. Cleans and normalizes the data.
3. Estimates price trends.
4. Estimates expected spoilage.
5. Calculates transportation cost.
6. Calculates expected net realization.
7. Evaluates uncertainty and risk.
8. Compares available selling options.
9. Generates an explainable recommendation.

### Output

The farmer receives:

> **WHERE + WHEN + HOW + WHY**

---

# 4. Key Decision Metric

The system should not optimize for **market price alone**.

It should estimate:

## Expected Net Realization

A simplified formulation is:

**Expected Net Realization = Expected Revenue − Transport Cost − Expected Spoilage Loss − Other Applicable Costs**

Where:

**Expected Revenue = Expected Selling Price × Expected Sellable Quantity**

and:

**Expected Sellable Quantity = Total Quantity × (1 − Expected Spoilage Rate)**

This allows HarvestLink to compare markets economically.

---

# 5. Example Decision

### Farmer Input

- Crop: Tomato
- Quantity: 1,000 kg
- Quality: Grade A

### Market A

- Price: ₹30/kg
- Distance: 80 km
- Transport cost: ₹6,000
- Expected spoilage: 8%

### Market B

- Price: ₹28/kg
- Distance: 25 km
- Transport cost: ₹2,000
- Expected spoilage: 2%

Although Market A has the higher listed price, Market B may provide a better **expected net realization** after transportation and spoilage.

### HarvestLink Decision

> **Recommended market: Market B**

### Reasoning

- Lower transport cost
- Lower expected spoilage
- Higher proportion of produce expected to remain sellable
- Better expected net realization

The system should show the calculations so that the farmer can understand the recommendation.

---

# 6. Where + When + How

## WHERE

Compare candidate markets using:

- Net realization
- Distance
- Transport cost
- Demand/price conditions
- Expected spoilage

## WHEN

Evaluate:

- Current price
- Historical trend
- Short-term forecast
- Shelf life
- Weather
- Risk of waiting

## HOW

Depending on available options, the system can recommend:

- Immediate sale
- Delayed sale
- Nearby market
- Higher-price distant market
- Direct buyer/FPO/aggregator route, where data is available

The prototype should only recommend options supported by available data.

---

# 7. Data Sources

Potential data sources include:

### Market Data

- AGMARKNET
- e-NAM
- Historical mandi prices
- Market arrival information where available

### Weather Data

- Temperature
- Rainfall
- Humidity
- Forecast conditions

### Logistics Data

- Market distance
- Estimated transport cost
- Travel time

### Farmer Data

- Crop
- Quantity
- Grade/quality
- Harvest date
- Available storage
- Shelf life

---

# 8. Technology Stack

## Backend & Data Processing

- Python
- Pandas
- NumPy
- Scikit-learn

## Machine Learning

Potential models:

- XGBoost
- Random Forest
- Regression models
- Time-series forecasting where appropriate

The model choice should depend on the available dataset and validation results.

## Explainable AI

- SHAP
- Feature importance
- Rule-based reasoning
- Confidence/risk indicators

## Backend

- FastAPI or Flask
- REST APIs

## Frontend

- React

or, for a rapid prototype:

- HTML
- CSS
- JavaScript

## Data Storage

- CSV/SQLite for prototype
- Firebase/PostgreSQL or another database for a larger deployment

---

# 9. Decision Engine

The decision engine is the core of HarvestLink.

### Simplified pipeline

```text
Farmer Input
     ↓
Market Data + Weather + Logistics
     ↓
Data Processing
     ↓
Price Estimation
     ↓
Spoilage Estimation
     ↓
Transport Cost Calculation
     ↓
Expected Net Realization
     ↓
Risk & Uncertainty Analysis
     ↓
Market Comparison
     ↓
Selling Decision
     ↓
Explanation
```

---

# 10. Explainability

HarvestLink should never simply say:

> "Sell at Market B."

It should explain:

### Recommendation

**SELL AT MARKET B**

### Why?

- Expected net realization is higher.
- Transport cost is lower.
- Expected spoilage is lower.
- Market A's additional price does not compensate for its additional logistics and spoilage costs.

### Confidence

Show a confidence/risk indicator based on the quality and freshness of the underlying data.

Example:

> **Confidence: Medium**

> The recommendation is sensitive to price fluctuations and transport-cost estimates.

This is important because agricultural markets are uncertain.

---

# 11. Honest Handling of Uncertainty

The system should not present predictions as guaranteed outcomes.

Instead of:

> "You will earn ₹25,000."

Use:

> **Estimated net realization: ₹23,000–₹26,000**

And:

> **Risk: Medium**

Possible uncertainty sources:

- Price fluctuations
- Incomplete market data
- Variable transportation cost
- Weather changes
- Uncertain spoilage
- Quality differences
- Data freshness

This makes the system more trustworthy.

---

# 12. Methodology

## Step 1 — Data Collection

Collect:

- Historical mandi prices
- Market locations
- Weather data
- Transport/distance information
- Crop information
- Quantity
- Shelf life
- Spoilage information

## Step 2 — Data Processing

- Remove duplicates
- Handle missing values
- Normalize units
- Convert dates
- Detect outliers
- Merge datasets
- Create derived economic features

## Step 3 — Price Estimation

Estimate short-term market price or price trend using historical data.

## Step 4 — Spoilage Estimation

Estimate expected loss based on:

- Crop
- Shelf life
- Time to sale
- Weather/environmental conditions
- Available storage assumptions

## Step 5 — Net Realization

Calculate expected revenue after:

- Spoilage
- Transport
- Other applicable costs

## Step 6 — Risk Analysis

Evaluate uncertainty in:

- Price
- Spoilage
- Transport
- Weather

## Step 7 — Decision Engine

Compare candidate selling options.

## Step 8 — Explainable Recommendation

Generate:

> **Where + When + How + Why + Confidence**

---

# 13. Architectural Design

```text
                 FARMER INPUT
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
        CROP       QUANTITY     QUALITY
          │           │           │
          └───────────┼───────────┘
                      ↓
               DATA SOURCES
          ┌───────────┼───────────┐
          ↓           ↓           ↓
      AGMARKNET     e-NAM      WEATHER
          │           │           │
          └───────────┼───────────┘
                      ↓
               DATA PROCESSING
                      ↓
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
 PRICE ESTIMATION  SPOILAGE      TRANSPORT
                  ESTIMATION        COST
       │              │              │
       └──────────────┼──────────────┘
                      ↓
           EXPECTED NET REALIZATION
                      ↓
              RISK & UNCERTAINTY
                      ↓
               DECISION ENGINE
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
      WHERE          WHEN          HOW
        │             │             │
        └─────────────┼─────────────┘
                      ↓
             EXPLAINABLE OUTPUT
                      ↓
               FARMER ACTION
```

---

# 14. DFD / Flowchart

```text
START
  ↓
Enter Crop + Quantity + Quality
  ↓
Collect Market Data
  ↓
Collect Weather Data
  ↓
Collect Distance & Transport Data
  ↓
Estimate Price Trend
  ↓
Estimate Spoilage
  ↓
Calculate Expected Net Realization
  ↓
Evaluate Risk & Uncertainty
  ↓
Compare Markets
  ↓
Select Best-Supported Selling Option
  ↓
Generate Explanation
  ↓
Show:
WHERE + WHEN + HOW + WHY
  ↓
END
```

---

# 15. Literature Survey — Research Gap

Previous research in agricultural decision support commonly focuses on individual components such as:

- Market price forecasting
- Crop price prediction
- Post-harvest loss estimation
- Transportation optimization
- Supply-chain management
- Weather-based agricultural decisions

### Identified Gap

These information sources are often treated separately.

A farmer, however, needs an integrated economic decision.

### HarvestLink's approach

Combine:

**Price + Quantity + Distance + Transport + Spoilage + Shelf Life + Weather + Risk**

into one farmer-facing decision.

### Research Gap Statement

> Existing agricultural information systems can provide market prices, forecasts or logistics information, but the farmer still has to manually combine these factors. HarvestLink focuses on converting these scattered signals into an explainable post-harvest selling decision.

---

# 16. Innovation

## 1. Decision-first design

The product is designed around the decision rather than the dashboard.

## 2. Net-realization optimization

The system considers the farmer's expected economic outcome rather than simply selecting the highest market price.

## 3. Multi-factor reasoning

Price is evaluated together with:

- Transport
- Distance
- Spoilage
- Shelf life
- Quantity
- Weather
- Risk

## 4. Explainable recommendation

Every recommendation includes the main factors contributing to the decision.

## 5. Uncertainty-aware output

The system communicates confidence and uncertainty instead of presenting predictions as guaranteed.

---

# 17. Business Model

## Target Customers

### Primary

- Smallholder farmers
- Farmer Producer Organizations (FPOs)
- Agricultural cooperatives

### Secondary

- Aggregators
- Traders
- Food processors
- Logistics providers

## Possible Revenue Models

### Freemium

Basic market comparison for free.

Premium features:

- Advanced price forecasts
- Personalized recommendations
- Multiple crop/market comparisons
- Historical analytics

### B2B SaaS

FPOs and agricultural organizations pay for decision-support tools.

### Transaction / Referral Model

Where commercially appropriate, the platform could earn revenue from verified buyer, logistics or marketplace transactions.

The prototype should focus on decision support rather than attempting to build the entire marketplace.

---

# 18. Scalability

### Phase 1

One crop + selected markets.

### Phase 2

Multiple crops + multiple markets.

### Phase 3

FPO-level decision support.

### Phase 4

Integration with:

- Buyers
- Transport providers
- Warehouses
- Processors
- Marketplaces

### Long-term Vision

HarvestLink can evolve from a **post-harvest decision engine** into an agricultural commerce intelligence platform.

---

# 19. MVP for the Hackathon

The MVP should remain focused.

### Farmer enters:

- Crop
- Quantity
- Quality
- Harvest date

### System retrieves:

- Current market prices
- Historical price trend
- Weather
- Distance
- Estimated transport cost

### System calculates:

- Expected revenue
- Expected spoilage loss
- Transport cost
- Expected net realization
- Risk

### System outputs:

# SELL HERE
## SELL WHEN
## SELL HOW

### Plus:

**WHY + CONFIDENCE**

This demonstrates the complete:

**Data → Assessment → Risk → Decision**

pipeline.

---

# 20. Live Demo Scenario

### Scenario

A farmer has:

**1,000 kg of tomatoes**

Three markets are available.

The system receives current prices, distance, transport costs, expected spoilage and weather.

### Step 1

Show raw market prices.

### Step 2

Show that the highest price is not automatically the best option.

### Step 3

Run HarvestLink.

### Step 4

Show expected net realization for each market.

### Step 5

System recommends a market.

### Step 6

Show the reasoning.

### Step 7

Change a variable, such as transport cost or expected price.

### Step 8

Demonstrate that the recommendation changes.

This proves that the system is a **decision engine**, not a static dashboard.

---

# 21. Key Performance Metrics

The prototype should be evaluated using:

### Prediction Metrics

- MAE
- RMSE
- MAPE

for price forecasting where applicable.

### Decision Metrics

- Net-realization estimation error
- Recommendation consistency
- Correct market ranking
- Sensitivity to changing inputs

### Product Metrics

- Decision response time
- Explanation clarity
- Data freshness
- Percentage of recommendations with sufficient data

---

# 22. Limitations

The prototype may be affected by:

- Incomplete market data
- Rapid price fluctuations
- Inaccurate transport-cost estimates
- Uncertain spoilage rates
- Quality differences between lots
- Limited historical data
- Regional differences
- Weather uncertainty

Therefore, recommendations should be presented as **decision support**, not guaranteed financial outcomes.

---

# 23. Future Scope

- Real-time market integration
- Direct buyer discovery
- Transport booking
- Warehouse availability
- Cold-storage integration
- Quality grading using computer vision
- Voice-based farmer interface
- Regional language support
- Offline/low-connectivity mode
- Personalized recommendations using historical farm transactions
- Integration with FPOs and agricultural cooperatives

---

# 24. Final Pitch

> **Farmers don't need another screen showing today's mandi prices. They need to know what those prices mean for their actual harvest.**
>
> **HarvestLink combines market price, transport cost, distance, quantity, spoilage, shelf life and market risk to recommend where, when and how a farmer should sell — and explains the economics behind that decision.**
>
> **We turn scattered post-harvest data into one actionable decision.**

---

# 25. One-Line Value Proposition

> **HarvestLink turns post-harvest market data into an explainable selling decision that helps farmers optimize expected net realization.**

---

## Important PPT Consistency Note

The final presentation must remain completely aligned with **PS-02 HarvestLink**.

Remove unrelated plant-disease components such as:

- PlantVillage
- EfficientNetB0
- Leaf image classification
- Disease classifier
- Grad-CAM

The technical architecture, datasets, objectives and methodology should all support:

**Post-Harvest → Market → Economics → Risk → Selling Decision.**
