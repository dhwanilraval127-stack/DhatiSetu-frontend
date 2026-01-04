import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiImage, FiX, FiCamera, FiAlertTriangle } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const ImageUpload = ({ 
  onImageSelect, 
  onCameraClick,
  showCameraOption = true,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg']
}) => {
  const { t, language } = useLanguage();
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError(null);
    setIsValidating(true);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(language === 'hi' ? 'फाइल बहुत बड़ी है। अधिकतम 10MB' : 'File is too large. Maximum 10MB');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError(language === 'hi' ? 'कृपया केवल JPEG या PNG छवियां अपलोड करें' : 'Please upload only JPEG or PNG images');
      } else {
        setError(language === 'hi' ? 'अमान्य फाइल' : 'Invalid file');
      }
      setIsValidating(false);
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      
      // Additional validation
      const reader = new FileReader();
      
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          // Validate image dimensions
          if (image.width < 100 || image.height < 100) {
            setError(language === 'hi' ? 'छवि बहुत छोटी है। कम से कम 100x100 पिक्सेल की आवश्यकता है' : 'Image is too small. Minimum 100x100 pixels required');
            setIsValidating(false);
            return;
          }
          
          // Validate image content (simple check)
          const imageData = reader.result;
          if (imageData && imageData.length > 0) {
            setPreview(imageData);
            onImageSelect(file);
          } else {
            setError(language === 'hi' ? 'छवि पढ़ने में विफल' : 'Failed to read image');
          }
          setIsValidating(false);
        };
        
        image.onerror = () => {
          setError(language === 'hi' ? 'अमान्य छवि फाइल' : 'Invalid image file');
          setIsValidating(false);
        };
        
        image.src = reader.result;
      };
      
      reader.onerror = () => {
        setError(language === 'hi' ? 'फाइल पढ़ने में विफल' : 'Failed to read file');
        setIsValidating(false);
      };
      
      reader.readAsDataURL(file);
    } else {
      setIsValidating(false);
    }
  }, [onImageSelect, language]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedTypes.map(type => `.${type.split('/')[1]}`)
    },
    maxSize,
    multiple: false
  });

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden bg-gray-100"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 sm:h-80 object-contain bg-gray-900"
            />
            
            <button
              onClick={clearImage}
              className="absolute top-3 right-3 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                transition-all duration-200
                ${isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }
                ${error ? 'border-red-400 bg-red-50' : ''}
              `}
            >
              <input {...getInputProps()} />
              
              <div className="flex flex-col items-center">
                <motion.div
                  animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    isDragActive ? 'bg-primary-100' : 'bg-gray-100'
                  }`}
                >
                  <FiUploadCloud className={`w-8 h-8 ${
                    isDragActive ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                </motion.div>
                
                <p className="text-gray-700 font-medium mb-1">
                  {language === 'hi' ? 'छवि खींचें और छोड़ें' : 'Drag and drop image'}
                </p>
                
                <p className="text-sm text-gray-500">
                  JPEG, PNG • Max 10MB
                </p>
              </div>
            </div>
            
            {/* Camera Option */}
            {showCameraOption && onCameraClick && (
              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <div className="h-px w-12 bg-gray-300" />
                  <span className="text-gray-500 text-sm">
                    {language === 'hi' ? 'या' : 'or'}
                  </span>
                  <div className="h-px w-12 bg-gray-300" />
                </div>
              </div>
            )}
            
            {showCameraOption && onCameraClick && (
              <motion.button
                onClick={onCameraClick}
                className="mt-4 w-full flex items-center justify-center space-x-2 px-6 py-4 bg-primary-50 text-primary-700 rounded-xl font-medium hover:bg-primary-100 transition-colors"
                whileTap={{ scale: 0.98 }}
              >
                <FiCamera className="w-5 h-5" />
                <span>{language === 'hi' ? 'कैमरा खोलें' : 'Open Camera'}</span>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-500 text-sm mt-3 text-center flex items-center justify-center space-x-2"
          >
            <FiAlertTriangle className="w-4 h-4" />
            <span>{error}</span>
          </motion.p>
        )}
      </AnimatePresence>
      
      {/* Validation Loading */}
      <AnimatePresence>
        {isValidating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-3"
          >
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              <span>{language === 'hi' ? 'छवि की पुष्टि कर रहे हैं...' : 'Validating image...'}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;