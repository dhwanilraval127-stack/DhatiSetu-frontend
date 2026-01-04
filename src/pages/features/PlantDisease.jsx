import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, 
  FiCamera, 
  FiRefreshCw, 
  FiAlertTriangle, 
  FiCheckCircle,
  FiInfo,
  FiShield,
  FiArrowRight,
  FiHelpCircle,
  FiX
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

import { useLanguage } from '../../context/LanguageContext';
import { plantDiseaseAPI } from '../../services/api';
import useApi from '../../hooks/useApi';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/camera/ImageUpload';
import CameraModal from '../../components/camera/CameraModal';
import ResultCard from '../../components/results/ResultCard';
import ConfidenceMeter from '../../components/results/ConfidenceMeter';

import { PlantDiseaseIcon } from '../../utils/icons';
import { checkImageRelevance } from '../../utils/imageRelevanceCheck';

// Complete Trilingual translations
const translations = {
  en: {
    // Page Header
    pageTitle: 'Plant Disease Detection',
    pageSubtitle: 'Upload or capture a plant/leaf image to detect diseases',
    
    // Buttons
    upload: 'Upload Image',
    camera: 'Use Camera',
    analyze: 'Analyze Plant',
    analyzing: 'Analyzing...',
    retry: 'Try Another Image',
    tryAgain: 'Try Again',
    
    // Results
    resultTitle: 'Detection Result',
    resultNotAvailable: 'Result not available',
    status: 'Status',
    healthy: 'Healthy',
    diseased: 'Disease Detected',
    confidence: 'Confidence',
    
    // Explanation Sections
    whyHappened: 'Why did this happen?',
    mainCauses: 'Main Causes',
    prevention: 'Prevention Tips',
    nextSteps: 'What to do next',
    treatmentOptions: 'Treatment Options',
    affectedParts: 'Affected Parts',
    severity: 'Severity Level',
    
    // Severity Levels
    severityLow: 'Low',
    severityMedium: 'Medium',
    severityHigh: 'High',
    severityCritical: 'Critical',
    
    // Error Messages
    imageRequired: 'Please select an image first',
    invalidImage: 'Please upload a plant or leaf image',
    invalidCapture: 'Please capture a plant or leaf image',
    analysisError: 'Failed to analyze image. Please try again.',
    
    // Upload Section
    uploadHint: 'Drag & drop or click to upload',
    supportedFormats: 'Supports: JPG, PNG, WebP',
    maxFileSize: 'Max file size: 10MB',
    
    // Tips
    quickTips: 'Quick Tips for Better Results',
    tip1: 'Use clear, well-lit images',
    tip2: 'Focus on affected leaves or plant parts',
    tip3: 'Capture from multiple angles for accuracy',
    tip4: 'Avoid blurry or shaky images',
    tip5: 'Include both healthy and affected areas',
    
    // Camera
    cameraCapture: 'Camera Capture',
    uploadedImage: 'Uploaded Image',
    
    // Health Status Messages
    healthyMessage: 'Your plant appears to be healthy! Continue with regular care and monitoring.',
    diseasedMessage: 'Disease detected. Please follow the recommendations below.',
    
    // Additional Info
    moreInfo: 'More Information',
    shareResult: 'Share Result',
    saveResult: 'Save Result',
    viewHistory: 'View History',
    
    // Loading States
    loadingAnalysis: 'Analyzing your plant image...',
    loadingAI: 'AI is processing the image...',
    almostDone: 'Almost done...',
    
    // Empty State
    emptyStateTitle: 'No Image Selected',
    emptyStateDesc: 'Upload or capture a plant image to get started',
    
    // Success/Error
    analysisComplete: 'Analysis complete!',
    detectedDisease: 'Disease detected:',
    plantIsHealthy: 'Great news! Your plant is healthy.',
  },
  
  hi: {
    // Page Header
    pageTitle: 'पौधों की बीमारी का पता लगाएं',
    pageSubtitle: 'बीमारी का पता लगाने के लिए पौधे/पत्ते की छवि अपलोड करें या कैप्चर करें',
    
    // Buttons
    upload: 'छवि अपलोड करें',
    camera: 'कैमरा उपयोग करें',
    analyze: 'पौधे का विश्लेषण करें',
    analyzing: 'विश्लेषण हो रहा है...',
    retry: 'दूसरी छवि आज़माएं',
    tryAgain: 'पुनः प्रयास करें',
    
    // Results
    resultTitle: 'पता लगाने का परिणाम',
    resultNotAvailable: 'परिणाम उपलब्ध नहीं',
    status: 'स्थिति',
    healthy: 'स्वस्थ',
    diseased: 'बीमारी का पता चला',
    confidence: 'विश्वसनीयता',
    
    // Explanation Sections
    whyHappened: 'यह क्यों हुआ?',
    mainCauses: 'मुख्य कारण',
    prevention: 'बचाव के उपाय',
    nextSteps: 'अब क्या करें?',
    treatmentOptions: 'उपचार के विकल्प',
    affectedParts: 'प्रभावित भाग',
    severity: 'गंभीरता स्तर',
    
    // Severity Levels
    severityLow: 'कम',
    severityMedium: 'मध्यम',
    severityHigh: 'उच्च',
    severityCritical: 'गंभीर',
    
    // Error Messages
    imageRequired: 'कृपया पहले एक छवि चुनें',
    invalidImage: 'कृपया पौधे या पत्ते की छवि अपलोड करें',
    invalidCapture: 'कृपया पौधे या पत्ते की छवि कैप्चर करें',
    analysisError: 'छवि का विश्लेषण करने में विफल। कृपया पुनः प्रयास करें।',
    
    // Upload Section
    uploadHint: 'खींचें और छोड़ें या अपलोड करने के लिए क्लिक करें',
    supportedFormats: 'समर्थित: JPG, PNG, WebP',
    maxFileSize: 'अधिकतम फ़ाइल आकार: 10MB',
    
    // Tips
    quickTips: 'बेहतर परिणाम के लिए सुझाव',
    tip1: 'साफ, अच्छी रोशनी वाली छवियां उपयोग करें',
    tip2: 'प्रभावित पत्तियों या पौधे के भागों पर ध्यान दें',
    tip3: 'सटीकता के लिए कई कोणों से कैप्चर करें',
    tip4: 'धुंधली या हिलती छवियों से बचें',
    tip5: 'स्वस्थ और प्रभावित दोनों क्षेत्रों को शामिल करें',
    
    // Camera
    cameraCapture: 'कैमरा कैप्चर',
    uploadedImage: 'अपलोड की गई छवि',
    
    // Health Status Messages
    healthyMessage: 'आपका पौधा स्वस्थ दिखाई देता है! नियमित देखभाल और निगरानी जारी रखें।',
    diseasedMessage: 'बीमारी का पता चला। कृपया नीचे दी गई सिफारिशों का पालन करें।',
    
    // Additional Info
    moreInfo: 'अधिक जानकारी',
    shareResult: 'परिणाम साझा करें',
    saveResult: 'परिणाम सहेजें',
    viewHistory: 'इतिहास देखें',
    
    // Loading States
    loadingAnalysis: 'आपके पौधे की छवि का विश्लेषण हो रहा है...',
    loadingAI: 'AI छवि को प्रोसेस कर रहा है...',
    almostDone: 'लगभग पूरा हो गया...',
    
    // Empty State
    emptyStateTitle: 'कोई छवि चयनित नहीं',
    emptyStateDesc: 'शुरू करने के लिए पौधे की छवि अपलोड करें या कैप्चर करें',
    
    // Success/Error
    analysisComplete: 'विश्लेषण पूर्ण!',
    detectedDisease: 'पता चली बीमारी:',
    plantIsHealthy: 'बढ़िया खबर! आपका पौधा स्वस्थ है।',
  },
  
  gu: {
    // Page Header
    pageTitle: 'છોડના રોગની શોધ',
    pageSubtitle: 'રોગ શોધવા માટે છોડ/પાંદડાની છબી અપલોડ કરો અથવા કેપ્ચર કરો',
    
    // Buttons
    upload: 'છબી અપલોડ કરો',
    camera: 'કેમેરા વાપરો',
    analyze: 'છોડનું વિશ્લેષણ કરો',
    analyzing: 'વિશ્લેષણ થઈ રહ્યું છે...',
    retry: 'બીજી છબી અજમાવો',
    tryAgain: 'ફરી પ્રયાસ કરો',
    
    // Results
    resultTitle: 'શોધ પરિણામ',
    resultNotAvailable: 'પરિણામ ઉપલબ્ધ નથી',
    status: 'સ્થિતિ',
    healthy: 'સ્વસ્થ',
    diseased: 'રોગ મળ્યો',
    confidence: 'વિશ્વસનીયતા',
    
    // Explanation Sections
    whyHappened: 'આ શા માટે થયું?',
    mainCauses: 'મુખ્ય કારણો',
    prevention: 'નિવારણ ટિપ્સ',
    nextSteps: 'હવે શું કરવું?',
    treatmentOptions: 'સારવાર વિકલ્પો',
    affectedParts: 'અસરગ્રસ્ત ભાગો',
    severity: 'ગંભીરતા સ્તર',
    
    // Severity Levels
    severityLow: 'ઓછું',
    severityMedium: 'મધ્યમ',
    severityHigh: 'ઉચ્ચ',
    severityCritical: 'ગંભીર',
    
    // Error Messages
    imageRequired: 'કૃપા કરીને પહેલા છબી પસંદ કરો',
    invalidImage: 'કૃપા કરીને છોડ અથવા પાંદડાની છબી અપલોડ કરો',
    invalidCapture: 'કૃપા કરીને છોડ અથવા પાંદડાની છબી કેપ્ચર કરો',
    analysisError: 'છબીનું વિશ્લેષણ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.',
    
    // Upload Section
    uploadHint: 'ખેંચો અને છોડો અથવા અપલોડ કરવા ક્લિક કરો',
    supportedFormats: 'સપોર્ટેડ: JPG, PNG, WebP',
    maxFileSize: 'મહત્તમ ફાઇલ કદ: 10MB',
    
    // Tips
    quickTips: 'વધુ સારા પરિણામો માટે ટિપ્સ',
    tip1: 'સ્પષ્ટ, સારી લાઇટવાળી છબીઓ વાપરો',
    tip2: 'અસરગ્રસ્ત પાંદડા અથવા છોડના ભાગો પર ધ્યાન આપો',
    tip3: 'ચોકસાઈ માટે વિવિધ ખૂણાથી કેપ્ચર કરો',
    tip4: 'ઝાંખી અથવા હલતી છબીઓ ટાળો',
    tip5: 'સ્વસ્થ અને અસરગ્રસ્ત બંને વિસ્તારોનો સમાવેશ કરો',
    
    // Camera
    cameraCapture: 'કેમેરા કેપ્ચર',
    uploadedImage: 'અપલોડ કરેલી છબી',
    
    // Health Status Messages
    healthyMessage: 'તમારો છોડ સ્વસ્થ દેખાય છે! નિયમિત સંભાળ અને દેખરેખ ચાલુ રાખો.',
    diseasedMessage: 'રોગ મળ્યો. કૃપા કરીને નીચેની ભલામણોનું પાલન કરો.',
    
    // Additional Info
    moreInfo: 'વધુ માહિતી',
    shareResult: 'પરિણામ શેર કરો',
    saveResult: 'પરિણામ સાચવો',
    viewHistory: 'ઇતિહાસ જુઓ',
    
    // Loading States
    loadingAnalysis: 'તમારા છોડની છબીનું વિશ્લેષણ થઈ રહ્યું છે...',
    loadingAI: 'AI છબી પ્રોસેસ કરી રહ્યું છે...',
    almostDone: 'લગભગ પૂર્ણ...',
    
    // Empty State
    emptyStateTitle: 'કોઈ છબી પસંદ નથી',
    emptyStateDesc: 'શરૂ કરવા માટે છોડની છબી અપલોડ કરો અથવા કેપ્ચર કરો',
    
    // Success/Error
    analysisComplete: 'વિશ્લેષણ પૂર્ણ!',
    detectedDisease: 'મળેલ રોગ:',
    plantIsHealthy: 'સારા સમાચાર! તમારો છોડ સ્વસ્થ છે.',
  },
};

// Common disease names in all languages
const diseaseTranslations = {
  // Healthy
  'healthy': {
    en: 'Healthy Plant',
    hi: 'स्वस्थ पौधा',
    gu: 'સ્વસ્થ છોડ'
  },
  'Healthy': {
    en: 'Healthy Plant',
    hi: 'स्वस्थ पौधा',
    gu: 'સ્વસ્થ છોડ'
  },
  
  // Tomato Diseases
  'Tomato___Late_blight': {
    en: 'Tomato Late Blight',
    hi: 'टमाटर झुलसा रोग',
    gu: 'ટામેટા લેટ બ્લાઇટ'
  },
  'Tomato___Early_blight': {
    en: 'Tomato Early Blight',
    hi: 'टमाटर अगेती झुलसा',
    gu: 'ટામેટા અર્લી બ્લાઇટ'
  },
  'Tomato___Septoria_leaf_spot': {
    en: 'Tomato Septoria Leaf Spot',
    hi: 'टमाटर सेप्टोरिया पत्ती धब्बा',
    gu: 'ટામેટા સેપ્ટોરિયા પાન ડાઘ'
  },
  'Tomato___Bacterial_spot': {
    en: 'Tomato Bacterial Spot',
    hi: 'टमाटर जीवाणु धब्बा',
    gu: 'ટામેટા બેક્ટેરિયલ ડાઘ'
  },
  'Tomato___Target_Spot': {
    en: 'Tomato Target Spot',
    hi: 'टमाटर लक्ष्य धब्बा',
    gu: 'ટામેટા ટાર્ગેટ સ્પોટ'
  },
  'Tomato___Yellow_Leaf_Curl_Virus': {
    en: 'Tomato Yellow Leaf Curl Virus',
    hi: 'टमाटर पीला पत्ता मोड़ वायरस',
    gu: 'ટામેટા પીળા પાન કર્લ વાયરસ'
  },
  'Tomato___Leaf_Mold': {
    en: 'Tomato Leaf Mold',
    hi: 'टमाटर पत्ती फफूंद',
    gu: 'ટામેટા પાન ફૂગ'
  },
  'Tomato___Spider_mites': {
    en: 'Tomato Spider Mites',
    hi: 'टमाटर मकड़ी के कण',
    gu: 'ટામેટા સ્પાઇડર માઇટ્સ'
  },
  'Tomato___Mosaic_virus': {
    en: 'Tomato Mosaic Virus',
    hi: 'टमाटर मोज़ेक वायरस',
    gu: 'ટામેટા મોઝેક વાયરસ'
  },
  'Tomato___healthy': {
    en: 'Healthy Tomato',
    hi: 'स्वस्थ टमाटर',
    gu: 'સ્વસ્થ ટામેટા'
  },
  
  // Potato Diseases
  'Potato___Late_blight': {
    en: 'Potato Late Blight',
    hi: 'आलू झुलसा रोग',
    gu: 'બટાકા લેટ બ્લાઇટ'
  },
  'Potato___Early_blight': {
    en: 'Potato Early Blight',
    hi: 'आलू अगेती झुलसा',
    gu: 'બટાકા અર્લી બ્લાઇટ'
  },
  'Potato___healthy': {
    en: 'Healthy Potato',
    hi: 'स्वस्थ आलू',
    gu: 'સ્વસ્થ બટાકા'
  },
  
  // Corn Diseases
  'Corn___Common_rust': {
    en: 'Corn Common Rust',
    hi: 'मक्का सामान्य रतुआ',
    gu: 'મકાઈ સામાન્ય રસ્ટ'
  },
  'Corn___Northern_Leaf_Blight': {
    en: 'Corn Northern Leaf Blight',
    hi: 'मक्का उत्तरी पत्ती झुलसा',
    gu: 'મકાઈ ઉત્તરી પાન બ્લાઇટ'
  },
  'Corn___Cercospora_leaf_spot': {
    en: 'Corn Cercospora Leaf Spot',
    hi: 'मक्का सर्कोस्पोरा पत्ती धब्बा',
    gu: 'મકાઈ સર્કોસ્પોરા પાન ડાઘ'
  },
  'Corn___healthy': {
    en: 'Healthy Corn',
    hi: 'स्वस्थ मक्का',
    gu: 'સ્વસ્થ મકાઈ'
  },
  
  // Apple Diseases
  'Apple___Apple_scab': {
    en: 'Apple Scab',
    hi: 'सेब पपड़ी रोग',
    gu: 'સફરજન સ્કેબ'
  },
  'Apple___Black_rot': {
    en: 'Apple Black Rot',
    hi: 'सेब काला सड़न',
    gu: 'સફરજન બ્લેક રોટ'
  },
  'Apple___Cedar_apple_rust': {
    en: 'Apple Cedar Rust',
    hi: 'सेब सीडर रतुआ',
    gu: 'સફરજન સીડર રસ્ટ'
  },
  'Apple___healthy': {
    en: 'Healthy Apple',
    hi: 'स्वस्थ सेब',
    gu: 'સ્વસ્થ સફરજન'
  },
  
  // Grape Diseases
  'Grape___Black_rot': {
    en: 'Grape Black Rot',
    hi: 'अंगूर काला सड़न',
    gu: 'દ્રાક્ષ બ્લેક રોટ'
  },
  'Grape___Esca': {
    en: 'Grape Esca Disease',
    hi: 'अंगूर एस्का रोग',
    gu: 'દ્રાક્ષ એસ્કા રોગ'
  },
  'Grape___Leaf_blight': {
    en: 'Grape Leaf Blight',
    hi: 'अंगूर पत्ती झुलसा',
    gu: 'દ્રાક્ષ પાન બ્લાઇટ'
  },
  'Grape___healthy': {
    en: 'Healthy Grape',
    hi: 'स्वस्थ अंगूर',
    gu: 'સ્વસ્થ દ્રાક્ષ'
  },
  
  // Rice Diseases
  'Rice___Brown_spot': {
    en: 'Rice Brown Spot',
    hi: 'धान भूरा धब्बा',
    gu: 'ચોખા બ્રાઉન સ્પોટ'
  },
  'Rice___Leaf_blast': {
    en: 'Rice Leaf Blast',
    hi: 'धान पत्ती ब्लास्ट',
    gu: 'ચોખા પાન બ્લાસ્ટ'
  },
  'Rice___Neck_blast': {
    en: 'Rice Neck Blast',
    hi: 'धान गर्दन ब्लास्ट',
    gu: 'ચોખા નેક બ્લાસ્ટ'
  },
  'Rice___healthy': {
    en: 'Healthy Rice',
    hi: 'स्वस्थ धान',
    gu: 'સ્વસ્થ ચોખા'
  },
  
  // Wheat Diseases
  'Wheat___Brown_rust': {
    en: 'Wheat Brown Rust',
    hi: 'गेहूं भूरा रतुआ',
    gu: 'ઘઉં બ્રાઉન રસ્ટ'
  },
  'Wheat___Yellow_rust': {
    en: 'Wheat Yellow Rust',
    hi: 'गेहूं पीला रतुआ',
    gu: 'ઘઉં પીળો રસ્ટ'
  },
  'Wheat___Septoria': {
    en: 'Wheat Septoria',
    hi: 'गेहूं सेप्टोरिया',
    gu: 'ઘઉં સેપ્ટોરિયા'
  },
  'Wheat___healthy': {
    en: 'Healthy Wheat',
    hi: 'स्वस्थ गेहूं',
    gu: 'સ્વસ્થ ઘઉં'
  },
  
  // Cotton Diseases
  'Cotton___Bacterial_blight': {
    en: 'Cotton Bacterial Blight',
    hi: 'कपास जीवाणु झुलसा',
    gu: 'કપાસ બેક્ટેરિયલ બ્લાઇટ'
  },
  'Cotton___Curl_virus': {
    en: 'Cotton Leaf Curl Virus',
    hi: 'कपास पत्ती मोड़ वायरस',
    gu: 'કપાસ પાન કર્લ વાયરસ'
  },
  'Cotton___healthy': {
    en: 'Healthy Cotton',
    hi: 'स्वस्थ कपास',
    gu: 'સ્વસ્થ કપાસ'
  },
};

const PlantDisease = () => {
  const { t, language } = useLanguage();
  const { loading, data, error, execute, reset } = useApi();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [mode, setMode] = useState('upload');

  // Get translation helper
  const getText = useCallback((key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  }, [language]);

  // Get disease name in current language
  const getDiseaseName = useCallback((diseaseKey) => {
    if (!diseaseKey) return getText('resultNotAvailable');
    
    // Check if we have a translation for this disease
    const diseaseData = diseaseTranslations[diseaseKey];
    if (diseaseData) {
      return diseaseData[language] || diseaseData.en || diseaseKey;
    }
    
    // Try to format the disease key nicely
    const formatted = diseaseKey
      .replace(/___/g, ' - ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    return formatted;
  }, [language, getText]);

  // Get language-specific field from API response
  const getLocalizedField = useCallback((obj, field) => {
    if (!obj) return '';
    
    // Try language-specific field first
    const langField = `${field}_${language}`;
    if (obj[langField]) return obj[langField];
    
    // Try with language code suffix
    if (language === 'hi' && obj[`${field}_hi`]) return obj[`${field}_hi`];
    if (language === 'gu' && obj[`${field}_gu`]) return obj[`${field}_gu`];
    
    // Fallback to default field
    return obj[field] || '';
  }, [language]);

  // Get localized array (for factors, prevention, steps)
  const getLocalizedArray = useCallback((obj, field) => {
    if (!obj) return [];
    
    // Try language-specific field first
    const langField = `${field}_${language}`;
    if (Array.isArray(obj[langField])) return obj[langField];
    
    // Try with language code suffix
    if (language === 'hi' && Array.isArray(obj[`${field}_hi`])) return obj[`${field}_hi`];
    if (language === 'gu' && Array.isArray(obj[`${field}_gu`])) return obj[`${field}_gu`];
    
    // Fallback to default field
    return Array.isArray(obj[field]) ? obj[field] : [];
  }, [language]);

  /* ---------------- Upload Handler ---------------- */
  const handleImageSelect = useCallback(async (selected) => {
    if (!selected) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result;
      const ok = await checkImageRelevance(base64);

      if (!ok) {
        toast.error(getText('invalidImage'));
        return;
      }

      setFile(selected);
      setPreview(base64);
      setMode('upload');
      reset();
    };
    reader.readAsDataURL(selected);
  }, [getText, reset]);

  /* ---------------- Camera Handler ---------------- */
  const handleCameraAnalyze = async (base64) => {
    const ok = await checkImageRelevance(base64);
    if (!ok) {
      toast.error(getText('invalidCapture'));
      return;
    }

    setShowCamera(false);
    setPreview(base64);
    setMode('camera');
    setFile(null);
    reset();

    const res = await fetch(base64);
    const blob = await res.blob();
    const imageFile = new File([blob], 'camera.jpg', { type: 'image/jpeg' });

    const result = await execute(
      () => plantDiseaseAPI.detect(imageFile, language),
      { showErrorToast: true }
    );

    if (result) {
      const isHealthy = result.prediction?.is_healthy;
      if (isHealthy) {
        toast.success(getText('plantIsHealthy'));
      } else {
        toast.success(`${getText('detectedDisease')} ${getDiseaseName(result.prediction?.disease_key || result.prediction?.title)}`);
      }
    }
  };

  /* ---------------- Analyze Upload Handler ---------------- */
  const handleAnalyze = async () => {
    if (!file) {
      toast.error(getText('imageRequired'));
      return;
    }

    const result = await execute(
      () => plantDiseaseAPI.detect(file, language),
      { showErrorToast: true }
    );

    if (result) {
      const isHealthy = result.prediction?.is_healthy;
      if (isHealthy) {
        toast.success(getText('plantIsHealthy'));
      } else {
        toast.success(`${getText('detectedDisease')} ${getDiseaseName(result.prediction?.disease_key || result.prediction?.title)}`);
      }
    }
  };

  /* ---------------- Data Extraction ---------------- */
  const prediction = data?.prediction ?? {};
  const explanation = data?.explanation ?? {};

  const isHealthy = prediction.is_healthy === true || 
                    prediction.disease_key?.toLowerCase().includes('healthy') ||
                    prediction.title?.toLowerCase().includes('healthy');
  
  const resultType = isHealthy ? 'success' : 'warning';

  // Get disease name with proper translation
  const resultText = getDiseaseName(prediction.disease_key || prediction.title) || getText('resultNotAvailable');

  // Get status text
  const getStatusText = () => {
    if (isHealthy) {
      return getText('healthy');
    }
    return getText('diseased');
  };

  // Get explanation text with localization
  const whyText = getLocalizedField(explanation, 'why');
  const factors = getLocalizedArray(explanation, 'factors');
  const prevention = getLocalizedArray(explanation, 'prevention');
  const nextSteps = getLocalizedArray(explanation, 'next_steps');
  const treatment = getLocalizedArray(explanation, 'treatment');

  /* ---------------- Reset Handler ---------------- */
  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setMode('upload');
    reset();
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-8">
      <PageHeader
        title={getText('pageTitle')}
        subtitle={getText('pageSubtitle')}
        icon={PlantDiseaseIcon}
        color="primary"
      />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* ================= INPUT SECTION ================= */}
          <div className="space-y-4">
            
            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-3 shadow-sm border border-green-100"
            >
              <div className="flex gap-3">
                <Button 
                  icon={FiUpload} 
                  fullWidth 
                  variant={mode === 'upload' && !showCamera ? 'primary' : 'outline'}
                  onClick={() => setMode('upload')}
                  className="transition-all duration-200"
                >
                  {getText('upload')}
                </Button>
                <Button 
                  icon={FiCamera} 
                  fullWidth 
                  variant="outline"
                  onClick={() => setShowCamera(true)}
                  className="transition-all duration-200"
                >
                  {getText('camera')}
                </Button>
              </div>
            </motion.div>

            {/* Image Preview / Upload Area */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden"
            >
              {preview ? (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-72 object-contain bg-gray-50 p-4"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
                  
                  {/* Image Source Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${mode === 'camera' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                      }
                    `}>
                      {mode === 'camera' ? `📷 ${getText('cameraCapture')}` : `📁 ${getText('uploadedImage')}`}
                    </span>
                  </div>

                  {/* Remove Image Button */}
                  <button
                    onClick={handleReset}
                    className="absolute top-3 left-3 w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FiX className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="p-6">
                  <ImageUpload onImageSelect={handleImageSelect} />
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {getText('supportedFormats')} • {getText('maxFileSize')}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Analyze Button */}
            {preview && !data && mode === 'upload' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  fullWidth
                  size="lg"
                  loading={loading}
                  icon={loading ? null : HiOutlineSparkles}
                  onClick={handleAnalyze}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-200"
                >
                  {loading ? getText('analyzing') : getText('analyze')}
                </Button>
              </motion.div>
            )}

            {/* Reset Button */}
            {data && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  variant="outline"
                  fullWidth
                  icon={FiRefreshCw}
                  onClick={handleReset}
                  className="border-green-200 text-green-700 hover:bg-green-50"
                >
                  {getText('retry')}
                </Button>
              </motion.div>
            )}

            {/* Quick Tips Card (when no preview) */}
            {!preview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100"
              >
                <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                  <FiInfo className="w-4 h-4" />
                  {getText('quickTips')}
                </h4>
                <ul className="space-y-2">
                  {['tip1', 'tip2', 'tip3', 'tip4', 'tip5'].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
                      <span className="w-5 h-5 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      {getText(tip)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Error State */}
            {error && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 rounded-xl p-4 border border-red-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FiAlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-red-800">{getText('analysisError')}</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyze}
                  className="mt-3 border-red-200 text-red-700"
                  icon={FiRefreshCw}
                >
                  {getText('tryAgain')}
                </Button>
              </motion.div>
            )}
          </div>

          {/* ================= RESULT SECTION ================= */}
          <AnimatePresence mode="wait">
            {data && !loading && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ type: 'spring', damping: 20 }}
                className="space-y-4"
              >
                {/* Main Result Card */}
                <div className={`
                  rounded-2xl p-5 shadow-sm border-2 
                  ${isHealthy 
                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                    : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                  }
                `}>
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`
                      inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                      ${isHealthy 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-amber-100 text-amber-700'
                      }
                    `}>
                      {isHealthy ? <FiCheckCircle className="w-4 h-4" /> : <FiAlertTriangle className="w-4 h-4" />}
                      {getStatusText()}
                    </span>
                   <span className="text-xs text-gray-500">
  {getText('confidence')}: {(data.confidence || 0).toFixed(1)}%
</span>
                  </div>

                  {/* Result Title - Translated Disease Name */}
                  <h3 className={`text-xl font-bold mb-2 ${isHealthy ? 'text-green-800' : 'text-amber-800'}`}>
                    {resultText}
                  </h3>

                  {/* Health Message */}
                  <p className={`text-sm ${isHealthy ? 'text-green-600' : 'text-amber-600'}`}>
                    {isHealthy ? getText('healthyMessage') : getText('diseasedMessage')}
                  </p>

                  {/* Confidence Meter */}
                  <div className="mt-4">
                    <ConfidenceMeter confidence={data.confidence} />
                  </div>
                </div>

                {/* Detailed Explanation Card */}
                {!isHealthy && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Why Section */}
                    {whyText && (
                      <div className="p-5 border-b border-gray-100">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <FiHelpCircle className="w-4 h-4 text-blue-500" />
                          {getText('whyHappened')}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">{whyText}</p>
                      </div>
                    )}

                    {/* Factors/Causes Section */}
                    {factors.length > 0 && (
                      <div className="p-5 border-b border-gray-100 bg-red-50/30">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FiAlertTriangle className="w-4 h-4 text-red-500" />
                          {getText('mainCauses')}
                        </h4>
                        <ul className="space-y-2">
                          {factors.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Prevention Section */}
                    {prevention.length > 0 && (
                      <div className="p-5 border-b border-gray-100 bg-green-50/30">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FiShield className="w-4 h-4 text-green-500" />
                          {getText('prevention')}
                        </h4>
                        <ul className="space-y-2">
                          {prevention.map((p, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Treatment Section */}
                    {treatment.length > 0 && (
                      <div className="p-5 border-b border-gray-100 bg-purple-50/30">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <HiOutlineSparkles className="w-4 h-4 text-purple-500" />
                          {getText('treatmentOptions')}
                        </h4>
                        <ul className="space-y-2">
                          {treatment.map((t, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs flex-shrink-0">
                                {i + 1}
                              </span>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Next Steps Section */}
                    {nextSteps.length > 0 && (
                      <div className="p-5 bg-blue-50/30">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FiArrowRight className="w-4 h-4 text-blue-500" />
                          {getText('nextSteps')}
                        </h4>
                        <ul className="space-y-2">
                          {nextSteps.map((n, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs flex-shrink-0">
                                {i + 1}
                              </span>
                              {n}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Healthy Plant Tips */}
                {isHealthy && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100"
                  >
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <FiCheckCircle className="w-4 h-4" />
                      {getText('prevention')}
                    </h4>
                    <ul className="space-y-2">
                      {[
                        language === 'hi' ? 'नियमित रूप से पानी दें' : language === 'gu' ? 'નિયમિતપણે પાણી આપો' : 'Water regularly',
                        language === 'hi' ? 'उचित धूप सुनिश्चित करें' : language === 'gu' ? 'યોગ્ય સૂર્યપ્રકાશ સુનિશ્ચિત કરો' : 'Ensure proper sunlight',
                        language === 'hi' ? 'समय पर खाद डालें' : language === 'gu' ? 'સમયસર ખાતર આપો' : 'Apply fertilizer on time',
                        language === 'hi' ? 'कीटों के लिए निगरानी करें' : language === 'gu' ? 'જંતુઓ માટે દેખરેખ રાખો' : 'Monitor for pests',
                        language === 'hi' ? 'अच्छी जल निकासी बनाए रखें' : language === 'gu' ? 'સારી ડ્રેનેજ જાળવો' : 'Maintain good drainage',
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                          <FiCheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl shadow-sm"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <HiOutlineSparkles className="w-8 h-8 text-green-500 animate-pulse" />
                  </div>
                </div>
                <p className="text-gray-600 mt-4 font-medium">{getText('analyzing')}</p>
                <p className="text-gray-400 text-sm mt-1">{getText('loadingAI')}</p>
              </motion.div>
            )}

            {/* Empty State (when no preview and no data) */}
            {!preview && !data && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-80 bg-white rounded-2xl shadow-sm border border-dashed border-gray-200"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <PlantDiseaseIcon className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{getText('emptyStateTitle')}</h3>
                <p className="text-gray-500 text-sm text-center max-w-xs">{getText('emptyStateDesc')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onAnalyze={handleCameraAnalyze}
        isAnalyzing={loading}
        featureType="plant"
      />
    </div>
  );
};

export default PlantDisease;