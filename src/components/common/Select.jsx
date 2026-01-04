import React, { forwardRef } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder,
      value = '',              // ✅ SAFE DEFAULT
      onChange,
      name,
      className = '',
      containerClassName = '',
      ...rest
    },
    ref
  ) => {
    return (
      <div className={containerClassName}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            name={name}
            value={value ?? ''}     // ✅ FORCE CONTROLLED VALUE
            onChange={onChange}
            className={`
              w-full px-4 py-3 rounded-xl border appearance-none
              ${error
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-primary-200'
              }
              bg-white cursor-pointer
              focus:outline-none focus:ring-2
              ${className}
            `}
            {...rest}
          >
            {/* PLACEHOLDER */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* OPTIONS */}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* DROPDOWN ICON */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <FiChevronDown />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
