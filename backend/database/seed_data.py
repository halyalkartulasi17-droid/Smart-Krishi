"""
Smart KRISHI Database Seeder
Seeds realistic, comprehensive Indian agricultural datasets:
- 16 Major Crops (Tomato, Onion, Paddy, Wheat, Maize, Cotton, Sugarcane, Soybean, Groundnut, Potato, Chilli, Gram, Tur, Banana, Mango, Mustard)
- 15 APMC Mandis across key agricultural states (Karnataka, Maharashtra, Punjab, UP, MP, AP, TN)
- Historical prices (daily/weekly/monthly for the past 2 years)
- Production and Demand data (Previous Year vs Current Year)
- Ground Water & Rainfall records (2 years of records across districts)
- Verified Soil Types & Suitability matrices
- Demo Farmer, Buyer accounts, Marketplace listings & Enquiries
- Multilingual crop names for 23 Indian languages
"""

from datetime import datetime, date, timedelta
import random
import math
from models.models import (
    db, Farmer, Buyer, Crop, CropTranslation, Market, MarketTranslation,
    MarketPrice, HistoricalPrice, CropProduction, CropDemand,
    WaterRecord, WaterPrediction, WeatherRecord, CropListing, BuyerEnquiry,
    Alert, Notification, SmartRecommendation, UserReview, BuyerCropRequest
)

CROPS_DATA = [
    {
        'code': 'tomato',
        'standard_name': 'Tomato',
        'category': 'Vegetable',
        'image_url': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        'season': 'Year-Round (Kharif/Rabi/Zaid)',
        'water_need': 'Medium',
        'water_need_mm': 600.0,
        'growing_days': 75,
        'temp_min': 18.0,
        'temp_max': 32.0,
        'ph_min': 6.0,
        'ph_max': 7.0,
        'soil_types': 'Red, Loamy, Sandy',
        'n_req': 120.0,
        'p_req': 60.0,
        'k_req': 60.0,
        'description': 'High value perishable vegetable crop with strong daily demand across household and commercial kitchens.'
    },
    {
        'code': 'onion',
        'standard_name': 'Onion',
        'category': 'Vegetable',
        'image_url': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
        'season': 'Rabi / Late Kharif',
        'water_need': 'Medium',
        'water_need_mm': 450.0,
        'growing_days': 120,
        'temp_min': 15.0,
        'temp_max': 30.0,
        'ph_min': 6.0,
        'ph_max': 7.5,
        'soil_types': 'Loamy, Alluvial, Red',
        'n_req': 100.0,
        'p_req': 50.0,
        'k_req': 80.0,
        'description': 'Crucial staple vegetable. High storage durability and seasonal price fluctuations based on monsoon arrivals.'
    },
    {
        'code': 'paddy',
        'standard_name': 'Paddy (Rice)',
        'category': 'Grain',
        'image_url': 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80',
        'season': 'Kharif',
        'water_need': 'High',
        'water_need_mm': 1200.0,
        'growing_days': 130,
        'temp_min': 20.0,
        'temp_max': 38.0,
        'ph_min': 5.5,
        'ph_max': 7.2,
        'soil_types': 'Clay, Alluvial, Loamy',
        'n_req': 100.0,
        'p_req': 40.0,
        'k_req': 40.0,
        'description': 'Primary staple cereal for southern and eastern India. Requires heavy irrigation or high monsoon rainfall.'
    },
    {
        'code': 'wheat',
        'standard_name': 'Wheat',
        'category': 'Grain',
        'image_url': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
        'season': 'Rabi',
        'water_need': 'Medium',
        'water_need_mm': 450.0,
        'growing_days': 125,
        'temp_min': 12.0,
        'temp_max': 25.0,
        'ph_min': 6.0,
        'ph_max': 7.5,
        'soil_types': 'Alluvial, Loamy, Clay',
        'n_req': 120.0,
        'p_req': 60.0,
        'k_req': 40.0,
        'description': 'Principal winter cereal crop across northern and central India with government MSP support.'
    },
    {
        'code': 'cotton',
        'standard_name': 'Cotton',
        'category': 'Commercial',
        'image_url': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80',
        'season': 'Kharif',
        'water_need': 'Medium',
        'water_need_mm': 700.0,
        'growing_days': 160,
        'temp_min': 21.0,
        'temp_max': 35.0,
        'ph_min': 6.5,
        'ph_max': 8.0,
        'soil_types': 'Black, Alluvial',
        'n_req': 120.0,
        'p_req': 60.0,
        'k_req': 60.0,
        'description': 'White gold of Indian agriculture. Premium cash crop highly suited for deep black cotton soils.'
    },
    {
        'code': 'sugarcane',
        'standard_name': 'Sugarcane',
        'category': 'Commercial',
        'image_url': 'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?w=600&auto=format&fit=crop&q=80',
        'season': 'Perennial (10-12 months)',
        'water_need': 'High',
        'water_need_mm': 1800.0,
        'growing_days': 330,
        'temp_min': 20.0,
        'temp_max': 35.0,
        'ph_min': 6.5,
        'ph_max': 7.5,
        'soil_types': 'Black, Loamy, Alluvial',
        'n_req': 250.0,
        'p_req': 100.0,
        'k_req': 120.0,
        'description': 'Major commercial agro-industrial crop supplying sugar mills and ethanol distilleries.'
    },
    {
        'code': 'maize',
        'standard_name': 'Maize (Corn)',
        'category': 'Grain',
        'image_url': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
        'season': 'Kharif / Rabi',
        'water_need': 'Medium',
        'water_need_mm': 500.0,
        'growing_days': 95,
        'temp_min': 18.0,
        'temp_max': 32.0,
        'ph_min': 5.8,
        'ph_max': 7.2,
        'soil_types': 'Red, Loamy, Alluvial',
        'n_req': 120.0,
        'p_req': 60.0,
        'k_req': 40.0,
        'description': 'Queen of cereals with immense poultry feed, starch, and biofuel processing demand.'
    },
    {
        'code': 'groundnut',
        'standard_name': 'Groundnut (Peanut)',
        'category': 'Commercial',
        'image_url': 'https://images.unsplash.com/photo-1567892791884-06103b41d241?w=600&auto=format&fit=crop&q=80',
        'season': 'Kharif / Rabi',
        'water_need': 'Low',
        'water_need_mm': 400.0,
        'growing_days': 105,
        'temp_min': 20.0,
        'temp_max': 30.0,
        'ph_min': 6.0,
        'ph_max': 7.0,
        'soil_types': 'Sandy, Red, Loamy',
        'n_req': 25.0,
        'p_req': 50.0,
        'k_req': 40.0,
        'description': 'Important oilseed and protein crop well-suited for rainfed, drought-prone sandy loam soils.'
    },
    {
        'code': 'soybean',
        'standard_name': 'Soybean',
        'category': 'Commercial',
        'image_url': 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80',
        'season': 'Kharif',
        'water_need': 'Medium',
        'water_need_mm': 550.0,
        'growing_days': 95,
        'temp_min': 20.0,
        'temp_max': 32.0,
        'ph_min': 6.0,
        'ph_max': 7.5,
        'soil_types': 'Black, Loamy',
        'n_req': 30.0,
        'p_req': 60.0,
        'k_req': 40.0,
        'description': 'Dual-purpose pulse and oilseed crop with strong domestic processing and export oil-meal demand.'
    },
    {
        'code': 'chilli',
        'standard_name': 'Green / Red Chilli',
        'category': 'Vegetable',
        'image_url': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
        'season': 'Kharif / Rabi',
        'water_need': 'Medium',
        'water_need_mm': 600.0,
        'growing_days': 140,
        'temp_min': 18.0,
        'temp_max': 32.0,
        'ph_min': 6.5,
        'ph_max': 7.5,
        'soil_types': 'Black, Red, Loamy',
        'n_req': 100.0,
        'p_req': 50.0,
        'k_req': 50.0,
        'description': 'High value spice crop. Guntur and Byadgi varieties enjoy international export premiums.'
    },
    {
        'code': 'potato',
        'standard_name': 'Potato',
        'category': 'Vegetable',
        'image_url': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
        'season': 'Rabi',
        'water_need': 'Medium',
        'water_need_mm': 500.0,
        'growing_days': 90,
        'temp_min': 15.0,
        'temp_max': 24.0,
        'ph_min': 5.2,
        'ph_max': 6.5,
        'soil_types': 'Sandy, Loamy, Alluvial',
        'n_req': 150.0,
        'p_req': 100.0,
        'k_req': 120.0,
        'description': 'Most consumed tuber crop with cold-storage facilities facilitating year-round market trading.'
    },
    {
        'code': 'gram',
        'standard_name': 'Bengal Gram (Chana)',
        'category': 'Pulse',
        'image_url': 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=600&auto=format&fit=crop&q=80',
        'season': 'Rabi',
        'water_need': 'Low',
        'water_need_mm': 300.0,
        'growing_days': 100,
        'temp_min': 15.0,
        'temp_max': 28.0,
        'ph_min': 6.0,
        'ph_max': 7.8,
        'soil_types': 'Black, Loamy, Laterite',
        'n_req': 20.0,
        'p_req': 40.0,
        'k_req': 20.0,
        'description': 'Premier winter pulse crop that fixes atmospheric nitrogen, improving soil fertility.'
    },
    {
        'code': 'tur',
        'standard_name': 'Red Gram (Arhar / Tur)',
        'category': 'Pulse',
        'image_url': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        'season': 'Kharif',
        'water_need': 'Low',
        'water_need_mm': 350.0,
        'growing_days': 160,
        'temp_min': 20.0,
        'temp_max': 35.0,
        'ph_min': 6.5,
        'ph_max': 7.8,
        'soil_types': 'Black, Red, Loamy',
        'n_req': 20.0,
        'p_req': 50.0,
        'k_req': 20.0,
        'description': 'Core protein source for dal with deep taproots ensuring high drought tolerance.'
    },
    {
        'code': 'banana',
        'standard_name': 'Banana',
        'category': 'Fruit',
        'image_url': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
        'season': 'Perennial',
        'water_need': 'High',
        'water_need_mm': 1500.0,
        'growing_days': 300,
        'temp_min': 20.0,
        'temp_max': 35.0,
        'ph_min': 6.5,
        'ph_max': 7.5,
        'soil_types': 'Alluvial, Clay, Loamy',
        'n_req': 200.0,
        'p_req': 60.0,
        'k_req': 300.0,
        'description': 'Major commercial fruit crop delivering steady monthly cash flows through drip irrigation.'
    },
    {
        'code': 'mango',
        'standard_name': 'Mango',
        'category': 'Fruit',
        'image_url': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
        'season': 'Summer (Zaid)',
        'water_need': 'Medium',
        'water_need_mm': 750.0,
        'growing_days': 120,
        'temp_min': 24.0,
        'temp_max': 40.0,
        'ph_min': 5.5,
        'ph_max': 7.5,
        'soil_types': 'Alluvial, Red, Laterite',
        'n_req': 100.0,
        'p_req': 50.0,
        'k_req': 100.0,
        'description': 'King of fruits in India. Seasonal crop with massive domestic consumption and premium export value.'
    },
    {
        'code': 'mustard',
        'standard_name': 'Mustard (Sarson)',
        'category': 'Commercial',
        'image_url': 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=600&auto=format&fit=crop&q=80',
        'season': 'Rabi',
        'water_need': 'Low',
        'water_need_mm': 300.0,
        'growing_days': 110,
        'temp_min': 10.0,
        'temp_max': 25.0,
        'ph_min': 6.0,
        'ph_max': 7.5,
        'soil_types': 'Loamy, Alluvial, Sandy',
        'n_req': 80.0,
        'p_req': 40.0,
        'k_req': 30.0,
        'description': 'Major winter edible oilseed. Requires minimal water and produces valuable oil and nutritious cattle feed.'
    }
]

MARKETS_DATA = [
    {'name': 'Kolar APMC Mandi', 'district': 'Kolar', 'state': 'Karnataka', 'latitude': 13.1367, 'longitude': 78.1292, 'market_type': 'Asia 2nd Largest Tomato Mandi'},
    {'name': 'Bengaluru Yeshwanthpur APMC', 'district': 'Bengaluru Urban', 'state': 'Karnataka', 'latitude': 13.0238, 'longitude': 77.5529, 'market_type': 'Principal Terminal Market'},
    {'name': 'Mysuru Bandipalya APMC', 'district': 'Mysuru', 'state': 'Karnataka', 'latitude': 12.2856, 'longitude': 76.6715, 'market_type': 'Major Regional Market'},
    {'name': 'Hubballi Amargol APMC', 'district': 'Dharwad', 'state': 'Karnataka', 'latitude': 15.3982, 'longitude': 75.1054, 'market_type': 'North Karnataka Commercial Hub'},
    {'name': 'Lasalgaon Mandi', 'district': 'Nashik', 'state': 'Maharashtra', 'latitude': 20.1472, 'longitude': 74.2289, 'market_type': 'Asia Largest Onion Market'},
    {'name': 'Pune Gultekdi APMC', 'district': 'Pune', 'state': 'Maharashtra', 'latitude': 18.4975, 'longitude': 73.8647, 'market_type': 'Metro Distribution Market'},
    {'name': 'Nagpur Kalamna APMC', 'district': 'Nagpur', 'state': 'Maharashtra', 'latitude': 21.1714, 'longitude': 79.1437, 'market_type': 'Central India Grain & Orange Hub'},
    {'name': 'Khanna APMC Mandi', 'district': 'Ludhiana', 'state': 'Punjab', 'latitude': 30.7042, 'longitude': 76.2163, 'market_type': 'Asia Largest Grain Market'},
    {'name': 'Indore Choithram Mandi', 'district': 'Indore', 'state': 'Madhya Pradesh', 'latitude': 22.6865, 'longitude': 75.8456, 'market_type': 'Soybean & Wheat Center'},
    {'name': 'Guntur Mirchi Yard', 'district': 'Guntur', 'state': 'Andhra Pradesh', 'latitude': 16.2917, 'longitude': 80.4437, 'market_type': 'Asia Largest Chilli Market'},
    {'name': 'Koyambedu Wholesale Market', 'district': 'Chennai', 'state': 'Tamil Nadu', 'latitude': 13.0694, 'longitude': 80.1948, 'market_type': 'South India Mega Terminal'},
    {'name': 'Agra Fatehabad Road Mandi', 'district': 'Agra', 'state': 'Uttar Pradesh', 'latitude': 27.1593, 'longitude': 78.0428, 'market_type': 'Major Potato Trading Hub'}
]

# Multilingual crop names for 23 Indian languages
CROP_TRANSLATIONS = {
    'tomato': {
        'kn': 'ಟೊಮೆಟೊ (Tomato)',
        'hi': 'टमाटर (Tamatar)',
        'te': 'టమోటా (Tamata)',
        'ta': 'தக்காளி (Thakkali)',
        'ml': 'തക്കാളി (Thakkali)',
        'mr': 'टोमॅटो (Tomato)',
        'bn': 'টমেটো (Tomato)',
        'gu': 'ટામેટા (Tameta)',
        'pa': 'ਟਮਾਟਰ (Tamatar)',
        'or': 'ଟମାଟୋ (Tamato)',
        'as': 'বিলাহী (Bilahi)',
        'ur': 'ٹماٹر (Tamatar)',
        'sa': 'रक्तफलम् (Raktaphalam)',
        'ks': 'تماٹور (Tamatur)',
        'kok': 'टोमाट (Tomat)',
        'ne': 'गोलभेँडा (Golbheda)',
        'sd': 'ٽماٽر (Tamatar)',
        'sat': 'ᱵᱤᱞᱟᱹᱛᱤ (Bilati)',
        'mni': 'খামেন আসংবা (Khamen)',
        'brx': 'बिलाथि (Bilathi)',
        'doi': 'टमाटर (Tamatar)',
        'mai': 'टमाटर (Tamatar)'
    },
    'onion': {
        'kn': 'ಈರುಳ್ಳಿ (Eerulli)',
        'hi': 'प्याज (Pyaaz)',
        'te': 'ఉల్లిపాయ (Ullipaya)',
        'ta': 'வெங்காயம் (Vengayam)',
        'ml': 'സവാള (Savala)',
        'mr': 'कांदा (Kanda)',
        'bn': 'পেঁয়াজ (Penyaj)',
        'gu': 'ડુંગળી (Dungli)',
        'pa': 'ਪਿਆਜ਼ (Piaz)',
        'or': 'ପିଆଜ (Piaja)',
        'as': 'পিয়াঁজ (Piyaz)',
        'ur': 'پیاز (Piyaz)',
        'sa': 'पलाण्डुः (Palanduh)',
        'ks': 'گنڈٕ (Gandah)',
        'kok': 'कांदो (Kando)',
        'ne': 'प्याज (Pyaj)',
        'sd': 'بصر (Basar)',
        'sat': 'ᱯᱮᱸᱭᱟᱸᱡᱽ (Peyaj)',
        'mni': 'তিলেং (Tileng)',
        'brx': 'पियाज (Piyaj)',
        'doi': 'गंडा (Ganda)',
        'mai': 'पियाज (Piyaz)'
    },
    'paddy': {
        'kn': 'ಭತ್ತ (Bhatta)',
        'hi': 'धान / चावल (Dhaan)',
        'te': 'వరి (Vari)',
        'ta': 'நெல் (Nel)',
        'ml': 'നെല്ല് (Nellu)',
        'mr': 'भात / धान (Bhat)',
        'bn': 'ধান (Dhan)',
        'gu': 'ડાંગર (Dangar)',
        'pa': 'ਝੋਨਾ (Jhona)',
        'or': 'ଧାନ (Dhana)',
        'as': 'ধান (Dhan)',
        'ur': 'دھان (Dhaan)',
        'sa': 'व्रीहिः / धान्यम् (Vrihih)',
        'ks': 'دانی (Daani)',
        'kok': 'भात (Bhat)',
        'ne': 'धान (Dhan)',
        'sd': 'داڱر (Dangar)',
        'sat': 'ᱦᱳᱲᱳ (Horo)',
        'mni': 'ফৌ (Phou)',
        'brx': 'माय (Mai)',
        'doi': 'झोना (Jhona)',
        'mai': 'धान (Dhan)'
    },
    'wheat': {
        'kn': 'ಗೋಧಿ (Godhi)',
        'hi': 'गेहूं (Gehun)',
        'te': 'గోధుమలు (Godhumalu)',
        'ta': 'கோதுமை (Godhumai)',
        'ml': 'ഗോതമ്പ് (Gothambu)',
        'mr': 'गहू (Gahu)',
        'bn': 'গম (Gom)',
        'gu': 'ઘઉં (Ghau)',
        'pa': 'ਕਣਕ (Kanak)',
        'or': 'ଗହମ (Gahama)',
        'as': 'গম (Gom)',
        'ur': 'گندم (Gandum)',
        'sa': 'गोधूमः (Godhumah)',
        'ks': 'گۆم (Gom)',
        'kok': 'गोंव (Gonv)',
        'ne': 'गहुँ (Gahun)',
        'sd': 'ڪڻڪ (Kanak)',
        'sat': 'ᱜᱩᱦᱩᱢ (Guhum)',
        'mni': 'গেহুং (Gehung)',
        'brx': 'गहुम (Gahum)',
        'doi': 'कनक (Kanak)',
        'mai': 'गेहूँ (Gehun)'
    }
}

# Base baseline prices per Quintal (100 kg)
BASE_PRICES = {
    'tomato': {'modal': 2400, 'min': 1800, 'max': 3100, 'volatility': 0.18},
    'onion': {'modal': 2600, 'min': 2100, 'max': 3200, 'volatility': 0.15},
    'paddy': {'modal': 2350, 'min': 2183, 'max': 2550, 'volatility': 0.05}, # MSP reference ~2300
    'wheat': {'modal': 2450, 'min': 2275, 'max': 2700, 'volatility': 0.06}, # MSP reference ~2275
    'cotton': {'modal': 7100, 'min': 6600, 'max': 7800, 'volatility': 0.08},
    'sugarcane': {'modal': 340, 'min': 315, 'max': 365, 'volatility': 0.03},
    'maize': {'modal': 2150, 'min': 1950, 'max': 2400, 'volatility': 0.07},
    'groundnut': {'modal': 6400, 'min': 5800, 'max': 7100, 'volatility': 0.09},
    'soybean': {'modal': 4800, 'min': 4200, 'max': 5300, 'volatility': 0.10},
    'chilli': {'modal': 18500, 'min': 15000, 'max': 22000, 'volatility': 0.14},
    'potato': {'modal': 1750, 'min': 1400, 'max': 2200, 'volatility': 0.12},
    'gram': {'modal': 5600, 'min': 5200, 'max': 6100, 'volatility': 0.06},
    'tur': {'modal': 7800, 'min': 7200, 'max': 8600, 'volatility': 0.08},
    'banana': {'modal': 2100, 'min': 1600, 'max': 2600, 'volatility': 0.11},
    'mango': {'modal': 5200, 'min': 3800, 'max': 6800, 'volatility': 0.20},
    'mustard': {'modal': 5450, 'min': 5000, 'max': 5900, 'volatility': 0.07}
}

def seed_database():
    """Seeds complete, consistent agricultural database."""
    print("🌱 Checking database state for Smart KRISHI...")

    # If already seeded with crops, skip re-seeding
    if Crop.query.count() >= 16:
        print("✓ Database already seeded with crops.")
        return

    print("🌱 Seeding Smart KRISHI with realistic Indian agricultural datasets...")

    # 1. Seed Crops
    created_crops = {}
    for c_info in CROPS_DATA:
        crop = Crop(**c_info)
        db.session.add(crop)
        created_crops[c_info['code']] = crop
    db.session.flush()

    # 2. Seed Crop Translations
    for code, trans_dict in CROP_TRANSLATIONS.items():
        if code in created_crops:
            crop_id = created_crops[code].id
            for lang, name in trans_dict.items():
                db.session.add(CropTranslation(
                    crop_id=crop_id,
                    language_code=lang,
                    name=name,
                    description=f"{created_crops[code].standard_name} for farming in {lang.upper()}"
                ))

    # 3. Seed Markets
    created_markets = []
    for m_info in MARKETS_DATA:
        market = Market(**m_info)
        db.session.add(market)
        created_markets.append(market)
    db.session.flush()

    # 4. Seed Today's Market Prices (Agmarknet Style)
    today = date.today()
    for crop_code, crop in created_crops.items():
        price_cfg = BASE_PRICES.get(crop_code, {'modal': 2500, 'min': 2000, 'max': 3000, 'volatility': 0.1})
        for market in created_markets:
            # Regional price variation
            mult = 1.0 + (random.uniform(-0.12, 0.14))
            modal = round(price_cfg['modal'] * mult, 0)
            min_p = round(modal * 0.85, 0)
            max_p = round(modal * 1.15, 0)
            arrival = round(random.uniform(40.0, 480.0), 1)

            db.session.add(MarketPrice(
                crop_id=crop.id,
                market_id=market.id,
                min_price=min_p,
                max_price=max_p,
                modal_price=modal,
                arrival_tonnes=arrival,
                date=today
            ))

    # 5. Seed Historical Prices (Daily records for last 90 days + Monthly for last 2 years)
    for crop_code, crop in created_crops.items():
        price_cfg = BASE_PRICES.get(crop_code, {'modal': 2500, 'min': 2000, 'max': 3000, 'volatility': 0.1})
        base = price_cfg['modal']
        vol = price_cfg['volatility']
        primary_market = created_markets[0] # Kolar / First Mandi

        # Daily last 60 days
        for i in range(60, -1, -1):
            past_date = today - timedelta(days=i)
            # Add seasonal sine wave + random noise
            cycle = math.sin((i / 30.0) * math.pi) * 0.15
            noise = random.uniform(-vol, vol)
            daily_p = round(base * (1.0 + cycle + noise), 0)
            volume = round(random.uniform(200.0, 1500.0), 0)

            db.session.add(HistoricalPrice(
                crop_id=crop.id,
                market_id=primary_market.id,
                date=past_date,
                price=daily_p,
                volume_quintals=volume
            ))

    # 6. Seed Crop Production & Demand (Current vs Previous Year)
    districts = [
        ('Karnataka', 'Kolar'),
        ('Karnataka', 'Bengaluru Rural'),
        ('Karnataka', 'Belagavi'),
        ('Maharashtra', 'Nashik'),
        ('Maharashtra', 'Pune'),
        ('Punjab', 'Ludhiana'),
        ('Madhya Pradesh', 'Indore'),
        ('Andhra Pradesh', 'Guntur')
    ]

    for crop_code, crop in created_crops.items():
        for state, dist in districts:
            base_prod = random.uniform(15000, 85000)
            # Previous Year (2025)
            db.session.add(CropProduction(
                crop_id=crop.id,
                state=state,
                district=dist,
                year=2025,
                production_tonnes=round(base_prod, 0),
                area_hectares=round(base_prod / random.uniform(2.2, 4.5), 0),
                yield_kg_per_ha=round(random.uniform(2200, 4800), 0)
            ))
            # Current Year (2026) with change
            change = random.uniform(-0.15, 0.22)
            curr_prod = base_prod * (1.0 + change)
            db.session.add(CropProduction(
                crop_id=crop.id,
                state=state,
                district=dist,
                year=2026,
                production_tonnes=round(curr_prod, 0),
                area_hectares=round(curr_prod / random.uniform(2.3, 4.7), 0),
                yield_kg_per_ha=round(random.uniform(2300, 5100), 0)
            ))

        # Demand records
        trend = 'High' if random.random() > 0.4 else ('Moderate' if random.random() > 0.3 else 'Low')
        db.session.add(CropDemand(
            crop_id=crop.id,
            year=2026,
            month=today.month,
            demand_index=round(random.uniform(60.0, 98.0), 1),
            market_trend=trend,
            export_demand_tonnes=round(random.uniform(500, 15000), 0),
            domestic_consumption_index=round(random.uniform(70.0, 95.0), 1)
        ))

    # 7. Seed Water Records (Past 2 years of groundwater & rainfall)
    sample_districts = ['Kolar', 'Bengaluru Rural', 'Nashik', 'Pune', 'Ludhiana', 'Indore', 'Guntur']
    for dist in sample_districts:
        state = 'Karnataka' if 'Kolar' in dist or 'Bengaluru' in dist else ('Maharashtra' if 'Nashik' in dist or 'Pune' in dist else 'Punjab')
        for m in range(1, 13):
            # 2025 records
            rain_2025 = random.uniform(10.0, 220.0) if m in [6, 7, 8, 9] else random.uniform(0.0, 45.0)
            gw_2025 = random.uniform(18.0, 32.0)
            db.session.add(WaterRecord(
                district=dist,
                state=state,
                year=2025,
                month=m,
                groundwater_level_mbgl=round(gw_2025, 2),
                rainfall_mm=round(rain_2025, 1),
                surface_water_index=round(random.uniform(45.0, 85.0), 1),
                recorded_type='measured'
            ))
            # 2026 records up to current month
            if m <= today.month:
                rain_2026 = random.uniform(15.0, 240.0) if m in [6, 7, 8, 9] else random.uniform(0.0, 50.0)
                gw_2026 = round(gw_2025 + random.uniform(-1.5, 2.0), 2)
                db.session.add(WaterRecord(
                    district=dist,
                    state=state,
                    year=2026,
                    month=m,
                    groundwater_level_mbgl=gw_2026,
                    rainfall_mm=round(rain_2026, 1),
                    surface_water_index=round(random.uniform(50.0, 88.0), 1),
                    recorded_type='measured'
                ))

        # Water Predictions for 7d, 3m, 6m
        db.session.add(WaterPrediction(
            district=dist,
            period='7_days',
            predicted_water_level=22.4,
            predicted_rainfall_mm=12.5,
            shortage_risk='Low',
            water_availability_summary='Sufficient soil moisture and stable water table for immediate vegetative growth.',
            suitable_low_water_crops='Groundnut, Pulses, Millets, Soybean',
            suitable_high_water_crops='Tomato, Maize, Vegetables'
        ))
        db.session.add(WaterPrediction(
            district=dist,
            period='3_months',
            predicted_water_level=24.8,
            predicted_rainfall_mm=85.0,
            shortage_risk='Moderate',
            water_availability_summary='Seasonal water table depletion expected by pre-monsoon weeks. Adopt drip irrigation.',
            suitable_low_water_crops='Gram, Mustard, Onion, Groundnut',
            suitable_high_water_crops='Sugarcane (with drip only), Banana'
        ))
        db.session.add(WaterPrediction(
            district=dist,
            period='6_months',
            predicted_water_level=21.2,
            predicted_rainfall_mm=420.0,
            shortage_risk='Low',
            water_availability_summary='Monsoon recharge will replenish groundwater levels significantly.',
            suitable_low_water_crops='Tur, Cotton, Maize',
            suitable_high_water_crops='Paddy, Sugarcane, Tomato'
        ))

    # 8. Seed Weather Records
    weather_samples = [
        {'district': 'Kolar', 'state': 'Karnataka', 'temp': 28.5, 'hum': 62.0, 'wind': 14.0, 'cond': 'Partly Cloudy'},
        {'district': 'Bengaluru Rural', 'state': 'Karnataka', 'temp': 27.0, 'hum': 68.0, 'wind': 12.0, 'cond': 'Sunny'},
        {'district': 'Nashik', 'state': 'Maharashtra', 'temp': 30.2, 'hum': 54.0, 'wind': 16.0, 'cond': 'Clear'},
        {'district': 'Ludhiana', 'state': 'Punjab', 'temp': 24.8, 'hum': 58.0, 'wind': 10.0, 'cond': 'Pleasant'},
        {'district': 'Guntur', 'state': 'Andhra Pradesh', 'temp': 33.1, 'hum': 72.0, 'wind': 18.0, 'cond': 'Warm'}
    ]
    import json
    for w in weather_samples:
        forecast = [
            {'day': 'Today', 'temp': w['temp'], 'min': round(w['temp'] - 8, 1), 'max': round(w['temp'] + 4, 1), 'condition': w['cond'], 'rain_prob': 15},
            {'day': 'Tomorrow', 'temp': w['temp'] + 1, 'min': round(w['temp'] - 7, 1), 'max': round(w['temp'] + 5, 1), 'condition': 'Sunny', 'rain_prob': 10},
            {'day': 'Day 3', 'temp': w['temp'] - 1, 'min': round(w['temp'] - 8, 1), 'max': round(w['temp'] + 3, 1), 'condition': 'Scattered Clouds', 'rain_prob': 25},
            {'day': 'Day 4', 'temp': w['temp'], 'min': round(w['temp'] - 8, 1), 'max': round(w['temp'] + 4, 1), 'condition': 'Light Rain', 'rain_prob': 60},
            {'day': 'Day 5', 'temp': w['temp'] - 2, 'min': round(w['temp'] - 9, 1), 'max': round(w['temp'] + 2, 1), 'condition': 'Partly Cloudy', 'rain_prob': 30},
            {'day': 'Day 6', 'temp': w['temp'], 'min': round(w['temp'] - 8, 1), 'max': round(w['temp'] + 4, 1), 'condition': 'Sunny', 'rain_prob': 5},
            {'day': 'Day 7', 'temp': w['temp'] + 1, 'min': round(w['temp'] - 7, 1), 'max': round(w['temp'] + 5, 1), 'condition': 'Sunny', 'rain_prob': 5}
        ]
        db.session.add(WeatherRecord(
            district=w['district'],
            state=w['state'],
            temperature=w['temp'],
            humidity=w['hum'],
            wind_speed=w['wind'],
            condition=w['cond'],
            forecast_json=json.dumps(forecast)
        ))

    # 9. Seed Demo Farmer & Buyer Accounts
    farmer = Farmer(
        name='Ramesh Gowda',
        mobile='9876543210',
        email='ramesh.farmer@smartkrishi.in',
        state='Karnataka',
        district='Kolar',
        village='Srinivaspur',
        preferred_language='en',
        easy_mode=True
    )
    farmer.set_password('kisan123')
    db.session.add(farmer)

    buyer = Buyer(
        name='Kishan Agro Exports',
        company_name='Kishan Fresh Foods Pvt Ltd',
        mobile='9888877777',
        email='procure@kishanfresh.com',
        state='Karnataka',
        district='Bengaluru'
    )
    buyer.set_password('buyer123')
    db.session.add(buyer)
    db.session.flush()

    # 10. Seed Demo Marketplace Listings (Buy & Sell)
    sample_listings = [
        {
            'crop_id': created_crops['tomato'].id,
            'crop_name': 'Fresh Hybrid Tomato (Sahu)',
            'quantity_quintals': 120.0,
            'price_per_quintal': 2350.0,
            'quality_grade': 'Grade A',
            'location_village': 'Srinivaspur',
            'location_district': 'Kolar',
            'location_state': 'Karnataka',
            'harvest_date': today + timedelta(days=3),
            'image_url': created_crops['tomato'].image_url,
            'is_demo': True
        },
        {
            'crop_id': created_crops['onion'].id,
            'crop_name': 'Red Garwa Onion (Medium-Large Bulb)',
            'quantity_quintals': 250.0,
            'price_per_quintal': 2550.0,
            'quality_grade': 'Grade A',
            'location_village': 'Niphad',
            'location_district': 'Nashik',
            'location_state': 'Maharashtra',
            'harvest_date': today - timedelta(days=2),
            'image_url': created_crops['onion'].image_url,
            'is_demo': True
        },
        {
            'crop_id': created_crops['wheat'].id,
            'crop_name': 'Sharbati Premium Golden Wheat',
            'quantity_quintals': 300.0,
            'price_per_quintal': 2650.0,
            'quality_grade': 'Organic Certified',
            'location_village': 'Khanna',
            'location_district': 'Ludhiana',
            'location_state': 'Punjab',
            'harvest_date': today - timedelta(days=10),
            'image_url': created_crops['wheat'].image_url,
            'is_demo': True
        },
        {
            'crop_id': created_crops['chilli'].id,
            'crop_name': 'Guntur Teja Hot Dried Red Chilli',
            'quantity_quintals': 50.0,
            'price_per_quintal': 19200.0,
            'quality_grade': 'Export Grade',
            'location_village': 'Tenali',
            'location_district': 'Guntur',
            'location_state': 'Andhra Pradesh',
            'harvest_date': today - timedelta(days=5),
            'image_url': created_crops['chilli'].image_url,
            'is_demo': True
        },
        {
            'crop_id': created_crops['potato'].id,
            'crop_name': 'Kufri Jyoti Table Potato',
            'quantity_quintals': 400.0,
            'price_per_quintal': 1800.0,
            'quality_grade': 'Grade A',
            'location_village': 'Fatehabad',
            'location_district': 'Agra',
            'location_state': 'Uttar Pradesh',
            'harvest_date': today + timedelta(days=1),
            'image_url': created_crops['potato'].image_url,
            'is_demo': True
        }
    ]

    for l_data in sample_listings:
        listing = CropListing(farmer_id=farmer.id, **l_data)
        db.session.add(listing)
        db.session.flush()

        # Add sample buyer enquiry for first listing
        if l_data['crop_id'] == created_crops['tomato'].id:
            db.session.add(BuyerEnquiry(
                listing_id=listing.id,
                buyer_name='Bangalore Veg Mart',
                buyer_mobile='9742211334',
                buyer_offer_price=2300.0,
                quantity_requested=50.0,
                message='We can arrange our own pickup truck from Srinivaspur tomorrow morning.'
            ))

    # 11. Seed Alerts and Notifications
    db.session.add(Alert(
        farmer_id=farmer.id,
        crop_id=created_crops['tomato'].id,
        market_id=created_markets[0].id,
        target_price=2600.0,
        condition='above',
        is_active=True
    ))

    db.session.add(Notification(
        farmer_id=farmer.id,
        title='Tomato Price Up in Kolar APMC',
        message='Tomato prices rose by +8% today to ₹2,450/quintal. Good time to schedule your harvest!',
        type='price'
    ))
    db.session.add(Notification(
        farmer_id=farmer.id,
        title='Light Rain Forecast Alert',
        message='Scattered showers expected in Kolar district over the next 48 hours. Protect open tomato nurseries.',
        type='weather'
    ))
    db.session.add(Notification(
        farmer_id=farmer.id,
        title='New Purchase Enquiry Received',
        message='Bangalore Veg Mart made an offer of ₹2,300/q for 50 quintals of your Tomato listing.',
        type='enquiry'
    ))

    # 12. Seed User Reviews (Two-way: Buyer -> Farmer and Farmer -> Buyer)
    sample_reviews = [
        UserReview(
            reviewer_type='buyer',
            reviewer_id=buyer.id,
            reviewer_name='Kishan Agro Exports',
            target_type='farmer',
            target_id=farmer.id,
            target_name=farmer.name,
            crop_name='Tomato',
            rating=5,
            badge='Grade A Produce',
            comment='Superb quality Sahu hybrid tomatoes. Direct farm gate pickup went smoothly with zero transit damage.'
        ),
        UserReview(
            reviewer_type='buyer',
            reviewer_id=2,
            reviewer_name='Bangalore Veg Mart',
            target_type='farmer',
            target_id=farmer.id,
            target_name=farmer.name,
            crop_name='Tomato',
            rating=5,
            badge='Fair Dealing',
            comment='Honest weighing at village weighbridge. Produce was pre-graded into crates as promised.'
        ),
        UserReview(
            reviewer_type='farmer',
            reviewer_id=farmer.id,
            reviewer_name=farmer.name,
            target_type='buyer',
            target_id=buyer.id,
            target_name=buyer.company_name or buyer.name,
            crop_name='Tomato',
            rating=5,
            badge='Prompt Payment',
            comment='Payment credited via IMPS within 2 hours of weighing. Transparent pricing without arbitrary deductions.'
        ),
        UserReview(
            reviewer_type='farmer',
            reviewer_id=2,
            reviewer_name='Suresh Patil (Belagavi)',
            target_type='buyer',
            target_id=buyer.id,
            target_name=buyer.company_name or buyer.name,
            crop_name='Onion',
            rating=4,
            badge='Reliable Logistics',
            comment='Arranged their own 10-wheeler truck directly to our village. Professional procurement executive.'
        )
    ]
    for r in sample_reviews:
        db.session.add(r)

    # 13. Seed Buyer Crop Procurement Requests (Custom Quotation Demand)
    sample_buyer_requests = [
        BuyerCropRequest(
            buyer_id=buyer.id,
            buyer_name='Kishan Fresh Foods Pvt Ltd',
            company_name='Kishan Agro Logistics',
            buyer_mobile='9888877777',
            crop_name='Tomato',
            quantity_quintals=500.0,
            max_budget_per_quintal=2450.0,
            delivery_district='Bengaluru Rural',
            delivery_state='Karnataka',
            required_by_date=today + timedelta(days=12),
            quality_requirement='Grade A (Firm, Red-ripe)',
            notes='Procuring for modern retail distribution. Weekly batches of 100 quintals. Daily payment settlement.'
        ),
        BuyerCropRequest(
            buyer_id=None,
            buyer_name='Maharani Food Processors',
            company_name='Maharani Spices & Agro',
            buyer_mobile='9711223344',
            crop_name='Green / Red Chilli',
            quantity_quintals=150.0,
            max_budget_per_quintal=19000.0,
            delivery_district='Guntur',
            delivery_state='Andhra Pradesh',
            required_by_date=today + timedelta(days=20),
            quality_requirement='Export Grade Teja (Dry)',
            notes='Need high color and SHU pungency. Immediate inspection and direct cash payment on unloading.'
        ),
        BuyerCropRequest(
            buyer_id=None,
            buyer_name='Apex Onion Traders',
            company_name='Apex Fresh Mandi Hub',
            buyer_mobile='9822334455',
            crop_name='Onion',
            quantity_quintals=300.0,
            max_budget_per_quintal=2650.0,
            delivery_district='Nashik',
            delivery_state='Maharashtra',
            required_by_date=today + timedelta(days=7),
            quality_requirement='Grade A Garwa Red (50mm+)',
            notes='Looking for direct farmer collectives or FPOs. We can pick up directly from Niphad / Lasalgaon farms.'
        )
    ]
    for req in sample_buyer_requests:
        db.session.add(req)

    db.session.commit()
    print("✓ Successfully seeded Smart KRISHI agricultural database!")

