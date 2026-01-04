import React from 'react';
import { Link } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import { FiMail, FiPhone, FiMapPin, FiGithub, FiTwitter } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <GiWheat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {language === 'hi' ? 'धरतीसेतु' : 'DhartiSetu'}
                </h3>
                <p className="text-xs text-gray-400">
                  {language === 'hi' ? 'कृषि बुद्धिमत्ता मंच' : 'Agricultural Intelligence Platform'}
                </p>
              </div>
            </div>
            <p className="text-gray-400 max-w-md">
              {language === 'hi' 
                ? 'AI-संचालित कृषि समाधान जो किसानों को बेहतर निर्णय लेने में मदद करते हैं।'
                : 'AI-powered agricultural solutions helping farmers make better decisions.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t('nav.dashboard')}
                </Link>
              </li>
              <li>
                <Link to="/plant-disease" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t('Plant Disease')}
                </Link>
              </li>
              <li>
                <Link to="/crop-recommend" className="text-gray-400 hover:text-primary-400 transition-colors">
                  {t('features.cropRecommend.title')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">
              {language === 'hi' ? 'संपर्क करें' : 'Contact'}
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-400">
                <FiMail className="w-4 h-4" />
                <span>support@dhartisetu.in</span>
              </li>
             
              <li className="flex items-center space-x-2 text-gray-400">
                <FiMapPin className="w-4 h-4" />
                <span>{language === 'hi' ? 'भारत' : 'India'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} DhartiSetu. {language === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
              <FiGithub className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
              <FiTwitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;