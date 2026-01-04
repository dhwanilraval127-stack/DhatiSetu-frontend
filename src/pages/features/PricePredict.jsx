import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiAlertTriangle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

import { useLanguage } from '../../context/LanguageContext';
import { useLocation as useUserLocation } from '../../context/LocationContext';
import { marketAPI, cropAPI, locationAPI } from '../../services/api';
import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Slider from '../../components/common/Slider';
import FormSection from '../../components/forms/FormSection';
import InputGrid from '../../components/forms/InputGrid';
import ResultCard from '../../components/results/ResultCard';
import ConfidenceMeter from '../../components/results/ConfidenceMeter';

const PricePredict = () => {
  const { t, language } = useLanguage();
  const { location: userLocation } = useUserLocation();
  const { loading, data, error, execute, reset } = useApi();

  const [crops, setCrops] = useState([]);
  const [states, setStates] = useState([]);

  const now = new Date();

  const initialValues = {
    crop: '',
    state: userLocation?.state || '',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    production: 100000,
    demand_index: 50
  };

  const { values, handleChange, reset: resetForm } = useForm(initialValues);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cropRes, stateRes] = await Promise.all([
          cropAPI.getCropList(),
          locationAPI.getStates()
        ]);

        setCrops(Array.isArray(cropRes?.crops) ? cropRes.crops : []);
        setStates(Array.isArray(stateRes?.states) ? stateRes.states : []);
      } catch {
        toast.error(language === 'hi' ? 'डेटा लोड नहीं हो सका' : 'Failed to load data');
      }
    };

    fetchData();
  }, [language]);

  /* ================= AUTO LOCATION ================= */
  useEffect(() => {
    if (userLocation?.state) {
      handleChange('state', userLocation.state);
    }
  }, [userLocation]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.crop || !values.state) {
      toast.error(language === 'hi'
        ? 'कृपया फसल और राज्य चुनें'
        : 'Please select crop and state');
      return;
    }

    await execute(() =>
      marketAPI.predictPrice({ ...values, language })
    );
  };

  const handleReset = () => {
    resetForm();
    reset();
  };

  /* ================= SAFE OPTIONS ================= */

  // ✅ FIXED: supports string OR object crops
  const cropOptions = crops.map(c => {
    if (typeof c === 'string') {
      return { value: c, label: c };
    }
    return {
      value: c.en,
      label: language === 'hi' ? c.hi : c.en
    };
  });

  const stateOptions = states.map(s => ({ value: s, label: s }));

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN', {
      month: 'long'
    })
  }));

  const yearOptions = [];
  for (let y = now.getFullYear() - 5; y <= now.getFullYear() + 2; y++) {
    yearOptions.push({ value: y, label: String(y) });
  }

  /* ================= TREND ================= */
  const trend = data?.prediction?.trend;
  const TrendIcon =
    trend === 'up' ? FiTrendingUp :
    trend === 'down' ? FiTrendingDown :
    FiDollarSign;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <PageHeader
        title={t('price prediction ')}
        subtitle={t('predict price for your crops')}
        icon={FiDollarSign}
        color="purple"
      />

      <div className="max-w-4xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection title={language === 'hi' ? 'फसल और स्थान' : 'Crop & Location'}>
            <InputGrid columns={2}>
              <Select
                label={language === 'hi' ? 'फसल' : 'Crop'}
                value={values.crop}
                options={cropOptions}
                onChange={e => handleChange('crop', e.target.value)}
                placeholder={language === 'hi' ? 'फसल चुनें' : 'Select Crop'}
              />

              <Select
                label={language === 'hi' ? 'राज्य' : 'State'}
                value={values.state}
                options={stateOptions}
                onChange={e => handleChange('state', e.target.value)}
                placeholder={language === 'hi' ? 'राज्य चुनें' : 'Select State'}
              />
            </InputGrid>
          </FormSection>

          <FormSection title={language === 'hi' ? 'समय अवधि' : 'Time Period'}>
            <InputGrid columns={2}>
              <Select
                label={language === 'hi' ? 'महीना' : 'Month'}
                value={values.month}
                options={monthOptions}
                onChange={e => handleChange('month', Number(e.target.value))}
              />
              <Select
                label={language === 'hi' ? 'वर्ष' : 'Year'}
                value={values.year}
                options={yearOptions}
                onChange={e => handleChange('year', Number(e.target.value))}
              />
            </InputGrid>
          </FormSection>

          <FormSection title={language === 'hi' ? 'बाजार स्थिति' : 'Market Conditions'}>
            <Slider
              label={language === 'hi' ? 'उत्पादन' : 'Production'}
              value={values.production}
              min={10000}
              max={500000}
              step={10000}
              onChange={v => handleChange('production', v)}
              unit=" tonnes"
            />
            <Slider
              label={language === 'hi' ? 'मांग सूचकांक' : 'Demand Index'}
              value={values.demand_index}
              min={0}
              max={100}
              onChange={v => handleChange('demand_index', v)}
              unit="%"
            />
          </FormSection>

          <Button
            type="submit"
            loading={loading}
            disabled={!values.crop || !values.state}
            fullWidth
            icon={FiDollarSign}
          >
            {t('predict')}
          </Button>

          {data && (
            <Button variant="outline" icon={FiRefreshCw} onClick={handleReset}>
              {language === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
            </Button>
          )}
        </form>

        {/* ================= RESULT ================= */}
        <AnimatePresence>
          {data && !loading && (
            <ResultCard
              type={trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'info'}
              title={language === 'hi' ? 'बाजार मूल्य' : 'Market Price'}
              value={`₹${data.prediction?.price_per_quintal ?? '--'}`}
              icon={TrendIcon}
            >
              <ConfidenceMeter confidence={(data.confidence ?? 0) * 100} />
            </ResultCard>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600">
              <FiAlertTriangle className="inline mr-2" />
              {error}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PricePredict;
