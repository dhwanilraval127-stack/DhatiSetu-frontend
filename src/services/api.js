import axios from 'axios';

const API_BASE = '/api/v1';

// Create axios instance with better defaults
const api = axios.create({
  baseURL: API_BASE,
  timeout: 60000, // 60 seconds for image uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Return a structured error
    const message = error.response?.data?.detail || 
                   error.response?.data?.message || 
                   error.message || 
                   'An error occurred';
    
    // Don't reject, return error response for graceful handling
    return {
      success: false,
      error: true,
      message: message,
      data: null
    };
  }
);

// Helper to handle API responses
const handleResponse = (response) => {
  if (response.error) {
    throw new Error(response.message);
  }
  return response;
};

// Location APIs
export const locationAPI = {
  reverseGeocode: async (latitude, longitude) => {
    try {
      const response = await api.post('/location/reverse', { latitude, longitude });
      return handleResponse(response);
    } catch (e) {
      console.error('Geocode error:', e);
      return { city: 'Unknown', district: 'Unknown', state: 'Unknown' };
    }
  },
  
  getStates: async () => {
    try {
      return await api.get('/location/states');
    } catch (e) {
      return { states: [] };
    }
  },
  
  getSubdivisions: async () => {
    try {
      return await api.get('/location/subdivisions');
    } catch (e) {
      return { subdivisions: [] };
    }
  },
};

// Plant Disease API
export const plantDiseaseAPI = {
  detect: async (file, language = 'en') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    
    const response = await api.post('/plant-disease/detect', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 minutes for image processing
    });
    
    return handleResponse(response);
  },
  
  detectBase64: async (imageData, language = 'en') => {
    const response = await api.post('/plant-disease/detect-base64', { 
      image_data: imageData, 
      language 
    });
    return handleResponse(response);
  },
};

// Soil APIs
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
  
  getSoilTypes: async (language = 'en') => {
    try {
      return await api.get('/soil/types', { params: { language } });
    } catch (e) {
      return { soil_types: [] };
    }
  },
  
  assessHealth: async (data) => {
    const response = await api.post('/soil-health/assess', data);
    return handleResponse(response);
  },
};

// Crop APIs
export const cropAPI = {
  recommend: async (data) => {
    const response = await api.post('/crop/recommend', data);
    return handleResponse(response);
  },
  
getCropList: async () => {
  try {
    return await api.get('/yield/crops');
  } catch (e) {
    return { crops: [] };
  }
},

};

// Weather & Risk APIs
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
  
  analyzeNDVI: async (data) => {
    const response = await api.post('/ndvi/analyze', data);
    return handleResponse(response);
  },
};

// Market & Finance APIs
export const marketAPI = {
  predictYield: async (data) => {
    const response = await api.post('/yield/predict', data);
    return handleResponse(response);
  },
  
  getSeasons: async () => {
    try {
      return await api.get('/yield/seasons');
    } catch (e) {
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

// Water Management APIs
export const waterAPI = {
  calculateRequirement: async (data) => {
    const response = await api.post('/water/calculate', data);
    return handleResponse(response);
  },
  
  getGrowthStages: async (language = 'en') => {
    try {
      return await api.get('/water/growth-stages', { params: { language } });
    } catch (e) {
      return { stages: [] };
    }
  },
};

export default api;