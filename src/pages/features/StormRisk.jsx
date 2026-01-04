import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiWind,
  FiThermometer,
  FiDroplet,
  FiRefreshCw,
  FiAlertTriangle,
  FiMapPin
} from 'react-icons/fi';
import { GiTornado, GiMountainCave } from 'react-icons/gi';

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
import StatCard from '../../components/results/StatCard';

const StormRisk = () => {
  const { t, language } = useLanguage();
  const { location: userLocation } = useUserLocation();
  const { loading, data, error, execute, reset } = useApi();

  const [states, setStates] = useState([]);

  const currentDate = new Date();

  const initialValues = {
    state: userLocation?.state || '',
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    wind_speed: 40,
    pressure: 1010,
    humidity: 70,
    temperature: 28
  };

  const { values, handleChange, reset: resetForm } = useForm(initialValues);

  /* ================= FETCH STATES ================= */
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await locationAPI.getStates();
        setStates(res?.states || []);
      } catch {
        setStates([
          'Andhra Pradesh',
          'Gujarat',
          'Maharashtra',
          'Rajasthan',
          'Tamil Nadu',
          'Uttar Pradesh',
          'West Bengal'
        ]);
      }
    };
    fetchStates();
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
      alert(language === 'hi' ? 'कृपया राज्य चुनें' : 'Please select a state');
      return;
    }

    await execute(() =>
      weatherAPI.predictStorm({ ...values, language })
    );
  };

  /* ================= RESET ================= */
  const handleReset = () => {
    resetForm();
    reset();
  };

  /* ================= SAFE RISK TYPE ================= */
  const mapRiskToCardType = (risk) => {
    switch (risk) {
      case 'low':
        return 'success';
      case 'moderate':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'info';
    }
  };

  const cardType = mapRiskToCardType(data?.prediction?.risk_level);

  const RiskIcon =
    data?.prediction?.risk_level === 'high'
      ? FiAlertTriangle
      : GiTornado;

  /* ================= SAFE CONFIDENCE ================= */
  const safeConfidence = Math.min(
    100,
    Math.max(0, Number(data?.confidence ?? 0))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <PageHeader
        title={t('features.storm.title')}
        subtitle={t('features.storm.desc')}
        icon={GiTornado}
        color="purple"
      />

      <div className="max-w-4xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6 items-start">

        {/* ================= FORM ================= */}
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

          <FormSection title="🌪️ Atmospheric Conditions">
            <InputGrid columns={2}>
              <Slider
                label="Wind Speed"
                value={values.wind_speed}
                onChange={(v) => handleChange('wind_speed', v)}
                max={200}
                unit="km/h"
              />
              <Slider
                label="Pressure"
                value={values.pressure}
                onChange={(v) => handleChange('pressure', v)}
                min={950}
                max={1050}
                unit="hPa"
              />
              <Slider
                label="Humidity"
                value={values.humidity}
                onChange={(v) => handleChange('humidity', v)}
                unit="%"
              />
              <Slider
                label="Temperature"
                value={values.temperature}
                onChange={(v) => handleChange('temperature', v)}
                unit="°C"
              />
            </InputGrid>
          </FormSection>

          <div className="space-y-3">
            <Button type="submit" loading={loading} icon={GiTornado} fullWidth>
              {t('predict')}
            </Button>

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
          </div>
        </form>

        {/* ================= RESULTS ================= */}
        <AnimatePresence>
          {loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              {t('loading')}
            </motion.p>
          )}

          {data && !loading && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ResultCard
                type={cardType}
                title="Storm Risk"
                value={data.prediction?.risk_label}
                subtitle={`${data.prediction?.storm_probability}% probability`}
                icon={RiskIcon}
              >
                <ConfidenceMeter confidence={safeConfidence} />

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <StatCard label="Wind" value={values.wind_speed} unit="km/h" icon={FiWind} />
                  <StatCard label="Pressure" value={values.pressure} unit="hPa" icon={GiMountainCave} />
                  <StatCard label="Humidity" value={values.humidity} unit="%" icon={FiDroplet} />
                  <StatCard label="Temp" value={values.temperature} unit="°C" icon={FiThermometer} />
                </div>
              </ResultCard>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 p-5 rounded-xl text-center"
            >
              <FiAlertTriangle className="mx-auto text-red-600 mb-2" />
              <p className="text-red-600">{error}</p>
              <Button variant="outline" onClick={handleReset} className="mt-3">
                Retry
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StormRisk;
