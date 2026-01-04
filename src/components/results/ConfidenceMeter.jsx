import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const ConfidenceMeter = ({ confidence, className = '' }) => {
  const { language } = useLanguage();
  
  const getConfidenceLevel = (value) => {
    if (value >= 80) return { level: 'high', color: 'bg-green-500', text: language === 'hi' ? 'उच्च' : 'High' };
    if (value >= 60) return { level: 'medium', color: 'bg-yellow-500', text: language === 'hi' ? 'मध्यम' : 'Medium' };
    return { level: 'low', color: 'bg-red-500', text: language === 'hi' ? 'कम' : 'Low' };
  };

  const { color, text } = getConfidenceLevel(confidence);

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">
          {language === 'hi' ? 'विश्वसनीयता' : 'Confidence'}
        </span>
        <span className="text-sm font-semibold text-gray-800">
          {confidence.toFixed(1)}% ({text})
        </span>
      </div>
      
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
};

export default ConfidenceMeter;