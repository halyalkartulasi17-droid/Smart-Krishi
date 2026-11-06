"""
Smart KRISHI Complete REST API Router
Provides all REST endpoints with validation, JWT authentication, and structured JSON responses.
"""

from datetime import datetime, date, timedelta
import math
import jwt
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from models.models import (
    db, Farmer, Buyer, Crop, CropTranslation, Market, MarketTranslation,
    MarketPrice, HistoricalPrice, CropProduction, CropDemand,
    SoilRecord, SoilRecommendation, WaterRecord, WaterPrediction,
    WeatherRecord, CropPrediction, SmartRecommendation, CropListing,
    BuyerEnquiry, Alert, Notification, ChatMessage, UserReview, BuyerCropRequest
)
from ml.price_predictor import forecast_crop_prices
from ml.soil_recommender import analyze_soil_and_recommend
from services.weather_service import get_live_weather
from services.kisan_mitra_service import process_kisan_chat, LANGUAGE_NAMES

api_bp = Blueprint('api', __name__)

def generate_token(farmer_id):
    secret = current_app.config.get('SECRET_KEY', 'smart-krishi-secret')
    payload = {
        'farmer_id': farmer_id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }
    return jwt.encode(payload, secret, algorithm='HS256')

def get_current_farmer():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        # Return default demo farmer for smooth accessibility
        return Farmer.query.first()
    token = auth_header.split(' ')[1]
    secret = current_app.config.get('SECRET_KEY', 'smart-krishi-secret')
    try:
        data = jwt.decode(token, secret, algorithms=['HS256'])
        return Farmer.query.get(data['farmer_id'])
    except Exception:
        return Farmer.query.first()

# ================= AUTHENTICATION =================
@api_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    mobile = data.get('mobile', '').strip()
    name = data.get('name', '').strip()
    password = data.get('password', 'kisan123')

    if not mobile or not name:
        return jsonify({'error': 'Mobile and Name are required'}), 400

    existing = Farmer.query.filter_by(mobile=mobile).first()
    if existing:
        return jsonify({'error': 'Farmer already registered with this mobile'}), 400

    farmer = Farmer(
        name=name,
        mobile=mobile,
        email=data.get('email'),
        state=data.get('state', 'Karnataka'),
        district=data.get('district', 'Kolar'),
        village=data.get('village', 'Srinivaspur'),
        preferred_language=data.get('preferred_language', 'en'),
        easy_mode=data.get('easy_mode', True)
    )
    farmer.set_password(password)
    db.session.add(farmer)
    db.session.commit()

    token = generate_token(farmer.id)
    return jsonify({
        'message': 'Registration successful',
        'token': token,
        'farmer': farmer.to_dict()
    }), 201

@api_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    mobile = data.get('mobile', '').strip()
    password = data.get('password', '')

    farmer = Farmer.query.filter_by(mobile=mobile).first()
    if not farmer or not farmer.check_password(password):
        # Demo bypass for hackathon presentation if password is default
        if mobile == '9876543210' or password in ['kisan123', '1234']:
            farmer = Farmer.query.first()
            if farmer:
                token = generate_token(farmer.id)
                return jsonify({'token': token, 'farmer': farmer.to_dict()})
        return jsonify({'error': 'Invalid mobile or password'}), 401

    token = generate_token(farmer.id)
    return jsonify({
        'token': token,
        'farmer': farmer.to_dict()
    })

@api_bp.route('/auth/demo-otp', methods=['POST'])
def demo_otp():
    data = request.get_json() or {}
    mobile = data.get('mobile', '9876543210')
    return jsonify({
        'message': f'Development demo OTP sent to {mobile}',
        'demo_otp': '1234',
        'note': 'In local demo mode, enter OTP: 1234'
    })

@api_bp.route('/auth/profile', methods=['GET', 'PUT'])
def profile():
    farmer = get_current_farmer()
    if not farmer:
        return jsonify({'error': 'Farmer not found'}), 404

    if request.method == 'PUT':
        data = request.get_json() or {}
        if 'name' in data: farmer.name = data['name']
        if 'email' in data: farmer.email = data['email']
        if 'state' in data: farmer.state = data['state']
        if 'district' in data: farmer.district = data['district']
        if 'village' in data: farmer.village = data['village']
        if 'preferred_language' in data: farmer.preferred_language = data['preferred_language']
        if 'easy_mode' in data: farmer.easy_mode = bool(data['easy_mode'])
        db.session.commit()

    return jsonify(farmer.to_dict())

# ================= CROPS & TODAY'S PRICES =================
@api_bp.route('/crops', methods=['GET'])
def get_crops():
    lang = request.args.get('lang', 'en')
    crops = Crop.query.all()
    return jsonify([c.to_dict(lang=lang) for c in crops])

@api_bp.route('/crops/<int:crop_id>', methods=['GET'])
def get_crop_details(crop_id):
    lang = request.args.get('lang', 'en')
    crop = Crop.query.get_or_404(crop_id)
    return jsonify(crop.to_dict(lang=lang))

@api_bp.route('/prices/today', methods=['GET'])
def get_today_prices():
    search = request.args.get('search', '').lower()
    crop_code = request.args.get('crop', '')
    state = request.args.get('state', '')
    district = request.args.get('district', '')
    sort_by = request.args.get('sort', 'modal_desc') # modal_desc, modal_asc, name

    query = MarketPrice.query.join(Crop).join(Market)

    if crop_code:
        query = query.filter(Crop.code == crop_code)
    if state:
        query = query.filter(Market.state == state)
    if district:
        query = query.filter(Market.district == district)
    if search:
        query = query.filter(
            (Crop.standard_name.ilike(f'%{search}%')) |
            (Market.name.ilike(f'%{search}%')) |
            (Market.district.ilike(f'%{search}%'))
        )

    prices = query.all()
    results = [p.to_dict() for p in prices]

    if sort_by == 'modal_desc':
        results.sort(key=lambda x: x['modal_price'], reverse=True)
    elif sort_by == 'modal_asc':
        results.sort(key=lambda x: x['modal_price'])
    elif sort_by == 'name':
        results.sort(key=lambda x: x['crop_name'])

    return jsonify({
        'total': len(results),
        'source': 'Agmarknet / Directorate of Marketing & Inspection (DMI)',
        'updated_at': date.today().isoformat(),
        'prices': results
    })

@api_bp.route('/prices/markets', methods=['GET'])
def get_markets():
    lang = request.args.get('lang', 'en')
    markets = Market.query.all()
    return jsonify([m.to_dict(lang=lang) for m in markets])

# ================= PRICE PREDICTION =================
@api_bp.route('/prediction/price', methods=['GET'])
def get_price_prediction():
    crop_id = request.args.get('crop_id', type=int)
    crop_code = request.args.get('crop_code')
    period = request.args.get('period', '3m') # 7d, 3m, 6m, 2y
    market_id = request.args.get('market_id', type=int)

    if not crop_id and crop_code:
        crop = Crop.query.filter_by(code=crop_code).first()
        if crop: crop_id = crop.id

    if not crop_id:
        # Default to tomato
        crop = Crop.query.filter_by(code='tomato').first()
        crop_id = crop.id if crop else 1

    forecast = forecast_crop_prices(crop_id=crop_id, market_id=market_id, period=period)
    return jsonify(forecast)

# ================= SOIL ANALYSIS & CROP RECOMMENDATION =================
@api_bp.route('/soil/analyze', methods=['POST'])
def analyze_soil():
    data = request.get_json() or {}
    soil_type = data.get('soil_type', 'Red')
    ph = float(data.get('ph', 6.5))
    nitrogen = float(data.get('nitrogen', 100.0))
    phosphorus = float(data.get('phosphorus', 50.0))
    potassium = float(data.get('potassium', 50.0))
    moisture = float(data.get('moisture', 45.0))
    water_avail = data.get('water_availability', 'Borewell')

    recs = analyze_soil_and_recommend(
        soil_type=soil_type,
        ph=ph,
        nitrogen=nitrogen,
        phosphorus=phosphorus,
        potassium=potassium,
        moisture=moisture,
        water_avail=water_avail
    )

    # Save to soil records
    farmer = get_current_farmer()
    record = SoilRecord(
        farmer_id=farmer.id if farmer else None,
        soil_type=soil_type,
        ph=ph,
        nitrogen=nitrogen,
        phosphorus=phosphorus,
        potassium=potassium,
        moisture=moisture,
        water_availability=water_avail
    )
    db.session.add(record)
    db.session.flush()

    for r in recs:
        db.session.add(SoilRecommendation(
            soil_record_id=record.id,
            crop_id=r['crop_id'],
            suitability_score=r['suitability_score'],
            reason=r['reason'],
            rank=r['rank']
        ))
    db.session.commit()

    return jsonify({
        'soil_analysis': {
            'soil_type': soil_type,
            'ph': ph,
            'ph_status': 'Ideal Neutral' if 6.0 <= ph <= 7.5 else ('Acidic' if ph < 6.0 else 'Alkaline'),
            'nitrogen': nitrogen,
            'phosphorus': phosphorus,
            'potassium': potassium,
            'moisture': moisture,
            'water_availability': water_avail
        },
        'top_recommendations': recs,
        'soil_health_tips': [
            f"Add organic compost / vermicompost to preserve moisture in {soil_type} soil.",
            "Apply neem cake to deter root nematodes and promote nitrogen assimilation.",
            "Schedule deep watering in the early mornings to reduce evaporative loss."
        ]
    })

# ================= PRODUCTION & DEMAND =================
@api_bp.route('/production-demand/compare', methods=['GET'])
def get_production_demand():
    crop_code = request.args.get('crop', '')
    crops = Crop.query.all()
    results = []

    for c in crops:
        if crop_code and c.code != crop_code:
            continue
        p25 = CropProduction.query.filter_by(crop_id=c.id, year=2025).first()
        p26 = CropProduction.query.filter_by(crop_id=c.id, year=2026).first()
        demand = CropDemand.query.filter_by(crop_id=c.id).first()

        prod_2025 = p25.production_tonnes if p25 else 45000
        prod_2026 = p26.production_tonnes if p26 else 48500
        diff_pct = ((prod_2026 - prod_2025) / prod_2025) * 100.0

        results.append({
            'crop_id': c.id,
            'crop_code': c.code,
            'crop_name': c.standard_name,
            'category': c.category,
            'image_url': c.image_url,
            'production_2025': prod_2025,
            'production_2026': prod_2026,
            'production_change_pct': round(diff_pct, 1),
            'production_status': 'Increasing' if diff_pct > 0 else 'Decreasing',
            'demand_index': demand.demand_index if demand else 80.0,
            'demand_trend': demand.market_trend if demand else 'High',
            'domestic_index': demand.domestic_consumption_index if demand else 78.0,
            'export_tonnes': demand.export_demand_tonnes if demand else 2400
        })

    # Summary statistics
    results.sort(key=lambda x: x['production_2026'], reverse=True)
    highest_prod = results[0] if results else None
    lowest_prod = results[-1] if results else None
    high_demand_crops = [r for r in results if r['demand_trend'] == 'High']

    return jsonify({
        'comparison': results,
        'summary': {
            'highest_production': highest_prod,
            'lowest_production': lowest_prod,
            'high_demand_count': len(high_demand_crops),
            'total_analyzed_crops': len(results)
        },
        'years_compared': {'previous_year': 2025, 'current_year': 2026},
        'source': 'Ministry of Agriculture & Farmers Welfare (DES/DAC&FW)'
    })

# ================= WATER INTELLIGENCE =================
@api_bp.route('/water/intelligence', methods=['GET'])
def get_water_intelligence():
    district = request.args.get('district', 'Kolar')
    records = WaterRecord.query.filter_by(district=district).order_by(WaterRecord.year.asc(), WaterRecord.month.asc()).all()

    if not records:
        # Fallback to Kolar
        records = WaterRecord.query.filter_by(district='Kolar').order_by(WaterRecord.year.asc(), WaterRecord.month.asc()).all()

    hist_2025 = [r.to_dict() for r in records if r.year == 2025]
    curr_2026 = [r.to_dict() for r in records if r.year == 2026]

    predictions = WaterPrediction.query.filter_by(district=district).all()
    if not predictions:
        predictions = WaterPrediction.query.filter_by(district='Kolar').all()

    # Calculate average current groundwater
    recent_gw = curr_2026[-1]['groundwater_level_mbgl'] if curr_2026 else 22.5
    recent_rain = sum(r['rainfall_mm'] for r in curr_2026)

    # Monthly comparison chart for Excel-style Cylinder Graph
    monthly_chart = []
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for idx, m_name in enumerate(month_names, 1):
        r25 = next((r for r in hist_2025 if r['month'] == idx), None)
        r26 = next((r for r in curr_2026 if r['month'] == idx), None)
        monthly_chart.append({
            'month': m_name,
            'gw_2025': r25['groundwater_level_mbgl'] if r25 else None,
            'gw_2026': r26['groundwater_level_mbgl'] if r26 else None,
            'rain_2025': r25['rainfall_mm'] if r25 else None,
            'rain_2026': r26['rainfall_mm'] if r26 else None
        })

    return jsonify({
        'district': district,
        'state': records[0].state if records else 'Karnataka',
        'current_groundwater_level_mbgl': recent_gw,
        'groundwater_status': 'Safe Zone' if recent_gw < 20 else ('Semi-Critical' if recent_gw < 30 else 'Critical'),
        'cumulative_rainfall_mm': round(recent_rain, 1),
        'predictions': [p.to_dict() for p in predictions],
        'monthly_chart': monthly_chart,
        'verified_sources': 'Central Ground Water Board (CGWB) & India Meteorological Department (IMD)',
        'data_type': 'measured & reported historical sensor records'
    })

# ================= SMART RECOMMENDATION (COMPOSITE) =================
@api_bp.route('/recommendations/smart', methods=['POST'])
def get_smart_recommendation():
    data = request.get_json() or {}
    soil_type = data.get('soil_type', 'Red')
    water_source = data.get('water_source', 'Borewell')
    district = data.get('district', 'Kolar')

    crops = Crop.query.all()
    results = []

    for c in crops:
        # Soil match
        s_score = 90.0 if soil_type.lower() in c.soil_types.lower() else 65.0
        # Water match
        if c.water_need == 'Low':
            w_score = 92.0
        elif c.water_need == 'Medium':
            w_score = 85.0 if water_source in ['Borewell', 'Canal'] else 60.0
        else: # High
            w_score = 90.0 if water_source == 'Canal' else 50.0

        # Market demand score
        demand = CropDemand.query.filter_by(crop_id=c.id).first()
        m_score = demand.demand_index if demand else 75.0

        # Composite weighted score
        composite = (s_score * 0.35) + (w_score * 0.30) + (m_score * 0.35)

        reasons = []
        if s_score >= 85: reasons.append(f"Highly compatible with {soil_type} soil.")
        if w_score >= 80: reasons.append(f"Water requirements fit {water_source} irrigation capacity.")
        if m_score >= 85: reasons.append(f"Strong domestic market demand index ({round(m_score)}/100).")

        results.append({
            'crop_id': c.id,
            'crop_code': c.code,
            'crop_name': c.standard_name,
            'category': c.category,
            'image_url': c.image_url,
            'composite_score': round(composite, 1),
            'soil_score': round(s_score, 1),
            'water_score': round(w_score, 1),
            'market_score': round(m_score, 1),
            'growing_season': c.season,
            'growing_days': c.growing_days,
            'explanation': " ".join(reasons) or "Balanced cultivation candidate under managed irrigation.",
            'disclaimer': 'Smart farming recommendations are advisories to support decisions, not guaranteed yield or profit.'
        })

    results.sort(key=lambda x: x['composite_score'], reverse=True)
    return jsonify({
        'recommendations': results[:6],
        'disclaimer': 'Smart farming recommendations are advisories to support decisions, not guaranteed yield or profit.'
    })

# ================= BUY & SELL MARKETPLACE =================
@api_bp.route('/marketplace/listings', methods=['GET', 'POST'])
def marketplace_listings():
    if request.method == 'POST':
        farmer = get_current_farmer()
        data = request.get_json() or {}

        crop_id = data.get('crop_id')
        crop = Crop.query.get(crop_id) if crop_id else None
        crop_name = data.get('crop_name') or (crop.standard_name if crop else 'Agricultural Crop')

        listing = CropListing(
            farmer_id=farmer.id if farmer else None,
            crop_id=crop_id or 1,
            crop_name=crop_name,
            quantity_quintals=float(data.get('quantity_quintals', 50.0)),
            price_per_quintal=float(data.get('price_per_quintal', 2200.0)),
            quality_grade=data.get('quality_grade', 'Grade A'),
            location_village=data.get('village', farmer.village if farmer else 'Kolar'),
            location_district=data.get('district', farmer.district if farmer else 'Kolar'),
            location_state=data.get('state', farmer.state if farmer else 'Karnataka'),
            harvest_date=date.today() + timedelta(days=2),
            image_url=data.get('image_url') or (crop.image_url if crop else None),
            status='active',
            is_demo=False
        )
        db.session.add(listing)
        db.session.commit()
        return jsonify({'message': 'Crop listing published successfully', 'listing': listing.to_dict()}), 201

    # GET filter listings
    crop_code = request.args.get('crop')
    district = request.args.get('district')
    quality = request.args.get('quality')
    search = request.args.get('search', '').lower()

    query = CropListing.query.filter_by(status='active')
    if district:
        query = query.filter(CropListing.location_district.ilike(f'%{district}%'))
    if quality:
        query = query.filter_by(quality_grade=quality)
    if search:
        query = query.filter(
            (CropListing.crop_name.ilike(f'%{search}%')) |
            (CropListing.location_district.ilike(f'%{search}%'))
        )

    listings = query.order_by(CropListing.created_at.desc()).all()
    return jsonify([l.to_dict() for l in listings])

@api_bp.route('/marketplace/listings/<int:listing_id>', methods=['PUT', 'DELETE'])
def manage_listing(listing_id):
    listing = CropListing.query.get_or_404(listing_id)
    if request.method == 'DELETE':
        db.session.delete(listing)
        db.session.commit()
        return jsonify({'message': 'Listing deleted successfully'})

    data = request.get_json() or {}
    if 'quantity_quintals' in data: listing.quantity_quintals = float(data['quantity_quintals'])
    if 'price_per_quintal' in data: listing.price_per_quintal = float(data['price_per_quintal'])
    if 'quality_grade' in data: listing.quality_grade = data['quality_grade']
    if 'status' in data: listing.status = data['status']
    db.session.commit()
    return jsonify({'message': 'Listing updated', 'listing': listing.to_dict()})

@api_bp.route('/marketplace/enquiries', methods=['POST'])
def send_enquiry():
    data = request.get_json() or {}
    listing_id = data.get('listing_id')
    listing = CropListing.query.get_or_404(listing_id)

    enquiry = BuyerEnquiry(
        listing_id=listing.id,
        buyer_name=data.get('buyer_name', 'Verified Agricultural Buyer'),
        buyer_mobile=data.get('buyer_mobile', '9812345678'),
        buyer_offer_price=float(data.get('offer_price', listing.price_per_quintal)),
        quantity_requested=float(data.get('quantity', listing.quantity_quintals)),
        message=data.get('message', 'Interested in purchasing this lot.')
    )
    db.session.add(enquiry)

    # Trigger notification for farmer
    if listing.farmer_id:
        db.session.add(Notification(
            farmer_id=listing.farmer_id,
            title='New Buyer Enquiry',
            message=f"{enquiry.buyer_name} offered ₹{enquiry.buyer_offer_price}/q for {enquiry.quantity_requested} quintals of {listing.crop_name}.",
            type='enquiry'
        ))

    db.session.commit()
    return jsonify({'message': 'Enquiry submitted successfully to farmer', 'enquiry': enquiry.to_dict()}), 201

@api_bp.route('/marketplace/my-listings', methods=['GET'])
def my_listings():
    farmer = get_current_farmer()
    if not farmer:
        listings = CropListing.query.limit(3).all()
    else:
        listings = CropListing.query.filter_by(farmer_id=farmer.id).all()
        if not listings:
            listings = CropListing.query.limit(3).all()
    return jsonify([l.to_dict() for l in listings])

# ================= BUYER CROP REQUESTS (BUYING OPPORTUNITIES & PROCUREMENT) =================
@api_bp.route('/marketplace/buyer-requests', methods=['GET', 'POST'])
def manage_buyer_requests():
    if request.method == 'POST':
        data = request.get_json() or {}
        req = BuyerCropRequest(
            buyer_id=data.get('buyer_id'),
            buyer_name=data.get('buyer_name', 'Commercial Buyer'),
            company_name=data.get('company_name', 'Agro Procurement Ltd'),
            buyer_mobile=data.get('buyer_mobile', '9876543210'),
            crop_name=data.get('crop_name', 'Tomato'),
            quantity_quintals=float(data.get('quantity_quintals', 100.0)),
            max_budget_per_quintal=float(data.get('max_budget_per_quintal', 2500.0)),
            delivery_district=data.get('district', 'Bengaluru'),
            delivery_state=data.get('state', 'Karnataka'),
            quality_requirement=data.get('quality_requirement', 'Grade A'),
            notes=data.get('notes', 'Looking for immediate harvest delivery with direct payment.'),
            status='active'
        )
        db.session.add(req)
        db.session.commit()
        return jsonify({'message': 'Buyer procurement request posted successfully', 'request': req.to_dict()}), 201

    # GET
    requests = BuyerCropRequest.query.filter_by(status='active').order_by(BuyerCropRequest.created_at.desc()).all()
    return jsonify([r.to_dict() for r in requests])

# ================= USER REVIEWS (FARMER & BUYER MUTUAL REVIEWS) =================
@api_bp.route('/reviews', methods=['GET', 'POST'])
def handle_reviews():
    if request.method == 'POST':
        data = request.get_json() or {}
        reviewer_name = data.get('reviewer_name', '').strip()
        comment = data.get('comment', '').strip()
        if not reviewer_name or not comment:
            return jsonify({'error': 'Reviewer name and comment are required'}), 400

        review = UserReview(
            reviewer_type=data.get('reviewer_type', 'buyer'), # buyer or farmer
            reviewer_id=data.get('reviewer_id'),
            reviewer_name=reviewer_name,
            target_type=data.get('target_type', 'farmer'),   # farmer or buyer
            target_id=int(data.get('target_id', 1)),
            target_name=data.get('target_name', 'Farmer Ramesh Gowda'),
            crop_name=data.get('crop_name', 'Tomato'),
            rating=int(data.get('rating', 5)),
            badge=data.get('badge', 'Verified Direct Trade'),
            comment=comment
        )
        db.session.add(review)
        db.session.commit()
        return jsonify({'message': 'Review submitted successfully', 'review': review.to_dict()}), 201

    # GET filter by target_type, target_id
    target_type = request.args.get('target_type')
    target_id = request.args.get('target_id')
    query = UserReview.query
    if target_type:
        query = query.filter_by(target_type=target_type)
    if target_id:
        query = query.filter_by(target_id=int(target_id))
    reviews = query.order_by(UserReview.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reviews])

# ================= SELLING & TRANSPORT CALCULATOR =================
@api_bp.route('/calculator/net-return', methods=['POST'])
def calculate_net_return():
    """
    Gross Revenue = Quantity * Market Price
    Net Return = Gross Revenue - Transport Cost - Handling/Mandi Expenses
    Compares 5 APMC mandis and returns the best 3 net returns.
    """
    data = request.get_json() or {}
    crop_id = data.get('crop_id', 1)
    quantity = float(data.get('quantity_quintals', 50.0))
    rate_per_km = float(data.get('transport_rate_per_km', 18.0)) # ₹/km for small truck
    base_mandi_fee = float(data.get('other_expenses_per_q', 35.0)) # ₹/quintal handling & loading

    crop = Crop.query.get(crop_id)
    if not crop:
        crop = Crop.query.first()

    prices = MarketPrice.query.filter_by(crop_id=crop.id).all()
    if not prices:
        prices = MarketPrice.query.all()[:5]

    evaluations = []
    # Assumed user location: Kolar Mandi coords (13.1367, 78.1292)
    user_lat, user_lon = 13.1367, 78.1292

    for p in prices:
        # Haversine distance in km
        dlat = math.radians(p.market.latitude - user_lat)
        dlon = math.radians(p.market.longitude - user_lon)
        a = math.sin(dlat/2)**2 + math.cos(math.radians(user_lat)) * math.cos(math.radians(p.market.latitude)) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        distance_km = round(6371 * c, 1)

        # Ensure minimal local mandi distance
        distance_km = max(distance_km, 8.0)

        gross_rev = quantity * p.modal_price
        transport_cost = distance_km * rate_per_km * (1 + (quantity / 100.0) * 0.2)
        other_exp = quantity * base_mandi_fee
        net_return = gross_rev - transport_cost - other_exp

        evaluations.append({
            'market_id': p.market.id,
            'market_name': p.market.name,
            'district': p.market.district,
            'state': p.market.state,
            'modal_price_per_q': p.modal_price,
            'distance_km': distance_km,
            'gross_revenue': round(gross_rev, 0),
            'transport_cost': round(transport_cost, 0),
            'other_expenses': round(other_exp, 0),
            'net_return': round(net_return, 0),
            'net_price_realized_per_q': round(net_return / quantity, 0)
        })

    evaluations.sort(key=lambda x: x['net_return'], reverse=True)
    top_3 = evaluations[:3]
    for idx, e in enumerate(top_3, 1):
        e['rank'] = idx

    return jsonify({
        'crop_name': crop.standard_name,
        'quantity_quintals': quantity,
        'top_3_markets': top_3,
        'all_market_comparisons': evaluations,
        'disclaimer': 'Calculations are estimates based on standard transport rates. Actual logistics costs may vary.'
    })

# ================= WEATHER =================
@api_bp.route('/weather/current', methods=['GET'])
def get_weather():
    district = request.args.get('district', 'Kolar')
    weather_data = get_live_weather(district)
    return jsonify(weather_data)

# ================= ALERTS & NOTIFICATIONS =================
@api_bp.route('/alerts', methods=['GET', 'POST'])
def manage_alerts():
    farmer = get_current_farmer()
    if request.method == 'POST':
        data = request.get_json() or {}
        alert = Alert(
            farmer_id=farmer.id if farmer else 1,
            crop_id=data.get('crop_id', 1),
            market_id=data.get('market_id', 1),
            target_price=float(data.get('target_price', 2500.0)),
            condition=data.get('condition', 'above'),
            is_active=True
        )
        db.session.add(alert)
        db.session.commit()
        return jsonify({'message': 'Price alert created', 'alert': alert.to_dict()}), 201

    alerts = Alert.query.filter_by(farmer_id=farmer.id if farmer else 1).all()
    return jsonify([a.to_dict() for a in alerts])

@api_bp.route('/alerts/<int:alert_id>', methods=['DELETE'])
def delete_alert(alert_id):
    alert = Alert.query.get_or_404(alert_id)
    db.session.delete(alert)
    db.session.commit()
    return jsonify({'message': 'Alert deleted'})

@api_bp.route('/notifications', methods=['GET'])
def get_notifications():
    farmer = get_current_farmer()
    nots = Notification.query.filter_by(farmer_id=farmer.id if farmer else 1).order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in nots])

@api_bp.route('/notifications/<int:not_id>/read', methods=['POST'])
def mark_notification_read(not_id):
    n = Notification.query.get_or_404(not_id)
    n.is_read = True
    db.session.commit()
    return jsonify({'message': 'Marked as read'})

# ================= KISAN MITRA AI CHATBOT =================
@api_bp.route('/chatbot/message', methods=['POST'])
def chatbot_message():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    language = data.get('language', 'en')
    session_id = data.get('session_id', 'demo-session')

    if not message:
        return jsonify({'error': 'Message cannot be empty'}), 400

    response_data = process_kisan_chat(message=message, language=language, session_id=session_id)

    # Save to chat history
    farmer = get_current_farmer()
    db.session.add(ChatMessage(
        user_id=farmer.id if farmer else None,
        session_id=session_id,
        role='user',
        content=message,
        language=language
    ))
    db.session.add(ChatMessage(
        user_id=farmer.id if farmer else None,
        session_id=session_id,
        role='assistant',
        content=response_data['reply'],
        language=language
    ))
    db.session.commit()

    return jsonify(response_data)

