import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon: Icon,
  type = 'text',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-3 rounded-xl border
            ${Icon ? 'pl-12' : ''}
            ${error 
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
              : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
            }
            transition-all duration-200 ease-in-out
            placeholder:text-gray-400
            ${className}
          `}
          {...props}
        />
      </div>
      
      {hint && !error && (
        <p className="text-sm text-gray-500 mt-1">{hint}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;