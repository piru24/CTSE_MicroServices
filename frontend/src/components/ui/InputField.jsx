import React from 'react';

const InputField = ({ 
  label, 
  id, 
  error, 
  ...props 
}) => (
  <div className="mb-4">
    <label 
      htmlFor={id} 
      className="block text-gray-700 font-medium mb-2"
    >
      {label}
    </label>
    <input
      id={id}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
        error ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'
      }`}
      {...props}
    />
    {error && (
      <p className="text-red-500 text-sm mt-1">{error}</p>
    )}
  </div>
);

export default InputField;
