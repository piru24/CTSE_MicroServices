import React from 'react';

const RoleSelector = ({ value, onChange, error }) => (
  <div className="mb-4">
    <label className="block text-gray-700 font-medium mb-2">
      Choose your Role:
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none ${
        error ? 'border-red-500' : 'focus:ring-2 focus:ring-blue-500'
      }`}
    >
      <option value="">Select the Role</option>
      <option value="buyer">I am a buyer</option>
      <option value="seller">I am a seller</option>
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default RoleSelector;
