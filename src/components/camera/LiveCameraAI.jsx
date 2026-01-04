/**
 * Live Camera with AI Detection Box (Gemini-style)
 * Features:
 * - Live camera feed
 * - Detection bounding box
 * - Voice activation
 * - Real-time analysis
 */
import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCamera, FiRefreshCw, FiX, FiCheck, FiMic, FiMicOff,
  FiZap, FiVolume2, FiVolumeX, FiSettings
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import useVoiceAssistant from '../../hooks/useVoiceAssistant';
import Button from '../common/Button';

const LiveCameraAI = ({ 
  onCapture, 
  onClose,
  onAnalyze,
  isAnalyzing = false,
  analysisResult = null,
  mode = 'plant-disease', // 'plant-disease' or 'soil'
}) => {
  const { t, language } = useLanguage();
  const webcamRef = useRef(null);
  
  const [facingMode, setFacingMode] = useState('environment');
  const [capturedImage, setCapturedImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(false);
  const [detectionBox, setDetectionBox] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Voice assistant
  const {
    isListening,
    isActivated,
    isSupported: voiceSupported,
    transcript,
    startListening,
    stopListening,
    toggleListening,
    speak,
  } = useVoiceAssistant({
    language,
    onActivation: () => {
      // Flash detection box when activated
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 500);
    },
    onResult: (result) => {
      handleVoiceCommand(result);
    },
  });

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: facingMode,
    aspectRatio: 4/3,
  };

  // Check camera permission
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setHasPermission(true);
        setIsLoading(false);
      })
      .catch(() => {
        setHasPermission(false);
        setIsLoading(false);
      });
  }, []);

  // Auto-start voice on mount
  useEffect(() => {
    if (voiceSupported && voiceEnabled) {
      const timer = setTimeout(() => {
        startListening();
        speak(language === 'hi' 
          ? 'कैमरा तैयार है। धरती बोलकर मुझे सक्रिय करें।' 
          : 'Camera ready. Say Dharti to activate me.'
        );
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [voiceSupported, voiceEnabled]);

  // Handle voice commands
  const handleVoiceCommand = useCallback((result) => {
    switch (result.action) {
      case 'capture':
        capture();
        break;
      case 'analyze':
        if (capturedImage) {
          handleUsePhoto();
        } else {
          captureAndAnalyze();
        }
        break;
      case 'detect_disease':
      case 'detect_soil':
        captureAndAnalyze();
        break;
      case 'stop':
        onClose();
        break;
      case 'help':
        // Help response already spoken
        break;
      default:
        break;
    }
  }, [capturedImage]);

  // Capture image
  const capture = useCallback(() => {
    if (webcamRef.current) {
      // Animate detection box
      setDetectionBox({ x: 10, y: 10, width: 80, height: 80 });
      setIsScanning(true);
      
      setTimeout(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        onCapture?.(imageSrc);
        setIsScanning(false);
        
        speak(language === 'hi' 
          ? 'फोटो कैप्चर हो गई। विश्लेषण के लिए उपयोग करें बोलें।' 
          : 'Photo captured. Say use or analyze.'
        );
      }, 300);
    }
  }, [onCapture, speak, language]);

  // Capture and immediately analyze
  const captureAndAnalyze = useCallback(() => {
    if (webcamRef.current) {
      setDetectionBox({ x: 10, y: 10, width: 80, height: 80 });
      setIsScanning(true);
      
      setTimeout(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setCapturedImage(imageSrc);
        setIsScanning(false);
        
        speak(language === 'hi' ? 'विश्लेषण कर रहा हूं...' : 'Analyzing...');
        
        if (onAnalyze) {
          onAnalyze(imageSrc);
        }
      }, 300);
    }
  }, [onAnalyze, speak, language]);

  // Retake
  const retake = () => {
    setCapturedImage(null);
    setDetectionBox(null);
  };

  // Switch camera
  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Use captured photo for analysis
  const handleUsePhoto = () => {
    if (capturedImage && onAnalyze) {
      speak(language === 'hi' ? 'विश्लेषण शुरू...' : 'Starting analysis...');
      onAnalyze(capturedImage);
    }
  };

  // Toggle voice
  const toggleVoice = () => {
    if (voiceEnabled) {
      stopListening();
    } else {
      startListening();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  // Simulate scanning animation
  useEffect(() => {
    if (!capturedImage && hasPermission && !isAnalyzing) {
      const interval = setInterval(() => {
        // Random detection box animation
        const randomX = 15 + Math.random() * 20;
        const randomY = 15 + Math.random() * 20;
        const randomW = 50 + Math.random() * 20;
        const randomH = 50 + Math.random() * 20;
        
        setDetectionBox({
          x: randomX,
          y: randomY,
          width: randomW,
          height: randomH
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [capturedImage, hasPermission, isAnalyzing]);

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <motion.div 
            className="w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="mt-4">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Permission denied
  if (hasPermission === false) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCamera className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {t('camera.permissionDenied')}
          </h3>
          <p className="text-gray-600 mb-4">
            {language === 'hi' 
              ? 'कृपया सेटिंग्स में कैमरा एक्सेस की अनुमति दें'
              : 'Please allow camera access in settings'}
          </p>
          <Button variant="outline" onClick={onClose}>
            {t('close')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50 flex flex-col"
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Title & Mode */}
        <div className="text-white text-center">
          <h3 className="font-semibold">
            {mode === 'plant-disease' 
              ? (language === 'hi' ? 'पौधा स्कैनर' : 'Plant Scanner')
              : (language === 'hi' ? 'मिट्टी स्कैनर' : 'Soil Scanner')
            }
          </h3>
          {isListening && (
            <motion.p 
              className="text-xs text-green-400 flex items-center justify-center gap-1"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FiMic className="w-3 h-3" />
              {isActivated 
                ? (language === 'hi' ? 'सुन रहा हूं...' : 'Listening...')
                : (language === 'hi' ? '"धरती" बोलें' : 'Say "Dharti"')
              }
            </motion.p>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Voice Toggle */}
          {voiceSupported && (
            <button
              onClick={toggleVoice}
              className={`p-3 rounded-full transition-colors ${
                voiceEnabled 
                  ? 'bg-green-500 text-white' 
                  : 'bg-black/50 text-white'
              }`}
            >
              {voiceEnabled ? <FiMic className="w-5 h-5" /> : <FiMicOff className="w-5 h-5" />}
            </button>
          )}
          
          {/* Switch Camera */}
          <button
            onClick={switchCamera}
            className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Camera View / Captured Image */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {capturedImage ? (
            <motion.img
              key="captured"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-contain"
            />
          ) : (
            <motion.div
              key="webcam"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.92}
                videoConstraints={videoConstraints}
                className="w-full h-full object-cover"
                onUserMediaError={() => setHasPermission(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Detection Box Overlay */}
        {detectionBox && !capturedImage && (
          <motion.div
            className="absolute pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              left: `${detectionBox.x}%`,
              top: `${detectionBox.y}%`,
              width: `${detectionBox.width}%`,
              height: `${detectionBox.height}%`,
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Detection Box */}
            <div className={`w-full h-full border-2 rounded-lg ${
              isScanning ? 'border-green-400' : 'border-white/60'
            }`}>
              {/* Corner markers */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-green-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-green-400" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-green-400" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-green-400" />
            </div>
            
            {/* Scanning line animation */}
            {isScanning && (
              <motion.div
                className="absolute left-0 right-0 h-0.5 bg-green-400"
                initial={{ top: 0 }}
                animate={{ top: '100%' }}
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            )}
          </motion.div>
        )}

        {/* Voice Activation Indicator */}
        <AnimatePresence>
          {isActivated && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute top-20 left-4 right-4 bg-green-500 text-white p-3 rounded-xl text-center"
            >
              <p className="font-medium">
                {language === 'hi' ? '🎤 सुन रहा हूं...' : '🎤 Listening...'}
              </p>
              {transcript && (
                <p className="text-sm opacity-80 mt-1">"{transcript}"</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Result Overlay */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-32 left-4 right-4 bg-white rounded-2xl p-4 shadow-xl"
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  analysisResult.isHealthy 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  <FiZap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">
                    {analysisResult.prediction}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {language === 'hi' ? 'विश्वसनीयता' : 'Confidence'}: {analysisResult.confidence}%
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guide Text */}
        {!capturedImage && !analysisResult && (
          <div className="absolute bottom-32 left-0 right-0 text-center">
            <div className="inline-block bg-black/50 px-4 py-2 rounded-full">
              <p className="text-white text-sm">
                {mode === 'plant-disease'
                  ? (language === 'hi' ? 'पत्ती को फ्रेम में रखें' : 'Position leaf in frame')
                  : (language === 'hi' ? 'मिट्टी को फ्रेम में रखें' : 'Position soil in frame')
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="bg-black/80 px-6 py-6 pb-8 safe-bottom">
        {capturedImage ? (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={retake}
              icon={FiRefreshCw}
              className="border-white text-white hover:bg-white/10"
            >
              {t('camera.retake')}
            </Button>
            
            <Button
              variant="primary"
              onClick={handleUsePhoto}
              loading={isAnalyzing}
              icon={FiCheck}
              className="bg-green-500 hover:bg-green-600"
            >
              {isAnalyzing 
                ? (language === 'hi' ? 'विश्लेषण...' : 'Analyzing...')
                : (language === 'hi' ? 'विश्लेषण करें' : 'Analyze')
              }
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-6">
            {/* Auto-analyze toggle */}
            <button
              onClick={() => setAutoAnalyze(!autoAnalyze)}
              className={`p-3 rounded-full transition-colors ${
                autoAnalyze ? 'bg-green-500 text-white' : 'bg-white/20 text-white'
              }`}
              title={language === 'hi' ? 'ऑटो विश्लेषण' : 'Auto Analyze'}
            >
              <FiZap className="w-5 h-5" />
            </button>
            
            {/* Main Capture Button */}
            <motion.button
              onClick={autoAnalyze ? captureAndAnalyze : capture}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"
              whileTap={{ scale: 0.9 }}
              disabled={isAnalyzing}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isAnalyzing 
                  ? 'bg-gray-400' 
                  : autoAnalyze 
                    ? 'bg-green-500' 
                    : 'bg-primary-500'
              }`}>
                {isAnalyzing ? (
                  <motion.div 
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                ) : (
                  <FiCamera className="w-8 h-8 text-white" />
                )}
              </div>
            </motion.button>
            
            {/* Voice indicator */}
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full transition-colors ${
                isListening 
                  ? isActivated 
                    ? 'bg-green-500 text-white animate-pulse' 
                    : 'bg-blue-500 text-white'
                  : 'bg-white/20 text-white'
              }`}
              title={language === 'hi' ? 'वॉइस कंट्रोल' : 'Voice Control'}
            >
              {isListening ? <FiMic className="w-5 h-5" /> : <FiMicOff className="w-5 h-5" />}
            </button>
          </div>
        )}
        
        {/* Voice hint */}
        {voiceSupported && voiceEnabled && !capturedImage && (
          <p className="text-white/60 text-xs text-center mt-4">
            {language === 'hi' 
              ? '🎤 "धरती, फोटो खींचो" या "धरती, विश्लेषण करो" बोलें'
              : '🎤 Say "Dharti, capture photo" or "Dharti, analyze"'
            }
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default LiveCameraAI;