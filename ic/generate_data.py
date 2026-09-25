import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
import random

os.makedirs('/Users/kmvinay/Desktop/ibm_Bhumika/ic/data', exist_ok=True)

# 2. markets.csv
markets_data = [
    (1, 'Bangalore (Yeshwanthpur)', 'Bangalore Urban', 'Karnataka', 13.0285, 77.5350),
    (2, 'Hubli', 'Dharwad', 'Karnataka', 15.3647, 75.1240),
    (3, 'Mysore', 'Mysore', 'Karnataka', 12.2958, 76.6394),
    (4, 'Belgaum', 'Belagavi', 'Karnataka', 15.8497, 74.4977),
    (5, 'Davangere', 'Davangere', 'Karnataka', 14.4644, 75.9218),
    (6, 'Shimoga', 'Shimoga', 'Karnataka', 13.9299, 75.5681),
    (7, 'Tumkur', 'Tumakuru', 'Karnataka', 13.3409, 77.1005),
    (8, 'Hassan', 'Hassan', 'Karnataka', 13.0068, 76.1004),
    (9, 'Mangalore', 'Dakshina Kannada', 'Karnataka', 12.9141, 74.8560),
    (10, 'Raichur', 'Raichur', 'Karnataka', 16.2076, 77.3463),
    (11, 'Gulbarga', 'Kalaburagi', 'Karnataka', 17.3297, 76.8343),
    (12, 'Bellary', 'Ballari', 'Karnataka', 15.1394, 76.9214),
    (13, 'Bijapur', 'Vijayapura', 'Karnataka', 16.8302, 75.7100),
    (14, 'Dharwad', 'Dharwad', 'Karnataka', 15.4589, 75.0078),
    (15, 'Karwar', 'Uttara Kannada', 'Karnataka', 14.8033, 74.1352)
]
df_markets = pd.DataFrame(markets_data, columns=['market_id', 'market_name', 'district', 'state', 'latitude', 'longitude'])
df_markets.to_csv('/Users/kmvinay/Desktop/ibm_Bhumika/ic/data/markets.csv', index=False)

# 3. crop_info.csv
crop_data = [
    ('Tomato', 7, 10, 10, 15, 85, 95, 'perishable'),
    ('Onion', 30, 2, 0, 4, 65, 70, 'semi-perishable'),
    ('Potato', 60, 1, 4, 10, 85, 90, 'semi-perishable'),
    ('Banana', 10, 8, 13, 15, 85, 95, 'perishable'),
    ('Mango', 14, 5, 13, 15, 85, 90, 'perishable'),
    ('Rice', 365, 0.1, 15, 20, 60, 65, 'durable'),
    ('Wheat', 365, 0.1, 15, 20, 60, 65, 'durable'),
    ('Chilli', 180, 0.5, 0, 10, 60, 70, 'durable'), # Dried chilli
    ('Coconut', 60, 1, 15, 25, 70, 80, 'semi-perishable'),
    ('Brinjal', 7, 10, 10, 12, 90, 95, 'perishable')
]
df_crops = pd.DataFrame(crop_data, columns=['crop', 'shelf_life_days', 'spoilage_rate_per_day', 'optimal_temp_min', 'optimal_temp_max', 'optimal_humidity_min', 'optimal_humidity_max', 'category'])
df_crops.to_csv('/Users/kmvinay/Desktop/ibm_Bhumika/ic/data/crop_info.csv', index=False)

# 4. transport_rates.csv
transport_data = [
    ('Pickup', 12.0, 1.5, 1500),
    ('Mini Truck', 10.0, 3.0, 2500),
    ('Medium Truck', 6.0, 9.0, 5000),
    ('Large Truck', 4.0, 15.0, 8000)
]
df_transport = pd.DataFrame(transport_data, columns=['vehicle_type', 'cost_per_km_per_tonne', 'capacity_tonnes', 'min_charge'])
df_transport.to_csv('/Users/kmvinay/Desktop/ibm_Bhumika/ic/data/transport_rates.csv', index=False)

# 1. market_prices.csv
start_date = datetime(2024, 1, 1)
end_date = datetime(2026, 9, 25)
days_diff = (end_date - start_date).days

base_prices = {
    'Tomato': 1500, 'Onion': 1200, 'Potato': 1000, 'Banana': 1800, 'Mango': 3000, 
    'Rice': 3500, 'Wheat': 2500, 'Chilli': 8000, 'Coconut': 2000, 'Brinjal': 1200
}

prices_data = []
for _ in range(3000):
    dt = start_date + timedelta(days=random.randint(0, days_diff))
    market = random.choice([m[1] for m in markets_data])
    crop = random.choice(list(base_prices.keys()))
    base = base_prices[crop]
    
    month = dt.month
    season_factor = 1.0 + 0.3 * np.sin(2 * np.pi * month / 12.0)
    
    price = base * season_factor * random.uniform(0.7, 1.3)
    modal = round(price)
    min_p = round(modal * 0.9)
    max_p = round(modal * 1.1)
    
    arrivals = round(random.uniform(5, 100), 1)
    prices_data.append((dt.strftime('%Y-%m-%d'), market, crop, 'Local', 'FAQ', min_p, max_p, modal, arrivals))

df_prices = pd.DataFrame(prices_data, columns=['date', 'market_name', 'crop', 'variety', 'grade', 'min_price', 'max_price', 'modal_price', 'arrivals_tonnes'])
df_prices = df_prices.sort_values(by='date')
df_prices.to_csv('/Users/kmvinay/Desktop/ibm_Bhumika/ic/data/market_prices.csv', index=False)

# 5. weather_data.csv
weather_start = datetime(2026, 8, 25)
weather_end = datetime(2026, 9, 25)
weather_days = (weather_end - weather_start).days

weather_data = []
conditions = ['Clear', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Partly Cloudy']
for i in range(weather_days + 1):
    dt = weather_start + timedelta(days=i)
    for market in [m[1] for m in markets_data]:
        temp = round(random.uniform(20, 38), 1)
        humidity = round(random.uniform(40, 90), 1)
        condition = random.choice(conditions)
        if 'Rain' in condition:
            rain = round(random.uniform(2, 50), 1)
        else:
            rain = 0.0
        weather_data.append((dt.strftime('%Y-%m-%d'), market, temp, humidity, rain, condition))

df_weather = pd.DataFrame(weather_data, columns=['date', 'market_name', 'temperature', 'humidity', 'rainfall_mm', 'condition'])
df_weather.to_csv('/Users/kmvinay/Desktop/ibm_Bhumika/ic/data/weather_data.csv', index=False)

print("Data generation complete!")
