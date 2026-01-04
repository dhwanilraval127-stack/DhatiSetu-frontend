import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { t } = useLanguage();

  const execute = useCallback(async (apiCall, options = {}) => {
    const { 
      showSuccessToast = false, 
      showErrorToast = true,
      successMessage,
      errorMessage,
      onSuccess,
      onError
    } = options;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      
      if (showSuccessToast) {
        toast.success(successMessage || t('success'));
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const message = err.message || t('errors.generic');
      setError(message);
      
      if (showErrorToast) {
        toast.error(errorMessage || message);
      }
      
      if (onError) {
        onError(err);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [t]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset,
    setData
  };
};

export default useApi;