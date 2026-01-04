import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { FiRotateCcw } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const FormActions = ({ 
  onSubmit, 
  onReset,
  submitLabel,
  submitIcon,
  loading = false,
  disabled = false,
  className = '' 
}) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={`flex flex-col sm:flex-row gap-3 pt-4 ${className}`}
    >
      <Button
        type="submit"
        onClick={onSubmit}
        loading={loading}
        disabled={disabled}
        icon={submitIcon}
        fullWidth
        className="sm:flex-1"
      >
        {submitLabel || t('submit')}
      </Button>
      
      {onReset && (
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          icon={FiRotateCcw}
          disabled={loading}
          className="sm:w-auto"
        >
          {t('retry')}
        </Button>
      )}
    </motion.div>
  );
};

export default FormActions;