import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiHome, FiRefreshCw } from 'react-icons/fi';

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiAlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Page Load Error
        </h1>
        
        <p className="text-gray-600 mb-6">
          Failed to load this page. Please try again.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          
          <Link
            to="/"
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl"
          >
            <FiHome className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;