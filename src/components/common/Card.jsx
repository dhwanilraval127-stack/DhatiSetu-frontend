import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  onClick,
  padding = 'p-6' 
}) => {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      className={`bg-white rounded-2xl shadow-sm ${padding} ${
        hover ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer' : ''
      } transition-all duration-300 ${className}`}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {children}
    </Component>
  );
};

export default Card;