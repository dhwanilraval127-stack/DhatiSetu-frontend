import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiActivity, FiRefreshCw, FiInfo, FiDroplet, FiThermometer, FiRadio } from 'react-icons/fi';
import { GiPlantRoots } from 'react-icons/gi';
import { HiOutlineSparkles } from 'react-icons/hi';
import { MdSatelliteAlt } from 'react-icons/md';
import toast from 'react-hot-toast';

import { useLanguage } from '../../context/LanguageContext';
import { weatherAPI } from '../../services/api';

import Button from '../../components/common/Button';
import Slider from '../../components/common/Slider';
import FormSection from '../../components/forms/FormSection';
import InputGrid from '../../components/forms/InputGrid';
import ResultCard from '../../components/results/ResultCard';
import ExplanationCard from '../../components/results/ExplanationCard';
import StatCard from '../../components/results/StatCard';
import CameraModal from '../../components/camera/CameraModal';

/* =========================
   TRANSLATIONS
========================= */
const translations = {
  en: {
    pageTitle: 'NDVI Analysis',
    pageSubtitle: 'Analyze vegetation health using spectral bands',
    spectralBands: '📡 Spectral Bands',
    spectralDesc: 'Enter Red and NIR reflectance values',
    redBand: 'Red Band',
    nirBand: 'NIR Band',
    currentNDVI: 'Current NDVI',
    environmental: '🌡 Environmental Conditions',
    environmentalDesc: 'Weather parameters affecting vegetation',
    temperature: 'Temperature',
    rainfall: 'Rainfall',
    analyze: 'Analyze NDVI',
    reset: 'Reset',
    analyzing: 'Analyzing...',
    vegetationHealth: 'Vegetation Health',
    healthScore: 'Health Score',
    ndviMap: '🗺 NDVI Heatmap',
    mapSize: 'Grid Size',
    placeholder: 'Enter Red & NIR values and click Analyze to generate NDVI heatmap',
    analysisComplete: 'Analysis complete!',
    legend: 'Legend',
    dense: 'Dense Vegetation',
    moderate: 'Moderate Vegetation',
    sparse: 'Sparse Vegetation',
    bare: 'Bare Soil',
    water: 'Water/Snow',
    healthStatus: {
      excellent: 'Excellent Health',
      good: 'Good Health',
      moderate: 'Moderate Health',
      poor: 'Poor Health',
      critical: 'Critical'
    },
    tips: 'Quick Tips',
    tip1: 'NIR values > 0.5 indicate healthy vegetation',
    tip2: 'NDVI > 0.6 means dense green vegetation',
    tip3: 'Low NDVI may indicate drought stress'
  },
  hi: {
    pageTitle: 'NDVI विश्लेषण',
    pageSubtitle: 'स्पेक्ट्रल बैंड का उपयोग करके वनस्पति स्वास्थ्य का विश्लेषण करें',
    spectralBands: '📡 स्पेक्ट्रल बैंड',
    spectralDesc: 'रेड और NIR परावर्तन मान दर्ज करें',
    redBand: 'रेड बैंड',
    nirBand: 'NIR बैंड',
    currentNDVI: 'वर्तमान NDVI',
    environmental: '🌡 पर्यावरणीय स्थितियां',
    environmentalDesc: 'वनस्पति को प्रभावित करने वाले मौसम पैरामीटर',
    temperature: 'तापमान',
    rainfall: 'वर्षा',
    analyze: 'NDVI विश्लेषण करें',
    reset: 'रीसेट',
    analyzing: 'विश्लेषण हो रहा है...',
    vegetationHealth: 'वनस्पति स्वास्थ्य',
    healthScore: 'स्वास्थ्य स्कोर',
    ndviMap: '🗺 NDVI हीटमैप',
    mapSize: 'ग्रिड आकार',
    placeholder: 'NDVI हीटमैप जनरेट करने के लिए रेड और NIR मान दर्ज करें और विश्लेषण पर क्लिक करें',
    analysisComplete: 'विश्लेषण पूर्ण!',
    legend: 'लीजेंड',
    dense: 'घनी वनस्पति',
    moderate: 'मध्यम वनस्पति',
    sparse: 'विरल वनस्पति',
    bare: 'नंगी मिट्टी',
    water: 'पानी/बर्फ',
    healthStatus: {
      excellent: 'उत्कृष्ट स्वास्थ्य',
      good: 'अच्छा स्वास्थ्य',
      moderate: 'मध्यम स्वास्थ्य',
      poor: 'खराब स्वास्थ्य',
      critical: 'गंभीर'
    },
    tips: 'त्वरित सुझाव',
    tip1: 'NIR मान > 0.5 स्वस्थ वनस्पति दर्शाता है',
    tip2: 'NDVI > 0.6 का मतलब घनी हरी वनस्पति',
    tip3: 'कम NDVI सूखे के तनाव का संकेत हो सकता है'
  },
  gu: {
    pageTitle: 'NDVI વિશ્લેષણ',
    pageSubtitle: 'સ્પેક્ટ્રલ બેન્ડનો ઉપયોગ કરીને વનસ્પતિ સ્વાસ્થ્યનું વિશ્લેષણ કરો',
    spectralBands: '📡 સ્પેક્ટ્રલ બેન્ડ',
    spectralDesc: 'રેડ અને NIR પ્રતિબિંબ મૂલ્યો દાખલ કરો',
    redBand: 'રેડ બેન્ડ',
    nirBand: 'NIR બેન્ડ',
    currentNDVI: 'વર્તમાન NDVI',
    environmental: '🌡 પર્યાવરણીય સ્થિતિઓ',
    environmentalDesc: 'વનસ્પતિને અસર કરતા હવામાન પરિમાણો',
    temperature: 'તાપમાન',
    rainfall: 'વરસાદ',
    analyze: 'NDVI વિશ્લેષણ કરો',
    reset: 'રીસેટ',
    analyzing: 'વિશ્લેષણ થઈ રહ્યું છે...',
    vegetationHealth: 'વનસ્પતિ સ્વાસ્થ્ય',
    healthScore: 'સ્વાસ્થ્ય સ્કોર',
    ndviMap: '🗺 NDVI હીટમેપ',
    mapSize: 'ગ્રીડ કદ',
    placeholder: 'NDVI હીટમેપ જનરેટ કરવા માટે રેડ અને NIR મૂલ્યો દાખલ કરો અને વિશ્લેષણ પર ક્લિક કરો',
    analysisComplete: 'વિશ્લેષણ પૂર્ણ!',
    legend: 'લીજેન્ડ',
    dense: 'ગાઢ વનસ્પતિ',
    moderate: 'મધ્યમ વનસ્પતિ',
    sparse: 'છૂટીછવાઈ વનસ્પતિ',
    bare: 'ખુલ્લી જમીન',
    water: 'પાણી/બરફ',
    healthStatus: {
      excellent: 'ઉત્તમ સ્વાસ્થ્ય',
      good: 'સારું સ્વાસ્થ્ય',
      moderate: 'મધ્યમ સ્વાસ્થ્ય',
      poor: 'નબળું સ્વાસ્થ્ય',
      critical: 'ગંભીર'
    },
    tips: 'ઝડપી ટિપ્સ',
    tip1: 'NIR મૂલ્ય > 0.5 સ્વસ્થ વનસ્પતિ દર્શાવે છે',
    tip2: 'NDVI > 0.6 એટલે ગાઢ લીલી વનસ્પતિ',
    tip3: 'ઓછું NDVI દુષ્કાળના તણાવનું સૂચન હોઈ શકે'
  }
};
const vegetationStatusMap = {
  'excellent health': {
    en: 'Excellent Health',
    hi: 'उत्कृष्ट स्वास्थ्य',
    gu: 'ઉત્તમ સ્વાસ્થ્ય'
  },
  'good health': {
    en: 'Good Health',
    hi: 'अच्छा स्वास्थ्य',
    gu: 'સારું સ્વાસ્થ્ય'
  },
  'moderate health': {
    en: 'Moderate Health',
    hi: 'मध्यम स्वास्थ्य',
    gu: 'મધ્યમ સ્વાસ્થ્ય'
  },
  'moderate vegetation': {
    en: 'Moderate Vegetation',
    hi: 'मध्यम वनस्पति',
    gu: 'મધ્યમ વનસ્પતિ'
  },
  'dense vegetation': {
    en: 'Dense Vegetation',
    hi: 'घनी वनस्पति',
    gu: 'ગાઢ વનસ્પતિ'
  },
  'sparse vegetation': {
    en: 'Sparse Vegetation',
    hi: 'विरल वनस्पति',
    gu: 'છૂટીછવાઈ વનસ્પતિ'
  },
  'very sparse vegetation': {
    en: 'Very Sparse Vegetation',
    hi: 'बहुत विरल वनस्पति',
    gu: 'ખૂબ છૂટીછવાઈ વનસ્પતિ'
  },
  'bare soil': {
    en: 'Bare Soil',
    hi: 'नंगी मिट्टी',
    gu: 'ખુલ્લી જમીન'
  },
  'water or snow': {
    en: 'Water or Snow',
    hi: 'पानी या बर्फ',
    gu: 'પાણી અથવા બરફ'
  },
  'water/snow': {
    en: 'Water/Snow',
    hi: 'पानी/बर्फ',
    gu: 'પાણી/બરફ'
  },
  'poor health': {
    en: 'Poor Health',
    hi: 'खराब स्वास्थ्य',
    gu: 'નબળું સ્વાસ્થ્ય'
  },
  'critical': {
    en: 'Critical',
    hi: 'गंभीर',
    gu: 'ગંભીર'
  },
  'healthy': {
    en: 'Healthy',
    hi: 'स्वस्थ',
    gu: 'સ્વસ્થ'
  },
  'unhealthy': {
    en: 'Unhealthy',
    hi: 'अस्वस्थ',
    gu: 'અસ્વસ્થ'
  },
  'stressed': {
    en: 'Stressed',
    hi: 'तनावग्रस्त',
    gu: 'તણાવગ્રસ્ત'
  },
  'very healthy': {
    en: 'Very Healthy',
    hi: 'बहुत स्वस्थ',
    gu: 'ખૂબ સ્વસ્થ'
  },
  'extremely healthy': {
    en: 'Extremely Healthy',
    hi: 'अत्यंत स्वस्थ',
    gu: 'અત્યંત સ્વસ્થ'
  }
};
const translateStatus = (status, lang) => {
  if (!status) return '';
  
  const key = status.toLowerCase().trim();
  
  // Direct match
  if (vegetationStatusMap[key]) {
    return vegetationStatusMap[key][lang] || vegetationStatusMap[key].en || status;
  }
  
  // Partial match
  for (const [mapKey, translations] of Object.entries(vegetationStatusMap)) {
    if (key.includes(mapKey) || mapKey.includes(key)) {
      return translations[lang] || translations.en || status;
    }
  }
  
  return status;
};
/* =========================
   HELPERS
========================= */
const generateNDVIMap = (size) =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => Math.random() * 2 - 1)
  );

const getNDVIColor = (v) => {
  if (v >= 0.6) return 'bg-green-600';
  if (v >= 0.3) return 'bg-green-400';
  if (v >= 0.1) return 'bg-yellow-400';
  if (v >= 0) return 'bg-orange-400';
  return 'bg-red-400';
};

const getNDVIGradient = (v) => {
  if (v >= 0.6) return 'from-green-500 to-green-700';
  if (v >= 0.3) return 'from-green-400 to-green-600';
  if (v >= 0.1) return 'from-yellow-400 to-green-400';
  if (v >= 0) return 'from-orange-400 to-yellow-400';
  return 'from-red-500 to-orange-400';
};

const getHealthStatus = (ndvi, lang, translations) => {
  const status = translations[lang]?.healthStatus || translations.en.healthStatus;
  if (ndvi >= 0.6) return { label: status.excellent, color: 'text-green-600', bg: 'bg-green-100' };
  if (ndvi >= 0.4) return { label: status.good, color: 'text-green-500', bg: 'bg-green-50' };
  if (ndvi >= 0.2) return { label: status.moderate, color: 'text-yellow-600', bg: 'bg-yellow-50' };
  if (ndvi >= 0) return { label: status.poor, color: 'text-orange-600', bg: 'bg-orange-50' };
  return { label: status.critical, color: 'text-red-600', bg: 'bg-red-50' };
};

/* =========================
   COMPONENT
========================= */
const NDVI = () => {
  const { language } = useLanguage();

  // Get translation helper
  const getText = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const [formData, setFormData] = useState({
    red_band: 0.1,
    nir_band: 0.5,
    temperature: 28,
    rainfall: 100,
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [ndviMap, setNdviMap] = useState(null);
  const [mapSize, setMapSize] = useState(8);
  const [showCamera, setShowCamera] = useState(false);

  // Calculate NDVI in real-time
  const ndvi =
    (formData.nir_band - formData.red_band) /
    (formData.nir_band + formData.red_band || 1);

  const healthStatus = getHealthStatus(ndvi, language, translations);

  const handleChange = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  /* =========================
     ANALYZE
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await weatherAPI.analyzeNDVI({ ...formData, language });
      setData(res);
      setNdviMap(generateNDVIMap(mapSize));
      toast.success(getText('analysisComplete'));
    } catch (err) {
      setError(err.message || 'Something went wrong');
      toast.error(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      red_band: 0.1,
      nir_band: 0.5,
      temperature: 28,
      rainfall: 100,
    });
    setData(null);
    setError(null);
    setNdviMap(null);
  };

  /* =========================
     NDVI LEGEND COMPONENT
  ========================= */
  const NDVILegend = () => (
    <div className="bg-gray-50 rounded-xl p-4 mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <FiInfo className="text-gray-500" />
        {getText('legend')}
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { color: 'bg-green-600', label: getText('dense'), range: '> 0.6' },
          { color: 'bg-green-400', label: getText('moderate'), range: '0.3 - 0.6' },
          { color: 'bg-yellow-400', label: getText('sparse'), range: '0.1 - 0.3' },
          { color: 'bg-orange-400', label: getText('bare'), range: '0 - 0.1' },
          { color: 'bg-red-400', label: getText('water'), range: '< 0' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className={`w-4 h-4 rounded ${item.color}`} />
            <div>
              <div className="font-medium text-gray-700">{item.label}</div>
              <div className="text-gray-500">{item.range}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 pb-10">
      <div className="max-w-7xl mx-auto px-4 pt-6">

        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 text-white shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              {/* ✅ FIXED: Using MdSatelliteAlt or FiRadio instead of GiSatellite */}
              <MdSatelliteAlt className="text-3xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{getText('pageTitle')}</h1>
              <p className="text-green-100 mt-1">{getText('pageSubtitle')}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* ================= LEFT PANEL - FORM ================= */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-5"
          >
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Spectral Bands */}
              <FormSection
                title={getText('spectralBands')}
                description={getText('spectralDesc')}
              >
                <InputGrid columns={1}>
                  <Slider
                    label={getText('redBand')}
                    min={0}
                    max={1}
                    step={0.01}
                    value={formData.red_band}
                    onChange={(v) => handleChange('red_band', v)}
                  />
                  <Slider
                    label={getText('nirBand')}
                    min={0}
                    max={1}
                    step={0.01}
                    value={formData.nir_band}
                    onChange={(v) => handleChange('nir_band', v)}
                  />
                </InputGrid>

                {/* Real-time NDVI Display */}
                <div className="mt-4 bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      {getText('currentNDVI')}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${healthStatus.color}`}>
                        {ndvi.toFixed(3)}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${healthStatus.bg} ${healthStatus.color}`}>
                        {healthStatus.label}
                      </span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(0, Math.min(100, (ndvi + 1) * 50))}%` }}
                      transition={{ duration: 0.3 }}
                      className={`h-full rounded-full bg-gradient-to-r ${getNDVIGradient(ndvi)}`}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>-1</span>
                    <span>0</span>
                    <span>+1</span>
                  </div>
                </div>
              </FormSection>

              {/* Environmental Conditions */}
              <FormSection
                title={getText('environmental')}
                description={getText('environmentalDesc')}
              >
                <InputGrid columns={2}>
                  <Slider
                    label={getText('temperature')}
                    min={0}
                    max={50}
                    unit="°C"
                    value={formData.temperature}
                    onChange={(v) => handleChange('temperature', v)}
                  />
                  <Slider
                    label={getText('rainfall')}
                    min={0}
                    max={500}
                    step={10}
                    unit=" mm"
                    value={formData.rainfall}
                    onChange={(v) => handleChange('rainfall', v)}
                  />
                </InputGrid>
              </FormSection>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  icon={FiActivity}
                >
                  {loading ? getText('analyzing') : getText('analyze')}
                </Button>
                {data && (
                  <Button
                    variant="outline"
                    icon={FiRefreshCw}
                    onClick={handleReset}
                  >
                    {getText('reset')}
                  </Button>
                )}
              </div>
            </form>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <HiOutlineSparkles className="text-yellow-500" />
                {getText('tips')}
              </h3>
              <ul className="space-y-2">
                {['tip1', 'tip2', 'tip3'].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {getText(tip)}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ================= RIGHT PANEL - RESULTS ================= */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-2 flex flex-col gap-5 min-h-[300px]"
          >
            <AnimatePresence mode="wait">
              {/* Loading State */}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-72 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="text-center">
                    <div className="relative">
                      <div className="animate-spin w-14 h-14 border-4 border-green-200 border-t-green-600 rounded-full mx-auto" />
                      <GiPlantRoots className="absolute inset-0 m-auto text-green-600 text-xl" />
                    </div>
                    <p className="text-gray-500 mt-4">{getText('analyzing')}</p>
                  </div>
                </motion.div>
              )}

              {/* Placeholder State */}
              {!loading && !data && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-72 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-center p-8"
                >
                  <div>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mx-auto mb-4">
                      <GiPlantRoots className="text-green-500 text-4xl" />
                    </div>
                    <p className="text-gray-500 max-w-sm">
                      {getText('placeholder')}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Results */}
              {data && !loading && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  {/* Main Result Card */}
                  <ResultCard
                    type="success"
                    title={getText('vegetationHealth')}
                    value={data.prediction?.status_label || healthStatus.label}
                    subtitle={`NDVI: ${data.prediction?.ndvi_value?.toFixed(3) || ndvi.toFixed(3)}`}
                    icon={GiPlantRoots}
                  />

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard
                      label="NDVI"
                      value={data.prediction?.ndvi_value?.toFixed(3) || ndvi.toFixed(3)}
                      icon={FiActivity}
                    />
                    <StatCard
                      label={getText('healthScore')}
                      value={data.prediction?.health_score?.toFixed(1) || ((ndvi + 1) * 50).toFixed(1)}
                      unit="%"
                      icon={FiSun}
                    />
                    <StatCard
                      label={getText('temperature')}
                      value={formData.temperature}
                      unit="°C"
                      icon={FiThermometer}
                    />
                    <StatCard
                      label={getText('rainfall')}
                      value={formData.rainfall}
                      unit="mm"
                      icon={FiDroplet}
                    />
                  </div>

                  {/* Explanation */}
                  {data.explanation && (
                    <ExplanationCard explanation={data.explanation} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* NDVI Map */}
            {data && ndviMap && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
                  <h3 className="font-semibold text-gray-800">{getText('ndviMap')}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{getText('mapSize')}:</span>
                    <select
                      value={mapSize}
                      onChange={(e) => {
                        const size = +e.target.value;
                        setMapSize(size);
                        setNdviMap(generateNDVIMap(size));
                      }}
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-gray-50 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value={5}>5×5</option>
                      <option value={8}>8×8</option>
                      <option value={10}>10×10</option>
                      <option value={12}>12×12</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setNdviMap(generateNDVIMap(mapSize))}
                      className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Map Grid */}
                <div className="overflow-x-auto">
                  <div
                    className="grid gap-1 min-w-[280px] max-w-lg mx-auto"
                    style={{ gridTemplateColumns: `repeat(${mapSize}, 1fr)` }}
                  >
                    {ndviMap.flat().map((v, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.005 }}
                        title={`NDVI: ${v.toFixed(2)}`}
                        className={`aspect-square rounded-sm cursor-pointer hover:ring-2 hover:ring-white hover:ring-offset-1 transition-all ${getNDVIColor(v)}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Legend */}
                <NDVILegend />
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        featureType="ndvi"
      />
    </div>
  );
};

export default NDVI;