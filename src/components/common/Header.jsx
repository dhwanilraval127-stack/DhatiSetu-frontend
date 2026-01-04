import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiGrid, FiMapPin } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation as useUserLocation } from '../../context/LocationContext';
import LanguageToggle from './LanguageToggle';
import LocationBadge from './LocationBadge';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useLanguage();
  const location = useLocation();
  const { location: userLocation } = useUserLocation();

  const navItems = [
    { path: '/', label: t('nav.home'), icon: FiHome },
    { path: '/dashboard', label: t('nav.dashboard'), icon: FiGrid },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <img 
              src="/DhartiSetu.png" 
              alt="DhartiSetu" 
              className="w-10 h-10 rounded-xl object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
            <div 
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl items-center justify-center shadow-md hidden"
            >
              <span className="text-white font-bold text-lg">ध</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-800">
                {language === 'hi' ? 'धरतीसेतु' : 'DhartiSetu'}
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                {language === 'hi' ? 'कृषि बुद्धिमत्ता' : 'Agri Intelligence'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  isActive(item.path)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {userLocation && (
              <LocationBadge className="hidden sm:flex" />
            )}
            
            <LanguageToggle />

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6 text-gray-600" />
              ) : (
                <FiMenu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t"
          >
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {userLocation && (
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiMapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {userLocation.city}, {userLocation.state}
                    </span>
                  </div>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;