/**
 * Global Voice Assistant Component
 * Provides voice control across entire application
 */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiMicOff, FiVolume2, FiVolumeX, FiX } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import useVoiceAssistant from '../../hooks/useVoiceAssistant';
import { toast } from 'react-hot-toast';

const VoiceAssistant = () => {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [volumeEnabled, setVolumeEnabled] = useState(true);

  // Voice assistant hook with global capabilities
  const {
    isListening,
    isActivated,
    isSupported,
    isProcessing,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    speak,
    reinitialize,
  } = useVoiceAssistant({
    language,
    onActivation: () => {
      toast.success(language === 'hi' 
        ? '🎤 मैं सुन रहा हूं...' 
        : '🎤 I am listening...'
      );
    },
    onResult: (result) => {
      handleGlobalCommand(result);
    },
  });

  // Auto-start voice assistant
  useEffect(() => {
    if (isSupported) {
      const timer = setTimeout(() => {
        startListening();
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, startListening]);

  // Handle global voice commands
  const handleGlobalCommand = useCallback((result) => {
    const command = result.originalCommand?.toLowerCase();
    
    if (!command) return;
    
    // Navigation commands
    if (command.includes('dashboard') || command.includes('डैशबोर्ड')) {
      window.location.href = '/dashboard';
      speak(language === 'hi' ? 'डैशबोर्ड पर जा रहा हूं' : 'Going to dashboard');
    }
    else if (command.includes('plant disease') || command.includes('पौधा रोग') || command.includes('बीमारी')) {
      window.location.href = '/plant-disease';
      speak(language === 'hi' ? 'पौधा रोग पहचान पर जा रहा हूं' : 'Going to plant disease detection');
    }
    else if (command.includes('soil') || command.includes('मिट्टी')) {
      window.location.href = '/soil-type';
      speak(language === 'hi' ? 'मिट्टी विश्लेषण पर जा रहा हूं' : 'Going to soil analysis');
    }
    else if (command.includes('crop') || command.includes('फसल')) {
      window.location.href = '/crop-recommend';
      speak(language === 'hi' ? 'फसल अनुशंसा पर जा रहा हूं' : 'Going to crop recommendation');
    }
    else if (command.includes('weather') || command.includes('मौसम')) {
      window.location.href = '/flood-risk';
      speak(language === 'hi' ? 'मौसम भविष्यवाणी पर जा रहा हूं' : 'Going to weather prediction');
    }
    else if (command.includes('market') || command.includes('बाजार')) {
      window.location.href = '/price-predict';
      speak(language === 'hi' ? 'बाजार मूल्य पहचान पर जा रहा हूं' : 'Going to market price prediction');
    }
    else if (command.includes('water') || command.includes('पानी')) {
      window.location.href = '/water-requirement';
      speak(language === 'hi' ? 'जल आवश्यकता पर जा रहा हूं' : 'Going to water requirement');
    }
    else if (command.includes('home') || command.includes('होम')) {
      window.location.href = '/';
      speak(language === 'hi' ? 'होम पर जा रहा हूं' : 'Going to home');
    }
    // Help command
    else if (command.includes('help') || command.includes('मदद') || command.includes('सहायता')) {
      const helpText = language === 'hi' 
        ? 'आप कह सकते हैं: डैशबोर्ड, पौधा रोग, मिट्टी, फसल, मौसम, बाजार, पानी, या होम'
        : 'You can say: dashboard, plant disease, soil, crop, weather, market, water, or home';
      speak(helpText);
    }
    // Stop listening
    else if (command.includes('stop') || command.includes('रुको') || command.includes('बंद')) {
      stopListening();
      speak(language === 'hi' ? 'ठीक है, रुक रहा हूं' : 'Okay, stopping');
    }
    // Unknown command
    else {
      speak(language === 'hi' 
        ? 'मुझे समझ नहीं आया। कृपया फिर से कहें' 
        : 'I did not understand. Please say again'
      );
    }
  }, [language, speak, stopListening]);

  // Toggle voice assistant visibility
  const toggleVisibility = () => {
    if (isVisible) {
      setIsMinimized(!isMinimized);
    } else {
      setIsVisible(true);
      setIsMinimized(false);
      startListening();
    }
  };

  // Toggle volume
  const toggleVolume = () => {
    setVolumeEnabled(!volumeEnabled);
  };

  if (!isSupported) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            x: isMinimized ? 'calc(100vw - 100px)' : 0
          }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          className={`fixed bottom-6 right-6 z-50 ${
            isMinimized ? 'w-16 h-16' : 'w-80'
          } transition-all duration-300 ease-in-out`}
        >
          {/* Minimized View */}
          {isMinimized ? (
            <motion.button
              onClick={toggleVisibility}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl ${
                isActivated 
                  ? 'bg-gradient-to-br from-green-500 to-green-600 animate-pulse' 
                  : isListening 
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
                    : 'bg-gradient-to-br from-gray-500 to-gray-600'
              } text-white`}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? <FiMic className="w-6 h-6" /> : <FiMicOff className="w-6 h-6" />}
            </motion.button>
          ) : (
            // Expanded View
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 flex items-center justify-between">
                <h3 className="font-semibold text-white">
                  {language === 'hi' ? 'धरतीसेतु वॉइस' : 'DhartiSetu Voice'}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleVolume}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    {volumeEnabled ? (
                      <FiVolume2 className="w-5 h-5 text-white" />
                    ) : (
                      <FiVolumeX className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <FiX className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Status Indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      isActivated 
                        ? 'bg-green-500 animate-pulse' 
                        : isListening 
                          ? 'bg-blue-500' 
                          : 'bg-gray-400'
                    }`} />
                    <span className="text-sm font-medium text-gray-700">
                      {isActivated 
                        ? (language === 'hi' ? 'सुन रहा हूं' : 'Listening')
                        : isListening 
                          ? (language === 'hi' ? 'तैयार' : 'Ready')
                          : (language === 'hi' ? 'बंद' : 'Off')
                      }
                    </span>
                  </div>
                  
                  <button
                    onClick={toggleListening}
                    className={`p-2 rounded-full ${
                      isListening 
                        ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    } transition-colors`}
                  >
                    {isListening ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
                  </button>
                </div>

                {/* Transcript */}
                <AnimatePresence>
                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-100 rounded-xl p-3 mb-4"
                    >
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">{language === 'hi' ? 'आपने कहा:' : 'You said:'}</span> "{transcript}"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Help Text */}
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                  <p className="text-xs text-blue-700">
                    {language === 'hi' 
                      ? 'कहें: "डैशबोर्ड", "पौधा रोग", "मिट्टी", "फसल", "मौसम", "बाजार", "पानी", या "होम"'
                      : 'Say: "dashboard", "plant disease", "soil", "crop", "weather", "market", "water", or "home"'}
                  </p>
                </div>

                {/* Reinitialize Button */}
                <button
                  onClick={reinitialize}
                  className="w-full mt-3 text-xs text-gray-500 hover:text-gray-700 text-center"
                >
                  {language === 'hi' ? 'फिर से शुरू करें' : 'Reinitialize'}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceAssistant;