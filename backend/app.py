"""
Smart KRISHI (SmartAI Kisan) Flask Backend Application
Main entry point for REST API server.
"""

import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

from models.models import db
from database.seed_data import seed_database
from routes.api import api_bp

def create_app():
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))
    app = Flask(__name__, static_folder=dist_dir if os.path.exists(dist_dir) else None)

    # Configuration
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'smart-krishi-secret-jwt-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///smart_krishi.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Enable CORS for all frontend origins
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize Database
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')

    @app.route('/api/health')
    def health():
        return jsonify({'status': 'healthy', 'database': 'connected'})

    # Serve React Frontend Build if dist exists
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        if path.startswith('api'):
            return jsonify({'error': 'Not Found'}), 404
        if os.path.exists(dist_dir) and path and os.path.exists(os.path.join(dist_dir, path)):
            return send_from_directory(dist_dir, path)
        if os.path.exists(dist_dir) and os.path.exists(os.path.join(dist_dir, 'index.html')):
            return send_from_directory(dist_dir, 'index.html')
        return jsonify({
            'application': 'Smart KRISHI API',
            'status': 'online',
            'version': '1.0.0',
            'tagline': 'Smart Farming. Better Prices. Higher Opportunities.',
            'docs': '/api'
        })

    # Auto-seed database within app context
    with app.app_context():
        db.create_all()
        try:
            seed_database()
        except Exception as e:
            print(f"Database seed note: {e}")

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    print(f"🌾 Smart KRISHI Backend starting on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)
