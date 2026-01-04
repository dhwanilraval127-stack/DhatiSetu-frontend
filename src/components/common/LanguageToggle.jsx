import React, { useState } from 'react';
import { FiChevronDown, FiCheck } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'gu', label: 'ગુજરાતી' },
];

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const current = languages.find(l => l.code === language);

  return (
    <div className="relative">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
      >
        <span>{current?.code.toUpperCase()}</span>
        <FiChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm transition ${
                language === lang.code
                  ? 'bg-primary-50 text-primary-700'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <span>{lang.label}</span>
              {language === lang.code && (
                <FiCheck className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageToggle;
