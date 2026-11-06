import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', native: 'اردو' },
  { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
  { code: 'ks', name: 'Kashmiri', native: 'کٲشُر' },
  { code: 'kok', name: 'Konkani', native: 'कोंकणी' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली' },
  { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
  { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন্' },
  { code: 'brx', name: 'Bodo', native: 'बड़ो' },
  { code: 'doi', name: 'Dogri', native: 'डोगरी' },
  { code: 'mai', name: 'Maithili', native: 'मैथिली' }
];

const en = {
  app_name: 'Smart KRISHI',
  tagline: 'Smart Farming. Better Prices. Higher Opportunities.',
  nav: {
    home: 'Home',
    dashboard: 'Dashboard',
    crop_prices: 'Crop Prices',
    price_prediction: 'Price Prediction',
    soil_analysis: 'Soil Analysis',
    crop_recommendations: 'Crop Recommendations',
    water_intelligence: 'Water Intelligence',
    crop_demand: 'Crop Demand',
    buy_crops: 'Buy Crops',
    sell_crops: 'Sell Crops',
    nearby_markets: 'Nearby Markets',
    selling_calculator: 'Selling Calculator',
    weather: 'Weather',
    notifications: 'Notifications',
    profile: 'Profile & Settings'
  },
  easy_mode: 'Easy Mode',
  listen: 'Listen',
  stop: 'Stop',
  search: 'Search...',
  disclaimer_prices: 'Predictions are estimates, not guaranteed prices.',
  get_started: 'Get Started Today',
  today_prices: "Today's Mandi Prices",
  view_all: 'View All'
};

const kn = {
  app_name: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ',
  tagline: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ. ಉತ್ತಮ ಬೆಲೆ. ಹೆಚ್ಚಿನ ಅವಕಾಶಗಳು.',
  nav: {
    home: 'ಮುಖಪುಟ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    crop_prices: 'ಬೆಳೆ ಬೆಲೆಗಳು',
    price_prediction: 'ಬೆಲೆ ಮುನ್ಸೂಚನೆ',
    soil_analysis: 'ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ',
    crop_recommendations: 'ಸೂಕ್ತ ಬೆಳೆಗಳು',
    water_intelligence: 'ನೀರಿನ ಮಾಹಿತಿ',
    crop_demand: 'ಬೆಳೆ ಬೇಡಿಕೆ',
    buy_crops: 'ಬೆಳೆ ಖರೀದಿ',
    sell_crops: 'ಬೆಳೆ ಮಾರಾಟ',
    nearby_markets: 'ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆಗಳು',
    selling_calculator: 'ಮಾರಾಟ ಲೆಕ್ಕಾಚಾರ',
    weather: 'ಹವಾಮಾನ',
    notifications: 'ಸೂಚನೆಗಳು',
    profile: 'ಪ್ರೊಫೈಲ್'
  },
  easy_mode: 'ಸರಳ ಮೋಡ್',
  listen: 'ಕೇಳಿ',
  stop: 'ನಿಲ್ಲಿಸಿ',
  search: 'ಹುಡುಕಿ...',
  disclaimer_prices: 'ಮುನ್ಸೂಚನೆಗಳು ಅಂದಾಜುಗಳು ಮಾತ್ರ, ಖಾತರಿಯ ಬೆಲೆಗಳಲ್ಲ.',
  get_started: 'ಈಗಲೇ ಪ್ರಾರಂಭಿಸಿ',
  today_prices: 'ಇಂದಿನ ಮಂಡಿ ದರಗಳು',
  view_all: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ'
};

const hi = {
  app_name: 'स्मार्ट कृषि',
  tagline: 'स्मार्ट खेती। बेहतर दाम। बेहतरीन अवसर।',
  nav: {
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    crop_prices: 'फसल भाव',
    price_prediction: 'मूल्य पूर्वानुमान',
    soil_analysis: 'मिट्टी विश्लेषण',
    crop_recommendations: 'फसल सिफारिशें',
    water_intelligence: 'जल सूचना',
    crop_demand: 'फसल मांग',
    buy_crops: 'फसल खरीदें',
    sell_crops: 'फसल बेचें',
    nearby_markets: 'नजदीकी मंडियां',
    selling_calculator: 'बिक्री कैलकुलेटर',
    weather: 'मौसम',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल'
  },
  easy_mode: 'आसान मोड',
  listen: 'सुनें',
  stop: 'रोकें',
  search: 'खोजें...',
  disclaimer_prices: 'पूर्वानुमान केवल अनुमान हैं, गारंटीकृत मूल्य नहीं।',
  get_started: 'शुरू करें',
  today_prices: 'आज के मंडी भाव',
  view_all: 'सभी देखें'
};

const te = {
  app_name: 'స్మార్ట్ కృషి',
  tagline: 'స్మార్ట్ వ్యవసాయం. మెరుగైన ధరలు. ఉన్నత అవకాశాలు.',
  nav: {
    home: 'హోమ్',
    dashboard: 'డ్యాష్‌బోర్డ్',
    crop_prices: 'పంట ధరలు',
    price_prediction: 'ధరల అంచనా',
    soil_analysis: 'నేల పరీక్ష',
    crop_recommendations: 'పంట సూచనలు',
    water_intelligence: 'నీటి సమాచారం',
    crop_demand: 'పంట డిమాండ్',
    buy_crops: 'పంటలు కొనండి',
    sell_crops: 'పంటలు అమ్మండి',
    nearby_markets: 'సమీప మార్కెట్లు',
    selling_calculator: 'అమ్మకాల కాలిక్యులేటర్',
    weather: 'వాతావరణం',
    notifications: 'నోటిఫికేషన్లు',
    profile: 'ప్రొఫైల్'
  },
  easy_mode: 'సులభ విధానం',
  listen: 'వినండి',
  stop: 'ఆపండి',
  search: 'వెతకండి...',
  disclaimer_prices: 'ధరల అంచనాలు కేవలం ముందస్తు సూచనలు మాత్రమే.',
  get_started: 'ప్రారంభించండి',
  today_prices: 'నేటి మార్కెట్ ధరలు',
  view_all: 'అన్నీ చూడండి'
};

const ta = {
  app_name: 'ஸ்மார்ட் கிருஷி',
  tagline: 'ஸ்மார்ட் விவசாயம். சிறந்த விலை. உயர்ந்த வாய்ப்புகள்.',
  nav: {
    home: 'முகப்பு',
    dashboard: 'டாஷ்போர்டு',
    crop_prices: 'பயிர் விலைகள்',
    price_prediction: 'விலை கணிப்பு',
    soil_analysis: 'மண் பரிசோதனை',
    crop_recommendations: 'பயிர் பரிந்துரைகள்',
    water_intelligence: 'நீர் தகவல்',
    crop_demand: 'பயிர் தேவை',
    buy_crops: 'பயிர் வாங்க',
    sell_crops: 'பயிர் விற்க',
    nearby_markets: 'அருகிலுள்ள சந்தைகள்',
    selling_calculator: 'விற்பனை கணக்கீடு',
    weather: 'வானிலை',
    notifications: 'அறிவிப்புகள்',
    profile: 'சுயவிவரம்'
  },
  easy_mode: 'எளிய பயன்முறை',
  listen: 'கேளுங்கள்',
  stop: 'நிறுத்துங்கள்',
  search: 'தேடுங்கள்...',
  disclaimer_prices: 'விலை கணிப்புகள் மதிப்பீடுகள் மட்டுமே.',
  get_started: 'தொடங்குங்கள்',
  today_prices: 'இன்றைய சந்தை விலைகள்',
  view_all: 'அனைத்தையும் காண்க'
};

// Generate fallbacks for all remaining 18 languages gracefully
const resources = { en: { translation: en }, kn: { translation: kn }, hi: { translation: hi }, te: { translation: te }, ta: { translation: ta } };

LANGUAGES.forEach(lang => {
  if (!resources[lang.code]) {
    resources[lang.code] = {
      translation: {
        ...en,
        tagline: `${lang.name}: Smart Farming. Better Prices. Higher Opportunities.`
      }
    };
  }
});

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

