import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, 
  FiCamera, 
  FiRefreshCw,
  FiInfo,
  FiAlertTriangle,
  FiCheckCircle,
  FiShield,
  FiArrowRight,
  FiHelpCircle,
  FiDroplet
} from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

import { useLanguage } from '../../context/LanguageContext';
import { soilAPI } from '../../services/api';
import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import ImageUpload from '../../components/camera/ImageUpload';
import CameraModal from '../../components/camera/CameraModal';
import ResultCard from '../../components/results/ResultCard';
import ConfidenceMeter from '../../components/results/ConfidenceMeter';

import { SoilLayersIcon } from '../../utils/icons';

// Trilingual translations
const translations = {
  en: {
    pageTitle: 'Soil Type Detection',
    pageSubtitle: 'Upload or capture a soil image to identify soil type',
    upload: 'Upload Image',
    camera: 'Use Camera',
    analyze: 'Analyze Soil',
    analyzing: 'Analyzing...',
    retry: 'Try Another Image',
    resultTitle: 'Soil Type Result',
    resultNotAvailable: 'Result not available',
    confidence: 'Confidence',
    recommendedCrops: 'Recommended Crops',
    bestSuitable: 'Best Suitable',
    otherOptions: 'Other Options',
    whyThisSoil: 'Why this soil type?',
    characteristics: 'Key Characteristics',
    benefits: 'Benefits',
    limitations: 'Limitations',
    tips: 'Farming Tips',
    imageRequired: 'Please upload a soil image',
    invalidImage: 'Please upload a valid soil image',
    quickTips: 'Quick Tips',
    tip1: 'Use clear, well-lit images of soil',
    tip2: 'Show soil texture clearly',
    tip3: 'Avoid shadows on soil surface',
    soilHealth: 'Soil Health',
    nutrients: 'Nutrient Content',
    waterRetention: 'Water Retention',
    phLevel: 'pH Level',
  },
  hi: {
    pageTitle: 'मिट्टी के प्रकार का पता लगाएं',
    pageSubtitle: 'मिट्टी के प्रकार की पहचान के लिए छवि अपलोड करें',
    upload: 'छवि अपलोड करें',
    camera: 'कैमरा उपयोग करें',
    analyze: 'मिट्टी का विश्लेषण करें',
    analyzing: 'विश्लेषण हो रहा है...',
    retry: 'दूसरी छवि आज़माएं',
    resultTitle: 'मिट्टी के प्रकार का परिणाम',
    resultNotAvailable: 'परिणाम उपलब्ध नहीं',
    confidence: 'विश्वसनीयता',
    recommendedCrops: 'अनुशंसित फसलें',
    bestSuitable: 'सर्वश्रेष्ठ उपयुक्त',
    otherOptions: 'अन्य विकल्प',
    whyThisSoil: 'यह मिट्टी का प्रकार क्यों?',
    characteristics: 'मुख्य विशेषताएं',
    benefits: 'लाभ',
    limitations: 'सीमाएं',
    tips: 'खेती के सुझाव',
    imageRequired: 'कृपया मिट्टी की छवि अपलोड करें',
    invalidImage: 'कृपया वैध मिट्टी की छवि अपलोड करें',
    quickTips: 'त्वरित सुझाव',
    tip1: 'मिट्टी की साफ, अच्छी रोशनी वाली छवियां उपयोग करें',
    tip2: 'मिट्टी की बनावट स्पष्ट रूप से दिखाएं',
    tip3: 'मिट्टी की सतह पर छाया से बचें',
    soilHealth: 'मिट्टी का स्वास्थ्य',
    nutrients: 'पोषक तत्व',
    waterRetention: 'जल धारण क्षमता',
    phLevel: 'पीएच स्तर',
  },
  gu: {
    pageTitle: 'માટીના પ્રકારની શોધ',
    pageSubtitle: 'માટીના પ્રકારની ઓળખ માટે છબી અપલોડ કરો',
    upload: 'છબી અપલોડ કરો',
    camera: 'કેમેરા વાપરો',
    analyze: 'માટીનું વિશ્લેષણ કરો',
    analyzing: 'વિશ્લેષણ થઈ રહ્યું છે...',
    retry: 'બીજી છબી અજમાવો',
    resultTitle: 'માટીના પ્રકારનું પરિણામ',
    resultNotAvailable: 'પરિણામ ઉપલબ્ધ નથી',
    confidence: 'વિશ્વસનીયતા',
    recommendedCrops: 'ભલામણ કરેલ પાક',
    bestSuitable: 'શ્રેષ્ઠ યોગ્ય',
    otherOptions: 'અન્ય વિકલ્પો',
    whyThisSoil: 'આ માટીનો પ્રકાર શા માટે?',
    characteristics: 'મુખ્ય લાક્ષણિકતાઓ',
    benefits: 'ફાયદા',
    limitations: 'મર્યાદાઓ',
    tips: 'ખેતીની ટિપ્સ',
    imageRequired: 'કૃપા કરીને માટીની છબી અપલોડ કરો',
    invalidImage: 'કૃપા કરીને માન્ય માટીની છબી અપલોડ કરો',
    quickTips: 'ઝડપી ટિપ્સ',
    tip1: 'માટીની સ્પષ્ટ, સારી લાઇટવાળી છબીઓ વાપરો',
    tip2: 'માટીની ટેક્સચર સ્પષ્ટ રીતે બતાવો',
    tip3: 'માટીની સપાટી પર પડછાયાથી બચો',
    soilHealth: 'માટીનું સ્વાસ્થ્ય',
    nutrients: 'પોષક તત્વો',
    waterRetention: 'પાણી ધારણ ક્ષમતા',
    phLevel: 'પીએચ સ્તર',
  },
};

const SoilType = () => {
  const { t, language } = useLanguage();
  const { loading, data, execute, reset } = useApi();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [inputMode, setInputMode] = useState('upload');
  const [error, setError] = useState(null);

  const { reset: resetForm } = useForm({});

  // Get translation helper
  const getText = useCallback((key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  }, [language]);

  // Get language-specific content from API response
  const getLocalizedContent = useCallback((content) => {
    if (!content) return null;
    if (typeof content === 'string') return content;
    if (typeof content === 'object') {
      return content[language] || content.en || content.hi || Object.values(content)[0];
    }
    return content;
  }, [language]);

  // Get localized array content
  const getLocalizedArray = useCallback((arr) => {
    if (!arr) return [];
    if (Array.isArray(arr)) {
      return arr.map(item => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object') {
          return item[language] || item.en || item.hi || Object.values(item)[0];
        }
        return item;
      });
    }
    if (typeof arr === 'object') {
      return arr[language] || arr.en || arr.hi || [];
    }
    return [];
  }, [language]);

  /* ------------------ Image Upload ------------------ */
  const handleImageSelect = useCallback((file) => {
    if (!file) return;

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    reset();
    setError(null);
  }, [reset]);

  /* ------------------ Camera Capture ------------------ */
  const handleCameraCapture = useCallback((base64) => {
    setImagePreview(base64);
    setInputMode('camera');
  }, []);

  /* ------------------ Analyze (Upload) ------------------ */
  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error(getText('imageRequired'));
      setError(getText('imageRequired'));
      return;
    }

    await execute(
      () => soilAPI.detectType(selectedImage, language),
      { showErrorToast: true }
    );
  };

  /* ------------------ Analyze (Camera) ------------------ */
  const handleAnalyzeCamera = async (base64) => {
    setShowCamera(false);
    setImagePreview(base64);
    setInputMode('camera');

    const res = await fetch(base64);
    const blob = await res.blob();
    const file = new File([blob], 'soil.jpg', { type: 'image/jpeg' });

    setSelectedImage(file);

    await execute(
      () => soilAPI.detectType(file, language),
      { showErrorToast: true }
    );
  };

  /* ------------------ Reset ------------------ */
  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setInputMode('upload');
    reset();
    resetForm();
    setError(null);
  };

  /* ------------------ Data Processing ------------------ */
  const prediction = data?.prediction ?? {};
  const explanation = data?.explanation ?? {};

  // Fix confidence - ensure it's between 0 and 1, then convert to percentage
  const getConfidencePercent = () => {
    let conf = data?.confidence || 0;
    // If confidence is already in percentage form (> 1), divide by 100
    if (conf > 1) conf = conf / 100;
    // Cap at 1 (100%)
    conf = Math.min(conf, 1);
    return Math.round(conf * 100);
  };

  // Get soil type name in current language
  const getSoilTypeName = () => {
    if (prediction.selected) {
      if (typeof prediction.selected === 'object') {
        return prediction.selected[language] || prediction.selected.en || prediction.selected.hi;
      }
      return prediction.selected;
    }
    if (prediction.title) {
      if (typeof prediction.title === 'object') {
        return prediction.title[language] || prediction.title.en || prediction.title.hi;
      }
      return prediction.title;
    }
    return getText('resultNotAvailable');
  };

  // Get crops in current language
  const getCrops = (type) => {
    const crops = prediction?.recommended_crops?.[type];
    if (!crops) return [];
    
    if (Array.isArray(crops)) return crops;
    if (typeof crops === 'object') {
      return crops[language] || crops.en || crops.hi || [];
    }
    return [];
  };

  /* ======================== RENDER ======================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pb-8">
      <PageHeader
        title={getText('pageTitle')}
        subtitle={getText('pageSubtitle')}
        icon={SoilLayersIcon}
        color="earth"
      />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* INPUT SECTION */}
          <div className="space-y-4">
            
            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-3 shadow-sm border border-amber-100"
            >
              <div className="flex gap-3">
                <Button
                  variant={inputMode === 'upload' && !showCamera ? 'primary' : 'outline'}
                  onClick={() => setInputMode('upload')}
                  icon={FiUpload}
                  fullWidth
                  className="transition-all duration-200"
                >
                  {getText('upload')}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowCamera(true)}
                  icon={FiCamera}
                  fullWidth
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
              className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden"
            >
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Soil preview"
                    className="w-full h-72 object-contain bg-gray-50 p-4"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
                  
                  {/* Image Source Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${inputMode === 'camera' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-amber-100 text-amber-700'
                      }
                    `}>
                      {inputMode === 'camera' ? '📷 Camera' : '📁 Upload'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <ImageUpload onImageSelect={handleImageSelect} error={error} />
                </div>
              )}
            </motion.div>

            {/* Analyze Button */}
            {imagePreview && !data && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  onClick={handleAnalyze}
                  loading={loading}
                  fullWidth
                  size="lg"
                  icon={loading ? null : HiOutlineSparkles}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-200"
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
                  onClick={handleReset}
                  icon={FiRefreshCw}
                  fullWidth
                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
                >
                  {getText('retry')}
                </Button>
              </motion.div>
            )}

            {/* Quick Tips Card (when no preview) */}
            {!imagePreview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100"
              >
                <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                  <FiInfo className="w-4 h-4" />
                  {getText('quickTips')}
                </h4>
                <ul className="space-y-2">
                  {['tip1', 'tip2', 'tip3'].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-amber-700">
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      {getText(tip)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* RESULTS SECTION */}
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
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 shadow-sm border-2 border-amber-200">
                  {/* Confidence Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
                      <SoilLayersIcon className="w-4 h-4" />
                      {getText('resultTitle')}
                    </span>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                      {getText('confidence')}: {getConfidencePercent()}%
                    </span>
                  </div>

                  {/* Soil Type Name */}
                  <h3 className="text-2xl font-bold text-amber-800 mb-3">
                    {getSoilTypeName()}
                  </h3>

                  {/* Confidence Meter */}
                  <ConfidenceMeter confidence={Math.min(data.confidence > 1 ? data.confidence / 100 : data.confidence, 1)} />
                </div>

                {/* Crop Recommendations */}
                {prediction?.recommended_crops && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5"
                  >
                    <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                      🌱 {getText('recommendedCrops')}
                    </h4>

                    {/* Primary Crops */}
                    {getCrops('primary').length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <FiCheckCircle className="w-4 h-4 text-green-500" />
                          {getText('bestSuitable')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {getCrops('primary').map((crop, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-medium shadow-sm"
                            >
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Secondary Crops */}
                    {getCrops('secondary').length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          <FiArrowRight className="w-4 h-4 text-green-500" />
                          {getText('otherOptions')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {getCrops('secondary').map((crop, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 rounded-full bg-green-100 text-green-800 border border-green-200 text-sm font-medium"
                            >
                              {crop}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Detailed Explanation Card */}
                {explanation && Object.keys(explanation).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    {/* Why Section */}
                    {(explanation.why || explanation.description) && (
                      <div className="p-5 border-b border-gray-100">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <FiHelpCircle className="w-4 h-4 text-blue-500" />
                          {getText('whyThisSoil')}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {getLocalizedContent(explanation.why) || getLocalizedContent(explanation.description)}
                        </p>
                      </div>
                    )}

                    {/* Characteristics Section */}
                    {(explanation.characteristics || explanation.factors) && (
                      <div className="p-5 border-b border-gray-100 bg-blue-50/30">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FiInfo className="w-4 h-4 text-blue-500" />
                          {getText('characteristics')}
                        </h4>
                        <ul className="space-y-2">
                          {getLocalizedArray(explanation.characteristics || explanation.factors).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Benefits Section */}
                    {(explanation.benefits || explanation.advantages) && (
                      <div className="p-5 border-b border-gray-100 bg-green-50/30">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FiCheckCircle className="w-4 h-4 text-green-500" />
                          {getText('benefits')}
                        </h4>
                        <ul className="space-y-2">
                          {getLocalizedArray(explanation.benefits || explanation.advantages).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Limitations Section */}
                    {(explanation.limitations || explanation.disadvantages) && (
                      <div className="p-5 border-b border-gray-100 bg-red-50/30">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FiAlertTriangle className="w-4 h-4 text-red-500" />
                          {getText('limitations')}
                        </h4>
                        <ul className="space-y-2">
                          {getLocalizedArray(explanation.limitations || explanation.disadvantages).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tips / Next Steps Section */}
                    {(explanation.tips || explanation.next_steps || explanation.prevention) && (
                      <div className="p-5 bg-amber-50/30">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FiShield className="w-4 h-4 text-amber-500" />
                          {getText('tips')}
                        </h4>
                        <ul className="space-y-2">
                          {getLocalizedArray(explanation.tips || explanation.next_steps || explanation.prevention).map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs flex-shrink-0">
                                {i + 1}
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-64"
              >
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">{getText('analyzing')}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <CameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
        onAnalyze={handleAnalyzeCamera}
        isAnalyzing={loading}
        featureType="soil"
      />
    </div>
  );
};

export default SoilType;