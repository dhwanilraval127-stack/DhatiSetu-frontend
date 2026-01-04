import axios from 'axios';

/**
 * IMPORTANT:
 * VITE_API_URL must be defined in .env
 * Example:
 * VITE_API_URL=https://crimson1232-dhartisetu-backend.hf.space
 */
const API_BASE = `${import.meta.env.VITE_API_URL}/api/v1`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 2 minutes (safe for ML image inference)
  headers: {
    'Content-Type': 'application/json',
  },
});

// --------------------------------------------------
// REQUEST INTERCEPTOR
// --------------------------------------------------
api.interceptors.request.use(
  (config) => {
    console.log(
      `[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// --------------------------------------------------
// RESPONSE INTERCEPTOR
// --------------------------------------------------
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error?.response?.data || error.message);

    return {
      success: false,
      error: true,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error.message ||
        'Server error',
      data: null,
    };
  }
);

// --------------------------------------------------
// HELPER
// --------------------------------------------------
const handleResponse = (response) => {
  if (!response || response.error) {
    throw new Error(response?.message || 'API Error');
  }
  return response;
};

// ==================================================
// LOCATION APIs
// ==================================================
export const locationAPI = {
  reverseGeocode: async (latitude, longitude) => {
    try {
      const response = await api.post('/location/reverse', {
        latitude,
        longitude,
      });
      return handleResponse(response);
    } catch {
      return { city: 'Unknown', district: 'Unknown', state: 'Unknown' };
    }
  },

  getStates: async () => {
    try {
      return await api.get('/location/states');
    } catch {
      return { states: [] };
    }
  },

  getSubdivisions: async () => {
    try {
      return await api.get('/location/subdivisions');
    } catch {
      return { subdivisions: [] };
    }
  },
};

// ==================================================
// 🌱 PLANT DISEASE (YOUR MAIN ATTRACTION)
// ==================================================
export const plantDiseaseAPI = {
  detect: async (file, language = 'en') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    const response = await api.post(
      '/plant-disease/detect',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      }
    );

    return handleResponse(response);
  },

  detectBase64: async (imageData, language = 'en') => {
    const response = await api.post('/plant-disease/detect-base64', {
      image_data: imageData,
      language,
    });
    return handleResponse(response);
  },
};

// ==================================================
// SOIL APIs
// ==================================================
export const soilAPI = {
  detectType: async (file, language = 'en') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);

    const response = await api.post('/soil/detect', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    });

    return handleResponse(response);
  },

  assessHealth: async (data) => {
    const response = await api.post('/soil-health/assess', data);
    return handleResponse(response);
  },
};

// ==================================================
// CROP APIs
// ==================================================
export const cropAPI = {
  recommend: async (data) => {
    const response = await api.post('/crop/recommend', data);
    return handleResponse(response);
  },

  getCropList: async () => {
    try {
      return await api.get('/yield/crops');
    } catch {
      return { crops: [] };
    }
  },
};

// ==================================================
// WEATHER & ENVIRONMENT
// ==================================================
export const weatherAPI = {
  predictFlood: async (data) => {
    const response = await api.post('/flood/predict', data);
    return handleResponse(response);
  },

  predictStorm: async (data) => {
    const response = await api.post('/storm/predict', data);
    return handleResponse(response);
  },

  predictRainfall: async (data) => {
    const response = await api.post('/rainfall/predict', data);
    return handleResponse(response);
  },

  predictAQI: async (data) => {
    const response = await api.post('/aqi/predict', data);
    return handleResponse(response);
  },

  predictCO2: async (data) => {
    const response = await api.post('/co2/predict', data);
    return handleResponse(response);
  },
};

// ==================================================
// MARKET & FINANCE
// ==================================================
export const marketAPI = {
  predictYield: async (data) => {
    const response = await api.post('/yield/predict', data);
    return handleResponse(response);
  },

  getSeasons: async () => {
    try {
      return await api.get('/yield/seasons');
    } catch {
      return { seasons: [] };
    }
  },

  predictPrice: async (data) => {
    const response = await api.post('/price/predict', data);
    return handleResponse(response);
  },

  calculateProfit: async (data) => {
    const response = await api.post('/profit/calculate', data);
    return handleResponse(response);
  },
};

// ==================================================
// WATER MANAGEMENT
// ==================================================
export const waterAPI = {
  calculateRequirement: async (data) => {
    const response = await api.post('/water/calculate', data);
    return handleResponse(response);
  },
};

export default api;
