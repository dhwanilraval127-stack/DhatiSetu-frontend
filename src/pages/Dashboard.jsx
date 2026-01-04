import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiDroplet, FiCloud, FiTrendingUp, FiDollarSign,
  FiThermometer, FiWind, FiSun, FiGrid, FiHome, FiCamera,
  FiArrowRight, FiRefreshCw, FiMapPin, FiMenu, FiSettings,
  FiAlertTriangle, FiInfo, FiCheck
} from 'react-icons/fi';
import { 
  GiWheat, GiCorn, GiPlantSeed, GiPlantRoots,
  GiWaterDrop, GiFarmTractor, GiWeight, GiReceiveMoney,
  GiMoneyStack, GiPayMoney, GiFruitBowl, GiEarthAmerica,
  GiRaining, GiTornado, GiMountainCave
} from 'react-icons/gi';
import { MdAir, MdCo2 } from 'react-icons/md';
import toast from 'react-hot-toast';

import { useLanguage } from '../context/LanguageContext';
import { useLocation as useUserLocation } from '../context/LocationContext';
import LocationBadge from '../components/common/LocationBadge';
import Button from '../components/common/Button';

// Custom SVG Icons to replace missing react-icons
const SoilLayersIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M2 19h20v2H2v-2zm0-4h20v2H2v-2zm0-4h20v2H2v-2zm0-4h20v2H2v-2z"/>
  </svg>
);

const NDVIIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
    <circle cx="12" cy="14" r="3" opacity="0.3"/>
  </svg>
);

const YieldIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
    <path d="M12 10l-2 4h4l-2-4z" fill="white"/>
  </svg>
);

const PriceIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
    <path d="M12 6v12" stroke="white" strokeWidth="2" />
    <path d="M8 10h8" stroke="white" strokeWidth="2" />
    <path d="M8 14h8" stroke="white" strokeWidth="2" />
  </svg>
);

const ProfitIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
    <path d="M12 8l4 4-4 4-4-4 4-4m0-2L6 12l6 6 6-6-6-6z" fill="white"/>
  </svg>
);

const WaterRequirementIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
    <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="white"/>
  </svg>
);

const CropRecommendIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
    <path d="M12 8l-2 4h4l-2-4z" fill="white"/>
    <path d="M12 14l-2 4h4l-2-4z" fill="white" opacity="0.7"/>
  </svg>
);

const SoilHealthIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
    <path d="M8 10h8v2H8v-2zm0 4h8v2H8v-2z" fill="white"/>
  </svg>
);

const AirQualityIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
    <path d="M12 8l-2 4h4l-2-4z" fill="white"/>
  </svg>
);

const CO2LevelIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
    <circle cx="12" cy="14" r="3" opacity="0.3"/>
  </svg>
);

const StormRiskIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
    <path d="M8 10h8v2H8v-2zm0 4h8v2H8v-2z" fill="white"/>
  </svg>
);

const FloodRiskIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
    <path d="M8 10h8v2H8v-2zm0 4h8v2H8v-2z" fill="white"/>
  </svg>
);

const RainfallIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
    <path d="M8 10h8v2H8v-2zm0 4h8v2H8v-2z" fill="white"/>
  </svg>
);

const PlantDiseaseIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    {...props}
  >
    <path d="M12 22c-1 0-2-.5-2.5-1.5-.5-1-.5-2.5 0-4 .5-1.5 1.5-3 2.5-4 1 1 2 2.5 2.5 4s.5 3 0 4S13 22 12 22z"/>
    <path d="M12 12c-2-2-4-3-6-3 0 3 1.5 5.5 4 7"/>
    <path d="M12 12c2-2 4-3 6-3 0 3-1.5 5.5-4 7"/>
    <circle cx="8" cy="8" r="1.5" fill="red" opacity="0.7"/>
    <circle cx="15" cy="6" r="1" fill="red" opacity="0.7"/>
    <circle cx="10" cy="5" r="0.8" fill="red" opacity="0.7"/>
  </svg>
);

const Dashboard = () => {
  const { t, language } = useLanguage();
  const { location } = useUserLocation();

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

  const categories = [
    {
      id: 'crop',
      title: getText(
        '🌾 Crop Intelligence',
        '🌾 फसल बुद्धिमत्ता',
        '🌾 પાક બુદ્ધિમત્તા'
      ),
      color: 'from-green-500 to-emerald-600',
      features: [
        {
          id: 'plant-disease',
          title: getText('Plant Disease', 'पौधे की बीमारी', 'છોડનો રોગ'),
          desc: getText(
            'Detect diseases from photos',
            'फोटो से बीमारी का पता लगाएं',
            'ફોટામાંથી રોગ શોધો'
          ),
          icon: PlantDiseaseIcon,
          path: '/plant-disease',
          hasCamera: true
        },
        {
          id: 'crop-recommend',
          title: getText('Crop Recommendation', 'फसल अनुशंसा', 'પાક ભલામણ'),
          desc: getText(
            'Based on soil & weather',
            'मिट्टी और मौसम के आधार पर',
            'માટી અને હવામાનના આધારે'
          ),
          icon: CropRecommendIcon,
          path: '/crop-recommend'
        },
        {
          id: 'ndvi',
          title: getText('NDVI Analysis', 'NDVI विश्लेषण', 'NDVI વિશ્લેષણ'),
          desc: getText(
            'Vegetation health assessment',
            'वनस्पति स्वास्थ्य का मूल्यांकन',
            'વનસ્પતિ સ્વાસ્થ્ય મૂલ્યાંકન'
          ),
          icon: NDVIIcon,
          path: '/ndvi'
        }
      ]
    },
    {
      id: 'soil',
      title: getText(
        '🌍 Soil Analysis',
        '🌍 मिट्टी विश्लेषण',
        '🌍 માટી વિશ્લેષણ'
      ),
      color: 'from-amber-600 to-orange-700',
      features: [
        {
          id: 'soil-type',
          title: getText('Soil Type', 'मिट्टी का प्रकार', 'માટીનો પ્રકાર'),
          desc: getText(
            'Identify soil type from image',
            'छवि से मिट्टी की पहचान',
            'છબીમાંથ�� માટીનો પ્રકાર ઓળખો'
          ),
          icon: SoilLayersIcon,
          path: '/soil-type',
          hasCamera: true
        },
        {
          id: 'soil-health',
          title: getText('Soil Health', 'मिट्टी स्वास्थ्य', 'માટી સ્વાસ્થ્ય'),
          desc: getText(
            'Assess nutrient levels',
            'पोषक तत्वों का मूल्यांकन',
            'પોષક તત્વોનું મૂલ્યાંકન'
          ),
          icon: SoilHealthIcon,
          path: '/soil-health'
        }
      ]
    },
    {
      id: 'weather',
      title: getText(
        '🌦️ Weather & Risk',
        '🌦️ मौसम और जोखिम',
        '🌦️ હવામાન અને જોખમ'
      ),
      color: 'from-blue-500 to-cyan-600',
      features: [
        {
          id: 'flood-risk',
          title: getText('Flood Risk', 'बाढ़ जोखिम', 'પૂર જોખમ'),
          desc: getText(
            'Predict flood probability',
            'बाढ़ की संभावना की भविष्यवाणी',
            'પૂરની સંભાવનાની આગાહી'
          ),
          icon: FloodRiskIcon,
          path: '/flood-risk'
        },
        {
          id: 'storm-risk',
          title: getText('Storm Risk', 'तूफान जोखिम', 'તોફાન જોખમ'),
          desc: getText(
            'Predict storm likelihood',
            'तूफान की भविष्यवाणी',
            'તોફાનની સંભાવનાની આગાહી'
          ),
          icon: StormRiskIcon,
          path: '/storm-risk'
        },
        {
          id: 'rainfall',
          title: getText('Rainfall', 'वर्षा', 'વરસાદ'),
          desc: getText(
            'Predict rainfall amounts',
            'वर्षा की भविष्यवाणी',
            'વરસાદની માત્રાની આગાહી'
          ),
          icon: RainfallIcon,
          path: '/rainfall'
        },
        {
          id: 'air-quality',
          title: getText('Air Quality', 'वायु गुणवत्ता', 'હવા ગુણવત્તા'),
          desc: getText(
            'Calculate AQI levels',
            'AQI की गणना',
            'AQI સ્તરની ગણતરી'
          ),
          icon: AirQualityIcon,
          path: '/air-quality'
        },
      ]
    },
    {
      id: 'market',
      title: getText(
        '💰 Market & Finance',
        '💰 बाजार और वित्त',
        '💰 બજાર અને નાણાં'
      ),
      color: 'from-purple-500 to-violet-600',
      features: [
        {
          id: 'yield-predict',
          title: getText('Yield Prediction', 'उपज भविष्यवाणी', 'ઉપજ આગાહી'),
          desc: getText(
            'Estimate expected yield',
            'अपेक्षित उपज की गणना',
            'અપેક્ષિત ઉપજનો અંદાજ'
          ),
          icon: YieldIcon,
          path: '/yield-predict'
        },
        {
          id: 'price-predict',
          title: getText('Price Prediction', 'मूल्य भविष्यवाणी', 'કિંમત આગાહી'),
          desc: getText(
            'Predict market prices',
            'बाजार मूल्य की भविष्यवाणी',
            'બજાર કિંમતની આગાહી'
          ),
          icon: PriceIcon,
          path: '/price-predict'
        },
      ]
    }
  ];

  // Stats data with all three languages
  const stats = [
    { 
      label: getText('AI Models', 'AI मॉडल', 'AI મોડેલ'), 
      value: '15+' 
    },
    { 
      label: getText('Crops Supported', 'समर्थित फसलें', 'સમર્થિત પાકો'), 
      value: '50+' 
    },
    { 
      label: getText('States Covered', 'राज्य कवर', 'આવરી લીધેલા રાજ્યો'), 
      value: '36' 
    },
    { 
      label: getText('Users', 'उपयोगकर्ता', 'વપરાશકર્તાઓ'), 
      value: '10K+' 
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <motion.h1 
                className="text-2xl md:text-3xl font-bold text-gray-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {getText('Dashboard', 'डैशबोर्ड', 'ડેશબોર્ડ')}
              </motion.h1>
              <motion.p 
                className="text-gray-600 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {getText(
                  'Make the right decisions for your crops',
                  'अपनी फसल के लिए सही निर्णय लें',
                  'તમારા પાક માટે યોગ્ય નિર્ણયો લો'
                )}
              </motion.p>
            </div>
            
            <LocationBadge />
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6"
      >
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                {getText(
                  'Get Started Today!',
                  'आज ही शुरू करें!',
                  'આજે જ શરૂ કરો!'
                )}
              </h2>
              <p className="text-white/90 mt-1">
                {getText(
                  'Improve your farming with the power of AI',
                  'AI की शक्ति से अपनी खेती को बेहतर बनाएं',
                  'AI ની શક્તિથી તમારી ખેતીમાં સુધારો કરો'
                )}
              </p>
            </div>
            <Link to="/plant-disease">
              <Button 
                variant="secondary" 
                size="md"
                icon={FiCamera}
                className="bg-white text-primary-700 hover:bg-gray-100 border-white"
              >
                {getText(
                  'Detect Disease',
                  'बीमारी का पता लगाएं',
                  'રોગ શોધો'
                )}
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              {/* Category Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${category.color}`} />
                <h2 className="text-xl font-semibold text-gray-800">
                  {category.title}
                </h2>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {category.features.map((feature) => (
                  <Link key={feature.id} to={feature.path}>
                    <motion.div
                      className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary-200 h-full"
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        
                        {feature.hasCamera && (
                          <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                            {getText('Camera', 'कैमरा', 'કેમેરા')}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors">
                        {feature.title}
                      </h3>
                      
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {feature.desc}
                      </p>
                      
                      <div className="flex items-center text-primary-600 font-medium text-sm mt-3">
                        <span>
                          {getText('Get Started', 'शुरू करें', 'શરૂ કરો')}
                        </span>
                        <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            {getText('📊 Quick Stats', '📊 त्वरित आंकड़े', '📊 ઝડપી આંકડા')}
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-3 bg-white rounded-xl shadow-sm">
                <div className="text-lg md:text-xl font-bold text-primary-600">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6"
      >
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FiInfo className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {getText(
                    'Need Help?',
                    'मदद चाहिए?',
                    'મદદ જોઈએ છે?'
                  )}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {getText(
                    'Learn how to use DhartiSetu features effectively',
                    'DhartiSetu सुविधाओं का प्रभावी ढंग से उपयोग करना सीखें',
                    'DhartiSetu સુવિધાઓનો અસરકારક રીતે ઉપયોગ કરવાનું શીખો'
                  )}
                </p>
              </div>
            </div>
            <Link to="/help">
              <Button 
                variant="outline" 
                size="sm"
                icon={FiArrowRight}
                iconPosition="right"
              >
                {getText('View Guide', 'गाइड देखें', 'માર્ગદર્શિકા જુઓ')}
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6"
      >
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiSun className="w-5 h-5 text-amber-500" />
            {getText('💡 Farming Tips', '💡 खेती टिप्स', '💡 ખેતી ટિપ્સ')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: getText(
                  'Check soil before planting',
                  'बुवाई से पहले मिट्टी जांचें',
                  'વાવણી પહેલાં માટી તપાસો'
                ),
                desc: getText(
                  'Know your soil type for better crop selection',
                  'बेहतर फसल चयन के लिए मिट्टी का प्रकार जानें',
                  'વધુ સારી પાક પસંદગી માટે માટીનો પ્રકાર જાણો'
                )
              },
              {
                title: getText(
                  'Monitor weather daily',
                  'दैनिक मौसम की निगरानी करें',
                  'દૈનિક હવામાનનું નિરીક્ષણ કરો'
                ),
                desc: getText(
                  'Stay updated with weather forecasts',
                  'मौसम पूर्वानुमान से अपडेट रहें',
                  'હવામાન આગાહી સાથે અપડેટ રહો'
                )
              },
              {
                title: getText(
                  'Early disease detection',
                  'जल्दी बीमारी का पता लगाएं',
                  'વહેલી રોગ શોધ'
                ),
                desc: getText(
                  'Scan plants weekly for early detection',
                  'जल्दी पता लगाने के लिए साप्ताहिक पौधों को स्कैन करें',
                  'વહેલી શોધ માટે સાપ્તાહિક છોડ સ્કેન કરો'
                )
              }
            ].map((tip, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800 text-sm">{tip.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{tip.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;