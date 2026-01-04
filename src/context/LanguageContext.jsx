import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

/* ================= TRANSLATIONS ================= */
const translations = {
  en: {
    appName: "DhartiSetu",
    tagline: "AI-Powered Agricultural Intelligence",
    loading: "Loading...",
    submit: "Submit",
    analyze: "Analyze",
    predict: "Predict",
    calculate: "Calculate",
    detect: "Detect",
    upload: "Upload",
    capture: "Capture",
    retry: "Retry",
    back: "Back",
    home: "Home",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",

    nav: {
      home: "Home",
      dashboard: "Dashboard",
      features: "Features",
      about: "About",
      contact: "Contact"
    },

    landing: {
      heroTitle: "Smart Farming Starts Here",
      heroSubtitle: "AI-powered insights for better crop decisions, disease detection, and yield prediction",
      getStarted: "Get Started",
      learnMore: "Learn More",
      features: "Features",
      whyChoose: "Why Choose DhartiSetu?"
    },

    dashboard: {
      title: "Dashboard",
      subtitle: "Select a feature to get started"
    },

    features: {
      cropRecommend: {
        title: "Crop Recommendation",
        desc: "Enter soil and climate data to get crop suggestions",
        result: "Recommended Crop"
      },
      rainfall: {
        title: "Rainfall Prediction",
        desc: "Predict rainfall for your region",
        result: "Predicted Rainfall"
      },
      flood: {
        title: "Flood Risk Prediction",
        desc: "Assess flood risk for your location",
        result: "Flood Risk Level"
      },
      storm: {
        title: "Storm Prediction",
        desc: "Predict storm risk using weather data",
        result: "Storm Risk Level"
      }
    },

    explanation: {
      why: "Why This Result?",
      factors: "Key Factors",
      prevention: "Prevention Tips",
      nextSteps: "What To Do Next"
    },

    errors: {
      generic: "Something went wrong. Please try again."
    },

    months: {
      1: "January", 2: "February", 3: "March", 4: "April",
      5: "May", 6: "June", 7: "July", 8: "August",
      9: "September", 10: "October", 11: "November", 12: "December"
    }
  },

  hi: {
    appName: "धरतीसेतु",
    tagline: "AI-संचालित कृषि बुद्धिमत्ता",
    loading: "लोड हो रहा है...",
    submit: "जमा करें",
    analyze: "विश्लेषण करें",
    predict: "भविष्यवाणी करें",
    calculate: "गणना करें",
    detect: "पता लगाएं",
    upload: "अपलोड करें",
    capture: "कैप्चर करें",
    retry: "पुनः प्रयास करें",
    back: "वापस",
    home: "होम",
    cancel: "रद्द करें",
    save: "सहेजें",
    close: "बंद करें",
    error: "त्रुटि",
    success: "सफलता",
    warning: "चेतावनी",
    info: "जानकारी",

    nav: {
      home: "होम",
      dashboard: "डैशबोर्ड",
      features: "सुविधाएं",
      about: "हमारे बारे में",
      contact: "संपर्क करें"
    },

    features: {
      cropRecommend: {
        title: "फसल अनुशंसा",
        desc: "फसल सुझाव प्राप्त करें",
        result: "अनुशंसित फसल"
      },
      rainfall: {
        title: "वर्षा भविष्यवाणी",
        desc: "अपने क्षेत्र के लिए वर्षा की भविष्यवाणी करें",
        result: "अनुमानित वर्षा"
      },
      flood: {
        title: "बाढ़ जोखिम",
        desc: "बाढ़ जोखिम का आकलन करें",
        result: "बाढ़ जोखिम स्तर"
      },
      storm: {
        title: "तूफान जोखिम",
        desc: "तूफान जोखिम की भविष्यवाणी",
        result: "तूफान जोखिम स्तर"
      }
    },

    explanation: {
      why: "यह परिणाम क्यों?",
      factors: "मुख्य कारक",
      prevention: "रोकथाम युक्तियां",
      nextSteps: "आगे क्या करें"
    },

    months: {
      1: "जनवरी", 2: "फरवरी", 3: "मार्च", 4: "अप्रैल",
      5: "मई", 6: "जून", 7: "जुलाई", 8: "अगस्त",
      9: "सितंबर", 10: "अक्टूबर", 11: "नवंबर", 12: "दिसंबर"
    }
  },

  gu: {
    appName: "ધરતીસેતુ",
    tagline: "AI આધારિત કૃષિ બુદ્ધિમત્તા",
    loading: "લોડ થઈ રહ્યું છે...",
    submit: "જમા કરો",
    analyze: "વિશ્લેષણ કરો",
    predict: "અનુમાન કરો",
    calculate: "ગણતરી કરો",
    detect: "શોધો",
    upload: "અપલોડ કરો",
    capture: "કૅપ્ચર કરો",
    retry: "ફરી પ્રયાસ કરો",
    back: "પાછા",
    home: "હોમ",
    cancel: "રદ કરો",
    save: "સાચવો",
    close: "બંધ કરો",
    error: "ભૂલ",
    success: "સફળતા",
    warning: "ચેતવણી",
    info: "માહિતી",

    nav: {
      home: "હોમ",
      dashboard: "ડેશબોર્ડ",
      features: "સુવિધાઓ",
      about: "વિશે",
      contact: "સંપર્ક"
    },

    features: {
      cropRecommend: {
        title: "પાક ભલામણ",
        desc: "શ્રેષ્ઠ પાક માટે ભલામણ મેળવો",
        result: "ભલામણ કરેલ પાક"
      },
      rainfall: {
        title: "વર્ષા અનુમાન",
        desc: "તમારા વિસ્તાર માટે વર્ષાનું અનુમાન",
        result: "અનુમાનિત વર્ષા"
      },
      flood: {
        title: "પૂર જોખમ",
        desc: "પૂર જોખમનું મૂલ્યાંકન",
        result: "પૂર જોખમ સ્તર"
      },
      storm: {
        title: "તોફાન જોખમ",
        desc: "તોફાન જોખમનું અનુમાન",
        result: "તોફાન જોખમ સ્તર"
      }
    },

    explanation: {
      why: "આ પરિણામ કેમ?",
      factors: "મુખ્ય પરિબળો",
      prevention: "રોકથામ સૂચનો",
      nextSteps: "આગળ શું કરવું"
    },

    months: {
      1: "જાન્યુઆરી", 2: "ફેબ્રુઆરી", 3: "માર્ચ", 4: "એપ્રિલ",
      5: "મે", 6: "જૂન", 7: "જુલાઈ", 8: "ઓગસ્ટ",
      9: "સપ્ટેમ્બર", 10: "ઓક્ટોબર", 11: "નવેમ્બર", 12: "ડિસેમ્બર"
    }
  },
  
  gu: {
    // Common
    appName: "ધરતીસેતુ",
    tagline: "AI આધારિત કૃષિ બુદ્ધિમત્તા",
    loading: "લોડ થઈ રહ્યું છે...",
    submit: "જમા કરો",
    analyze: "વિશ્લેષણ કરો",
    predict: "અનુમાન કરો",
    calculate: "ગણતરી કરો",
    detect: "શોધો",
    upload: "અપલોડ કરો",
    capture: "કૅપ્ચર કરો",
    retry: "ફરી પ્રયાસ કરો",
    back: "પાછા",
    home: "હોમ",
    cancel: "રદ કરો",
    save: "સાચવો",
    close: "બંધ કરો",
    error: "ભૂલ",
    success: "સફળતા",
    warning: "ચેતવણી",
    info: "માહિતી",

    // Navigation
    nav: {
      home: "હોમ",
      dashboard: "ડેશબોર્ડ",
      features: "સુવિધાઓ",
      about: "વિશે",
      contact: "સંપર્ક"
    },

    // Landing Page
    landing: {
      heroTitle: "સ્માર્ટ ખેતી અહીંથી શરૂ થાય છે",
      heroSubtitle: "ઉત્તમ પાક નિર્ણય, રોગ ઓળખ અને ઉપજ અનુમાન માટે AI આધારિત માહિતી",
      getStarted: "શરૂ કરો",
      learnMore: "વધુ જાણો",
      features: "સુવિધાઓ",
      whyChoose: "ધરતીસેતુ કેમ પસંદ કરો?",
      feature1Title: "પાક રોગ ઓળખ",
      feature1Desc: "AI વડે તરત જ પાકના રોગ ઓળખો",
      feature2Title: "પાક ભલામણ",
      feature2Desc: "માટી અને હવામાન મુજબ યોગ્ય પાક પસંદ કરો",
      feature3Title: "મોસમ અને જોખમ વિશ્લેષણ",
      feature3Desc: "પૂર, તોફાન અને વરસાદની આગાહી",
      feature4Title: "ઉપજ અને નફાની આગાહી",
      feature4Desc: "વાવેતર પહેલાં ઉપજ અને નફાનો અંદાજ",
      feature5Title: "માટી વિશ્લેષણ",
      feature5Desc: "છબી અથવા માહિતી પરથી માટીનો પ્રકાર અને આરોગ્ય તપાસો",
      feature6Title: "પાણી વ્યવસ્થાપન",
      feature6Desc: "પાક માટે યોગ્ય સિંચાઈની ગણતરી"
    },

    // Dashboard
    dashboard: {
      title: "ડેશબોર્ડ",
      subtitle: "શરૂ કરવા માટે સુવિધા પસંદ કરો",
      categories: {
        crop: "પાક બુદ્ધિમત્તા",
        soil: "માટી વિશ્લેષણ",
        weather: "મોસમ અને જોખમ",
        market: "બજાર અને નાણાં"
      }
    },

    // Features
    features: {
      plantDisease: {
        title: "પાક રોગ ઓળખ",
        desc: "પાંદડાની છબી અપલોડ કરો અથવા કૅપ્ચર કરો",
        uploadHint: "છબી અહીં મૂકો અથવા અપલોડ કરવા ક્લિક કરો",
        cameraHint: "પાંદડું સ્પષ્ટ રીતે ફ્રેમમાં રાખો",
        result: "ઓળખ પરિણામ",
        healthy: "પાક સ્વસ્થ છે",
        diseased: "રોગ મળી આવ્યો"
      },
      cropRecommend: {
        title: "પાક ભલામણ",
        desc: "માટી અને હવામાનની માહિતી દાખલ કરો",
        nitrogen: "નાઈટ્રોજન (N)",
        phosphorus: "ફોસ્ફરસ (P)",
        potassium: "પોટેશિયમ (K)",
        temperature: "તાપમાન (°C)",
        humidity: "આર્દ્રતા (%)",
        ph: "માટી pH",
        rainfall: "વરસાદ (મિમી)",
        result: "ભલામણ કરેલ પાક"
      },
      soilType: {
        title: "માટી પ્રકાર ઓળખ",
        desc: "માટીનો પ્રકાર જાણવા છબી અપલોડ કરો",
        result: "માટી પ્રકાર"
      },
      soilHealth: {
        title: "માટી આરોગ્ય મૂલ્યાંકન",
        desc: "માટી પોષક તત્વોની માહિતી દાખલ કરો",
        organicCarbon: "સજીવ કાર્બન (%)",
        ec: "વિદ્યુત વાહકતા (dS/m)",
        result: "માટી આરોગ્ય સ્થિતિ"
      },
      flood: {
        title: "પૂર જોખમ આગાહી",
        desc: "તમારા વિસ્તારમાં પૂર જોખમ જાણો",
        state: "રાજ્ય",
        district: "જિલ્લો",
        rainfallMm: "વરસાદ (મિમી)",
        riverLevel: "નદી સ્તર (મી)",
        elevation: "ઊંચાઈ (મી)",
        floodHistory: "પૂર ઇતિહાસ (0-10)",
        result: "પૂર જોખમ સ્તર"
      },
      storm: {
        title: "તોફાન આગાહી",
        desc: "મોસમ આધારે તોફાન જોખમ જાણો",
        windSpeed: "પવનની ઝડપ (કિમી/કલાક)",
        pressure: "હવામાન દબાણ (hPa)",
        result: "તોફાન જોખમ સ્તર"
      },
      rainfall: {
        title: "વરસાદ આગાહી",
        desc: "તમારા વિસ્તાર માટે વરસાદની આગાહી",
        subdivision: "હવામાન ઉપવિભાગ",
        month: "મહિનો",
        year: "વર્ષ",
        result: "અનુમાનિત વરસાદ"
      },
      aqi: {
        title: "હવા ગુણવત્તા સૂચકાંક",
        desc: "ખેતી માટે હવાની ગુણવત્તા તપાસો",
        city: "શહેર",
        pm25: "PM2.5",
        pm10: "PM10",
        no2: "NO₂",
        so2: "SO₂",
        co: "CO",
        o3: "O₃",
        result: "હવા ગુણવત્તા સૂચકાંક"
      },
      co2: {
        title: "CO₂ સ્તર આગાહી",
        desc: "હવામાં CO₂ સ્તરની આગાહી",
        result: "CO₂ સ્તર"
      },
      ndvi: {
        title: "વનસ્પતિ આરોગ્ય (NDVI)",
        desc: "સ્પેક્ટ્રલ ડેટા પરથી પાક આરોગ્ય",
        redBand: "લાલ બેન્ડ (0-1)",
        nirBand: "NIR બેન્ડ (0-1)",
        result: "વનસ્પતિ આરોગ્ય"
      },
      yield: {
        title: "ઉપજ આગાહી",
        desc: "અપેક્ષિત પાક ઉપજ જાણો",
        crop: "પાક",
        season: "મોસમ",
        area: "વિસ્તાર (હેક્ટર)",
        result: "અપેક્ષિત ઉપજ"
      },
      price: {
        title: "ભાવ આગાહી",
        desc: "પાકના બજાર ભાવની આગાહી",
        result: "અનુમાનિત ભાવ"
      },
      profit: {
        title: "નફા ગણતરી",
        desc: "પાકમાંથી નફાની ગણતરી",
        costPerHectare: "પ્રતિ હેક્ટર ખર્ચ (₹)",
        expectedYield: "અપેક્ષિત ઉપજ (કિગ્રા)",
        marketPrice: "બજાર ભાવ (₹)",
        result: "અપેક્ષિત નફો"
      },
      water: {
        title: "પાણી જરૂરિયાત",
        desc: "સિંચાઈ પાણીની જરૂરિયાત",
        growthStage: "વિકાસ તબક્કો",
        soilType: "માટી પ્રકાર",
        result: "પાણી જરૂરિયાત"
      }
    },

    // Explanation
    explanation: {
      why: "આ પરિણામ કેમ?",
      factors: "મુખ્ય પરિબળો",
      prevention: "રોકથામ સૂચનો",
      nextSteps: "આગળ શું કરવું"
    },

    // Location
    location: {
      detecting: "સ્થાન શોધી રહ્યા છીએ...",
      detected: "સ્થાન મળી ગયું",
      failed: "સ્થાન શોધવામાં નિષ્ફળ",
      permission: "સારી આગાહી માટે સ્થાનની પરવાનગી આપો",
      manual: "સ્થાન હાથથી દાખલ કરો",
      city: "શહેર",
      district: "જિલ્લો",
      state: "રાજ્ય"
    },

    // Camera
    camera: {
      title: "કેમેરા",
      switchCamera: "કેમેરા બદલો",
      capture: "કૅપ્ચર કરો",
      retake: "ફરી લો",
      use: "ફોટો ઉપયોગ કરો",
      permissionDenied: "કેમેરાની પરવાનગી નકારી",
      notSupported: "આ ઉપકરણ પર કેમેરા સપોર્ટ નથી"
    },

    // Errors
    errors: {
      generic: "કઈક ખોટું થયું. ફરી પ્રયાસ કરો.",
      network: "નેટવર્ક ભૂલ. કનેક્શન તપાસો.",
      server: "સર્વર ભૂલ. પછી પ્રયાસ કરો.",
      validation: "ઇનપુટ તપાસો.",
      imageRequired: "છબી અપલોડ કરો અથવા કૅપ્ચર કરો",
      imageTooLarge: "છબી બહુ મોટી છે (મહત્તમ 10MB)",
      invalidImageType: "ફક્ત JPEG અથવા PNG માન્ય છે"
    },

    // Months
    months: {
      1: "જાન્યુઆરી", 2: "ફેબ્રુઆરી", 3: "માર્ચ", 4: "એપ્રિલ",
      5: "મે", 6: "જૂન", 7: "જુલાઈ", 8: "ઑગસ્ટ",
      9: "સપ્ટેમ્બર", 10: "ઑક્ટોબર", 11: "નવેમ્બર", 12: "ડિસેમ્બર"
    }
  }

};


/* ================= PROVIDER ================= */
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    () => localStorage.getItem('dhartisetu_language') || 'en'
  );

  useEffect(() => {
    localStorage.setItem('dhartisetu_language', language);
    document.documentElement.lang = language;

    document.body.classList.remove('font-hindi', 'font-gujarati');
    if (language === 'hi') document.body.classList.add('font-hindi');
    if (language === 'gu') document.body.classList.add('font-gujarati');
  }, [language]);

  /* ===== SAFE TRANSLATION FUNCTION (NO MISSING TEXT EVER) ===== */
  const t = (key) => {
    const keys = key.split('.');
    let current = translations[language];
    let fallback = translations.en;

    for (const k of keys) {
      current = current?.[k];
      fallback = fallback?.[k];
    }

    return current || fallback || key;
  };

  /* ===== CYCLE LANGUAGES ===== */
  const toggleLanguage = () => {
    setLanguage((prev) =>
      prev === 'en' ? 'hi' : prev === 'hi' ? 'gu' : 'en'
    );
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      t,
      isHindi: language === 'hi',
      isGujarati: language === 'gu'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};

export default LanguageContext;
