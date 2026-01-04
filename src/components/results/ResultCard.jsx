import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const ResultCard = ({ 
  type = 'success', // success, warning, error, info
  title,
  value,
  subtitle,
  icon: CustomIcon,
  children,
  className = ''
}) => {
  const styles = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'bg-green-100 text-green-600',
      title: 'text-green-800',
      value: 'text-green-700',
      defaultIcon: FiCheck
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'bg-amber-100 text-amber-600',
      title: 'text-amber-800',
      value: 'text-amber-700',
      defaultIcon: FiAlertTriangle
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'bg-red-100 text-red-600',
      title: 'text-red-800',
      value: 'text-red-700',
      defaultIcon: FiX
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'bg-blue-100 text-blue-600',
      title: 'text-blue-800',
      value: 'text-blue-700',
      defaultIcon: FiInfo
    }
  };

  const style = styles[type];
  const Icon = CustomIcon || style.defaultIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 border ${style.bg} ${style.border} ${className}`}
    >
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.icon}`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold ${style.title}`}>{title}</h3>
          
          {value && (
            <p className={`text-2xl font-bold mt-1 ${style.value}`}>
              {value}
            </p>
          )}
          
          {subtitle && (
            <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
          )}
          
          {children && (
            <div className="mt-4">{children}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;