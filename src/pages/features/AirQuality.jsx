import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAir } from 'react-icons/md';
import { FiWind, FiAlertCircle } from 'react-icons/fi';

import { useLanguage } from '../../context/LanguageContext';
import { useLocation as useUserLocation } from '../../context/LocationContext';
import { weatherAPI } from '../../services/api';
import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Slider from '../../components/common/Slider';
import FormSection from '../../components/forms/FormSection';
import InputGrid from '../../components/forms/InputGrid';
import ResultCard from '../../components/results/ResultCard';
import ExplanationCard from '../../components/results/ExplanationCard';
import ConfidenceMeter from '../../components/results/ConfidenceMeter';

const AirQuality = () => {
  const { t, language } = useLanguage();
  const { location: userLocation } = useUserLocation();
  const { loading, data, execute, reset } = useApi();

  const initialValues = {
    city: userLocation?.city || '',
    pm25: 35,
    pm10: 50,
    no2: 20,
    so2: 10,
    co: 0.5,
    o3: 30
  };

  const { values, handleChange, reset: resetForm } = useForm(initialValues);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    await execute(
      () => weatherAPI.predictAQI({
        ...values,
        language
      }),
      { showErrorToast: true }
    );
  };

  const handleReset = () => {
    resetForm();
    reset();
  };

  // Get AQI color and status
  const getAQIStyle = (category) => {
    const styles = {
      good: { 
        color: 'bg-green-500', 
        text: 'text-green-700', 
        bg: 'bg-green-50',
        gradient: 'from-green-400 to-green-600'
      },
      moderate: { 
        color: 'bg-yellow-500', 
        text: 'text-yellow-700', 
        bg: 'bg-yellow-50',
        gradient: 'from-yellow-400 to-yellow-600'
      },
      unhealthy_sensitive: { 
        color: 'bg-orange-500', 
        text: 'text-orange-700', 
        bg: 'bg-orange-50',
        gradient: 'from-orange-400 to-orange-600'
      },
      unhealthy: { 
        color: 'bg-red-500', 
        text: 'text-red-700', 
        bg: 'bg-red-50',
        gradient: 'from-red-400 to-red-600'
      },
      very_unhealthy: { 
        color: 'bg-purple-500', 
        text: 'text-purple-700', 
        bg: 'bg-purple-50',
        gradient: 'from-purple-400 to-purple-600'
      },
      hazardous: { 
        color: 'bg-rose-800', 
        text: 'text-rose-800', 
        bg: 'bg-rose-50',
        gradient: 'from-rose-600 to-rose-800'
      }
    };
    return styles[category] || styles.moderate;
  };

  const getResultType = () => {
    if (!data?.prediction?.category_code) return 'info';
    switch (data.prediction.category_code) {
      case 'good': return 'success';
      case 'moderate': return 'warning';
      default: return 'error';
    }
  };

  const aqiStyle = data?.prediction?.category_code 
    ? getAQIStyle(data.prediction.category_code) 
    : getAQIStyle('moderate');

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <PageHeader
        title={t('Aqi Prediction')}
        subtitle={t('Predict Aqi for your region')}
        icon={MdAir}
        color="blue"
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <form onSubmit={handleSubmit}>
              {/* City */}
              <FormSection
                title={language === 'hi' ? '📍 शहर' : '📍 City'}
                className="mb-4"
              >
                <Input
                  label={t('aqi city')}
                  value={values.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder={language === 'hi' ? 'शहर का नाम दर्ज करें' : 'Enter city name'}
                />
              </FormSection>

              {/* Particulate Matter */}
              <FormSection
                title={language === 'hi' ? '🌫️ कण प्रदूषक' : '🌫️ Particulate Matter'}
                className="mb-4"
              >
                <InputGrid columns={2}>
                  <Slider
                    label={t('aqi pm25')}
                    value={values.pm25}
                    onChange={(val) => handleChange('pm25', val)}
                    min={0}
                    max={500}
                    step={5}
                  />
                  
                  <Slider
                    label={t('aqi pm10')}
                    value={values.pm10}
                    onChange={(val) => handleChange('pm10', val)}
                    min={0}
                    max={600}
                    step={5}
                  />
                </InputGrid>
              </FormSection>

              {/* Gases */}
              <FormSection
                title={language === 'hi' ? '💨 गैसीय प्रदूषक' : '💨 Gaseous Pollutants'}
                className="mb-4"
              >
                <InputGrid columns={2}>
                  <Slider
                    label={t('aqi no2')}
                    value={values.no2}
                    onChange={(val) => handleChange('no2', val)}
                    min={0}
                    max={200}
                  />
                  
                  <Slider
                    label={t('aqi so2')}
                    value={values.so2}
                    onChange={(val) => handleChange('so2', val)}
                    min={0}
                    max={100}
                  />
                  
                  <Slider
                    label={t('aqi co')}
                    value={values.co}
                    onChange={(val) => handleChange('co', val)}
                    min={0}
                    max={10}
                    step={0.1}
                  />
                  
                  <Slider
                    label={t('aqi o3')}
                    value={values.o3}
                    onChange={(val) => handleChange('o3', val)}
                    min={0}
                    max={200}
                  />
                </InputGrid>
              </FormSection>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  size="lg"
                  icon={MdAir}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? t('loading') : t('analyze')}
                </Button>
                
                {data && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                  >
                    {t('retry')}
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-64"
              >
                <div className="text-center">
                  <div className="spinner mx-auto mb-4" />
                  <p className="text-gray-600">{t('loading')}</p>
                </div>
              </motion.div>
            )}

            {data && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* AQI Gauge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-2xl p-6 ${aqiStyle.bg} border`}
                >
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      {t('Aqi Result')}
                    </p>
                    
                    {/* Large AQI Value */}
                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${aqiStyle.gradient} mb-4`}>
                      <span className="text-4xl font-bold text-white">
                        {data.prediction?.aqi_value}
                      </span>
                    </div>
                    
                    <h2 className={`text-2xl font-bold ${aqiStyle.text}`}>
                      {data.prediction?.category}
                    </h2>
                    
                    <p className="text-gray-600 mt-1">
                      {data.prediction?.city}
                    </p>
                  </div>
                  
                  <ConfidenceMeter confidence={data.confidence * 100} className="mt-6" />
                </motion.div>

                {/* AQI Scale */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h3 className="font-semibold text-gray-800 mb-4">
                    {language === 'hi' ? 'AQI स्केल' : 'AQI Scale'}
                  </h3>
                  
                  <div className="space-y-2">
                    {[
                      { range: '0-50', label: language === 'hi' ? 'अच्छा' : 'Good', color: 'bg-green-500' },
                      { range: '51-100', label: language === 'hi' ? 'मध्यम' : 'Moderate', color: 'bg-yellow-500' },
                      { range: '101-150', label: language === 'hi' ? 'संवेदनशील के लिए अस्वस्थ' : 'Unhealthy for Sensitive', color: 'bg-orange-500' },
                      { range: '151-200', label: language === 'hi' ? 'अस्वस्थ' : 'Unhealthy', color: 'bg-red-500' },
                      { range: '201-300', label: language === 'hi' ? 'बहुत अस्वस्थ' : 'Very Unhealthy', color: 'bg-purple-500' },
                      { range: '301+', label: language === 'hi' ? 'खतरनाक' : 'Hazardous', color: 'bg-rose-800' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${item.color}`} />
                        <span className="text-sm text-gray-600 w-20">{item.range}</span>
                        <span className="text-sm font-medium text-gray-800">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Explanation */}
                {data.explanation && (
                  <ExplanationCard explanation={data.explanation} />
                )}
              </motion.div>
            )}

            {!loading && !data && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-64"
              >
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MdAir className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {language === 'hi' 
                    ? 'वायु गुणवत्ता जांचें' 
                    : 'Check Air Quality'}
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                  {language === 'hi'
                    ? 'प्रदूषक स्तर दर्ज करें और AQI की गणना करें'
                    : 'Enter pollutant levels to calculate AQI'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Agricultural Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6"
        >
          <h3 className="font-semibold text-gray-800 mb-4">
            {language === 'hi' ? '🌾 कृषि पर प्रभाव' : '🌾 Impact on Agriculture'}
          </h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FiAlertCircle className="w-5 h-5 text-orange-500" />
                <h4 className="font-medium text-gray-800">
                  {language === 'hi' ? 'खराब AQI के प्रभाव' : 'Effects of Poor AQI'}
                </h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {language === 'hi' ? 'प्रकाश संश्लेषण में कमी' : 'Reduced photosynthesis'}</li>
                <li>• {language === 'hi' ? 'पत्तियों को नुकसान' : 'Leaf damage'}</li>
                <li>• {language === 'hi' ? 'उपज में कमी' : 'Reduced yield'}</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FiWind className="w-5 h-5 text-green-500" />
                <h4 className="font-medium text-gray-800">
                  {language === 'hi' ? 'सुरक्षात्मक उपाय' : 'Protective Measures'}
                </h4>
              </div>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {language === 'hi' ? 'सुबह जल्दी सिंचाई' : 'Early morning irrigation'}</li>
                <li>• {language === 'hi' ? 'पौधों को धोएं' : 'Wash plants'}</li>
                <li>• {language === 'hi' ? 'छिड़काव में देरी' : 'Delay spraying'}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AirQuality;