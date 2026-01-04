import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useLanguage } from './context/LanguageContext';
import { useLocation as useUserLocation } from './context/LocationContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import BottomNav from './components/common/BottomNav';
import PageLoader from './components/common/PageLoader';
import ErrorBoundary from './components/common/ErrorBoundary';
import VoiceAssistant from './components/voice/VoiceAssistant';
import GuidePage from './pages/GuidePage';

// ONLY SAFE REACT-ICONS IMPORTS
import { 
  FiHome, FiGrid, FiCamera, FiUpload, FiX, FiCheck, 
  FiAlertTriangle, FiAlertCircle, FiInfo, FiArrowRight, 
  FiArrowLeft, FiChevronDown, FiRefreshCw, FiMapPin, 
  FiMenu, FiSettings, FiDroplet, FiCloud, FiSun, 
  FiWind, FiThermometer, FiTrendingUp, FiDollarSign, 
  FiCalendar, FiClock, FiPackage, FiShield, FiGlobe, 
  FiMail, FiPhone, FiGithub, FiTwitter, FiHelpCircle, 
  FiList, FiActivity, FiZap, FiLayers, FiMessageSquare,
  FiDollarSign as FiDollarSignAlt
} from 'react-icons/fi';

import { 
  GiWheat, GiCorn, GiPlantSeed, GiPlantRoots, 
  GiWaterDrop, GiFarmTractor, GiWeight, GiReceiveMoney, 
  GiMoneyStack, GiPayMoney, GiFruitBowl, GiEarthAmerica,
  GiRaining, GiTornado, GiMountainCave
} from 'react-icons/gi';

import { MdAir, MdCo2 } from 'react-icons/md';

// CUSTOM SVG ICONS TO REPLACE PROBLEMATIC ONES
const CustomIcons = {
  // Replaces GiSoilLayers
  SoilLayers: ({ className = "w-6 h-6", ...props }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      {...props}
    >
      <path d="M2 19h20v2H2v-2zm0-4h20v2H2v-2zm0-4h20v2H2v-2zm0-4h20v2H2V7z"/>
    </svg>
  ),
  
  // Replaces GiChemicalDrop
  ChemicalDrop: ({ className = "w-6 h-6", ...props }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      {...props}
    >
      <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
      <circle cx="12" cy="14" r="3" opacity="0.3"/>
    </svg>
  ),
  
  // Replaces GiWindSlap
  WindSlap: ({ className = "w-6 h-6", ...props }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      {...props}
    >
      <path d="M4 10h8c1.1 0 2-.9 2-2s-.9-2-2-2H4v2h8v2H4v-2zM4 12h14c1.7 0 3 1.3 3 3s-1.3 3-3 3c-.8 0-1.6-.3-2.1-.9"/>
      <path d="M4 16h6c1.1 0 2 .9 2 2s-.9 2-2 2c-.6 0-1.1-.3-1.5-.7"/>
    </svg>
  ),
  
  // Replaces GiWaves
  Waves: ({ className = "w-6 h-6", ...props }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      {...props}
    >
      <path d="M2 12c1.5-1.5 3-2 4.5-2s3 .5 4.5 2 3 2 4.5 2 3-.5 4.5-2v2c-1.5 1.5-3 2-4.5 2s-3-.5-4.5-2-3-2-4.5-2-3 .5-4.5 2v-2z"/>
      <path d="M2 16c1.5-1.5 3-2 4.5-2s3 .5 4.5 2 3 2 4.5 2 3-.5 4.5-2v2c-1.5 1.5-3 2-4.5 2s-3-.5-4.5-2-3-2-4.5-2-3 .5-4.5 2v-2z" opacity="0.7"/>
    </svg>
  ),
  
  // Replaces GiMountainCave
  MountainCave: ({ className = "w-6 h-6", ...props }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      {...props}
    >
      <path d="M12 3L2 21h20L12 3zm0 4l6 12H6l6-12z"/>
      <path d="M12 9l4 8H8l4-8z" opacity="0.3"/>
    </svg>
  ),
  
  // Replaces GiPlantDisease
  PlantDisease: ({ className = "w-6 h-6", ...props }) => (
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
  ),
  
  // Replaces GiFlood
  Flood: ({ className = "w-6 h-6", ...props }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      {...props}
    >
      <path d="M3 18c1.5-1 3-1.5 4.5-1.5s3 .5 4.5 1.5 3 1.5 4.5 1.5 3-.5 4.5-1.5v2c-1.5 1-3 1.5-4.5 1.5s-3-.5-4.5-1.5-3-1.5-4.5-1.5-3 .5-4.5 1.5v-2z"/>
      <path d="M5 12h14l-3-8H8l-3 8z"/>
      <path d="M8 12V8l4-3 4 3v4" opacity="0.5"/>
    </svg>
  ),
  
  // Replaces GiStorm
  Storm: ({ className = "w-6 h-6", ...props }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      {...props}
    >
      <path d="M21 4H3v2h18V4zM19 8H5v2h14V8zM17 12H7v2h10v-2zM14 16H10v2h4v-2zM12 20h0v2h0v-2z"/>
    </svg>
  ),
  
  // Replaces GiNDVI
  NDVI: ({ className = "w-6 h-6", ...props }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      {...props}
    >
      <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
      <circle cx="12" cy="14" r="3" opacity="0.3"/>
    </svg>
  ),
  
  // Replaces GiYield
  Yield: ({ className = "w-6 h-6", ...props }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      {...props}
    >
      <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
      <path d="M12 10l-2 4h4l-2-4z" fill="white"/>
    </svg>
  ),
  
  // Replaces GiPrice
  Price: ({ className = "w-6 h-6", ...props }) => (
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
  ),
  
  // Replaces GiProfit
  Profit: ({ className = "w-6 h-6", ...props }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      {...props}
    >
      <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
      <path d="M12 8l4 4-4 4-4-4 4-4m0-2L6 12l6 6 6-6-6-6z" fill="white"/>
    </svg>
  ),
  
  // Replaces GiWaterRequirement
  WaterRequirement: ({ className = "w-6 h-6", ...props }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
      {...props}
    >
      <path d="M12 2C8 6 4 9.5 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8c0-4.5-4-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-3.5 3-6.5 6-10 3 3.5 6 6.5 6 10 0 3.31-2.69 6-6 6z"/>
      <path d="M12 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="white"/>
    </svg>
  )
};

// Lazy load pages with error boundaries
const LazyLoadPage = (importFn) => {
  const Component = lazy(importFn);
  return (props) => (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// Import pages with custom icons
const LandingPage = LazyLoadPage(() => import('./pages/LandingPage'));
const Dashboard = LazyLoadPage(() => import('./pages/Dashboard'));
const PlantDisease = LazyLoadPage(() => import('./pages/features/PlantDisease'));
const CropRecommend = LazyLoadPage(() => import('./pages/features/CropRecommend'));
const SoilType = LazyLoadPage(() => import('./pages/features/SoilType'));
const SoilHealth = LazyLoadPage(() => import('./pages/features/SoilHealth'));
const FloodRisk = LazyLoadPage(() => import('./pages/features/FloodRisk'));
const StormRisk = LazyLoadPage(() => import('./pages/features/StormRisk'));
const Rainfall = LazyLoadPage(() => import('./pages/features/Rainfall'));
const AirQuality = LazyLoadPage(() => import('./pages/features/AirQuality'));
const CO2Level = LazyLoadPage(() => import('./pages/features/CO2Level'));
const NDVI = LazyLoadPage(() => import('./pages/features/NDVI'));
const YieldPredict = LazyLoadPage(() => import('./pages/features/YieldPredict'));
const PricePredict = LazyLoadPage(() => import('./pages/features/PricePredict'));
const ProfitCalc = LazyLoadPage(() => import('./pages/features/ProfitCalc'));
const WaterRequirement = LazyLoadPage(() => import('./pages/features/WaterRequirement'));
const NotFound = LazyLoadPage(() => import('./pages/NotFound'));

function App() {
  const { t, language } = useLanguage();
  const { location: userLocation } = useUserLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 pb-20 md:pb-0">
        <ErrorBoundary language={language}>
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Feature Routes */}
                <Route path="/plant-disease" element={<PlantDisease />} />
                <Route path="/crop-recommend" element={<CropRecommend />} />
                <Route path="/soil-type" element={<SoilType />} />
                <Route path="/soil-health" element={<SoilHealth />} />
                <Route path="/flood-risk" element={<FloodRisk />} />
                <Route path="/storm-risk" element={<StormRisk />} />
                <Route path="/rainfall" element={<Rainfall />} />
                <Route path="/air-quality" element={<AirQuality />} />
                <Route path="/co2-level" element={<CO2Level />} />
                <Route path="/ndvi" element={<NDVI />} />
                <Route path="/yield-predict" element={<YieldPredict />} />
                <Route path="/price-predict" element={<PricePredict />} />
                <Route path="/profit-calc" element={<ProfitCalc />} />
                <Route path="/water-requirement" element={<WaterRequirement />} />
                <Route path="/guide" element={<GuidePage />} />
                <Route path="/help" element={<GuidePage />} />  {/* Alias route */}
                {/* Redirect old paths */}
                <Route path="/plant-disease-detection" element={<Navigate to="/plant-disease" replace />} />
                <Route path="/crop-recommendation" element={<Navigate to="/crop-recommend" replace />} />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>
      
      <Footer />
      <BottomNav />
      <VoiceAssistant />
      
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;