import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const PredictionList = ({ 
  predictions, 
  labelKey = 'disease',
  valueKey = 'probability',
  className = '' 
}) => {
  const { language } = useLanguage();

  if (!predictions || predictions.length === 0) return null;

  const maxValue = Math.max(...predictions.map(p => p[valueKey]));

  return (
    <div className={className}>
      <h4 className="text-sm font-medium text-gray-600 mb-3">
        {language === 'hi' ? 'अन्य संभावनाएं' : 'Other Possibilities'}
      </h4>
      
      <div className="space-y-3">
        {predictions.map((prediction, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700 truncate pr-4">
                {prediction[labelKey]}
              </span>
              <span className="text-sm font-medium text-gray-800">
                {prediction[valueKey].toFixed(1)}%
              </span>
            </div>
            
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(prediction[valueKey] / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`h-full rounded-full ${
                  idx === 0 ? 'bg-primary-500' : 'bg-gray-300'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PredictionList;