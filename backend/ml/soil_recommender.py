"""
Smart KRISHI Soil Analysis & Crop Recommendation Engine
Evaluates:
- 7 Soil Types: Black, Red, Alluvial, Laterite, Sandy, Clay, Loamy
- Soil pH (Acidic 4.5 to Alkaline 9.0)
- Nitrogen (N), Phosphorus (P), Potassium (K) kg/ha
- Soil Moisture (%) and Texture
- Location and Water Availability
Matches against crop database and outputs Top 5 recommendations with suitability scores and clear agronomic explanations.
"""

from models.models import Crop

SOIL_PREFERENCES = {
    'Black': ['cotton', 'soybean', 'chilli', 'gram', 'tur', 'sugarcane', 'wheat'],
    'Red': ['tomato', 'groundnut', 'maize', 'tur', 'chilli', 'banana', 'mango'],
    'Alluvial': ['wheat', 'paddy', 'sugarcane', 'potato', 'mustard', 'maize', 'onion'],
    'Laterite': ['groundnut', 'mango', 'gram', 'tur', 'maize'],
    'Sandy': ['groundnut', 'potato', 'mustard', 'tomato'],
    'Clay': ['paddy', 'wheat', 'sugarcane', 'cotton'],
    'Loamy': ['tomato', 'onion', 'wheat', 'potato', 'soybean', 'maize', 'mustard']
}

def analyze_soil_and_recommend(soil_type, ph, nitrogen, phosphorus, potassium, moisture=45.0, water_avail='Borewell'):
    """
    Computes suitability score (0-100) for all crops and returns top 5.
    """
    crops = Crop.query.all()
    results = []

    preferred_crops_for_soil = SOIL_PREFERENCES.get(soil_type, [])

    for c in crops:
        score = 60.0 # base score

        # 1. Soil Type Match (weight 30)
        c_soils = [s.strip().lower() for s in c.soil_types.split(',')]
        if soil_type.lower() in c_soils or c.code in preferred_crops_for_soil:
            score += 25.0
        else:
            score -= 10.0

        # 2. pH Match (weight 25)
        if c.ph_min <= ph <= c.ph_max:
            score += 20.0
        elif abs(ph - c.ph_min) <= 0.8 or abs(ph - c.ph_max) <= 0.8:
            score += 10.0
        else:
            score -= 15.0

        # 3. NPK Nutrient Match (weight 25)
        # Ratio comparisons
        n_ratio = min(nitrogen / max(c.n_req, 1.0), 1.5)
        p_ratio = min(phosphorus / max(c.p_req, 1.0), 1.5)
        k_ratio = min(potassium / max(c.k_req, 1.0), 1.5)
        nutrient_match = ((n_ratio + p_ratio + k_ratio) / 3.0) * 20.0
        score += min(nutrient_match, 20.0)

        # 4. Water match (weight 20)
        if water_avail in ['Canal', 'River', 'High'] and c.water_need == 'High':
            score += 15.0
        elif water_avail in ['Rainfed', 'Low'] and c.water_need == 'Low':
            score += 15.0
        elif water_avail in ['Borewell', 'Medium'] and c.water_need in ['Medium', 'Low']:
            score += 12.0
        elif water_avail in ['Rainfed', 'Low'] and c.water_need == 'High':
            score -= 20.0

        score = max(35.0, min(98.5, score))

        # Explain why
        reasons = []
        if soil_type.lower() in c_soils:
            reasons.append(f"{soil_type} soil provides ideal root aeration and drainage for {c.standard_name}.")
        if c.ph_min <= ph <= c.ph_max:
            reasons.append(f"Soil pH ({ph}) matches required range ({c.ph_min}-{c.ph_max}).")
        if c.water_need == 'Low' and water_avail == 'Rainfed':
            reasons.append("Low water requirement makes it drought resilient.")

        if not reasons:
            reasons.append(f"Moderate adaptability under standard nutrient and irrigation management.")

        results.append({
            'crop_id': c.id,
            'crop_name': c.standard_name,
            'crop_code': c.code,
            'category': c.category,
            'image_url': c.image_url,
            'suitability_score': round(score, 1),
            'growing_season': c.season,
            'water_requirement': c.water_need,
            'growing_duration': f"{c.growing_days} days",
            'suitable_temperature': f"{c.temp_min}-{c.temp_max}°C",
            'cultivation_guidance': f"Apply balanced NPK fertilizers. Maintain recommended weed control during first {c.growing_days // 3} days.",
            'reason': " ".join(reasons)
        })

    # Sort descending by suitability score
    results.sort(key=lambda x: x['suitability_score'], reverse=True)
    top_5 = results[:5]
    for idx, item in enumerate(top_5, 1):
        item['rank'] = idx

    return top_5

