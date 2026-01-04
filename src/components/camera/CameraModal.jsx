import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiX, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { checkImageRelevance } from '../../utils/imageRelevanceCheck';

const CameraModal = ({
  isOpen,
  onClose,
  onCapture,
  onAnalyze,
  isAnalyzing = false,
  analysisResult = null,
  featureType = 'general'
}) => {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const getDevices = async () => {
        try {
          const allDevices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
          setDevices(videoDevices);
        } catch (err) {
          console.error('Error enumerating devices:', err);
        }
      };
      getDevices();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && devices.length > 0) {
      startCamera();
    }
    return () => stopCamera();
  }, [isOpen, devices, currentDeviceIndex]);

  const startCamera = async () => {
    stopCamera();
    try {
      const constraints = {
        video: {
          deviceId: devices[currentDeviceIndex]?.deviceId
            ? { exact: devices[currentDeviceIndex].deviceId }
            : undefined,
          facingMode: devices.length > 1 ? undefined : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error('Camera error:', err);
      setError(err.message || 'Failed to access camera');
      if (devices.length > 0 && currentDeviceIndex < devices.length - 1) {
        setCurrentDeviceIndex(prev => prev + 1);
      } else {
        toast.error('Please enable camera permissions in your browser settings');
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    if (devices.length > 1) {
      setCurrentDeviceIndex(prev => (prev + 1) % devices.length);
    }
  };

  const captureImage = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/jpeg', 0.92);

      const isRelevant = await checkImageRelevance(imageData);
      if (!isRelevant) {
        toast.error('Please upload an image of soil, plant, or land');
        return;
      }

      onCapture?.(imageData);
      if (onAnalyze) {
        onAnalyze(imageData);
      }
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex flex-col"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-black/50">
          <button
            onClick={onClose}
            className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>

          {devices.length > 1 && (
            <button
              onClick={switchCamera}
              className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <FiRefreshCw className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Camera View */}
        <div className="flex-1 relative">
          {error ? (
            <div className="flex flex-col items-center justify-center h-full text-white p-4 text-center">
              <FiAlertTriangle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Camera Access Denied</h3>
              <p className="mb-4">
                Please enable camera permissions in your browser settings
              </p>
              <button
                onClick={startCamera}
                className="px-6 py-3 bg-primary-600 rounded-lg font-medium"
              >
                Retry Camera
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              onLoadedMetadata={() => {
                console.log('Camera stream loaded');
              }}
            />
          )}
        </div>

        {/* Capture Button */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={captureImage}
            disabled={isAnalyzing}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl"
          >
            {isAnalyzing ? (
              <motion.div
                className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ) : (
              <FiCamera className="w-10 h-10 text-gray-800" />
            )}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default CameraModal;