import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCamera,
  FiRefreshCw,
  FiClock,
  FiCalendar,
  FiMapPin,
  FiInfo,
  FiLayers
} from 'react-icons/fi';
import { MdWaterDrop, MdGrass } from 'react-icons/md';
import toast from 'react-hot-toast';

import { useLanguage } from '../../context/LanguageContext';
import { waterAPI, cropAPI } from '../../services/api';
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
import CameraModal from '../../components/camera/CameraModal';

const WaterRequirement = () => {
  const { t, language } = useLanguage();
  const { loading, data, execute, reset } = useApi();

  const [crops, setCrops] = useState([]);
  const [growthStages, setGrowthStages] = useState([]);
  const [showCamera, setShowCamera] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  /* ------------------ FORM STATE ------------------ */
  const initialValues = {
    crop: '',
    growth_stage: 'seedling',
    temperature: 30,
    humidity: 60,
    soil_type: 'Loamy',
    area_hectares: 2
  };

  const { values, handleChange, reset: resetForm } = useForm(initialValues);

  /* ------------------ FETCH DATA ------------------ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cropRes, stageRes] = await Promise.all([
          cropAPI.getCropList(),
          waterAPI.getGrowthStages(language)
        ]);

        setCrops(cropRes?.crops || []);
        setGrowthStages(stageRes?.stages || []);
      } catch (err) {
        toast.error('Failed to load crop data');

        // ✅ HARD FALLBACK (ensures select always works)
        setCrops([
          { en: 'Rice', hi: 'चावल' },
          { en: 'Wheat', hi: 'गेहूं' },
          { en: 'Maize', hi: 'मक्का' },
          { en: 'Cotton', hi: 'कपास' },
          { en: 'Sugarcane', hi: 'गन्ना' }
        ]);

        setGrowthStages([
          { value: 'seedling', en: 'Seedling', hi: 'अंकुर' },
          { value: 'vegetative', en: 'Vegetative', hi: 'वानस्पतिक' },
          { value: 'flowering', en: 'Flowering', hi: 'फूल' },
          { value: 'maturity', en: 'Maturity', hi: 'परिपक्वता' }
        ]);
      }
    };

    fetchData();
  }, [language]);

  /* ------------------ OPTIONS (FIXED) ------------------ */
  const cropOptions = (crops.length > 0
    ? crops
    : [
        { en: 'Rice', hi: 'चावल' },
        { en: 'Wheat', hi: 'गेहूं' },
        { en: 'Maize', hi: 'मक्का' }
      ]
  ).map(crop => ({
    value: crop.en,
    label: language === 'hi' ? crop.hi : crop.en
  }));

  const stageOptions = growthStages.map(stage => ({
    value: stage.value,
    label: language === 'hi' ? stage.hi : stage.en
  }));

  const soilOptions = [
    { value: 'Sandy', label: language === 'hi' ? 'रेतीली' : 'Sandy' },
    { value: 'Loamy', label: language === 'hi' ? 'दोमट' : 'Loamy' },
    { value: 'Clay', label: language === 'hi' ? 'चिकनी' : 'Clay' }
  ];

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.crop) {
      toast.error(language === 'hi'
        ? 'कृपया फसल चुनें'
        : 'Please select a crop');
      return;
    }

    await execute(
      () => waterAPI.calculateRequirement({ ...values, language }),
      { showErrorToast: true }
    );
  };

  const handleReset = () => {
    resetForm();
    reset();
  };

  /* ======================= UI ======================= */
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <PageHeader
        title={t('features.water.title')}
        subtitle={t('features.water.desc')}
        icon={MdWaterDrop}
        color="blue"
      />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">

          {/* ---------------- FORM ---------------- */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <FormSection title="🌱 Crop Details">
              <InputGrid columns={2}>
                <Select
                  label="Crop"
                  value={values.crop || ''}
                  onChange={(e) => handleChange('crop', e.target.value)}
                  options={cropOptions}
                  placeholder="Select crop"
                />

                <Select
                  label="Growth Stage"
                  value={values.growth_stage}
                  onChange={(e) => handleChange('growth_stage', e.target.value)}
                  options={stageOptions}
                />
              </InputGrid>
            </FormSection>

            <FormSection title="🌡️ Environment">
              <InputGrid columns={2}>
                <Slider
                  label="Temperature"
                  value={values.temperature}
                  min={10}
                  max={50}
                  unit="°C"
                  onChange={(v) => handleChange('temperature', v)}
                />

                <Slider
                  label="Humidity"
                  value={values.humidity}
                  min={20}
                  max={100}
                  unit="%"
                  onChange={(v) => handleChange('humidity', v)}
                />
              </InputGrid>
            </FormSection>

            <FormSection title="🌍 Soil & Area">
              <InputGrid columns={2}>
                <Select
                  label="Soil Type"
                  value={values.soil_type}
                  onChange={(e) => handleChange('soil_type', e.target.value)}
                  options={soilOptions}
                />

                <Slider
                  label="Area"
                  value={values.area_hectares}
                  min={0.5}
                  max={50}
                  unit=" ha"
                  onChange={(v) => handleChange('area_hectares', v)}
                />
              </InputGrid>
            </FormSection>

            <div className="flex gap-3">
              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                icon={MdWaterDrop}
                className="bg-blue-600"
              >
                {t('calculate')}
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
                variant="outline"
                onClick={handleReset}
                icon={FiRefreshCw}
                fullWidth
              >
                Reset
              </Button>
            )}
          </form>

          {/* ---------------- RESULTS ---------------- */}
          <AnimatePresence>
            {data && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <ResultCard
                  title="Water Requirement"
                  value={`${Number(data.prediction?.water_requirement_mm || 0).toFixed(1)} mm/day`}
                  icon={MdWaterDrop}
                >
                  <ConfidenceMeter confidence={(data.confidence || 0) * 100} />
                </ResultCard>

                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="Crop"
                    value={data.prediction?.crop}
                    icon={MdGrass}
                  />
                  <StatCard
                    label="Soil"
                    value={data.prediction?.soil_type}
                    icon={FiLayers}
                  />
                  <StatCard
                    label="Area"
                    value={`${data.prediction?.area_hectares} ha`}
                    icon={FiMapPin}
                  />
                </div>

                {data.explanation && (
                  <ExplanationCard explanation={data.explanation} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <CameraModal
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        isAnalyzing={loading}
      />
    </div>
  );
};

export default WaterRequirement;
