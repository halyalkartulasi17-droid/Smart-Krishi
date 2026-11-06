"""
Smart KRISHI (SmartAI Kisan) SQLAlchemy Database Models
Covers all entities: Farmers, Buyers, Crops, Markets, Prices, Soil, Water,
Recommendations, Predictions, Marketplace, Alerts, Notifications, and Chatbot.
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Farmer(db.Model):
    __tablename__ = 'farmers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    mobile = db.Column(db.String(20), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    state = db.Column(db.String(100), default='Karnataka')
    district = db.Column(db.String(100), default='Bengaluru Rural')
    village = db.Column(db.String(100), default='Devanahalli')
    preferred_language = db.Column(db.String(20), default='en')
    easy_mode = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    listings = db.relationship('CropListing', backref='farmer', lazy=True)
    soil_records = db.relationship('SoilRecord', backref='farmer', lazy=True)
    alerts = db.relationship('Alert', backref='farmer', lazy=True)
    notifications = db.relationship('Notification', backref='farmer', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'mobile': self.mobile,
            'email': self.email,
            'state': self.state,
            'district': self.district,
            'village': self.village,
            'preferred_language': self.preferred_language,
            'easy_mode': self.easy_mode,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Buyer(db.Model):
    __tablename__ = 'buyers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    company_name = db.Column(db.String(150), nullable=True)
    mobile = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    state = db.Column(db.String(100), default='Karnataka')
    district = db.Column(db.String(100), default='Bengaluru')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'company_name': self.company_name,
            'mobile': self.mobile,
            'email': self.email,
            'state': self.state,
            'district': self.district,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Crop(db.Model):
    __tablename__ = 'crops'
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    standard_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # Vegetable, Grain, Commercial, Fruit, Pulse
    image_url = db.Column(db.String(255), nullable=True)
    season = db.Column(db.String(50), default='Kharif/Rabi')
    water_need = db.Column(db.String(20), default='Medium')  # Low, Medium, High
    water_need_mm = db.Column(db.Float, default=500.0)
    growing_days = db.Column(db.Integer, default=90)
    temp_min = db.Column(db.Float, default=18.0)
    temp_max = db.Column(db.Float, default=32.0)
    ph_min = db.Column(db.Float, default=6.0)
    ph_max = db.Column(db.Float, default=7.5)
    soil_types = db.Column(db.String(255), default='Loamy, Red, Black')
    n_req = db.Column(db.Float, default=80.0)
    p_req = db.Column(db.Float, default=40.0)
    k_req = db.Column(db.Float, default=40.0)
    description = db.Column(db.Text, nullable=True)

    translations = db.relationship('CropTranslation', backref='crop', lazy=True, cascade='all, delete-orphan')

    def to_dict(self, lang=None):
        name = self.standard_name
        desc = self.description
        if lang:
            trans = next((t for t in self.translations if t.language_code == lang), None)
            if trans:
                name = trans.name or name
                desc = trans.description or desc
        return {
            'id': self.id,
            'code': self.code,
            'name': name,
            'standard_name': self.standard_name,
            'category': self.category,
            'image_url': self.image_url,
            'season': self.season,
            'water_need': self.water_need,
            'water_need_mm': self.water_need_mm,
            'growing_days': self.growing_days,
            'temp_min': self.temp_min,
            'temp_max': self.temp_max,
            'ph_min': self.ph_min,
            'ph_max': self.ph_max,
            'soil_types': [s.strip() for s in self.soil_types.split(',')],
            'n_req': self.n_req,
            'p_req': self.p_req,
            'k_req': self.k_req,
            'description': desc
        }


class CropTranslation(db.Model):
    __tablename__ = 'crop_translations'
    id = db.Column(db.Integer, primary_key=True)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    language_code = db.Column(db.String(10), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)


class Market(db.Model):
    __tablename__ = 'markets'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    district = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    market_type = db.Column(db.String(50), default='APMC Mandi')

    translations = db.relationship('MarketTranslation', backref='market', lazy=True)

    def to_dict(self, lang=None):
        name = self.name
        if lang:
            trans = next((t for t in self.translations if t.language_code == lang), None)
            if trans:
                name = trans.name or name
        return {
            'id': self.id,
            'name': name,
            'district': self.district,
            'state': self.state,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'market_type': self.market_type
        }


class MarketTranslation(db.Model):
    __tablename__ = 'market_translations'
    id = db.Column(db.Integer, primary_key=True)
    market_id = db.Column(db.Integer, db.ForeignKey('markets.id'), nullable=False)
    language_code = db.Column(db.String(10), nullable=False)
    name = db.Column(db.String(150), nullable=False)


class MarketPrice(db.Model):
    __tablename__ = 'market_prices'
    id = db.Column(db.Integer, primary_key=True)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    market_id = db.Column(db.Integer, db.ForeignKey('markets.id'), nullable=False)
    min_price = db.Column(db.Float, nullable=False)      # Rs per Quintal
    max_price = db.Column(db.Float, nullable=False)
    modal_price = db.Column(db.Float, nullable=False)
    arrival_tonnes = db.Column(db.Float, default=100.0)
    date = db.Column(db.Date, nullable=False)

    crop = db.relationship('Crop', backref='prices')
    market = db.relationship('Market', backref='prices')

    def to_dict(self):
        return {
            'id': self.id,
            'crop_id': self.crop_id,
            'crop_name': self.crop.standard_name if self.crop else '',
            'crop_code': self.crop.code if self.crop else '',
            'category': self.crop.category if self.crop else '',
            'market_id': self.market_id,
            'market_name': self.market.name if self.market else '',
            'district': self.market.district if self.market else '',
            'state': self.market.state if self.market else '',
            'min_price': self.min_price,
            'max_price': self.max_price,
            'modal_price': self.modal_price,
            'arrival_tonnes': self.arrival_tonnes,
            'date': self.date.isoformat() if self.date else '',
            'unit': '₹/Quintal'
        }


class HistoricalPrice(db.Model):
    __tablename__ = 'historical_prices'
    id = db.Column(db.Integer, primary_key=True)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    market_id = db.Column(db.Integer, db.ForeignKey('markets.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, index=True)
    price = db.Column(db.Float, nullable=False)
    volume_quintals = db.Column(db.Float, default=500.0)

    crop = db.relationship('Crop')
    market = db.relationship('Market')

    def to_dict(self):
        return {
            'id': self.id,
            'crop_id': self.crop_id,
            'market_id': self.market_id,
            'date': self.date.isoformat(),
            'price': self.price,
            'volume_quintals': self.volume_quintals
        }


class CropProduction(db.Model):
    __tablename__ = 'crop_production'
    id = db.Column(db.Integer, primary_key=True)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    production_tonnes = db.Column(db.Float, nullable=False)
    area_hectares = db.Column(db.Float, nullable=False)
    yield_kg_per_ha = db.Column(db.Float, nullable=False)

    crop = db.relationship('Crop')

    def to_dict(self):
        return {
            'id': self.id,
            'crop_id': self.crop_id,
            'crop_name': self.crop.standard_name if self.crop else '',
            'state': self.state,
            'district': self.district,
            'year': self.year,
            'production_tonnes': self.production_tonnes,
            'area_hectares': self.area_hectares,
            'yield_kg_per_ha': self.yield_kg_per_ha
        }


class CropDemand(db.Model):
    __tablename__ = 'crop_demand'
    id = db.Column(db.Integer, primary_key=True)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    demand_index = db.Column(db.Float, nullable=False) # 0 to 100
    market_trend = db.Column(db.String(20), default='High') # High, Moderate, Low
    export_demand_tonnes = db.Column(db.Float, default=0.0)
    domestic_consumption_index = db.Column(db.Float, default=75.0)

    crop = db.relationship('Crop')

    def to_dict(self):
        return {
            'id': self.id,
            'crop_id': self.crop_id,
            'crop_name': self.crop.standard_name if self.crop else '',
            'year': self.year,
            'month': self.month,
            'demand_index': self.demand_index,
            'market_trend': self.market_trend,
            'export_demand_tonnes': self.export_demand_tonnes,
            'domestic_consumption_index': self.domestic_consumption_index
        }


class SoilRecord(db.Model):
    __tablename__ = 'soil_records'
    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=True)
    soil_type = db.Column(db.String(50), nullable=False) # Black, Red, Alluvial, Laterite, Sandy, Clay, Loamy
    ph = db.Column(db.Float, nullable=False)
    nitrogen = db.Column(db.Float, nullable=False)      # kg/ha
    phosphorus = db.Column(db.Float, nullable=False)    # kg/ha
    potassium = db.Column(db.Float, nullable=False)     # kg/ha
    moisture = db.Column(db.Float, default=45.0)        # %
    texture = db.Column(db.String(50), default='Medium')
    location = db.Column(db.String(150), default='Karnataka')
    water_availability = db.Column(db.String(50), default='Borewell')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    recommendations = db.relationship('SoilRecommendation', backref='soil_record', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'farmer_id': self.farmer_id,
            'soil_type': self.soil_type,
            'ph': self.ph,
            'nitrogen': self.nitrogen,
            'phosphorus': self.phosphorus,
            'potassium': self.potassium,
            'moisture': self.moisture,
            'texture': self.texture,
            'location': self.location,
            'water_availability': self.water_availability,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'recommendations': [r.to_dict() for r in self.recommendations]
        }


class SoilRecommendation(db.Model):
    __tablename__ = 'soil_recommendations'
    id = db.Column(db.Integer, primary_key=True)
    soil_record_id = db.Column(db.Integer, db.ForeignKey('soil_records.id'), nullable=False)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    suitability_score = db.Column(db.Float, nullable=False) # 0 to 100
    reason = db.Column(db.Text, nullable=False)
    rank = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    crop = db.relationship('Crop')

    def to_dict(self):
        return {
            'id': self.id,
            'crop_id': self.crop_id,
            'crop_name': self.crop.standard_name if self.crop else '',
            'crop_code': self.crop.code if self.crop else '',
            'image_url': self.crop.image_url if self.crop else '',
            'season': self.crop.season if self.crop else '',
            'growing_days': self.crop.growing_days if self.crop else 90,
            'water_need': self.crop.water_need if self.crop else 'Medium',
            'temp_range': f"{self.crop.temp_min}-{self.crop.temp_max}°C" if self.crop else '20-30°C',
            'suitability_score': round(self.suitability_score, 1),
            'reason': self.reason,
            'rank': self.rank
        }


class WaterRecord(db.Model):
    __tablename__ = 'water_records'
    id = db.Column(db.Integer, primary_key=True)
    district = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    month = db.Column(db.Integer, nullable=False)
    groundwater_level_mbgl = db.Column(db.Float, nullable=False) # meters below ground level (lower is deeper)
    rainfall_mm = db.Column(db.Float, nullable=False)
    surface_water_index = db.Column(db.Float, default=65.0)      # % reservoir/canal capacity
    recorded_type = db.Column(db.String(30), default='measured') # measured, reported, predicted

    def to_dict(self):
        return {
            'id': self.id,
            'district': self.district,
            'state': self.state,
            'year': self.year,
            'month': self.month,
            'groundwater_level_mbgl': self.groundwater_level_mbgl,
            'rainfall_mm': self.rainfall_mm,
            'surface_water_index': self.surface_water_index,
            'recorded_type': self.recorded_type
        }


class WaterPrediction(db.Model):
    __tablename__ = 'water_predictions'
    id = db.Column(db.Integer, primary_key=True)
    district = db.Column(db.String(100), nullable=False)
    period = db.Column(db.String(20), nullable=False) # 7_days, 3_months, 6_months
    predicted_water_level = db.Column(db.Float, nullable=False)
    predicted_rainfall_mm = db.Column(db.Float, nullable=False)
    shortage_risk = db.Column(db.String(30), default='Moderate') # Low, Moderate, High, Critical
    water_availability_summary = db.Column(db.Text, nullable=True)
    suitable_low_water_crops = db.Column(db.String(255), default='Ragi, Bajra, Groundnut, Pulses')
    suitable_high_water_crops = db.Column(db.String(255), default='Paddy, Sugarcane')

    def to_dict(self):
        return {
            'id': self.id,
            'district': self.district,
            'period': self.period,
            'predicted_water_level': self.predicted_water_level,
            'predicted_rainfall_mm': self.predicted_rainfall_mm,
            'shortage_risk': self.shortage_risk,
            'water_availability_summary': self.water_availability_summary,
            'suitable_low_water_crops': [c.strip() for c in self.suitable_low_water_crops.split(',')],
            'suitable_high_water_crops': [c.strip() for c in self.suitable_high_water_crops.split(',')]
        }


class WeatherRecord(db.Model):
    __tablename__ = 'weather_records'
    id = db.Column(db.Integer, primary_key=True)
    district = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    wind_speed = db.Column(db.Float, default=12.0)
    rainfall_forecast_mm = db.Column(db.Float, default=0.0)
    condition = db.Column(db.String(80), default='Partly Cloudy')
    forecast_json = db.Column(db.Text, nullable=True) # 7-day array
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        import json
        forecast = []
        if self.forecast_json:
            try:
                forecast = json.loads(self.forecast_json)
            except Exception:
                forecast = []
        return {
            'id': self.id,
            'district': self.district,
            'state': self.state,
            'temperature': self.temperature,
            'humidity': self.humidity,
            'wind_speed': self.wind_speed,
            'rainfall_forecast_mm': self.rainfall_forecast_mm,
            'condition': self.condition,
            'forecast': forecast,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class CropPrediction(db.Model):
    __tablename__ = 'crop_predictions'
    id = db.Column(db.Integer, primary_key=True)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    market_id = db.Column(db.Integer, db.ForeignKey('markets.id'), nullable=False)
    period = db.Column(db.String(20), nullable=False) # 7d, 3m, 6m, 2y
    current_price = db.Column(db.Float, nullable=False)
    predicted_price = db.Column(db.Float, nullable=False)
    min_expected = db.Column(db.Float, nullable=False)
    max_expected = db.Column(db.Float, nullable=False)
    trend = db.Column(db.String(20), default='Rising') # Rising, Falling, Stable
    best_selling_period = db.Column(db.String(100), nullable=True)
    mae = db.Column(db.Float, default=45.2)
    rmse = db.Column(db.Float, default=62.8)
    model_accuracy = db.Column(db.Float, default=91.5) # %
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    crop = db.relationship('Crop')
    market = db.relationship('Market')

    def to_dict(self):
        return {
            'id': self.id,
            'crop_id': self.crop_id,
            'crop_name': self.crop.standard_name if self.crop else '',
            'market_id': self.market_id,
            'market_name': self.market.name if self.market else '',
            'period': self.period,
            'current_price': self.current_price,
            'predicted_price': self.predicted_price,
            'min_expected': self.min_expected,
            'max_expected': self.max_expected,
            'trend': self.trend,
            'best_selling_period': self.best_selling_period,
            'mae': self.mae,
            'rmse': self.rmse,
            'model_accuracy': self.model_accuracy,
            'disclaimer': 'Predictions are estimates, not guaranteed prices.',
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class SmartRecommendation(db.Model):
    __tablename__ = 'recommendations'
    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=True)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    combined_score = db.Column(db.Float, nullable=False)
    soil_match_score = db.Column(db.Float, default=85.0)
    water_match_score = db.Column(db.Float, default=80.0)
    market_demand_score = db.Column(db.Float, default=90.0)
    weather_match_score = db.Column(db.Float, default=85.0)
    explanation = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    crop = db.relationship('Crop')

    def to_dict(self):
        return {
            'id': self.id,
            'crop_id': self.crop_id,
            'crop_name': self.crop.standard_name if self.crop else '',
            'crop_code': self.crop.code if self.crop else '',
            'image_url': self.crop.image_url if self.crop else '',
            'combined_score': round(self.combined_score, 1),
            'soil_match': round(self.soil_match_score, 1),
            'water_match': round(self.water_match_score, 1),
            'market_match': round(self.market_demand_score, 1),
            'weather_match': round(self.weather_match_score, 1),
            'explanation': self.explanation,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class CropListing(db.Model):
    __tablename__ = 'crop_listings'
    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=True)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    crop_name = db.Column(db.String(100), nullable=False)
    quantity_quintals = db.Column(db.Float, nullable=False)
    price_per_quintal = db.Column(db.Float, nullable=False)
    quality_grade = db.Column(db.String(30), default='Grade A') # Grade A, Grade B, Organic
    location_village = db.Column(db.String(100), default='Kolar')
    location_district = db.Column(db.String(100), default='Kolar')
    location_state = db.Column(db.String(100), default='Karnataka')
    harvest_date = db.Column(db.Date, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    status = db.Column(db.String(20), default='active') # active, sold, paused
    is_demo = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    enquiries = db.relationship('BuyerEnquiry', backref='listing', lazy=True, cascade='all, delete-orphan')
    crop = db.relationship('Crop')

    def to_dict(self):
        return {
            'id': self.id,
            'farmer_id': self.farmer_id,
            'farmer_name': self.farmer.name if self.farmer else 'Kisan Producer',
            'farmer_mobile': self.farmer.mobile if self.farmer else '9876543210',
            'crop_id': self.crop_id,
            'crop_name': self.crop_name,
            'quantity_quintals': self.quantity_quintals,
            'price_per_quintal': self.price_per_quintal,
            'quality_grade': self.quality_grade,
            'village': self.location_village,
            'district': self.location_district,
            'state': self.location_state,
            'harvest_date': self.harvest_date.isoformat() if self.harvest_date else None,
            'image_url': self.image_url or (self.crop.image_url if self.crop else ''),
            'status': self.status,
            'is_demo': self.is_demo,
            'enquiries_count': len(self.enquiries),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class BuyerEnquiry(db.Model):
    __tablename__ = 'buyer_enquiries'
    id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer, db.ForeignKey('crop_listings.id'), nullable=False)
    buyer_name = db.Column(db.String(120), nullable=False)
    buyer_mobile = db.Column(db.String(20), nullable=False)
    buyer_offer_price = db.Column(db.Float, nullable=False) # per quintal
    quantity_requested = db.Column(db.Float, nullable=False)
    message = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='pending') # pending, accepted, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'listing_id': self.listing_id,
            'crop_name': self.listing.crop_name if self.listing else '',
            'buyer_name': self.buyer_name,
            'buyer_mobile': self.buyer_mobile,
            'buyer_offer_price': self.buyer_offer_price,
            'quantity_requested': self.quantity_requested,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Alert(db.Model):
    __tablename__ = 'alerts'
    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=False)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    market_id = db.Column(db.Integer, db.ForeignKey('markets.id'), nullable=False)
    target_price = db.Column(db.Float, nullable=False)
    condition = db.Column(db.String(20), default='above') # above, below
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    crop = db.relationship('Crop')
    market = db.relationship('Market')

    def to_dict(self):
        return {
            'id': self.id,
            'farmer_id': self.farmer_id,
            'crop_id': self.crop_id,
            'crop_name': self.crop.standard_name if self.crop else '',
            'market_id': self.market_id,
            'market_name': self.market.name if self.market else '',
            'target_price': self.target_price,
            'condition': self.condition,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Notification(db.Model):
    __tablename__ = 'notifications'
    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(30), default='price') # price, weather, enquiry, alert
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'farmer_id': self.farmer_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    session_id = db.Column(db.String(64), nullable=False)
    role = db.Column(db.String(20), nullable=False) # user, assistant
    content = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(20), default='en')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'role': self.role,
            'content': self.content,
            'language': self.language,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class LanguagePreference(db.Model):
    __tablename__ = 'language_preferences'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=True)
    ip_or_device = db.Column(db.String(100), nullable=True)
    language_code = db.Column(db.String(10), default='en')
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)


class UserReview(db.Model):
    __tablename__ = 'user_reviews'
    id = db.Column(db.Integer, primary_key=True)
    reviewer_type = db.Column(db.String(20), nullable=False) # 'buyer' or 'farmer'
    reviewer_id = db.Column(db.Integer, nullable=True)
    reviewer_name = db.Column(db.String(120), nullable=False)
    target_type = db.Column(db.String(20), nullable=False)   # 'farmer' or 'buyer'
    target_id = db.Column(db.Integer, nullable=False)
    target_name = db.Column(db.String(120), nullable=True)
    crop_name = db.Column(db.String(100), nullable=True)
    rating = db.Column(db.Integer, nullable=False)          # 1 to 5
    badge = db.Column(db.String(80), default='Verified Trade')
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'reviewer_type': self.reviewer_type,
            'reviewer_name': self.reviewer_name,
            'target_type': self.target_type,
            'target_id': self.target_id,
            'target_name': self.target_name,
            'crop_name': self.crop_name,
            'rating': self.rating,
            'badge': self.badge,
            'comment': self.comment,
            'created_at': self.created_at.strftime('%b %d, %Y') if self.created_at else 'Recent'
        }


class BuyerCropRequest(db.Model):
    __tablename__ = 'buyer_crop_requests'
    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('buyers.id'), nullable=True)
    buyer_name = db.Column(db.String(120), nullable=False)
    company_name = db.Column(db.String(150), nullable=True)
    buyer_mobile = db.Column(db.String(20), nullable=False)
    crop_name = db.Column(db.String(100), nullable=False)
    quantity_quintals = db.Column(db.Float, nullable=False)
    max_budget_per_quintal = db.Column(db.Float, nullable=False)
    delivery_district = db.Column(db.String(100), default='Bengaluru')
    delivery_state = db.Column(db.String(100), default='Karnataka')
    required_by_date = db.Column(db.Date, nullable=True)
    quality_requirement = db.Column(db.String(50), default='Grade A')
    notes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='active') # active, fulfilled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'buyer_id': self.buyer_id,
            'buyer_name': self.buyer_name,
            'company_name': self.company_name,
            'buyer_mobile': self.buyer_mobile,
            'crop_name': self.crop_name,
            'quantity_quintals': self.quantity_quintals,
            'max_budget_per_quintal': self.max_budget_per_quintal,
            'district': self.delivery_district,
            'state': self.delivery_state,
            'required_by_date': self.required_by_date.isoformat() if self.required_by_date else None,
            'quality_requirement': self.quality_requirement,
            'notes': self.notes,
            'status': self.status,
            'created_at': self.created_at.strftime('%b %d, %Y') if self.created_at else 'Recent'
        }


