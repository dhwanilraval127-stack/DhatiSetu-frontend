import React from 'react';
import { motion } from 'framer-motion';

const FormSection = ({ 
  title, 
  description, 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-sm p-6 ${className}`}
    >
      {title && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          {description && (
            <p className="text-gray-500 text-sm mt-1">{description}</p>
          )}
        </div>
      )}
      
      {children}
    </motion.div>
  );
};

export default FormSection;