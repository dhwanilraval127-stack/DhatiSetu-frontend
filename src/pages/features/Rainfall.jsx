import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiDroplet,
  FiCloud,
  FiCalendar,
  FiRefreshCw,
  FiMapPin,
  FiAlertTriangle,
  FiInfo
} from 'react-icons/fi';
import { GiRaining } from 'react-icons/gi';
import toast from 'react-hot-toast';

import { useLanguage } from '../../context/LanguageContext';
import { useLocation as useUserLocation } from '../../context/LocationContext';
import { weatherAPI, locationAPI } from '../../services/api';
import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Slider from '../../components/common/Slider';
import FormSection from '../../components/forms/FormSection';
import InputGrid from '../../components/forms/InputGrid';
import ResultCard from '../../components/results/ResultCard';
import ExplanationCard from '../../components/results/ExplanationCard';
import ConfidenceMeter from '../../components/results/ConfidenceMeter';
import StatCard from '../../components/results/StatCard';

const Rainfall = () => {
  const { t, language } = useLanguage();
  const { location: userLocation } = useUserLocation();
  const { loading, data, error, execute, reset } = useApi();

  const [subdivisions, setSubdivisions] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const initialValues = {
    subdivision: userLocation?.state || '',
    month: currentMonth,
    year: currentYear,
    temperature: 30,
    humidity: 60,
    pressure: 1010,
    wind_speed: 10
  };

  const { values, handleChange, reset: resetForm } = useForm(initialValues);

  /* ================= FETCH SUBDIVISIONS ================= */
  useEffect(() => {
    const fetchSubdivisions = async () => {
      try {
        const res = await locationAPI.getSubdivisions();
        setSubdivisions(res?.subdivisions || []);
      } catch {
        toast.error(t('errors.generic'));
        setSubdivisions([
          'Andhra Pradesh','Assam','Bihar','Gujarat','Karnataka',
          'Kerala','Maharashtra','Odisha','Tamil Nadu',
          'Uttar Pradesh','West Bengal'
        ]);
      }
    };
    fetchSubdivisions();
  }, [t]);

  /* ================= AUTO LOCATION ================= */
  useEffect(() => {
    if (userLocation?.state) {
      handleChange('subdivision', userLocation.state);
    }
  }, [userLocation]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.subdivision) {
      toast.error(language === 'hi'
        ? 'कृपया एक क्षेत्र चुनें'
        : 'Please select a region');
      return;
    }

    await execute(
      () => weatherAPI.predictRainfall({ ...values, language }),
      { showErrorToast: true }
    );
  };

  /* ================= RESET ================= */
  const handleReset = () => {
    resetForm();
    reset();
  };

  /* ================= CATEGORY ================= */
  const rainfallType = (() => {
    switch (data?.prediction?.category) {
      case 'scanty':
        return 'success';
      case 'light':
      case 'moderate':
        return 'warning';
      case 'heavy':
      case 'very_heavy':
        return 'error';
      default:
        return 'info';
    }
  })();

  const CategoryIcon =
    data?.prediction?.category === 'scanty'
      ? FiCloud
      : GiRaining;

  const safeConfidence = Math.min(
    100,
    Math.max(0, Number(data?.confidence ?? 0))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <PageHeader
        title={t('features.rainfall.title')}
        subtitle={t('features.rainfall.desc')}
        icon={GiRaining}
        color="blue"
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {/* ================= INPUT ================= */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormSection title="📍 Select Region">
              <Select
                label="Region"
                value={values.subdivision}
                onChange={(e) => handleChange('subdivision', e.target.value)}
                options={subdivisions.map(s => ({ value: s, label: s }))}
              />

              {userLocation?.city && (
                <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
                  <FiMapPin /> Auto-detected: {userLocation.city}
                </p>
              )}
            </FormSection>

            <FormSection title="📅 Time Period">
              <InputGrid columns={2}>
                <Select
                  label="Month"
                  value={values.month}
                  onChange={(e) => handleChange('month', Number(e.target.value))}
                  options={Object.entries(t('months')).map(([k, v]) => ({
                    value: Number(k),
                    label: v
                  }))}
                />
                <Select
                  label="Year"
                  value={values.year}
                  onChange={(e) => handleChange('year', Number(e.target.value))}
                  options={[...Array(5)].map((_, i) => ({
                    value: currentYear - 2 + i,
                    label: `${currentYear - 2 + i}`
                  }))}
                />
              </InputGrid>
            </FormSection>

            <FormSection title="🌡 Environmental Conditions">
              <InputGrid columns={2}>
                <Slider label="Temperature" value={values.temperature}
                  min={10} max={50} unit="°C"
                  onChange={(v) => handleChange('temperature', v)} />
                <Slider label="Humidity" value={values.humidity}
                  min={20} max={100} unit="%"
                  onChange={(v) => handleChange('humidity', v)} />
                <Slider label="Pressure" value={values.pressure}
                  min={950} max={1050} unit="hPa"
                  onChange={(v) => handleChange('pressure', v)} />
                <Slider label="Wind Speed" value={values.wind_speed}
                  min={0} max={100} unit="km/h"
                  onChange={(v) => handleChange('wind_speed', v)} />
              </InputGrid>
            </FormSection>

            <div className="space-y-3">
              <Button type="submit" loading={loading} fullWidth icon={GiRaining}>
                {t('predict')}
              </Button>

              {data && (
                <Button
                  type="button"
                  variant="outline"
                  icon={FiRefreshCw}
                  onClick={handleReset}
                >
                  {t('retry')}
                </Button>
              )}
            </div>
          </form>

          {/* ================= RESULTS ================= */}
          <AnimatePresence>
            {data && !loading && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <ResultCard
                  type={rainfallType}
                  title="Rainfall Prediction"
                  value={`${data.prediction?.rainfall_mm} mm`}
                  subtitle={data.prediction?.category_label}
                  icon={CategoryIcon}
                >
                  <ConfidenceMeter confidence={safeConfidence} />
                </ResultCard>

                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Month" value={t('months')[data.prediction?.month]} icon={FiCalendar} />
                  <StatCard label="Year" value={data.prediction?.year} icon={FiCalendar} />
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-blue-600" />
                    <div>
                      <p className="font-medium">{data.prediction?.subdivision}</p>
                      <p className="text-sm text-gray-500">
                        {language === 'hi' ? 'विश्लेषित क्षेत्र' : 'Analyzed Region'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {data.explanation && (
                  <ExplanationCard explanation={data.explanation} />
                )}
              </motion.div>
            )}

            {!loading && !data && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8 text-center"
              >
                <GiRaining className="mx-auto text-blue-600 w-10 h-10 mb-3" />
                <p className="text-gray-600">
                  {language === 'hi'
                    ? 'क्षेत्र और समय अवधि चुनें'
                    : 'Select region and time period'}
                </p>
              </motion.div>
            )}

            {error && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center"
              >
                <FiAlertTriangle className="mx-auto text-red-600 mb-2" />
                <p className="text-red-600">{error}</p>
                <Button variant="outline" onClick={handleReset} className="mt-3">
                  {t('retry')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Rainfall;
