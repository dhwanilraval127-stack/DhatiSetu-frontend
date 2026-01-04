import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiDroplet,
  FiMapPin,
  FiCalendar,
  FiRefreshCw,
  FiAlertTriangle,
  FiInfo,
  FiTrendingUp
} from 'react-icons/fi';
import { GiRaining, GiWaves, GiMountainCave } from 'react-icons/gi';

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

const FloodRisk = () => {
  const { t, language } = useLanguage();
  const { location: userLocation } = useUserLocation();
  const { loading, data, error, execute, reset } = useApi();

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const initialValues = {
    state: userLocation?.state || '',
    district: userLocation?.district || '',
    month: currentMonth,
    year: currentYear,
    rainfall_mm: 150,
    river_level: 5,
    elevation: 100,
    flood_history: 2
  };

  const { values, handleChange, reset: resetForm } = useForm(initialValues);

  // ================= FETCH STATES =================
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await locationAPI.getStates();
        setStates(res?.states || []);
      } catch {
        setStates([
          'Andhra Pradesh','Assam','Bihar','Gujarat','Karnataka',
          'Kerala','Maharashtra','Odisha','Tamil Nadu','Uttar Pradesh','West Bengal'
        ]);
      }
    };
    fetchStates();
  }, []);

  // ================= FETCH DISTRICTS =================
  useEffect(() => {
    if (!values.state) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      try {
        const res = await locationAPI.getDistricts(values.state);
        setDistricts(res?.districts || []);
      } catch {
        setDistricts([
          `${values.state} District 1`,
          `${values.state} District 2`
        ]);
      }
    };

    fetchDistricts();
  }, [values.state]);

  // ================= AUTO LOCATION =================
  useEffect(() => {
    if (userLocation) {
      handleChange('state', userLocation.state || '');
      handleChange('district', userLocation.district || '');
    }
  }, [userLocation]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.state || !values.district) {
      alert(language === 'hi'
        ? 'कृपया राज्य और जिला चुनें'
        : 'Please select state and district');
      return;
    }

    await execute(
      () => weatherAPI.predictFlood({ ...values, language }),
      { showErrorToast: true }
    );
  };

  // ================= RESET =================
  const handleReset = () => {
    resetForm();
    reset();
  };

  // ================= RISK CATEGORY =================
  const riskType =
    data?.prediction?.risk_level === 'high'
      ? 'error'
      : data?.prediction?.risk_level === 'moderate'
      ? 'warning'
      : 'success';

  const RiskIcon =
    data?.prediction?.risk_level === 'high'
      ? FiAlertTriangle
      : GiWaves;

  const safeConfidence = Math.min(
    100,
    Math.max(0, Number(data?.confidence ?? 0))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <PageHeader
        title={t('features.flood.title')}
        subtitle={t('features.flood.desc')}
        icon={GiRaining}
        color="blue"
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {/* ================= INPUT ================= */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormSection title="📍 Location">
              <InputGrid columns={2}>
                <Select
                  label="State"
                  value={values.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  options={states.map(s => ({ value: s, label: s }))}
                />
                <Select
                  label="District"
                  value={values.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  options={districts.map(d => ({ value: d, label: d }))}
                />
              </InputGrid>

              {userLocation && (
                <p className="text-sm text-blue-600 mt-2 flex items-center gap-1">
                  <FiMapPin /> Auto-detected location
                </p>
              )}
            </FormSection>

            <FormSection title="📅 Time Period">
              <InputGrid columns={2}>
                <Select
                  label="Month"
                  value={values.month}
                  onChange={(e) => handleChange('month', Number(e.target.value))}
                  options={[...Array(12)].map((_, i) => ({
                    value: i + 1,
                    label: t(`months.${i + 1}`)
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

            <FormSection title="🌧 Weather Conditions">
              <Slider label="Rainfall (mm)" value={values.rainfall_mm}
                min={0} max={500} step={10}
                onChange={(v) => handleChange('rainfall_mm', v)} />
              <Slider label="River Level (m)" value={values.river_level}
                min={0} max={20} step={0.5}
                onChange={(v) => handleChange('river_level', v)} />
            </FormSection>

            <FormSection title="🏔 Geographic Data">
              <InputGrid columns={2}>
                <Slider label="Elevation (m)" value={values.elevation}
                  min={0} max={500} step={10}
                  onChange={(v) => handleChange('elevation', v)} />
                <Slider label="Flood History" value={values.flood_history}
                  min={0} max={10}
                  onChange={(v) => handleChange('flood_history', v)} />
              </InputGrid>
            </FormSection>

            <div className="space-y-3">
              <Button type="submit" fullWidth size="lg" loading={loading} icon={GiRaining}>
                Predict
              </Button>

              {data && (
                <Button
                  type="button"
                  fullWidth
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
          <AnimatePresence mode="wait">
            {data && !loading && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <ResultCard
                  type={riskType}
                  title="Flood Risk"
                  value={data.prediction?.risk_label}
                  icon={RiskIcon}
                >
                  <ConfidenceMeter confidence={safeConfidence} />
                </ResultCard>

                <div className="grid grid-cols-2 gap-3">
                  <StatCard label="Rainfall" value={values.rainfall_mm} unit="mm" icon={FiDroplet} />
                  <StatCard label="River Level" value={values.river_level} unit="m" icon={GiWaves} />
                  <StatCard label="Elevation" value={values.elevation} unit="m" icon={GiMountainCave} />
                  <StatCard label="Flood History" value={values.flood_history} icon={FiTrendingUp} />
                </div>

                {data.explanation && (
                  <ExplanationCard explanation={data.explanation} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FloodRisk;
