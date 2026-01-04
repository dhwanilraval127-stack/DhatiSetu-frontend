import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiRefreshCw, FiChevronDown } from 'react-icons/fi';
import { useLocation } from '../../context/LocationContext';
import { useLanguage } from '../../context/LanguageContext';

const LocationBadge = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { location, loading, detectLocation } = useLocation();
  const { t } = useLanguage();

  if (!location) {
    return (
      <motion.button
        onClick={detectLocation}
        disabled={loading}
        className={`flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors ${className}`}
        whileTap={{ scale: 0.95 }}
      >
        {loading ? (
          <FiRefreshCw className="w-4 h-4 text-gray-600 animate-spin" />
        ) : (
          <FiMapPin className="w-4 h-4 text-gray-600" />
        )}
        <span className="text-sm text-gray-600">
          {loading ? t('location.detecting') : t('location.manual')}
        </span>
      </motion.button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-2 px-3 py-2 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        <FiMapPin className="w-4 h-4 text-primary-600" />
        <span className="text-sm font-medium text-primary-700 max-w-32 truncate">
          {location.city}
        </span>
        <FiChevronDown className={`w-4 h-4 text-primary-600 transition-transform ${
          isExpanded ? 'rotate-180' : ''
        }`} />
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg p-4 min-w-48 z-50"
          >
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-500">{t('location.city')}</p>
                <p className="font-medium text-gray-800">{location.city}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('location.district')}</p>
                <p className="font-medium text-gray-800">{location.district}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{t('location.state')}</p>
                <p className="font-medium text-gray-800">{location.state}</p>
              </div>
              
              <button
                onClick={() => {
                  detectLocation();
                  setIsExpanded(false);
                }}
                disabled={loading}
                className="w-full mt-3 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{t('retry')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationBadge;