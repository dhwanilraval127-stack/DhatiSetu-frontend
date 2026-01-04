import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHelpCircle, FiList, FiShield, FiArrowRight,
  FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const ExplanationCard = ({ explanation, className = '' }) => {
  const { t } = useLanguage();
  const [expandedSection, setExpandedSection] = useState('why');

  if (!explanation) return null;

  const sections = [
    {
      id: 'why',
      title: t('explanation.why'),
      icon: FiHelpCircle,
      content: explanation.why,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'factors',
      title: t('explanation.factors'),
      icon: FiList,
      content: explanation.factors,
      isList: true,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'prevention',
      title: t('explanation.prevention'),
      icon: FiShield,
      content: explanation.prevention,
      isList: true,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'nextSteps',
      title: t('explanation.nextSteps'),
      icon: FiArrowRight,
      content: explanation.next_steps,
      isList: true,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const toggleSection = (id) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`bg-white rounded-2xl shadow-sm overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="font-semibold text-gray-800">
          {t('language') === 'hi' ? 'विस्तृत विश्लेषण' : 'Detailed Analysis'}
        </h3>
      </div>

      <div className="divide-y">
        {sections.map((section) => (
          <div key={section.id}>
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${section.color}`}>
                  <section.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-800">{section.title}</span>
              </div>
              
              {expandedSection === section.id ? (
                <FiChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <AnimatePresence>
              {expandedSection === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4 pl-[4.5rem]">
                    {section.isList && Array.isArray(section.content) ? (
                      <ul className="space-y-2">
                        {section.content.map((item, idx) => (
                          <li 
                            key={idx}
                            className="flex items-start space-x-2 text-gray-600"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">{section.content}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExplanationCard;