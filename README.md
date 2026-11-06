# 🌾 Smart KRISHI (SmartAI Kisan)

> **Tagline:** Smart Farming. Better Prices. Higher Opportunities.  
> **Platform:** Full-stack Progressive Web App (PWA) + Mobile-First Responsive Web Application  
> **Target Audience:** Indian farmers, agricultural buyers, and APMC commission agents  
> **Development Team:** 4 beginner engineering students  

---

## 🚀 Live Access Link

Open your browser to:
- **Local Application URL:** [http://localhost:5000](http://localhost:5000) (Unified full-stack app) or [http://localhost:5173](http://localhost:5173) (Vite dev server)

---

## 🌟 Key Features

1. **Original Brand Logo:** SVG logo featuring Green sacred leaf, Golden crop spikelet, and AI circuit intelligence.
2. **23 Indian Languages:** Native support for English, Kannada (ಕನ್ನಡ), Hindi (हिन्दी), Telugu (తెలుగు), Tamil (தமிழ்), Malayalam (മലയാളം), Marathi (मराठी), Bengali (বাংলা), Gujarati, Punjabi, Odia, Assamese, Urdu, Sanskrit, etc.
3. **Easy Mode by Default:** Large readable typography, minimum 56px action touch targets, picture-based crop selection, and audio voice instructions.
4. **Today's Mandi Prices (Agmarknet Feeds):** Real-time daily modal, min, and max rates per quintal for Tomato, Onion, Paddy, Wheat, Cotton, Chilli, Potato, Soybean, etc.
5. **AI Price Forecasting (7d, 3m, 6m, 2yr):** Time-series regression & seasonal cycle wave models evaluated with MAE, RMSE, and confidence intervals.
6. **Soil Health Analysis:** Evaluates 7 soil types (Black, Red, Alluvial, Laterite, Sandy, Clay, Loamy), pH, and NPK nutrients; delivers Top 5 crop recommendations.
7. **Water Intelligence:** 2-year groundwater depth records, rainfall tracking, drought risk alerts, and low-water crop advisories.
8. **Crop Production & Demand:** Previous Year (2025) vs Current Year (2026) harvests with Excel-style cylinder column graphs.
9. **Zero-Commission Buy & Sell Marketplace:** Direct listings between farmers and registered buyers with purchase enquiry management.
10. **Selling & Transport Net Return Calculator:** Realizes `Net Return = Gross Revenue − Transport Cost − Mandi Expenses` to rank the top 3 most profitable markets within 150 km.
11. **Live Agricultural Weather (Open-Meteo):** Real-time temperature, humidity, wind, rainfall, and 7-day weather outlook.
12. **Multilingual Kisan Mitra AI Assistant:** Floating chatbot with text & voice TTS/STT, quick replies, and zero price fabrication.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, React Router 7, Recharts, Lucide Icons, React i18next, PWA Manifest.
- **Backend:** Python 3.14, Flask, Flask-SQLAlchemy, PyJWT, Werkzeug, Flask-CORS, requests, python-dotenv.
- **AI/ML:** NumPy, Pandas, Scikit-learn, SciPy, custom time-series regression forecaster.
- **Database:** SQLite (local development), PostgreSQL ready (production).
- **External Data:** Agmarknet / DMI schema, Open-Meteo Weather API, Central Ground Water Board (CGWB).

---

## 🏃 Quick Start Guide

### 1. Prerequisites
- Python 3.10+ (Installed at `C:\Users\HP\AppData\Local\Programs\Python\Python314\python.exe`)
- Node.js 18+ and npm (`npm.cmd`)

### 2. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python app.py
```
*Backend runs on `http://localhost:5000` with automated database seeding.*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173` with reverse proxy to backend.*

---

## 👥 Four-Member Team Task Division

| Member | Role | Key Responsibilities |
|---|---|---|
| **Member 1 (Lead & Full-Stack)** | Full-Stack & Architecture | REST API design, Flask routes, Vite proxy, state management, Docker/Render configuration. |
| **Member 2 (Frontend & UI/UX)** | React & Accessibility Designer | Mobile-first UI, Easy Mode, 56px action buttons, SVG logo, 23-language i18n setup. |
| **Member 3 (AI/ML & Data Analyst)** | AI/ML & Crop Specialist | Price forecasting algorithms, MAE/RMSE evaluation, Soil recommendation matrices, Water tables. |
| **Member 4 (QA & Integration)** | Tester & Data Integrator | Unit testing, Agmarknet seed datasets, Open-Meteo API, Web Speech TTS/STT testing. |

---

## ⏱️ 5-Minute Hackathon Demo Script

- **Minute 0:00 - 0:45 (The Problem):** "Indian farmers suffer up to 35% revenue loss due to opaque middleman pricing, seasonal crop gluts, and lack of localized water/soil intelligence. Smart KRISHI solves this with an accessible, multilingual AI platform."
- **Minute 0:45 - 1:30 (Mandi Prices & Easy Mode):** Open `http://localhost:5000`. Show Easy Mode, 23-language switching (e.g. Kannada/Hindi), tap 'Tomato' picture to see live modal rates across APMC mandis.
- **Minute 1:30 - 2:30 (AI Price Prediction & Soil Health):** Navigate to **Price Prediction**. Select Tomato for 3 months. Show the Excel-style cylinder graph, rising price trend, ±MAE accuracy, and best selling window. Then switch to **Soil Analysis**, run Black soil analysis, and highlight the Top 5 recommended crops.
- **Minute 2:30 - 3:30 (Water Intelligence & Selling Calculator):** Open **Water Intelligence** to show 2025 vs 2026 groundwater levels. Open **Selling Calculator** and enter 50 quintals: show how taking produce to Kolar vs Bangalore saves ₹12,000 in net cash after transport deduction.
- **Minute 3:30 - 4:15 (Kisan Mitra Voice AI):** Tap the floating **Kisan Mitra** button. Ask: "What is today's tomato price?" Show the audio reply in native language with quick reply pills.
- **Minute 4:15 - 5:00 (Impact & Vision):** "Zero commission, accessible in every village, and ready for deployment on Vercel and Render."

---

## 📊 Eight-Slide Presentation Outline

1. **Slide 1: Title Slide:** Smart KRISHI — Smart Farming. Better Prices. Higher Opportunities. Team Intro & Vision.
2. **Slide 2: The Core Farmer Challenges:** Volatile harvest prices, post-harvest distress selling, groundwater depletion, digital literacy barriers.
3. **Slide 3: Our Solution:** An intuitive PWA web platform combining Agmarknet price transparency, AI forecasting, and soil/water intelligence.
4. **Slide 4: Architecture & Tech Stack:** React 19 + Tailwind v4 frontend, Flask REST backend, SQLite/PostgreSQL, Scikit-learn ML engine.
5. **Slide 5: Farmer-First UI/UX & 23 Languages:** Minimum 56px action targets, picture-based crop selection, voice instruction TTS, and Easy Mode.
6. **Slide 6: Machine Learning Models:** Multi-horizon price predictor (7d, 3m, 6m, 2y) with MAE/RMSE accuracy and agronomic soil-NPK matching.
7. **Slide 7: Direct Marketplace & Profit Calculator:** Disintermediating the supply chain with zero-commission listings and net return route optimization.
8. **Slide 8: Roadmap & Scalability:** Offline-first syncing, WhatsApp bot integration, and multi-state APMC e-NAM integration.

---

## ⚠️ Known Limitations & Future Enhancements

1. **SMS Gateway:** Local development uses simulated instant demo OTP (`1234`). For production, integrate with MSG91 or Twilio SMS API.
2. **Offline Syncing:** Offline PWA caching is active for assets; background queue sync for offline listing creation is scheduled for v2.0.
3. **Satellite Imagery:** Water intelligence uses CGWB borehole records and IMD rainfall; Sentinel-2 satellite NDVI soil moisture can be integrated next.

