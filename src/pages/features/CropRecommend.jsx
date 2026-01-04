import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiWheat } from 'react-icons/gi';
import { FiRefreshCw } from 'react-icons/fi';
import toast from 'react-hot-toast';

import { useLanguage } from '../../context/LanguageContext';
import { cropAPI } from '../../services/api';
import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Slider from '../../components/common/Slider';
import FormSection from '../../components/forms/FormSection';
import InputGrid from '../../components/forms/InputGrid';
import ResultCard from '../../components/results/ResultCard';
import ConfidenceMeter from '../../components/results/ConfidenceMeter';
import ExplanationCard from '../../components/results/ExplanationCard';
import StatCard from '../../components/results/StatCard';

/* ✅ TRANSLATIONS FOR ALL THREE LANGUAGES */
const translations = {
  en: {
    pageTitle: 'Crop Recommendation',
    pageSubtitle: 'Enter soil and climate data to get crop suggestions',
    soilNutrients: '🌱 Soil Nutrients',
    soilNutrientsDesc: 'Enter NPK values (kg/ha)',
    nitrogen: 'Nitrogen',
    phosphorus: 'Phosphorus',
    potassium: 'Potassium',
    climate: '🌡 Climate',
    temperature: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    rainfall: 'Rainfall (mm)',
    soilPh: '⚗️ Soil pH',
    ph: 'pH',
    predict: 'Predict',
    retry: 'Retry',
    recommendedCrop: 'Recommended Crop',
    yourInputs: 'Your Inputs',
    commonCrops: '🌾 Common Crops',
    usingDefaultList: 'Using default crop list',
    loading: 'Loading...'
  },
  hi: {
    pageTitle: 'फसल सिफारिश',
    pageSubtitle: 'फसल सुझाव प्राप्त करने के लिए मिट्टी और जलवायु डेटा दर्ज करें',
    soilNutrients: '🌱 मिट्टी के पोषक तत्व',
    soilNutrientsDesc: 'NPK मान दर्ज करें (kg/ha)',
    nitrogen: 'नाइट्रोजन',
    phosphorus: 'फॉस्फोरस',
    potassium: 'पोटेशियम',
    climate: '🌡 जलवायु',
    temperature: 'तापमान (°C)',
    humidity: 'आर्द्रता (%)',
    rainfall: 'वर्षा (mm)',
    soilPh: '⚗️ मिट्टी का pH',
    ph: 'pH',
    predict: 'भविष्यवाणी करें',
    retry: 'पुनः प्रयास करें',
    recommendedCrop: 'अनुशंसित फसल',
    yourInputs: 'आपके इनपुट',
    commonCrops: '🌾 सामान्य फसलें',
    usingDefaultList: 'डिफ़ॉल्ट फसल सूची का उपयोग',
    loading: 'लोड हो रहा है...'
  },
  gu: {
    pageTitle: 'પાક ભલામણ',
    pageSubtitle: 'પાક સૂચનો મેળવવા માટે જમીન અને આબોહવા ડેટા દાખલ કરો',
    soilNutrients: '🌱 જમીનના પોષક તત્વો',
    soilNutrientsDesc: 'NPK મૂલ્યો દાખલ કરો (kg/ha)',
    nitrogen: 'નાઇટ્રોજન',
    phosphorus: 'ફોસ્ફરસ',
    potassium: 'પોટેશિયમ',
    climate: '🌡 આબોહવા',
    temperature: 'તાપમાન (°C)',
    humidity: 'ભેજ (%)',
    rainfall: 'વરસાદ (mm)',
    soilPh: '⚗️ જમીનનું pH',
    ph: 'pH',
    predict: 'આગાહી કરો',
    retry: 'ફરી પ્રયાસ કરો',
    recommendedCrop: 'ભલામણ કરેલ પાક',
    yourInputs: 'તમારા ઇનપુટ્સ',
    commonCrops: '🌾 સામાન્ય પાકો',
    usingDefaultList: 'ડિફોલ્ટ પાક સૂચિનો ઉપયોગ',
    loading: 'લોડ થઈ રહ્યું છે...'
  }
};

/* ✅ COMPREHENSIVE CROP DICTIONARY WITH ALL VARIATIONS */
const CROP_TRANSLATIONS = {
  // Cereals / अनाज / અનાજ
  'rice': { en: 'Rice', hi: 'धान', gu: 'ચોખા' },
  'wheat': { en: 'Wheat', hi: 'गेहूं', gu: 'ઘઉં' },
  'maize': { en: 'Maize', hi: 'मक्का', gu: 'મકાઈ' },
  'corn': { en: 'Maize', hi: 'मक्का', gu: 'મકાઈ' },
  'barley': { en: 'Barley', hi: 'जौ', gu: 'જવ' },
  'millet': { en: 'Millet', hi: 'बाजरा', gu: 'બાજરી' },
  'bajra': { en: 'Millet', hi: 'बाजरा', gu: 'બાજરી' },
  'pearl millet': { en: 'Pearl Millet', hi: 'बाजरा', gu: 'બાજરી' },
  'sorghum': { en: 'Sorghum', hi: 'ज्वार', gu: 'જુવાર' },
  'jowar': { en: 'Sorghum', hi: 'ज्वार', gu: 'જુવાર' },
  'ragi': { en: 'Finger Millet', hi: 'रागी', gu: 'નાગલી' },
  'finger millet': { en: 'Finger Millet', hi: 'रागी', gu: 'નાગલી' },
  'oats': { en: 'Oats', hi: 'जई', gu: 'ઓટ્સ' },

  // Pulses / दालें / કઠોળ
  'pigeonpeas': { en: 'Pigeon Peas', hi: 'अरहर', gu: 'તુવેર' },
  'pigeon peas': { en: 'Pigeon Peas', hi: 'अरहर', gu: 'તુવેર' },
  'arhar': { en: 'Pigeon Peas', hi: 'अरहर', gu: 'તુવેર' },
  'toor': { en: 'Pigeon Peas', hi: 'अरहर', gu: 'તુવેર' },
  'tur': { en: 'Pigeon Peas', hi: 'अरहर', gu: 'તુવેર' },
  'chickpea': { en: 'Chickpea', hi: 'चना', gu: 'ચણા' },
  'chana': { en: 'Chickpea', hi: 'चना', gu: 'ચણા' },
  'gram': { en: 'Chickpea', hi: 'चना', gu: 'ચણા' },
  'bengal gram': { en: 'Chickpea', hi: 'चना', gu: 'ચણા' },
  'lentil': { en: 'Lentil', hi: 'मसूर', gu: 'મસૂર' },
  'masoor': { en: 'Lentil', hi: 'मसूर', gu: 'મસૂર' },
  'moong': { en: 'Mung Bean', hi: 'मूंग', gu: 'મગ' },
  'mung bean': { en: 'Mung Bean', hi: 'मूंग', gu: 'મગ' },
  'mungbean': { en: 'Mung Bean', hi: 'मूंग', gu: 'મગ' },
  'green gram': { en: 'Mung Bean', hi: 'मूंग', gu: 'મગ' },
  'urad': { en: 'Black Gram', hi: 'उड़द', gu: 'અડદ' },
  'black gram': { en: 'Black Gram', hi: 'उड़द', gu: 'અડદ' },
  'blackgram': { en: 'Black Gram', hi: 'उड़द', gu: 'અડદ' },
  'kidney beans': { en: 'Kidney Beans', hi: 'राजमा', gu: 'રાજમા' },
  'kidneybeans': { en: 'Kidney Beans', hi: 'राजमा', gu: 'રાજમા' },
  'rajma': { en: 'Kidney Beans', hi: 'राजमा', gu: 'રાજમા' },
  'peas': { en: 'Peas', hi: 'मटर', gu: 'વટાણા' },
  'moth beans': { en: 'Moth Beans', hi: 'मोठ', gu: 'મઠ' },
  'mothbeans': { en: 'Moth Beans', hi: 'मोठ', gu: 'મઠ' },

  // Oilseeds / तिलहन / તેલીબિયાં
  'groundnut': { en: 'Groundnut', hi: 'मूंगफली', gu: 'મગફળી' },
  'peanut': { en: 'Groundnut', hi: 'मूंगफली', gu: 'મગફળી' },
  'mustard': { en: 'Mustard', hi: 'सरसों', gu: 'રાઈ' },
  'sarson': { en: 'Mustard', hi: 'सरसों', gu: 'રાઈ' },
  'soybean': { en: 'Soybean', hi: 'सोयाबीन', gu: 'સોયાબીન' },
  'soya bean': { en: 'Soybean', hi: 'सोयाबीन', gu: 'સોયાબીન' },
  'sunflower': { en: 'Sunflower', hi: 'सूरजमुखी', gu: 'સૂર્યમુખી' },
  'sesame': { en: 'Sesame', hi: 'तिल', gu: 'તલ' },
  'til': { en: 'Sesame', hi: 'तिल', gu: 'તલ' },
  'castor': { en: 'Castor', hi: 'अरंडी', gu: 'એરંડા' },
  'linseed': { en: 'Linseed', hi: 'अलसी', gu: 'અળસી' },
  'flax': { en: 'Linseed', hi: 'अलसी', gu: 'અળસી' },
  'coconut': { en: 'Coconut', hi: 'नारियल', gu: 'નારિયેળ' },
  'safflower': { en: 'Safflower', hi: 'कुसुम', gu: 'કુસુમ' },

  // Cash Crops / नकदी फसलें / રોકડિયા પાકો
  'cotton': { en: 'Cotton', hi: 'कपास', gu: 'કપાસ' },
  'sugarcane': { en: 'Sugarcane', hi: 'गन्ना', gu: 'શેરડી' },
  'jute': { en: 'Jute', hi: 'जूट', gu: 'શણ' },
  'tobacco': { en: 'Tobacco', hi: 'तंबाकू', gu: 'તમાકુ' },
  'rubber': { en: 'Rubber', hi: 'रबड़', gu: 'રબર' },
  'tea': { en: 'Tea', hi: 'चाय', gu: 'ચા' },
  'coffee': { en: 'Coffee', hi: 'कॉफी', gu: 'કોફી' },

  // Vegetables / सब्जियां / શાકભાજી
  'potato': { en: 'Potato', hi: 'आलू', gu: 'બટાકા' },
  'tomato': { en: 'Tomato', hi: 'टमाटर', gu: 'ટામેટા' },
  'onion': { en: 'Onion', hi: 'प्याज', gu: 'ડુંગળી' },
  'garlic': { en: 'Garlic', hi: 'लहसुन', gu: 'લસણ' },
  'ginger': { en: 'Ginger', hi: 'अदरक', gu: 'આદું' },
  'brinjal': { en: 'Brinjal', hi: 'बैंगन', gu: 'રીંગણ' },
  'eggplant': { en: 'Brinjal', hi: 'बैंगन', gu: 'રીંગણ' },
  'cabbage': { en: 'Cabbage', hi: 'पत्तागोभी', gu: 'કોબી' },
  'cauliflower': { en: 'Cauliflower', hi: 'फूलगोभी', gu: 'ફૂલકોબી' },
  'carrot': { en: 'Carrot', hi: 'गाजर', gu: 'ગાજર' },
  'radish': { en: 'Radish', hi: 'मूली', gu: 'મૂળા' },
  'spinach': { en: 'Spinach', hi: 'पालक', gu: 'પાલક' },
  'okra': { en: 'Okra', hi: 'भिंडी', gu: 'ભીંડા' },
  'ladyfinger': { en: 'Okra', hi: 'भिंडी', gu: 'ભીંડા' },
  'bitter gourd': { en: 'Bitter Gourd', hi: 'करेला', gu: 'કારેલા' },
  'bottle gourd': { en: 'Bottle Gourd', hi: 'लौकी', gu: 'દૂધી' },
  'cucumber': { en: 'Cucumber', hi: 'खीरा', gu: 'કાકડી' },
  'pumpkin': { en: 'Pumpkin', hi: 'कद्दू', gu: 'કોળું' },
  'chilli': { en: 'Chilli', hi: 'मिर्च', gu: 'મરચા' },
  'pepper': { en: 'Pepper', hi: 'मिर्च', gu: 'મરચા' },
  'green chilli': { en: 'Green Chilli', hi: 'हरी मिर्च', gu: 'લીલા મરચા' },

  // Fruits / फल / ફળો
  'mango': { en: 'Mango', hi: 'आम', gu: 'કેરી' },
  'banana': { en: 'Banana', hi: 'केला', gu: 'કેળા' },
  'apple': { en: 'Apple', hi: 'सेब', gu: 'સફરજન' },
  'orange': { en: 'Orange', hi: 'संतरा', gu: 'સંતરા' },
  'grapes': { en: 'Grapes', hi: 'अंगूर', gu: 'દ્રાક્ષ' },
  'papaya': { en: 'Papaya', hi: 'पपीता', gu: 'પપૈયા' },
  'pomegranate': { en: 'Pomegranate', hi: 'अनार', gu: 'દાડમ' },
  'guava': { en: 'Guava', hi: 'अमरूद', gu: 'જામફળ' },
  'watermelon': { en: 'Watermelon', hi: 'तरबूज', gu: 'તરબૂચ' },
  'muskmelon': { en: 'Muskmelon', hi: 'खरबूजा', gu: 'શક્કરટેટી' },
  'lemon': { en: 'Lemon', hi: 'नींबू', gu: 'લીંબુ' },
  'lime': { en: 'Lime', hi: 'नींबू', gu: 'લીંબુ' },
  'jackfruit': { en: 'Jackfruit', hi: 'कटहल', gu: 'ફણસ' },
  'litchi': { en: 'Litchi', hi: 'लीची', gu: 'લીચી' },
  'lychee': { en: 'Litchi', hi: 'लीची', gu: 'લીચી' },
  'pineapple': { en: 'Pineapple', hi: 'अनानास', gu: 'અનાનસ' },
  'sapota': { en: 'Sapota', hi: 'चीकू', gu: 'ચીકુ' },
  'chikoo': { en: 'Sapota', hi: 'चीकू', gu: 'ચીકુ' },

  // Spices / मसाले / મસાલા
  'cumin': { en: 'Cumin', hi: 'जीरा', gu: 'જીરું' },
  'jeera': { en: 'Cumin', hi: 'जीरा', gu: 'જીરું' },
  'coriander': { en: 'Coriander', hi: 'धनिया', gu: 'ધાણા' },
  'turmeric': { en: 'Turmeric', hi: 'हल्दी', gu: 'હળદર' },
  'haldi': { en: 'Turmeric', hi: 'हल्दी', gu: 'હળદર' },
  'fenugreek': { en: 'Fenugreek', hi: 'मेथी', gu: 'મેથી' },
  'methi': { en: 'Fenugreek', hi: 'मेथी', gu: 'મેથી' },
  'fennel': { en: 'Fennel', hi: 'सौंफ', gu: 'વરિયાળી' },
  'saunf': { en: 'Fennel', hi: 'सौंफ', gu: 'વરિયાળી' },
  'cardamom': { en: 'Cardamom', hi: 'इलायची', gu: 'એલચી' },
  'clove': { en: 'Clove', hi: 'लौंग', gu: 'લવિંગ' },
  'black pepper': { en: 'Black Pepper', hi: 'काली मिर्च', gu: 'કાળા મરી' },
  'ajwain': { en: 'Carom Seeds', hi: 'अजवाइन', gu: 'અજમો' },
  'carom seeds': { en: 'Carom Seeds', hi: 'अजवाइन', gu: 'અજમો' },
  'asafoetida': { en: 'Asafoetida', hi: 'हींग', gu: 'હિંગ' },
  'hing': { en: 'Asafoetida', hi: 'हींग', gu: 'હિંગ' }
};

/* ✅ DEFAULT CROPS LIST FOR DISPLAY */
const DEFAULT_CROP_LIST = [
  'rice', 'wheat', 'maize', 'cotton', 'sugarcane',
  'pigeonpeas', 'chickpea', 'groundnut', 'mustard',
  'soybean', 'barley', 'millet', 'sorghum', 'potato',
  'tomato', 'onion', 'cumin', 'coriander', 'turmeric'
];

const CropRecommend = () => {
  const { t, language } = useLanguage();
  const { loading, data, execute, reset } = useApi();
  const [cropList, setCropList] = useState(DEFAULT_CROP_LIST);

  // ✅ Get translation for current language
  const getText = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  // ✅ FIXED: Get crop name in current language with normalization
  const getCropName = (crop) => {
    if (!crop) return '';

    // If crop is already an object with translations
    if (typeof crop === 'object' && crop !== null) {
      return crop[language] || crop.en || crop.hi || crop.gu || '';
    }

    // Normalize the crop name for lookup
    const normalizedCrop = String(crop)
      .toLowerCase()
      .trim()
      .replace(/[-_]/g, ' ')      // Replace hyphens/underscores with spaces
      .replace(/\s+/g, ' ');       // Normalize multiple spaces

    // Also try without spaces
    const noSpaceCrop = normalizedCrop.replace(/\s/g, '');

    // Try to find in dictionary
    const translation = CROP_TRANSLATIONS[normalizedCrop] || 
                       CROP_TRANSLATIONS[noSpaceCrop];

    if (translation) {
      return translation[language] || translation.en;
    }

    // If not found, return original with first letter capitalized
    return String(crop).charAt(0).toUpperCase() + String(crop).slice(1);
  };

  // ================= FORM STATE =================
  const initialValues = {
    nitrogen: 60,
    phosphorus: 85,
    potassium: 63,
    temperature: 25,
    humidity: 60,
    ph: 6.5,
    rainfall: 100
  };

  const { values, handleChange, reset: resetForm } = useForm(initialValues);

  // ================= FETCH CROPS =================
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await cropAPI.getCropList();
        if (Array.isArray(res?.crops) && res.crops.length > 0) {
          setCropList(res.crops);
        } else {
          setCropList(DEFAULT_CROP_LIST);
        }
      } catch {
        setCropList(DEFAULT_CROP_LIST);
        toast.error(getText('usingDefaultList'));
      }
    };
    fetchCrops();
  }, [language]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    await execute(
      () => cropAPI.recommend({ ...values, language }),
      { showErrorToast: true }
    );
  };

  // ================= RESET =================
  const handleReset = () => {
    resetForm();
    reset();
  };

  // ================= CONFIDENCE SAFE =================
  const confidence = Math.min(
    100,
    Math.max(0, Number(data?.confidence ?? 0))
  );

  // ✅ Get recommended crop name in current language
  const getRecommendedCropName = () => {
    const crop = data?.prediction?.recommended_crop;
    if (!crop) return '';
    return getCropName(crop);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <PageHeader
        title={getText('pageTitle')}
        subtitle={getText('pageSubtitle')}
        icon={GiWheat}
        color="primary"
      />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {/* ================= INPUT ================= */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormSection 
              title={getText('soilNutrients')} 
              description={getText('soilNutrientsDesc')}
            >
              <InputGrid columns={3}>
                <Slider 
                  label={getText('nitrogen')} 
                  value={values.nitrogen} 
                  min={0} 
                  max={200}
                  onChange={(v) => handleChange('nitrogen', v)} 
                />
                <Slider 
                  label={getText('phosphorus')} 
                  value={values.phosphorus} 
                  min={0} 
                  max={200}
                  onChange={(v) => handleChange('phosphorus', v)} 
                />
                <Slider 
                  label={getText('potassium')} 
                  value={values.potassium} 
                  min={0} 
                  max={200}
                  onChange={(v) => handleChange('potassium', v)} 
                />
              </InputGrid>
            </FormSection>

            <FormSection title={getText('climate')}>
              <InputGrid columns={2}>
                <Slider 
                  label={getText('temperature')} 
                  value={values.temperature} 
                  min={-10} 
                  max={60}
                  onChange={(v) => handleChange('temperature', v)} 
                />
                <Slider 
                  label={getText('humidity')} 
                  value={values.humidity} 
                  min={0} 
                  max={100}
                  onChange={(v) => handleChange('humidity', v)} 
                />
              </InputGrid>

              <div className="mt-4">
                <Slider 
                  label={getText('rainfall')} 
                  value={values.rainfall} 
                  min={0} 
                  max={500} 
                  step={10}
                  onChange={(v) => handleChange('rainfall', v)} 
                />
              </div>
            </FormSection>

            <FormSection title={getText('soilPh')}>
              <Slider 
                label={getText('ph')} 
                value={values.ph} 
                min={0} 
                max={14} 
                step={0.1}
                onChange={(v) => handleChange('ph', v)} 
              />
            </FormSection>

            <div className="space-y-3">
              <Button 
                type="submit" 
                fullWidth 
                size="lg" 
                loading={loading} 
                icon={GiWheat}
              >
                {getText('predict')}
              </Button>

              {data && (
                <Button
                  type="button"
                  fullWidth
                  variant="outline"
                  icon={FiRefreshCw}
                  onClick={handleReset}
                >
                  {getText('retry')}
                </Button>
              )}
            </div>
          </form>

          {/* ================= RESULT ================= */}
          <AnimatePresence mode="wait">
            {data && !loading && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <ResultCard
                  title={getText('recommendedCrop')}
                  value={getRecommendedCropName()}
                  type="success"
                  icon={GiWheat}
                >
                  <ConfidenceMeter confidence={confidence} />
                </ResultCard>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold mb-3">{getText('yourInputs')}</h3>
                  <div className="grid grid-cols-4 gap-3">
                    <StatCard 
                      label={language === 'hi' ? 'ना' : language === 'gu' ? 'ના' : 'N'} 
                      value={values.nitrogen} 
                    />
                    <StatCard 
                      label={language === 'hi' ? 'फ़ॉ' : language === 'gu' ? 'ફો' : 'P'} 
                      value={values.phosphorus} 
                    />
                    <StatCard 
                      label={language === 'hi' ? 'पो' : language === 'gu' ? 'પો' : 'K'} 
                      value={values.potassium} 
                    />
                    <StatCard 
                      label="pH" 
                      value={values.ph} 
                    />
                  </div>
                </div>

                {data?.explanation && (
                  <div className="bg-white rounded-2xl shadow-sm divide-y">
                    <ExplanationCard explanation={data.explanation} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= COMMON CROPS ================= */}
        <div className="mt-10 bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold mb-4">{getText('commonCrops')}</h3>

          <div className="flex flex-wrap gap-2">
            {cropList.map((crop, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 
                         border border-green-200 rounded-full text-sm font-medium 
                         text-green-700 hover:from-green-100 hover:to-emerald-100 
                         transition-colors cursor-default"
              >
                {getCropName(crop)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropRecommend;