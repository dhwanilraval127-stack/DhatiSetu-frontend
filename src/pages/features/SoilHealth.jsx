import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiAlertTriangle, FiX, FiRefreshCw, FiInfo } from 'react-icons/fi';
import { GiMountainCave } from 'react-icons/gi';
import toast from 'react-hot-toast';

import { useLanguage } from '../../context/LanguageContext';
import { soilAPI } from '../../services/api';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Slider from '../../components/common/Slider';
import FormSection from '../../components/forms/FormSection';
import InputGrid from '../../components/forms/InputGrid';
import ResultCard from '../../components/results/ResultCard';
import ExplanationCard from '../../components/results/ExplanationCard';
import ConfidenceMeter from '../../components/results/ConfidenceMeter';

const SoilHealth = () => {
  const { t, language } = useLanguage();

  // Helper function for multi-language text
  const getText = (en, hi, gu) => {
    switch (language) {
      case 'hi':
        return hi;
      case 'gu':
        return gu;
      default:
        return en;
    }
  };

  // Nutrient Display Names with all 3 languages
  const NUTRIENT_NAMES = {
    nitrogen: {
      en: 'Nitrogen (N)',
      hi: 'नाइट्रोजन (N)',
      gu: 'નાઇટ્રોજન (N)'
    },
    phosphorus: {
      en: 'Phosphorus (P)',
      hi: 'फास्फोरस (P)',
      gu: 'ફોસ્ફરસ (P)'
    },
    potassium: {
      en: 'Potassium (K)',
      hi: 'पोटेशियम (K)',
      gu: 'પોટેશિયમ (K)'
    },
    ph: {
      en: 'Soil pH',
      hi: 'मिट्टी का pH',
      gu: 'માટીનો pH'
    },
    organic_carbon: {
      en: 'Organic Carbon',
      hi: 'जैविक कार्बन',
      gu: 'કાર્બનિક કાર્બન'
    },
    ec: {
      en: 'Electrical Conductivity',
      hi: 'विद्युत चालकता',
      gu: 'વિદ્યુત વાહકતા'
    }
  };

  // Slider labels with all 3 languages
  const SLIDER_LABELS = {
    nitrogen: {
      label: getText('Nitrogen (kg/ha)', 'नाइट्रोजन (kg/ha)', 'નાઇટ્રોજન (kg/ha)'),
      hint: getText(
        'Amount of nitrogen in soil',
        'मिट्टी में नाइट्रोजन की मात्रा',
        'માટીમાં નાઇટ્રોજનની માત્રા'
      )
    },
    phosphorus: {
      label: getText('Phosphorus (kg/ha)', 'फास्फोरस (kg/ha)', 'ફોસ્ફરસ (kg/ha)'),
      hint: getText(
        'Amount of phosphorus in soil',
        'मिट्टी में फास्फोरस की मात्रा',
        'માટીમાં ફોસ્ફરસની માત્રા'
      )
    },
    potassium: {
      label: getText('Potassium (kg/ha)', 'पोटेशियम (kg/ha)', 'પોટેશિયમ (kg/ha)'),
      hint: getText(
        'Amount of potassium in soil',
        'मिट्टी में पोटेशियम की मात्रा',
        'માટીમાં પોટેશિયમની માત્રા'
      )
    },
    ph: {
      label: getText('Soil pH', 'मिट्टी का pH', 'માટીનો pH'),
      hint: getText(
        'pH level of soil (acidic to alkaline)',
        'मिट्टी का pH स्तर (अम्लीय से क्षारीय)',
        'માટીનું pH સ્તર (એસિડિક થી આલ્કલાઇન)'
      )
    },
    organic_carbon: {
      label: getText('Organic Carbon (%)', 'जैविक कार्बन (%)', 'કાર્બનિક કાર્બન (%)'),
      hint: getText(
        'Percentage of organic carbon',
        'जैविक कार्बन का प्रतिशत',
        'કાર્બનિક કાર્બનની ટકાવારી'
      )
    },
    ec: {
      label: getText('EC (dS/m)', 'विद्युत चालकता (dS/m)', 'વિદ્યુત વાહકતા (dS/m)'),
      hint: getText(
        'Electrical conductivity of soil',
        'मिट्टी की विद्युत चालकता',
        'માટીની વિદ્યુત વાહકતા'
      )
    }
  };

  // Status labels with all 3 languages
  const STATUS_LABELS = {
    optimal: getText('Optimal', 'उचित', 'શ્રેષ્ઠ'),
    high: getText('High', 'अधिक', 'ઉચ્ચ'),
    low: getText('Low', 'कम', 'ઓછું'),
    good: getText('Good', 'अच्छा', 'સારું'),
    moderate: getText('Moderate', 'मध्यम', 'મધ્યમ'),
    poor: getText('Poor', 'खराब', 'નબળું')
  };

  const [formData, setFormData] = useState({
    nitrogen: 280,
    phosphorus: 35,
    potassium: 250,
    ph: 6.5,
    organic_carbon: 0.8,
    ec: 0.5
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  /* ---------------- Handlers ---------------- */

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await soilAPI.assessHealth({
        ...formData,
        language
      });

      setData(response);
      toast.success(
        getText(
          'Soil health analysis complete!',
          'मिट्टी स्वास्थ्य विश्लेषण पूर्ण!',
          'માટી સ્વાસ્થ્ય વિશ્લેષણ પૂર્ણ!'
        )
      );
    } catch (err) {
      const msg =
        typeof err === 'string'
          ? err
          : err?.message || getText(
              'Something went wrong',
              'कुछ गलत हो गया',
              'કંઈક ખોટું થયું'
            );

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nitrogen: 280,
      phosphorus: 35,
      potassium: 250,
      ph: 6.5,
      organic_carbon: 0.8,
      ec: 0.5
    });
    setData(null);
    setError(null);
  };

  /* ---------------- UI Helpers ---------------- */

  const getStatusInfo = (status) => {
    switch (status) {
      case 'optimal':
        return { 
          icon: FiCheck, 
          color: 'text-green-600', 
          bg: 'bg-green-100',
          label: STATUS_LABELS.optimal
        };
      case 'high':
        return { 
          icon: FiAlertTriangle, 
          color: 'text-yellow-600', 
          bg: 'bg-yellow-100',
          label: STATUS_LABELS.high
        };
      case 'low':
        return { 
          icon: FiX, 
          color: 'text-red-600', 
          bg: 'bg-red-100',
          label: STATUS_LABELS.low
        };
      default:
        return { 
          icon: FiCheck, 
          color: 'text-gray-600', 
          bg: 'bg-gray-100',
          label: status
        };
    }
  };

  const getHealthType = () => {
    if (!data?.prediction?.health_status) return 'info';
    if (data.prediction.health_status === 'good') return 'success';
    if (data.prediction.health_status === 'moderate') return 'warning';
    return 'error';
  };

  const getHealthLabel = (status) => {
    switch (status) {
      case 'good':
        return getText('Healthy Soil', 'स्वस्थ मिट्टी', 'સ્વસ્થ માટી');
      case 'moderate':
        return getText('Moderate Health', 'मध्यम स्वास्थ्य', 'મધ્યમ સ્વાસ્થ્ય');
      case 'poor':
        return getText('Poor Health', 'खराब स्वास्थ्य', 'નબળું સ્વાસ્થ્ય');
      default:
        return status;
    }
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <PageHeader
        title={getText('Soil Health Analysis', 'मिट्टी स्वास्थ्य विश्लेषण', 'માટી સ્વાસ્થ્ય વિશ્લેષણ')}
        subtitle={getText(
          'Analyze your soil health and get improvement recommendations',
          'अपनी मिट्टी के स्वास्थ्य का विश्लेषण करें और सुधार की सिफारिशें प्राप्त करें',
          'તમારી માટીના સ્વાસ્થ્યનું વિશ્લેષણ કરો અને સુધારણા ભલામણો મેળવો'
        )}
        icon={GiMountainCave}
        color="earth"
      />

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* ================= LEFT : INPUT FORM ================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Soil Nutrients Section */}
              <FormSection 
                title={getText('🌱 Soil Nutrients', '🌱 मिट्टी के पोषक तत्व', '🌱 માટીના પોષક તત્વો')}
              >
                <InputGrid columns={1}>
                  {/* Nitrogen */}
                  <div>
                    <Slider
                      label={SLIDER_LABELS.nitrogen.label}
                      value={formData.nitrogen}
                      onChange={v => handleChange('nitrogen', v)}
                      min={0}
                      max={600}
                      step={10}
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <FiInfo className="w-3 h-3" />
                      {SLIDER_LABELS.nitrogen.hint}
                    </p>
                  </div>

                  {/* Phosphorus */}
                  <div>
                    <Slider
                      label={SLIDER_LABELS.phosphorus.label}
                      value={formData.phosphorus}
                      onChange={v => handleChange('phosphorus', v)}
                      min={0}
                      max={100}
                      step={1}
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <FiInfo className="w-3 h-3" />
                      {SLIDER_LABELS.phosphorus.hint}
                    </p>
                  </div>

                  {/* Potassium */}
                  <div>
                    <Slider
                      label={SLIDER_LABELS.potassium.label}
                      value={formData.potassium}
                      onChange={v => handleChange('potassium', v)}
                      min={0}
                      max={500}
                      step={10}
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <FiInfo className="w-3 h-3" />
                      {SLIDER_LABELS.potassium.hint}
                    </p>
                  </div>
                </InputGrid>
              </FormSection>

              {/* Soil Properties Section */}
              <FormSection 
                title={getText('🧪 Soil Properties', '🧪 मिट्टी के गुण', '🧪 માટીના ગુણધર્મો')}
              >
                <InputGrid columns={1}>
                  {/* pH */}
                  <div>
                    <Slider
                      label={SLIDER_LABELS.ph.label}
                      value={formData.ph}
                      onChange={v => handleChange('ph', v)}
                      min={3}
                      max={10}
                      step={0.1}
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <FiInfo className="w-3 h-3" />
                      {SLIDER_LABELS.ph.hint}
                    </p>
                  </div>

                  {/* Organic Carbon */}
                  <div>
                    <Slider
                      label={SLIDER_LABELS.organic_carbon.label}
                      value={formData.organic_carbon}
                      onChange={v => handleChange('organic_carbon', v)}
                      min={0}
                      max={3}
                      step={0.1}
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <FiInfo className="w-3 h-3" />
                      {SLIDER_LABELS.organic_carbon.hint}
                    </p>
                  </div>

                  {/* EC */}
                  <div>
                    <Slider
                      label={SLIDER_LABELS.ec.label}
                      value={formData.ec}
                      onChange={v => handleChange('ec', v)}
                      min={0}
                      max={4}
                      step={0.1}
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <FiInfo className="w-3 h-3" />
                      {SLIDER_LABELS.ec.hint}
                    </p>
                  </div>
                </InputGrid>
              </FormSection>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  loading={loading} 
                  fullWidth 
                  icon={GiMountainCave}
                >
                  {getText('Analyze Soil Health', 'मिट्टी स्वास्थ्य विश्लेषण करें', 'માટી સ્વાસ્થ્ય વિશ્લેષણ કરો')}
                </Button>

                {(data || error) && (
                  <Button 
                    variant="outline" 
                    onClick={handleReset} 
                    icon={FiRefreshCw}
                  >
                    {getText('Reset', 'रीसेट', 'રીસેટ')}
                  </Button>
                )}
              </div>

              {/* Input Summary */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                  <FiInfo className="w-4 h-4" />
                  {getText('Current Input Summary', 'वर्तमान इनपुट सारांश', 'વર્તમાન ઇનપુટ સારાંશ')}
                </h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-gray-500 text-xs">N</p>
                    <p className="font-semibold text-amber-700">{formData.nitrogen}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-gray-500 text-xs">P</p>
                    <p className="font-semibold text-amber-700">{formData.phosphorus}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-gray-500 text-xs">K</p>
                    <p className="font-semibold text-amber-700">{formData.potassium}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-gray-500 text-xs">pH</p>
                    <p className="font-semibold text-amber-700">{formData.ph}</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-gray-500 text-xs">OC</p>
                    <p className="font-semibold text-amber-700">{formData.organic_carbon}%</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center">
                    <p className="text-gray-500 text-xs">EC</p>
                    <p className="font-semibold text-amber-700">{formData.ec}</p>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>

          {/* ================= RIGHT : RESULTS ================= */}
          <div>
            <AnimatePresence mode="wait">
              {/* Loading State */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center h-64"
                >
                  <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4" />
                  <p className="text-gray-600">
                    {getText('Analyzing soil health...', 'मिट्टी स्वास्थ्य का विश्लेषण हो रहा है...', 'માટી સ્વાસ્થ્યનું વિશ્લેષણ થઈ રહ્યું છે...')}
                  </p>
                </motion.div>
              )}

              {/* Error State */}
              {error && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 rounded-2xl p-6 border border-red-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <FiX className="w-5 h-5 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-red-800">
                      {getText('Analysis Failed', 'विश्लेषण विफल', 'વિશ્લેષણ નિષ્ફળ')}
                    </h3>
                  </div>
                  <p className="text-red-700 text-sm">{error}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSubmit}
                    className="mt-4"
                    icon={FiRefreshCw}
                  >
                    {getText('Try Again', 'पुनः प्रयास करें', 'ફરી પ્રયાસ કરો')}
                  </Button>
                </motion.div>
              )}

              {/* Results */}
              {data && !loading && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Main Result Card */}
                  <ResultCard
                    type={getHealthType()}
                    title={getText('Soil Health Status', 'मिट्टी स्वास्थ्य स्थिति', 'માટી સ્વાસ્થ્ય સ્થિતિ')}
                    value={getHealthLabel(data.prediction?.health_status) || data.prediction?.health_label}
                    icon={GiMountainCave}
                  >
                    <ConfidenceMeter confidence={data.confidence} />
                  </ResultCard>

                  {/* Overall Health Score */}
                  {data.prediction?.health_score && (
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                      <h3 className="font-semibold mb-3">
                        {getText('Overall Health Score', 'समग्र स्वास्थ्य स्कोर', 'એકંદર સ્વાસ્થ્ય સ્કોર')}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${data.prediction.health_score}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              data.prediction.health_score >= 70
                                ? 'bg-green-500'
                                : data.prediction.health_score >= 40
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                          />
                        </div>
                        <span className="font-bold text-lg">
                          {data.prediction.health_score}%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Nutrient Analysis */}
                  {data.prediction?.nutrient_analysis && (
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                      <h3 className="font-semibold mb-4">
                        {getText('Nutrient Analysis', 'पोषक तत्व विश्लेषण', 'પોષક તત્વ વિશ્લેષણ')}
                      </h3>

                      <div className="space-y-4">
                        {Object.entries(data.prediction.nutrient_analysis).map(([key, val]) => {
                          const info = getStatusInfo(val.status);
                          const Icon = info.icon;
                          const nutrientName = NUTRIENT_NAMES[key]?.[language] || NUTRIENT_NAMES[key]?.en || key;

                          return (
                            <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${info.bg} flex-shrink-0`}>
                                <Icon className={`w-5 h-5 ${info.color}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-gray-800">{nutrientName}</p>
                                  <span className={`text-xs px-2 py-1 rounded-full ${info.bg} ${info.color} font-medium`}>
                                    {info.label}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{val.label}</p>
                                {val.action && (
                                  <p className="text-xs text-primary-600 mt-1 flex items-center gap-1">
                                    👉 {val.action}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {data.prediction?.recommendations && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                      <h3 className="font-semibold text-green-800 mb-3">
                        {getText('💡 Recommendations', '💡 सिफारिशें', '💡 ભલામણો')}
                      </h3>
                      <ul className="space-y-2">
                        {data.prediction.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
                            <FiCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suitable Crops */}
                  {data.prediction?.suitable_crops && data.prediction.suitable_crops.length > 0 && (
                    <div className="bg-white rounded-xl p-5 shadow-sm">
                      <h3 className="font-semibold mb-3">
                        {getText('🌾 Suitable Crops', '🌾 उपयुक्त फसलें', '🌾 યોગ્ય પાકો')}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {data.prediction.suitable_crops.map((crop, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                          >
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explanation Card */}
                  {data.explanation && (
                    <ExplanationCard explanation={data.explanation} />
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      icon={FiRefreshCw}
                      fullWidth
                    >
                      {getText('Analyze Again', 'फिर से विश्लेषण करें', 'ફરીથી વિશ્લેષણ કરો')}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Empty State */}
              {!data && !loading && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-8 shadow-sm text-center"
                >
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GiMountainCave className="w-10 h-10 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {getText(
                      'Enter Soil Parameters',
                      'मिट्टी के मापदंड दर्ज करें',
                      'માટીના પરિમાણો દાખલ કરો'
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {getText(
                      'Adjust the sliders on the left to input your soil test values and get health analysis',
                      'अपनी मिट्टी परीक्षण मूल्य दर्ज करने और स्वास्थ्य विश्लेषण प्राप्त करने के लिए बाईं ओर स्लाइडर समायोजित करें',
                      'તમારા માટી પરીક્ષણ મૂલ્યો દાખલ કરવા અને સ્વાસ્થ્ય વિશ્લેષણ મેળવવા માટે ડાબી બાજુના સ્લાઇડર્સ એડજસ્ટ કરો'
                    )}
                  </p>

                  {/* Quick Reference */}
                  <div className="bg-gray-50 rounded-xl p-4 text-left">
                    <h4 className="font-medium text-gray-700 mb-2 text-sm">
                      {getText('Ideal Ranges:', 'आदर्श सीमा:', 'આદર્શ શ્રેણીઓ:')}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>• N: 250-350 kg/ha</div>
                      <div>• P: 25-50 kg/ha</div>
                      <div>• K: 200-300 kg/ha</div>
                      <div>• pH: 6.0-7.5</div>
                      <div>• OC: 0.5-1.5%</div>
                      <div>• EC: 0-1 dS/m</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100"
        >
          <h3 className="font-semibold text-amber-800 mb-4 flex items-center gap-2">
            <FiInfo className="w-5 h-5" />
            {getText('Understanding Soil Health Parameters', 'मिट्टी स्वास्थ्य मापदंडों को समझें', 'માટી સ્વાસ્થ્ય પરિમાણોને સમજો')}
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: getText('Nitrogen (N)', 'नाइट्रोजन (N)', 'નાઇટ્રોજન (N)'),
                desc: getText(
                  'Essential for leaf growth and green color. Deficiency causes yellowing.',
                  'पत्ती के विकास और हरे रंग के लिए आवश्यक। कमी से पीलापन होता है।',
                  'પાનની વૃદ્ધિ અને લીલા રંગ માટે આવશ્યક. ઉણપથી પીળાશ થાય છે.'
                )
              },
              {
                title: getText('Phosphorus (P)', 'फास्फोरस (P)', 'ફોસ્ફરસ (P)'),
                desc: getText(
                  'Important for root development and flowering. Promotes early maturity.',
                  'जड़ विकास और फूलों के लिए महत्वपूर्ण। जल्दी परिपक्वता को बढ़ावा देता है।',
                  'મૂળ વિકાસ અને ફૂલો માટે મહત્વપૂર્ણ. વહેલી પરિપક્વતાને પ્રોત્સાહન આપે છે.'
                )
              },
              {
                title: getText('Potassium (K)', 'पोटेशियम (K)', 'પોટેશિયમ (K)'),
                desc: getText(
                  'Enhances disease resistance and fruit quality. Regulates water uptake.',
                  'रोग प्रतिरोधक क्षमता और फल की गुणवत्ता बढ़ाता है। पानी के अवशोषण को नियंत्रित करता है।',
                  'રોગ પ્રતિકાર અને ફળની ગુણવત્તા વધારે છે. પાણીના શોષણને નિયંત્રિત કરે છે.'
                )
              },
              {
                title: getText('Soil pH', 'मिट्टी का pH', 'માટીનો pH'),
                desc: getText(
                  'Affects nutrient availability. Most crops prefer pH 6.0-7.5.',
                  'पोषक तत्वों की उपलब्धता को प्रभावित करता है। अधिकांश फसलें pH 6.0-7.5 पसंद करती हैं।',
                  'પોષક તત્વોની ઉપલબ્ધતાને અસર કરે છે. મોટાભાગના પાક pH 6.0-7.5 પસંદ કરે છે.'
                )
              },
              {
                title: getText('Organic Carbon', 'जैविक कार्बन', 'કાર્બનિક કાર્બન'),
                desc: getText(
                  'Indicates soil fertility and microbial activity. Higher is better.',
                  'मिट्टी की उर्वरता और सूक्ष्मजीव गतिविधि को इंगित करता है। अधिक बेहतर है।',
                  'માટીની ફળદ્રુપતા અને સૂક્ષ્મજીવ પ્રવૃત્તિ સૂચવે છે. વધુ સારું છે.'
                )
              },
              {
                title: getText('EC (Salinity)', 'विद्युत चालकता (लवणता)', 'વિદ્યુત વાહકતા (ખારાશ)'),
                desc: getText(
                  'Measures salt content. High EC can damage plant roots.',
                  'नमक की मात्रा मापता है। उच्च EC पौधों की जड़ों को नुकसान पहुंचा सकता है।',
                  'મીઠાની માત્રા માપે છે. ઉચ્ચ EC છોડના મૂળને નુકસાન કરી શકે છે.'
                )
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-1 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SoilHealth;