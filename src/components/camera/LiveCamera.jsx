import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCamera, FiRefreshCw, FiX, FiCheck, FiZap 
} from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import Button from '../common/Button';

const LiveCamera = ({ 
  onCapture, 
  onClose,
  onAnalyze,
  isAnalyzing = false
}) => {
  const { t } = useLanguage();
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState('environment');
  const [capturedImage, setCapturedImage] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const videoConstraints = {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: facingMode
  };

  useEffect(() => {
    // Check camera permission
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

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      onCapture?.(imageSrc);
    }
  }, [onCapture]);

  const retake = () => {
    setCapturedImage(null);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleUsePhoto = () => {
    if (capturedImage && onAnalyze) {
      onAnalyze(capturedImage);
    }
  };

  // Convert base64 to blob for API
  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="spinner mx-auto mb-4" />
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

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
            {t('location.permission')}
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
      className="fixed inset-0 bg-black z-50"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
      >
        <FiX className="w-6 h-6" />
      </button>

      {/* Switch Camera Button */}
      <button
        onClick={switchCamera}
        className="absolute top-4 right-4 z-10 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
      >
        <FiRefreshCw className="w-6 h-6" />
      </button>

      {/* Camera View / Captured Image */}
      <div className="h-full flex flex-col">
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {capturedImage ? (
              <motion.img
                key="captured"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                  screenshotQuality={0.9}
                  videoConstraints={videoConstraints}
                  className="w-full h-full object-cover"
                  onUserMediaError={() => setHasPermission(false)}
                />
                
                {/* Guide Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 sm:w-80 sm:h-80 border-2 border-white/50 rounded-3xl">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full">
                      <p className="text-white text-sm">
                        {t('features.plantDisease.cameraHint')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="bg-black/80 px-6 py-8 safe-bottom">
          {capturedImage ? (
            <div className="flex items-center justify-center space-x-4">
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
                className="bg-primary-500 hover:bg-primary-600"
              >
                {isAnalyzing ? t('loading') : t('camera.use')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <motion.button
                onClick={capture}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"
                whileTap={{ scale: 0.9 }}
              >
                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
                  <FiCamera className="w-8 h-8 text-white" />
                </div>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LiveCamera;