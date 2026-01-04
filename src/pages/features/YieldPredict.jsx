import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiMapPin, FiPackage } from 'react-icons/fi';
import { GiWheat, GiFarmTractor, GiWeight } from 'react-icons/gi';

import { useLanguage } from '../../context/LanguageContext';
import { useLocation as useUserLocation } from '../../context/LocationContext';
import { marketAPI, cropAPI, locationAPI } from '../../services/api';
import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Slider from '../../components/common/Slider';
import FormSection from '../../components/forms/FormSection';
import InputGrid from '../../components/forms/InputGrid';
import ResultCard from '../../components/results/ResultCard';
import ConfidenceMeter from '../../components/results/ConfidenceMeter';
import StatCard from '../../components/results/StatCard';

const YieldPredict = () => {
  const { language } = useLanguage();
  const { location } = useUserLocation();
  const { loading, data, execute } = useApi();

  const [cropOptions, setCropOptions] = useState([]);
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);

  const { values, handleChange, setValue } = useForm({
    crop: '',
    state: '',
    district: '',
    season: '',
    area_hectares: 2
  });

  // -------------------------
  // FETCH DROPDOWN DATA
  // -------------------------
  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const cropRes = await cropAPI.getCropList();
        const seasonRes = await marketAPI.getSeasons();
        const stateRes = await locationAPI.getStates();

        // ✅ CROPS → { value, label }
        setCropOptions(
          Array.isArray(cropRes?.crops)
            ? cropRes.crops.map(crop => ({
                value: crop,
                label: crop
              }))
            : []
        );

        // ✅ SEASONS → { value, label }
        setSeasonOptions(
          Array.isArray(seasonRes?.seasons)
            ? seasonRes.seasons.map(season => ({
                value: season.value,
                label: language === 'hi' ? season.hi : season.en
              }))
            : []
        );

        // ✅ STATES
        setStateOptions(
          Array.isArray(stateRes?.states)
            ? stateRes.states.map(state => ({
                value: state,
                label: state
              }))
            : []
        );
      } catch (err) {
        console.error('Dropdown load failed:', err);
      }
    };

    loadDropdowns();
  }, [language]);

  // -------------------------
  // AUTO LOCATION
  // -------------------------
  useEffect(() => {
    if (location) {
      setValue('state', location.state || '');
      setValue('district', location.district || '');
    }
  }, [location, setValue]);

  // -------------------------
  // SUBMIT
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    await execute(() =>
      marketAPI.predictYield({
        ...values,
        language
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <PageHeader
        title="Yield Prediction"
        subtitle="Predict expected crop yield"
        icon={FiTrendingUp}
        color="primary"
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* INPUT PANEL */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <FormSection title="🌾 Select Crop">
              <Select
                label="Crop"
                value={values.crop}
                onChange={(e) => handleChange('crop', e.target.value)}
                options={cropOptions}
                placeholder="Select Crop"
              />
            </FormSection>

            <FormSection title="📍 Location">
              <InputGrid columns={2}>
                <Select
                  label="State"
                  value={values.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  options={stateOptions}
                  placeholder="Select State"
                />
                <Input
                  label="District"
                  value={values.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                />
              </InputGrid>

              {location && (
                <div className="mt-2 flex items-center space-x-2 text-sm text-primary-600">
                  <FiMapPin className="w-4 h-4" />
                  <span>
                    Auto: {location.district}, {location.state}
                  </span>
                </div>
              )}
            </FormSection>

            <FormSection title="📅 Season & Area">
              <InputGrid columns={2}>
                <Select
                  label="Season"
                  value={values.season}
                  onChange={(e) => handleChange('season', e.target.value)}
                  options={seasonOptions}
                  placeholder="Select Season"
                />
                <Slider
                  label="Area (ha)"
                  value={values.area_hectares}
                  onChange={(val) => handleChange('area_hectares', val)}
                  min={0.5}
                  max={100}
                  step={0.5}
                />
              </InputGrid>
            </FormSection>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={!values.crop || !values.state || !values.season}
              icon={FiTrendingUp}
            >
              Predict Yield
            </Button>
          </form>

          {/* RESULT PANEL */}
          <AnimatePresence>
            {data && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <ResultCard
                  type="success"
                  title="Predicted Yield"
                  value={data.prediction.yield_label}
                  icon={GiWheat}
                >
                  <ConfidenceMeter confidence={data.confidence * 100} />
                </ResultCard>

                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="Per Hectare"
                    value={data.prediction.yield_per_hectare_quintal}
                    unit="q/ha"
                    icon={GiWeight}
                  />
                  <StatCard
                    label="Total Production"
                    value={data.prediction.total_production_quintal}
                    unit="q"
                    icon={FiPackage}
                  />
                </div>
              </motion.div>
            )}

            {!data && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center"
              >
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <GiFarmTractor className="w-10 h-10 text-primary-600" />
                </div>
                <p className="text-gray-500">
                  Select crop, location and season to predict yield
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default YieldPredict;
