import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

const NotFound = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-green-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          className="inline-block mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center shadow-xl">
            <GiWheat className="w-14 h-14 text-white" />
          </div>
        </motion.div>

        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          {language === 'hi' ? 'पेज नहीं मिला' : 'Page Not Found'}
        </h2>
        
        <p className="text-gray-600 mb-8 max-w-md">
          {language === 'hi' 
            ? 'जिस पेज की आप तलाश कर रहे हैं वह मौजूद नहीं है या हटा दिया गया है।'
            : 'The page you are looking for does not exist or has been removed.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button icon={FiHome}>
              {language === 'hi' ? 'होम पर जाएं' : 'Go Home'}
            </Button>
          </Link>
          
          <Link to="/dashboard">
            <Button variant="outline" icon={FiArrowLeft}>
              {language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;