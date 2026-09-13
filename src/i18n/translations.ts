export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  states: string[];
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    states: ['All India / Federal', 'Sikkim', 'Meghalaya', 'Nagaland', 'Goa'],
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    states: [
      'Uttarakhand',
      'Himachal Pradesh',
      'Jammu and Kashmir',
      'Ladakh',
      'Uttar Pradesh',
      'Madhya Pradesh',
      'Bihar',
      'Rajasthan',
      'Delhi',
      'Haryana',
      'Jharkhand',
      'Chhattisgarh',
    ],
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    states: ['Tamil Nadu', 'Puducherry'],
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    states: ['Andhra Pradesh', 'Telangana'],
  },
];

/**
 * Determine best matching language based on Indian State name
 */
export function getLanguageForState(stateName: string): SupportedLanguage {
  if (!stateName) return 'en';
  const s = stateName.toLowerCase().trim();

  // Tamil Nadu
  if (s.includes('tamil') || s.includes('puducherry') || s.includes('pondicherry') || s.includes('chennai') || s.includes('nilgiri')) {
    return 'ta';
  }

  // Andhra Pradesh / Telangana
  if (s.includes('andhra') || s.includes('telangana') || s.includes('araku') || s.includes('hyderabad') || s.includes('godavari') || s.includes('krishna')) {
    return 'te';
  }

  // Northern & Central Hindi belt states
  if (
    s.includes('uttarakhand') ||
    s.includes('himachal') ||
    s.includes('uttar pradesh') ||
    s.includes('madhya') ||
    s.includes('bihar') ||
    s.includes('rajasthan') ||
    s.includes('delhi') ||
    s.includes('jammu') ||
    s.includes('kashmir') ||
    s.includes('ladakh') ||
    s.includes('haryana') ||
    s.includes('jharkhand') ||
    s.includes('chhattisgarh')
  ) {
    return 'hi';
  }

  // Default to English for other regions (or user can switch anytime)
  return 'en';
}

export interface Translations {
  // Navigation
  nav_home: string;
  nav_search: string;
  nav_prediction: string;
  nav_map: string;
  nav_alerts: string;
  nav_weather: string;
  nav_shelters: string;
  nav_rescue: string;
  nav_analytics: string;
  nav_awareness: string;
  nav_contacts: string;
  nav_sos: string;
  nav_admin: string;

  // Language Bar
  lang_bar_label: string;
  lang_auto_state: string;
  lang_auto_active: string;
  lang_state_detected: string;
  lang_switch_hint: string;

  // Hero & Common
  hero_title_prefix: string;
  hero_title_highlight: string;
  hero_subtitle: string;
  hero_cta_predict: string;
  hero_cta_map: string;
  hero_cta_alerts: string;

  // Live Ticker
  live_advisory_label: string;
  live_advisory_text: string;
  view_all_alerts: string;

  // Siren
  test_siren: string;
  stop_siren: string;

  // Roles
  role_citizen: string;
  role_hydrologist: string;
  role_rescue: string;
  role_admin: string;
  switch_perspective: string;
  my_profile: string;
  logout: string;

  // Risk & Alerts
  risk_high: string;
  risk_medium: string;
  risk_low: string;
  danger_mark: string;
  water_level: string;
  evacuation_status: string;
  active_location: string;
  cloudburst_alert: string;

  // Actions
  action_run_simulation: string;
  action_open_map: string;
  action_view_shelters: string;
  action_deploy_teams: string;
  action_view_warnings: string;
  action_distress_beacon: string;
  action_helpline: string;

  // Metrics
  metric_rainfall: string;
  metric_soil_moisture: string;
  metric_slope: string;
  metric_river_stage: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en: {
    nav_home: 'Home',
    nav_search: 'Search India',
    nav_prediction: 'AI Predictor',
    nav_map: 'Risk Map',
    nav_alerts: 'Early Warnings',
    nav_weather: 'Rainfall & Radar',
    nav_shelters: 'Safe Shelters',
    nav_rescue: 'Rescue Team',
    nav_analytics: 'Analytics',
    nav_awareness: 'Disaster Guide',
    nav_contacts: 'Helpline',
    nav_sos: 'SOS DISTRESS',
    nav_admin: 'Admin IoT Center',

    lang_bar_label: 'Language / மொழி / भाषा / భాష:',
    lang_auto_state: 'Auto (State-based)',
    lang_auto_active: 'Auto-adapted for state',
    lang_state_detected: 'State Detected',
    lang_switch_hint: 'Switch language anytime using the language bar',

    hero_title_prefix: 'Sentinel Flash Flood',
    hero_title_highlight: 'Early Warning Network',
    hero_subtitle:
      'AI-powered hydrologic intelligence, real-time IoT sensors, and emergency response for mountainous terrains across India.',
    hero_cta_predict: 'Run AI Flood Simulator',
    hero_cta_map: 'Live GIS Risk Map',
    hero_cta_alerts: 'Early Warnings',

    live_advisory_label: 'LIVE CRITICAL ADVISORY:',
    live_advisory_text:
      'Multi-source precipitation & slope saturation triggers ACTIVE across mountain river basins.',
    view_all_alerts: 'View All',

    test_siren: 'Test Siren',
    stop_siren: 'Stop Siren',

    role_citizen: 'Citizen Resident',
    role_hydrologist: 'Field Hydrologist',
    role_rescue: 'NDRF Rescue Unit',
    role_admin: 'Disaster Admin',
    switch_perspective: 'Switch Perspective',
    my_profile: 'My Safety Profile',
    logout: 'Log Out',

    risk_high: 'High Flood Risk',
    risk_medium: 'Medium Risk',
    risk_low: 'Low Risk / Stable',
    danger_mark: 'Danger Mark',
    water_level: 'River Stage',
    evacuation_status: 'Evacuation',
    active_location: 'Active Location',
    cloudburst_alert: 'Cloudburst Warning Triggered',

    action_run_simulation: 'Run AI Simulation',
    action_open_map: 'Open Interactive Map',
    action_view_shelters: 'Find Safe Shelters',
    action_deploy_teams: 'View Rescue Units',
    action_view_warnings: 'View Warnings',
    action_distress_beacon: 'Send SOS Distress',
    action_helpline: 'Emergency Helplines',

    metric_rainfall: 'IMD Rainfall Rate',
    metric_soil_moisture: 'NASA SMAP Soil Moisture',
    metric_slope: 'Terrain Slope Incline',
    metric_river_stage: 'River Water Level',
  },

  hi: {
    nav_home: 'मुख्य पृष्ठ',
    nav_search: 'स्थान खोजें',
    nav_prediction: 'एआई बाढ़ पूर्वानुमान',
    nav_map: 'जोखिम मानचित्र',
    nav_alerts: 'पूर्व चेतावनियाँ',
    nav_weather: 'वर्षा एवं राडार',
    nav_shelters: 'सुरक्षित आश्रय',
    nav_rescue: 'बचाव दल (NDRF)',
    nav_analytics: 'डेटा विश्लेषण',
    nav_awareness: 'आपदा नियमावली',
    nav_contacts: 'हेल्पलाइन',
    nav_sos: 'एसओएस आपातकाल',
    nav_admin: 'एडमिन नियंत्रण केंद्र',

    lang_bar_label: 'भाषा / Language:',
    lang_auto_state: 'स्वतः (राज्य अनुसार)',
    lang_auto_active: 'राज्य अनुसार चयनित भाषा',
    lang_state_detected: 'पहचाना गया राज्य',
    lang_switch_hint: 'भाषा बदलने के लिए ऊपर दी गई भाषा पट्टी का उपयोग करें',

    hero_title_prefix: 'सेंटिनल फ्लैश फ्लड',
    hero_title_highlight: 'पूर्व चेतावनी नेटवर्क',
    hero_subtitle:
      'भारत के पहाड़ी क्षेत्रों के लिए कृत्रिम बुद्धिमत्ता (AI) आधारित जलवैज्ञानिक निगरानी, रियल-टाइम आईओटी सेंसर और त्वरित आपदा प्रबंधन।',
    hero_cta_predict: 'एआई बाढ़ सिमुलेटर चलाएं',
    hero_cta_map: 'लाइव जीआईएस जोखिम मानचित्र',
    hero_cta_alerts: 'पूर्व चेतावनियाँ देखें',

    live_advisory_label: 'लाइव गंभीर चेतावनी:',
    live_advisory_text:
      'पर्वतीय नदी घाटियों में अत्यधिक वर्षा और ढलान पर मिट्टी संतृप्ति के कारण चेतावनी जारी।',
    view_all_alerts: 'सभी देखें',

    test_siren: 'सायरन परीक्षण',
    stop_siren: 'सायरन बंद करें',

    role_citizen: 'नागरिक / निवासी',
    role_hydrologist: 'फील्ड हाइड्रोलॉजिस्ट',
    role_rescue: 'एनडीआरएफ बचाव दल',
    role_admin: 'आपदा प्रशासक',
    switch_perspective: 'भूमिका बदलें',
    my_profile: 'मेरी सुरक्षा प्रोफ़ाइल',
    logout: 'लॉग आउट',

    risk_high: 'उच्च बाढ़ जोखिम',
    risk_medium: 'मध्यम जोखिम',
    risk_low: 'सुरक्षित / स्थिर',
    danger_mark: 'खतरे का निशान',
    water_level: 'नदी जल स्तर',
    evacuation_status: 'निकासी स्थिति',
    active_location: 'सक्रिय स्थान',
    cloudburst_alert: 'बादल फटने की चेतावनी सक्रिय',

    action_run_simulation: 'एआई सिमुलेशन चलाएं',
    action_open_map: 'जोखिम मानचित्र खोलें',
    action_view_shelters: 'सुरक्षित आश्रय स्थल खोजें',
    action_deploy_teams: 'बचाव दल देखें',
    action_view_warnings: 'चेतावनियाँ देखें',
    action_distress_beacon: 'एसओएस संदेश भेजें',
    action_helpline: 'आपातकालीन हेल्पलाइन',

    metric_rainfall: 'आईएमडी वर्षा दर',
    metric_soil_moisture: 'मृदा नमी (SMAP)',
    metric_slope: 'पहाड़ी ढलान',
    metric_river_stage: 'नदी जल स्तर',
  },

  ta: {
    nav_home: 'முகப்பு',
    nav_search: 'இடங்கள் தேடல்',
    nav_prediction: 'AI வெள்ள முன்னறிவிப்பு',
    nav_map: 'இடர் வரைபடம்',
    nav_alerts: 'எச்சரிக்கைகள்',
    nav_weather: 'மழை & ரேடார்',
    nav_shelters: 'பாதுகாப்பான புகலிடம்',
    nav_rescue: 'மீட்புக் குழு (NDRF)',
    nav_analytics: 'பகுப்பாய்வு',
    nav_awareness: 'பேரிடர் வழிகாட்டி',
    nav_contacts: 'உதவி எண்கள்',
    nav_sos: 'SOS அவசர உதவி',
    nav_admin: 'நிர்வாக மையம்',

    lang_bar_label: 'மொழி / Language:',
    lang_auto_state: 'தானியங்கி (மாநிலம் வாரியாக)',
    lang_auto_active: 'மாநிலத்தின் அடிப்படையில் தமிழ் தேர்வு செய்யப்பட்டது',
    lang_state_detected: 'கண்டறியப்பட்ட மாநிலம்',
    lang_switch_hint: 'விரும்பிய மொழியை மாற்ற மேலே உள்ள மொழிப் பட்டியைப் பயன்படுத்தவும்',

    hero_title_prefix: 'சென்டினல் திடீர் வெள்ளப்பெருக்கு',
    hero_title_highlight: 'முன் எச்சரிக்கை கட்டமைப்பு',
    hero_subtitle:
      'தமிழ்நாடு மற்றும் மலைப்பகுதிகளுக்கான AI அடிப்படையிலான நீரியல் முன்கணிப்பு, நிகழ்நேர IoT சென்சார்கள் மற்றும் பேரிடர் மீட்பு மேலாண்மை.',
    hero_cta_predict: 'AI வெள்ள உருவகப்படுத்துதல்',
    hero_cta_map: 'நேரலை இடர் வரைபடம்',
    hero_cta_alerts: 'எச்சரிக்கைகளைக் காண்க',

    live_advisory_label: 'முக்கிய அவசர எச்சரிக்கை:',
    live_advisory_text:
      'மலைப்பகுதி ஆற்றுப் படுகைகளில் அதிதீவிர மழையால் வெள்ள அபாயம் தீவிரமாக கண்காணிக்கப்படுகிறது.',
    view_all_alerts: 'அனைத்தையும் காண்க',

    test_siren: 'சைரன் சோதனை',
    stop_siren: 'சைரனை நிறுத்து',

    role_citizen: 'குடிமகன் / குடியிருப்புவாசி',
    role_hydrologist: 'நீரியல் ஆய்வாளர்',
    role_rescue: 'மீட்புப் படை (NDRF)',
    role_admin: 'பேரிடர் நிர்வாகி',
    switch_perspective: 'பார்வையை மாற்றுக',
    my_profile: 'எனது பாதுகாப்பு சுயவிவரம்',
    logout: 'வெளியேறு',

    risk_high: 'அதிதீவிர வெள்ள அபாயம்',
    risk_medium: 'நடுத்தர அபாயம்',
    risk_low: 'பாதுகாப்பானது / இயல்பு',
    danger_mark: 'அபாய அளவு',
    water_level: 'ஆற்று நீர் மட்டம்',
    evacuation_status: 'வெளியேற்ற நிலை',
    active_location: 'செயலில் உள்ள இடம்',
    cloudburst_alert: 'மேகவெடிப்பு எச்சரிக்கை விடுக்கப்பட்டது',

    action_run_simulation: 'AI உருவகப்படுத்துதல் இயக்கு',
    action_open_map: 'வரைபடத்தைத் திறக்கவும்',
    action_view_shelters: 'புகலிடங்களைக் கண்டறியவும்',
    action_deploy_teams: 'மீட்புக் குழுக்களைப் பார்க்கவும்',
    action_view_warnings: 'எச்சரிக்கைகளைப் பார்க்கவும்',
    action_distress_beacon: 'SOS அவசர உதவி கோருக',
    action_helpline: 'அவசர உதவி எண்கள்',

    metric_rainfall: 'IMD மழைப்பொழிவு விகிதம்',
    metric_soil_moisture: 'மண் ஈரப்பதம் (SMAP)',
    metric_slope: 'நிலச்சரிவு சாய்வு',
    metric_river_stage: 'ஆற்று நீர் மட்டம்',
  },

  te: {
    nav_home: 'హోమ్',
    nav_search: 'ప్రాంత శోధన',
    nav_prediction: 'AI వరద అంచనా',
    nav_map: 'ప్రమాద పటం',
    nav_alerts: 'ముందస్తు హెచ్చరికలు',
    nav_weather: 'వర్షపాతం & రాడార్',
    nav_shelters: 'సురక్షిత ఆశ్రయాలు',
    nav_rescue: 'రెస్క్యూ బృందం (NDRF)',
    nav_analytics: 'విశ్లేషణలు',
    nav_awareness: 'విపత్తు మార్గదర్శి',
    nav_contacts: 'హెల్ప్‌లైన్',
    nav_sos: 'SOS అత్యవసర సహాయం',
    nav_admin: 'అడ్మిన్ నియంత్రణ కేంద్రం',

    lang_bar_label: 'భాష / Language:',
    lang_auto_state: 'స్వయంచాలక (రాష్ట్రం ప్రకారం)',
    lang_auto_active: 'రాష్ట్రం ఆధారంగా తెలుగు ఎంపిక చేయబడింది',
    lang_state_detected: 'గుర్తించబడిన రాష్ట్రం',
    lang_switch_hint: 'భాషను మార్చడానికి పై భాషా పట్టీని ఉపయోగించండి',

    hero_title_prefix: 'సెంటినెల్ ఆకస్మిక వరద',
    hero_title_highlight: 'ముందస్తు హెచ్చరిక నెట్‌వర్క్',
    hero_subtitle:
      'ఆంధ్రప్రదేశ్, తెలంగాణ మరియు భారతదేశ పర్వత ప్రాంతాలకు AI ఆధారిత హైడ్రోలాజికల్ ఇంటెలిజెన్స్, రియల్-టైమ్ IoT సెన్సార్లు మరియు అత్యవసర సహాయం.',
    hero_cta_predict: 'AI వరద సిమ్యులేటర్‌ను ప్రారంభించండి',
    hero_cta_map: 'ప్రత్యక్ష GIS ప్రమాద పటం',
    hero_cta_alerts: 'హెచ్చరికలను వీక్షించండి',

    live_advisory_label: 'లైవ్ అత్యవసర హెచ్చరిక:',
    live_advisory_text:
      'పర్వత నదీ పరీవాహక ప్రాంతాలలో కురుస్తున్న భారీ వర్షాలకు నీటిమట్టం పెరుగుతోంది. అప్రమత్తంగా ఉండండి.',
    view_all_alerts: 'అన్నీ చూడండి',

    test_siren: 'సైరన్ పరీక్ష',
    stop_siren: 'సైరన్ ఆపండి',

    role_citizen: 'పౌరుడు / నివాసి',
    role_hydrologist: 'ఫీల్డ్ హైడ్రాలజిస్ట్',
    role_rescue: 'NDRF రెస్క్యూ యూనిట్',
    role_admin: 'విపత్తు నిర్వాహకుడు',
    switch_perspective: 'పాత్రను మార్చండి',
    my_profile: 'నా భద్రతా ప్రొఫైల్',
    logout: 'లాగ్ అవుట్',

    risk_high: 'అత్యధిక వరద ప్రమాదం',
    risk_medium: 'మధ్యస్థ ప్రమాదం',
    risk_low: 'సురక్షితం / సాధారణం',
    danger_mark: 'ప్రమాద గుర్తు',
    water_level: 'నది నీటి మట్టం',
    evacuation_status: 'తరలింపు స్థితి',
    active_location: 'యాక్టివ్ ప్రాంతం',
    cloudburst_alert: 'క్లౌడ్‌బర్స్ట్ హెచ్చరిక సక్రియం చేయబడింది',

    action_run_simulation: 'AI సిమ్యులేషన్‌ను అమలు చేయండి',
    action_open_map: 'ప్రమాద పటాన్ని తెరవండి',
    action_view_shelters: 'సురక్షిత ఆశ్రయాలను కనుగొనండి',
    action_deploy_teams: 'రెస్క్యూ బృందాలను వీక్షించండి',
    action_view_warnings: 'హెచ్చరికలను చూడండి',
    action_distress_beacon: 'SOS సందేశాన్ని పంపండి',
    action_helpline: 'అత్యవసర హెల్ప్‌లైన్లు',

    metric_rainfall: 'IMD వర్షపాతం రేటు',
    metric_soil_moisture: 'నేల తేమ (SMAP)',
    metric_slope: 'పర్వత వాలు కోణం',
    metric_river_stage: 'నది నీటి మట్టం',
  },
};
