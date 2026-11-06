import os
import sys
import unittest
import json

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models.models import db, Crop, Farmer

class SmartKrishiApiTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        os.environ['DATABASE_URL'] = 'sqlite:///:memory:'
        cls.app = create_app()
        cls.client = cls.app.test_client()

    def test_1_health(self):
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data.get('status'), 'healthy')

    def test_2_crops_endpoint(self):
        res = self.client.get('/api/crops')
        self.assertEqual(res.status_code, 200)
        crops = res.get_json()
        self.assertGreaterEqual(len(crops), 10)
        self.assertTrue(any(c['code'] == 'tomato' for c in crops))

    def test_3_today_prices(self):
        res = self.client.get('/api/prices/today?crop=tomato')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('prices', data)
        self.assertGreater(len(data['prices']), 0)
        self.assertIn('modal_price', data['prices'][0])

    def test_4_price_prediction(self):
        res = self.client.get('/api/prediction/price?crop_code=tomato&period=3m')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertTrue(data.get('sufficient_data'))
        self.assertIn('predicted_average', data)
        self.assertIn('disclaimer', data)

    def test_5_soil_analysis(self):
        payload = {
            'soil_type': 'Black',
            'ph': 7.0,
            'nitrogen': 120,
            'phosphorus': 60,
            'potassium': 50,
            'moisture': 50,
            'water_availability': 'Borewell'
        }
        res = self.client.post('/api/soil/analyze', json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(len(data.get('top_recommendations', [])), 5)

    def test_6_water_intelligence(self):
        res = self.client.get('/api/water/intelligence?district=Kolar')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('current_groundwater_level_mbgl', data)
        self.assertGreater(len(data.get('predictions', [])), 0)

    def test_7_selling_calculator(self):
        payload = {
            'crop_id': 1,
            'quantity_quintals': 100,
            'transport_rate_per_km': 15,
            'other_expenses_per_q': 30
        }
        res = self.client.post('/api/calculator/net-return', json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(len(data.get('top_3_markets', [])), 3)
        self.assertIn('net_return', data['top_3_markets'][0])

    def test_8_chatbot_reply(self):
        payload = {
            'message': 'What is the price of tomato today?',
            'language': 'en'
        }
        res = self.client.post('/api/chatbot/message', json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn('reply', data)
        self.assertIn('Tomato', data['reply'])

if __name__ == '__main__':
    unittest.main()

