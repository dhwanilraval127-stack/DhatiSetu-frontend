import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiGrid, FiCamera, FiSettings } from 'react-icons/fi';
import { GiPlantSeed } from 'react-icons/gi';
import { useLanguage } from '../../context/LanguageContext';

const BottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/', icon: FiHome, label: t('nav.home') },
    { path: '/dashboard', icon: FiGrid, label: t('nav.dashboard') },
    { path: '/plant-disease', icon: GiPlantSeed, label: t('detect'), isMain: true },
    { path: '/crop-recommend', icon: FiCamera, label: t('features.cropRecommend.title').split(' ')[0] },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className="relative flex-1"
          >
            {item.isMain ? (
              <motion.div 
                className="absolute left-1/2 -translate-x-1/2 -top-6"
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${
                  isActive(item.path) 
                    ? 'bg-primary-600' 
                    : 'bg-gradient-to-br from-primary-500 to-primary-600'
                }`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="flex flex-col items-center py-2"
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className={`w-6 h-6 ${
                  isActive(item.path) ? 'text-primary-600' : 'text-gray-500'
                }`} />
                <span className={`text-xs mt-1 ${
                  isActive(item.path) ? 'text-primary-600 font-medium' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
                {isActive(item.path) && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-600 rounded-t-full"
                  />
                )}
              </motion.div>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;