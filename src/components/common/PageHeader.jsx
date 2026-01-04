import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const PageHeader = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  backTo = '/dashboard',
  color = 'primary' 
}) => {
  const { t } = useLanguage();

  const colors = {
    primary: 'from-primary-500 to-primary-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    amber: 'from-amber-500 to-orange-600',
    purple: 'from-purple-500 to-violet-600',
    earth: 'from-earth-500 to-amber-700'
  };

  return (
    <div className="bg-white border-b">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          to={backTo}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-4"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>{t('back')}</span>
        </Link>
        
        <div className="flex items-start space-x-4">
          {Icon && (
            <motion.div 
              className={`w-14 h-14 bg-gradient-to-br ${colors[color]} rounded-2xl flex items-center justify-center shadow-lg`}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <Icon className="w-7 h-7 text-white" />
            </motion.div>
          )}
          
          <div>
            <motion.h1 
              className="text-2xl md:text-3xl font-bold text-gray-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {title}
            </motion.h1>
            {subtitle && (
              <motion.p 
                className="text-gray-600 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;