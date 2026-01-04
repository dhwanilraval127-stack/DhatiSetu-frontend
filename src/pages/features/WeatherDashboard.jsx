import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSun, FiCloud, FiDroplet, FiWind, FiThermometer, 
  FiRefreshCw, FiMapPin, FiAlertTriangle, FiInfo, FiCalendar
} from 'react-icons/fi';
import { GiRaining, GiTornado, GiMountainCave } from 'react-icons/gi';
import { MdAir, MdCo2 } from 'react-icons/md';
import toast from 'react-hot-toast';

import { useLanguage } from '../../context/LanguageContext';
import { useLocation as useUserLocation } from '../../context/LocationContext';
import { weatherAPI, locationAPI } from '../../services/api';
import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import FormSection from '../../components/forms/FormSection';
import InputGrid from '../../components/forms/InputGrid';
import ResultCard from '../../components/results/ResultCard';
import ExplanationCard from '../../components/results/ExplanationCard';
import ConfidenceMeter from '../../components/results/ConfidenceMeter';
import StatCard from '../../components/results/StatCard';
import LocationBadge from '../../components/common/LocationBadge';

const WeatherDashboard = () => {
  const { t, language } = useLanguage();
  const { location: userLocation, detectLocation } = useUserLocation();
  const { loading, data, execute, reset } = useApi();
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  const initialValues = {
    state: userLocation?.state || '',
    district: userLocation?.district || '',
    latitude: userLocation?.latitude || 28.6139,
    longitude: userLocation?.longitude || 77.2090
  };

  const { values, handleChange, reset: resetForm } = useForm(initialValues);

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await locationAPI.getStates();
        setStates(response.states || []);
      } catch (error) {
        console.error('Failed to fetch states:', error);
        toast.error(t('errors.generic'));
        
        // Fallback states
        setStates([
          "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
          "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
          "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
          "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
          "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
        ]);
      }
    };
    fetchStates();
  }, [t]);

  // Update form when user location changes
  useEffect(() => {
    if (userLocation) {
      handleChange('state', userLocation.state || '');
      handleChange('district', userLocation.district || '');
      handleChange('latitude', userLocation.latitude || 28.6139);
      handleChange('longitude', userLocation.longitude || 77.2090);
    }
  }, [userLocation, handleChange]);

  // Fetch districts when state changes
  useEffect(() => {
    if (values.state) {
      // In a real app, you'd fetch districts for the selected state
      setDistricts([
        language === 'hi' ? 'जिला 1' : 'District 1',
        language === 'hi' ? 'जिला 2' : 'District 2',
        language === 'hi' ? 'जिला 3' : 'District 3'
      ]);
    } else {
      setDistricts([]);
    }
  }, [values.state, language]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!values.state || !values.district) {
      toast.error(language === 'hi' ? 'कृपया एक स्थान चुनें' : 'Please select a location');
      return;
    }
    
    await execute(
      () => weatherAPI.getWeatherDashboard({
        ...values,
        language
      }),
      { 
        showErrorToast: true,
        successMessage: language === 'hi' ? 'मौसम डैशबोर्ड अपडेट हुआ!' : 'Weather dashboard updated!'
      }
    );
  };

  const handleReset = () => {
    resetForm();
    reset();
  };

  const handleDetectLocation = async () => {
    await detectLocation();
  };

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny': return FiSun;
      case 'cloudy': return FiCloud;
      case 'rainy': return GiRaining;
      case 'stormy': return GiTornado;
      case 'partly cloudy': return FiCloud;
      default: return FiSun;
    }
  };

  // Get weather category styling
  const getWeatherCategory = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny': return { color: 'yellow', label: language === 'hi' ? 'धूप' : 'Sunny' };
      case 'cloudy': return { color: 'gray', label: language === 'hi' ? 'बादल' : 'Cloudy' };
      case 'rainy': return { color: 'blue', label: language === 'hi' ? 'बारिश' : 'Rainy' };
      case 'stormy': return { color: 'red', label: language === 'hi' ? 'तूफान' : 'Stormy' };
      case 'partly cloudy': return { color: 'gray', label: language === 'hi' ? 'आंशिक बादल' : 'Partly Cloudy' };
      default: return { color: 'yellow', label: language === 'hi' ? 'धूप' : 'Sunny' };
    }
  };

  const weatherCategory = data?.current?.weather_condition 
    ? getWeatherCategory(data.current.weather_condition) 
    : { color: 'yellow', label: language === 'hi' ? 'धूप' : 'Sunny' };

  const WeatherIcon = getWeatherIcon(data?.current?.weather_condition);

  // Get AQI category styling
  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { color: 'green', label: language === 'hi' ? 'अच्छा' : 'Good' };
    if (aqi <= 100) return { color: 'yellow', label: language === 'hi' ? 'मध्यम' : 'Moderate' };
    if (aqi <= 150) return { color: 'orange', label: language === 'hi' ? 'संवेदनशील के लिए अस्वस्थ' : 'Unhealthy for Sensitive' };
    if (aqi <= 200) return { color: 'red', label: language === 'hi' ? 'अस्वस्थ' : 'Unhealthy' };
    if (aqi <= 300) return { color: 'purple', label: language === 'hi' ? 'बहुत अस्वस्थ' : 'Very Unhealthy' };
    return { color: 'maroon', label: language === 'hi' ? 'खतरनाक' : 'Hazardous' };
  };

  const aqiCategory = data?.air_quality?.aqi_value 
    ? getAQICategory(data.air_quality.aqi_value) 
    : { color: 'green', label: language === 'hi' ? 'अच्छा' : 'Good' };

  // Get UV index category
  const getUVCategory = (uv) => {
    if (uv <= 2) return { color: 'green', label: language === 'hi' ? 'कम' : 'Low' };
    if (uv <= 5) return { color: 'yellow', label: language === 'hi' ? 'मध्यम' : 'Moderate' };
    if (uv <= 7) return { color: 'orange', label: language === 'hi' ? 'उच्च' : 'High' };
    if (uv <= 10) return { color: 'red', label: language === 'hi' ? 'बहुत उच्च' : 'Very High' };
    return { color: 'purple', label: language === 'hi' ? 'अत्यधिक' : 'Extreme' };
  };

  const uvCategory = data?.current?.uv_index 
    ? getUVCategory(data.current.uv_index) 
    : { color: 'green', label: language === 'hi' ? 'कम' : 'Low' };

  const stateOptions = states.map(state => ({ value: state, label: state }));
  const districtOptions = districts.map(district => ({ value: district, label: district }));

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <PageHeader
        title={t('features.weather.title')}
        subtitle={t('features.weather.desc')}
        icon={FiSun}
        color="yellow"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Location Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {language === 'hi' ? '📍 आपका स्थान' : '📍 Your Location'}
              </h2>
              <p className="text-gray-600 mt-1">
                {language === 'hi' ? 'मौसम अपडेट प्राप्त करने के लिए' : 'For weather updates'}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <LocationBadge />
              
              <Button
                variant="outline"
                onClick={handleDetectLocation}
                icon={FiRefreshCw}
                size="sm"
              >
                {language === 'hi' ? 'स्थान खोजें' : 'Detect Location'}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-4">
            <InputGrid columns={2}>
              <Select
                label={t('features.flood.state')}
                value={values.state}
                onChange={(e) => handleChange('state', e.target.value)}
                options={stateOptions}
                placeholder={language === 'hi' ? 'राज्य चुनें' : 'Select State'}
              />
              
              <Select
                label={t('features.flood.district')}
                value={values.district}
                onChange={(e) => handleChange('district', e.target.value)}
                options={districtOptions}
                placeholder={language === 'hi' ? 'जिला चुनें' : 'Select District'}
              />
            </InputGrid>

            <div className="flex gap-3 mt-4">
              <Button
                type="submit"
                loading={loading}
                disabled={!values.state || !values.district}
                fullWidth
                size="lg"
                icon={FiRefreshCw}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                {loading ? t('loading') : t('update')}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                icon={FiRefreshCw}
              >
                {t('retry')}
              </Button>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Current Weather */}
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <WeatherIcon className="w-10 h-10" />
                      <div>
                        <h2 className="text-2xl font-bold">
                          {data.current?.temperature_2m}°C
                        </h2>
                        <p className="text-yellow-100">
                          {weatherCategory.label}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-yellow-100 mt-2">
                      {data.current?.location?.district}, {data.current?.location?.state}
                    </p>
                  </div>
                  
                  <div className="bg-white/20 rounded-xl p-4">
                    <p className="text-sm text-yellow-100 mb-1">
                      {language === 'hi' ? 'अनुभवी तापमान' : 'Feels Like'}
                    </p>
                    <p className="text-xl font-bold">
                      {data.current?.apparent_temperature}°C
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  <StatCard
                    label={language === 'hi' ? 'आर्द्रता' : 'Humidity'}
                    value={`${data.current?.relative_humidity_2m}%`}
                    icon={FiDroplet}
                    color="blue"
                    className="bg-white/20 text-white"
                  />
                  <StatCard
                    label={language === 'hi' ? 'हवा की गति' : 'Wind Speed'}
                    value={`${data.current?.wind_speed_10m} km/h`}
                    icon={FiWind}
                    color="green"
                    className="bg-white/20 text-white"
                  />
                  <StatCard
                    label={language === 'hi' ? 'दबाव' : 'Pressure'}
                    value={`${data.current?.surface_pressure} hPa`}
                    icon={GiMountainCave}
                    color="purple"
                    className="bg-white/20 text-white"
                  />
                  <StatCard
                    label={language === 'hi' ? 'UV सूचकांक' : 'UV Index'}
                    value={data.current?.uv_index}
                    icon={FiSun}
                    color={uvCategory.color}
                    className="bg-white/20 text-white"
                  />
                </div>
              </div>

              {/* Hourly Forecast */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">
                    {language === 'hi' ? '⏱️ घंटावार पूर्वानुमान' : '⏱️ Hourly Forecast'}
                  </h3>
                  <button 
                    onClick={() => setShowInfo(!showInfo)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiInfo className="w-5 h-5" />
                  </button>
                </div>
                
                <AnimatePresence>
                  {showInfo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <p className="text-sm text-gray-600">
                        {language === 'hi' 
                          ? 'अगले 24 घंटों के लिए मौसम पूर्वानुमान। कृषि गतिविधियों के लिए योजना बनाएं।'
                          : 'Weather forecast for the next 24 hours. Plan your agricultural activities.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="flex overflow-x-auto pb-4 -mx-2 px-2">
                  {data.hourly?.slice(0, 12).map((hour, idx) => {
                    const hourIcon = getWeatherIcon(hour.weather_condition);
                    const hourCategory = getWeatherCategory(hour.weather_condition);
                    
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex-shrink-0 w-24 p-3 bg-gray-50 rounded-xl mx-2 text-center"
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {new Date(hour.time).getHours()}:00
                        </p>
                        <div className={`w-10 h-10 mx-auto my-2 rounded-full flex items-center justify-center bg-${hourCategory.color}-100`}>
                          {React.createElement(hourIcon, { className: `w-6 h-6 text-${hourCategory.color}-600` })}
                        </div>
                        <p className="text-lg font-bold text-gray-800">
                          {hour.temperature_2m}°
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {hourCategory.label}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Daily Forecast */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">
                  {language === 'hi' ? '📅 दैनिक पूर्वानुमान' : '📅 Daily Forecast'}
                </h3>
                
                <div className="space-y-3">
                  {data.daily?.slice(0, 5).map((day, idx) => {
                    const dayIcon = getWeatherIcon(day.weather_condition);
                    const dayCategory = getWeatherCategory(day.weather_condition);
                    
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${dayCategory.color}-100`}>
                            {React.createElement(dayIcon, { className: `w-5 h-5 text-${dayCategory.color}-600` })}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {new Date(day.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long' })}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(day.date).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-bold text-gray-800">
                              {day.temperature_2m_max}°/{day.temperature_2m_min}°
                            </p>
                            <p className="text-sm text-gray-500">
                              {dayCategory.label}
                            </p>
                          </div>
                          
                          {day.precipitation_sum > 0 && (
                            <div className="flex items-center space-x-1 text-blue-600">
                              <GiRaining className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {day.precipitation_sum}mm
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Environmental Conditions */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Air Quality */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">
                      {language === 'hi' ? '🌬️ वायु गुणवत्ता' : '🌬️ Air Quality'}
                    </h3>
                    <MdAir className={`w-5 h-5 text-${aqiCategory.color}-600`} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-800">
                        {data.air_quality?.aqi_value}
                      </p>
                      <p className={`font-medium text-${aqiCategory.color}-600`}>
                        {aqiCategory.label}
                      </p>
                    </div>
                    
                    <div className="w-24 h-24">
                      <CircularProgress 
                        value={data.air_quality?.aqi_value || 50}
                        max={500}
                        color={aqiCategory.color}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <StatCard
                      label={language === 'hi' ? 'PM2.5' : 'PM2.5'}
                      value={data.air_quality?.pm25}
                      unit=" μg/m³"
                      icon={FiDroplet}
                      color="red"
                    />
                    <StatCard
                      label={language === 'hi' ? 'PM10' : 'PM10'}
                      value={data.air_quality?.pm10}
                      unit=" μg/m³"
                      icon={FiDroplet}
                      color="orange"
                    />
                  </div>
                </motion.div>

                {/* CO2 Level */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">
                      {language === 'hi' ? '🌿 CO₂ स्तर' : '🌿 CO₂ Level'}
                    </h3>
                    <MdCo2 className="w-5 h-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-gray-800">
                        {data.co2?.co2_ppm}
                      </p>
                      <p className="font-medium text-green-600">
                        ppm
                      </p>
                    </div>
                    
                    <div className="w-24 h-24">
                      <CircularProgress 
                        value={data.co2?.co2_ppm || 400}
                        max={1000}
                        color="green"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-700">
                      <FiInfo className="w-4 h-4 inline mr-1" />
                      {language === 'hi' 
                        ? 'वायुमंडलीय CO₂ पौधों की वृद्धि के लिए महत्वपूर्ण है'
                        : 'Atmospheric CO₂ is important for plant growth'}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Alerts */}
              {data.alerts && data.alerts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-red-50 border border-red-200 rounded-2xl p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <FiAlertTriangle className="w-6 h-6 text-red-600" />
                    <h3 className="font-semibold text-red-800">
                      {language === 'hi' ? '⚠️ मौसम चेतावनी' : '⚠️ Weather Alerts'}
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    {data.alerts.map((alert, idx) => (
                      <div key={idx} className="p-4 bg-white rounded-xl border border-red-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-red-800">{alert.title}</p>
                            <p className="text-sm text-red-600 mt-1">{alert.description}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(alert.start_time).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US')} - 
                              {new Date(alert.end_time).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US')}
                            </p>
                          </div>
                          <div className={`w-3 h-3 rounded-full bg-${alert.severity_color}-500`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Agricultural Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6"
              >
                <h3 className="font-semibold text-gray-800 mb-4">
                  {language === 'hi' ? '🌾 कृषि युक्तियां' : '🌾 Agricultural Tips'}
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: '🌧️',
                      title: language === 'hi' ? 'बारिश के दिनों में काम योजना बनाएं' : 'Plan work on rainy days',
                      desc: language === 'hi' ? 'बारिश के दिनों में आंतरिक कार्य करें' : 'Do indoor tasks on rainy days'
                    },
                    {
                      tag: language === 'hi' ? 'बाढ़ जोखिम' : 'Flood Risk',
                      icon: '🌊',
                      title: language === 'hi' ? 'बाढ़ के लिए तैयार रहें' : 'Be prepared for floods',
                      desc: language === 'hi' ? 'निचले क्षेत्रों में फसलों की रक्षा करें' : 'Protect crops in low-lying areas'
                    },
                    {
                      tag: language === 'hi' ? 'तूफान जोखिम' : 'Storm Risk',
                      icon: '🌪️',
                      title: language === 'hi' ? 'तूफान के लिए तैयार रहें' : 'Be prepared for storms',
                      desc: language === 'hi' ? 'पौधों को सुरक्षित स्थान पर ले जाएं' : 'Move plants to safe locations'
                    },
                    {
                      icon: '🌞',
                      title: language === 'hi' ? 'धूप के दिनों में सुबह काम करें' : 'Work in mornings on sunny days',
                      desc: language === 'hi' ? 'सुबह के समय में अधिक उत्पादकता' : 'Higher productivity in morning hours'
                    }
                  ].map((tip, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-xl p-4 border border-green-100 hover:border-green-200 transition-all"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{tip.icon}</span>
                        <div>
                          {tip.tag && (
                            <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full mb-1">
                              {tip.tag}
                            </span>
                          )}
                          <h4 className="font-medium text-gray-800">{tip.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{tip.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {!loading && !data && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-64"
            >
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <FiSun className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {language === 'hi' 
                  ? 'मौसम डैशबोर्ड' 
                  : 'Weather Dashboard'}
              </h3>
              <p className="text-gray-500 text-sm max-w-xs">
                {language === 'hi'
                  ? 'अपने स्थान का चयन करके मौसम अपडेट प्राप्त करें'
                  : 'Select your location to get weather updates'}
              </p>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
            >
              <div className="flex items-center justify-center text-red-600 mb-2">
                <FiAlertTriangle className="w-5 h-5 mr-2" />
                <span className="font-medium">{language === 'hi' ? 'त्रुटि' : 'Error'}</span>
              </div>
              <p className="text-red-600">{error}</p>
              <Button
                variant="outline"
                onClick={handleReset}
                className="mt-4"
              >
                {t('retry')}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
        isAnalyzing={loading}
        featureType="weather"
      />
    </div>
  );
};

// Circular Progress Component
const CircularProgress = ({ value, max, color = 'blue' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const strokeDasharray = 2 * Math.PI * 40;
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;
  
  const colorClasses = {
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    maroon: 'text-red-800',
    blue: 'text-blue-500'
  };

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
          className={colorClasses[color]}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-800">{value}</span>
        <span className="text-xs text-gray-500">/{max}</span>
      </div>
    </div>
  );
};

export default WeatherDashboard;