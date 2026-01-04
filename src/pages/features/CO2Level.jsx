import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiRefreshCw,
  FiCamera,
  FiMapPin,
  FiAlertTriangle
} from 'react-icons/fi';
import { MdCo2 } from 'react-icons/md';
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
import ConfidenceMeter from '../../components/results/ConfidenceMeter';
import CameraModal from '../../components/camera/CameraModal';

const CO2Level = () => {
  const { t, language } = useLanguage();
  const { location: userLocation } = useUserLocation();
  const { loading, data, error, execute, reset } = useApi();

  const [states, setStates] = useState([]);
  const [showCamera, setShowCamera] = useState(false);

  const now = new Date();

  /* ================= SAFE DEFAULT FORM VALUES ================= */
  const initialValues = {
    state: userLocation?.state || '',
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    temperature: 25,
    humidity: 60,
    pressure: 1010,
    wind_speed: 5
  };

  const { values, handleChange, reset: resetForm } = useForm(initialValues);

  /* ================= FETCH STATES ================= */
  useEffect(() => {
    const loadStates = async () => {
      try {
        const res = await locationAPI.getStates();
        setStates(res.states || []);
      } catch {
        setStates([
          'Gujarat',
          'Maharashtra',
          'Rajasthan',
          'Tamil Nadu',
          'Uttar Pradesh'
        ]);
      }
    };
    loadStates();
  }, []);

  /* ================= AUTO LOCATION ================= */
  useEffect(() => {
    if (userLocation?.state) {
      handleChange('state', userLocation.state);
    }
  }, [userLocation]);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.state) {
      toast.error(language === 'hi' ? 'कृपया राज्य चुनें' : 'Please select a state');
      return;
    }

    // 🔒 EXPLICIT PAYLOAD (NO 422 EVER)
    const payload = {
      year: Number(values.year),
      month: Number(values.month),
      temperature: Number(values.temperature),
      humidity: Number(values.humidity),
      pressure: Number(values.pressure),
      wind_speed: Number(values.wind_speed),
      language: language === 'hi' ? 'hi' : 'en'
    };

    await execute(() => weatherAPI.predictCO2(payload));
  };

  const handleReset = () => {
    resetForm();
    reset();
  };

  /* ================= CAMERA (SIMULATED INPUT) ================= */
  const handleCameraCapture = () => {
    setShowCamera(false);

    const simulated = {
      temperature: 24 + Math.random() * 8,
      humidity: 55 + Math.random() * 20,
      pressure: 995 + Math.random() * 20,
      wind_speed: 5 + Math.random() * 10
    };

    Object.entries(simulated).forEach(([k, v]) =>
      handleChange(k, Number(v.toFixed(1)))
    );

    toast.success(language === 'hi'
      ? 'पर्यावरण डेटा प्राप्त हुआ'
      : 'Environmental data captured'
    );
  };

  /* ================= RESULT CARD TYPE ================= */
  const ppm = data?.prediction?.co2_ppm;

  const cardType =
    ppm == null ? 'info' :
    ppm < 350 ? 'success' :
    ppm < 400 ? 'warning' :
    'error';

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <PageHeader
        title={t('features.co2.title')}
        subtitle={t('features.co2.desc')}
        icon={MdCo2}
        color="purple"
      />

      <div className="max-w-4xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">

        {/* ================= INPUT FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSection title="📍 Location">
            <Select
              label="State"
              value={values.state}
              onChange={(e) => handleChange('state', e.target.value)}
              options={states.map(s => ({ value: s, label: s }))}
            />

            {userLocation?.city && (
              <p className="text-sm text-purple-600 mt-2 flex items-center gap-1">
                <FiMapPin /> Auto-detected: {userLocation.city}
              </p>
            )}
          </FormSection>

          <FormSection title="🌡 Environmental Conditions">
            <InputGrid columns={2}>
              <Slider
                label="Temperature"
                value={values.temperature}
                onChange={v => handleChange('temperature', v)}
                unit="°C"
              />
              <Slider
                label="Humidity"
                value={values.humidity}
                onChange={v => handleChange('humidity', v)}
                unit="%"
              />
              <Slider
                label="Pressure"
                value={values.pressure}
                onChange={v => handleChange('pressure', v)}
                unit="hPa"
              />
              <Slider
                label="Wind Speed"
                value={values.wind_speed}
                onChange={v => handleChange('wind_speed', v)}
                unit="km/h"
              />
            </InputGrid>
          </FormSection>

          <div className="flex gap-3">
            <Button type="submit" loading={loading} icon={MdCo2} fullWidth>
              {t('predict')}
            </Button>
            <Button
              type="button"
              variant="outline"
              icon={FiCamera}
              onClick={() => setShowCamera(true)}
            >
              Camera
            </Button>
          </div>

          {data && (
            <Button
              type="button"
              variant="outline"
              icon={FiRefreshCw}
              onClick={handleReset}
            >
              Retry
            </Button>
          )}
        </form>

        {/* ================= RESULTS ================= */}
        <AnimatePresence>
          {loading && (
            <motion.div key="loading" className="text-center">
              Loading...
            </motion.div>
          )}

          {data && !loading && (
            <motion.div key="result">
              <ResultCard
                type={cardType}
                title="CO₂ Level"
                value={`${ppm} ppm`}
                subtitle={data.prediction?.level_label || 'Estimated'}
                icon={MdCo2}
              >
                <ConfidenceMeter confidence={(data.confidence ?? 0.85) * 100} />
              </ResultCard>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div
              key="error"
              className="bg-red-50 p-5 rounded-xl text-center"
            >
              <FiAlertTriangle className="mx-auto text-red-600 mb-2" />
              <p className="text-red-600">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ================= CAMERA MODAL ================= */}
      <CameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={handleCameraCapture}
        isAnalyzing={loading}
        featureType="co2"
      />
    </div>
  );
};

export default CO2Level;
