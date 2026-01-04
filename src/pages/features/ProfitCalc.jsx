import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { GiMoneyStack, GiReceiveMoney, GiPayMoney } from 'react-icons/gi';

import { useLanguage } from '../../context/LanguageContext';
import { cropAPI, marketAPI } from '../../services/api';
import useApi from '../../hooks/useApi';
import useForm from '../../hooks/useForm';

import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Slider from '../../components/common/Slider';
import FormSection from '../../components/forms/FormSection';
import InputGrid from '../../components/forms/InputGrid';
import StatCard from '../../components/results/StatCard';
import ExplanationCard from '../../components/results/ExplanationCard';

const ProfitCalc = () => {
  const { t, language } = useLanguage();
  const { loading, data, execute, reset } = useApi();

  const [crops, setCrops] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(true);

  const initialValues = {
    crop: '',
    area_hectares: 2,
    cost_per_hectare: 30000,
    expected_yield: 25,
    market_price: 2000
  };

  const { values, handleChange, reset: resetForm } = useForm(initialValues);

  /* ================= FETCH CROPS (FIXED) ================= */
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await cropAPI.getCropList();

        // ✅ Handle ALL possible backend response formats
        const cropList =
          res?.crops ??
          res?.data ??
          res?.results ??
          (Array.isArray(res) ? res : []);

        setCrops(Array.isArray(cropList) ? cropList : []);
      } catch (err) {
        console.error('Crop fetch failed:', err);
        setCrops([]);
      } finally {
        setLoadingCrops(false);
      }
    };

    fetchCrops();
  }, []);

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.crop) return;

    await execute(() =>
      marketAPI.calculateProfit({
        ...values,
        language
      })
    );
  };

  const handleReset = () => {
    resetForm();
    reset();
  };

  /* ================= DROPDOWN OPTIONS (FIXED) ================= */
  const cropOptions = crops
    .filter(c => c && c.en)
    .map(c => ({
      value: c.en,
      label: language === 'hi' ? (c.hi || c.en) : c.en
    }));

  /* ================= LIVE PREVIEW ================= */
  const totalCost = values.area_hectares * values.cost_per_hectare;
  const totalRevenue = values.area_hectares * values.expected_yield * values.market_price;
  const profit = totalRevenue - totalCost;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <PageHeader
        title="Profit Calculator"
        subtitle="Calculate expected profit from your crop"
        icon={GiMoneyStack}
        color="primary"
      />

      <div className="max-w-4xl mx-auto px-4 py-6 grid lg:grid-cols-2 gap-6">

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <FormSection title="🌾 Crop Details">
            <InputGrid columns={2}>
              <Select
                label="Crop"
                value={values.crop}
                options={cropOptions}
                placeholder={
                  loadingCrops
                    ? 'Loading crops...'
                    : cropOptions.length === 0
                      ? 'No crops available'
                      : 'Select Crop'
                }
                onChange={e => handleChange('crop', e.target.value)}
                disabled={loadingCrops || cropOptions.length === 0}
              />

              <Slider
                label="Area (ha)"
                value={values.area_hectares}
                min={0.5}
                max={50}
                step={0.5}
                onChange={v => handleChange('area_hectares', v)}
              />
            </InputGrid>

            <p className="text-xs text-gray-500 mt-1">
              Loaded crops: {cropOptions.length}
            </p>
          </FormSection>

          <FormSection title="💰 Cost">
            <Slider
              label="Cost per Hectare"
              value={values.cost_per_hectare}
              min={5000}
              max={200000}
              step={1000}
              onChange={v => handleChange('cost_per_hectare', v)}
            />
          </FormSection>

          <FormSection title="📈 Revenue">
            <InputGrid columns={2}>
              <Slider
                label="Expected Yield (q/ha)"
                value={values.expected_yield}
                min={1}
                max={100}
                onChange={v => handleChange('expected_yield', v)}
              />

              <Slider
                label="Market Price (₹/q)"
                value={values.market_price}
                min={500}
                max={10000}
                step={100}
                onChange={v => handleChange('market_price', v)}
              />
            </InputGrid>
          </FormSection>

          {/* ================= PREVIEW ================= */}
          <div className="bg-white rounded-xl p-4 grid grid-cols-3 text-center">
            <div>
              <p className="text-xs text-gray-500">Cost</p>
              <p className="font-bold text-red-600">₹{totalCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="font-bold text-blue-600">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Profit</p>
              <p className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{profit.toLocaleString()}
              </p>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={!values.crop}
            icon={GiMoneyStack}
          >
            Calculate Profit
          </Button>

          {data && (
            <Button variant="outline" type="button" onClick={handleReset}>
              Reset
            </Button>
          )}
        </form>

        {/* ================= RESULTS ================= */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div
                className={`rounded-2xl p-6 text-white ${
                  data.prediction.expected_profit >= 0
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                    : 'bg-gradient-to-br from-red-500 to-rose-600'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm opacity-80">Expected Profit</p>
                    <h2 className="text-3xl font-bold">
                      ₹{Math.abs(data.prediction.expected_profit).toLocaleString()}
                    </h2>
                  </div>
                  {data.prediction.expected_profit >= 0
                    ? <GiReceiveMoney size={36} />
                    : <GiPayMoney size={36} />}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Total Cost"
                  value={`₹${data.prediction.total_cost.toLocaleString()}`}
                />
                <StatCard
                  label="Total Revenue"
                  value={`₹${data.prediction.total_revenue.toLocaleString()}`}
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
  );
};

export default ProfitCalc;
