import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLanguage } from './LanguageContext';

const LocationContext = createContext();

const API_BASE = '/api/v1';

export const LocationProvider = ({ children }) => {
  const { t, language } = useLanguage();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  // Check permission status
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state);
        result.onchange = () => {
          setPermissionStatus(result.state);
        };
      });
    }
  }, []);

  // Load saved location
  useEffect(() => {
    const saved = localStorage.getItem('dhartisetu_location');
    if (saved) {
      try {
        setLocation(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('dhartisetu_location');
      }
    }
  }, []);

  // Reverse geocode coordinates
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await axios.post(`${API_BASE}/location/reverse`, {
        latitude,
        longitude
      });
      return response.data;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return null;
    }
  };

  // Detect current location
  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      toast.error(t('location.notSupported') || 'Geolocation not supported');
      return Promise.resolve(null);
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocode
          const locationData = await reverseGeocode(latitude, longitude);
          
          if (locationData) {
            const fullLocation = {
              ...locationData,
              latitude,
              longitude,
              timestamp: Date.now()
            };
            
            setLocation(fullLocation);
            localStorage.setItem('dhartisetu_location', JSON.stringify(fullLocation));
            toast.success(t('location.detected') || 'Location detected');
            resolve(fullLocation);
          } else {
            // Use coordinates as fallback
            const fallback = {
              city: 'Unknown',
              district: 'Unknown',
              state: 'Unknown',
              country: 'India',
              latitude,
              longitude,
              timestamp: Date.now()
            };
            setLocation(fallback);
            resolve(fallback);
          }
          
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError(error.message);
          setLoading(false);
          
          if (error.code === error.PERMISSION_DENIED) {
            toast.error(t('location.permission') || 'Please allow location access');
          } else {
            toast.error(t('location.failed') || 'Location detection failed');
          }
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }, [t]);

  // Set manual location
  const setManualLocation = useCallback((locationData) => {
    const fullLocation = {
      ...locationData,
      timestamp: Date.now(),
      manual: true
    };
    setLocation(fullLocation);
    localStorage.setItem('dhartisetu_location', JSON.stringify(fullLocation));
    toast.success(t('location.detected') || 'Location saved');
  }, [t]);

  // Clear location
  const clearLocation = useCallback(() => {
    setLocation(null);
    localStorage.removeItem('dhartisetu_location');
  }, []);

  return (
    <LocationContext.Provider value={{
      location,
      loading,
      error,
      permissionStatus,
      detectLocation,
      setManualLocation,
      clearLocation,
      hasLocation: !!location
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationContext;