// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { authActions } from '../Store';
// import validators from '../../utils/validators';

// axios.defaults.withCredentials = true;
// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8090';

// const Register = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     mobile: '',
//     email: '',
//     address: '',
//     role: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState('');

//   const validateForm = () => {
//     const newErrors = {};
//     if (!validators.validateName(formData.name)) newErrors.name = 'Invalid name';
//     if (!validators.validatePhone(formData.mobile)) newErrors.mobile = 'Invalid phone number';
//     if (!validators.validateEmail(formData.email)) newErrors.email = 'Invalid email';
//     if (!formData.address) newErrors.address = 'Address is required';
//     if (!formData.role) newErrors.role = 'Please select a role';
//     if (!validators.validatePassword(formData.password)) newErrors.password = 'Minimum 8 characters required';

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const sendData = async () => {
//     const res = await axios
//       .post(`${API_BASE} {
//         name: formData.name,
//         mobile: formData.mobile,
//         email: formData.email.trim().toLowerCase(),
//         address: formData.address,
//         role: formData.role,
//         password: formData.password
//       })
//       .catch((err) => {
//         console.error('Error during registration request:', err);
//         throw err;
//       });
//     return res.data;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);
//     setApiError('');

//     try {
//       const response = await sendData();

//       if (response && response.User && response.User._id && response.User.role) {
//         dispatch(
//           authActions.login({
//             userId: response.User._id,
//             role: response.User.role,
//             email: response.User.email
//           })
//         );

//         // Navigate based on user role
//         switch (response.User.role) {
//           case 'admin':
//             navigate('/admin', { replace: true });
//             break;
//           case 'seller':
//             navigate('/profile', { replace: true });
//             break;
//           case 'delivery':
//             navigate('/delivery', { replace: true });
//             break;
//           default:
//             navigate('/products', { replace: true });
//         }
//       } else {
//         throw new Error('Invalid response structure from backend');
//       }
//     } catch (err) {
//       const errorMessage = err?.response?.data?.message || err.message || 'Registration failed';
//       setApiError(errorMessage);
//       console.error('Registration Error:', err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-gray-50 py-2 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Create a new account
//         </h2>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Full Name
//               </label>
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full px-3 py-2 border ${
//                   errors.name ? 'border-red-500' : 'border-gray-300'
//                 } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//               />
//               {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
//             </div>

//             <div>
//               <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
//                 Mobile Number
//               </label>
//               <input
//                 id="mobile"
//                 name="mobile"
//                 type="tel"
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full px-3 py-2 border ${
//                   errors.mobile ? 'border-red-500' : 'border-gray-300'
//                 } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//               />
//               {errors.mobile && <p className="mt-2 text-sm text-red-600">{errors.mobile}</p>}
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full px-3 py-2 border ${
//                   errors.email ? 'border-red-500' : 'border-gray-300'
//                 } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//               />
//               {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
//             </div>

//             <div>
//               <label htmlFor="address" className="block text-sm font-medium text-gray-700">
//                 Address
//               </label>
//               <input
//                 id="address"
//                 name="address"
//                 type="text"
//                 value={formData.address}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full px-3 py-2 border ${
//                   errors.address ? 'border-red-500' : 'border-gray-300'
//                 } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//               />
//               {errors.address && <p className="mt-2 text-sm text-red-600">{errors.address}</p>}
//             </div>

//             <div>
//               <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                 Choose Your Role
//               </label>
//               <select
//                 id="role"
//                 name="role"
//                 value={formData.role}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full px-3 py-2 border ${
//                   errors.role ? 'border-red-500' : 'border-gray-300'
//                 } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//               >
//                 <option value="">Select the Role</option>
//                 <option value="buyer">I am a buyer</option>
//                 <option value="seller">I am a seller</option>
//                 <option value="delivery">I am a delivery person</option>
//               </select>
//               {errors.role && <p className="mt-2 text-sm text-red-600">{errors.role}</p>}
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`mt-1 block w-full px-3 py-2 border ${
//                   errors.password ? 'border-red-500' : 'border-gray-300'
//                 } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
//               />
//               {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
//             </div>

//             {apiError && (
//               <p className="mt-2 text-sm text-red-600" role="alert">
//                 {apiError}
//               </p>
//             )}

//             <div>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//               >
//                 {isSubmitting ? 'Submitting...' : 'Create Account'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

// New components/RegisterModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../Store';
import axios from 'axios';
import validators from '../../utils/validators';
import InputField from '../ui/InputField';
import Loader from '../Loader';

axios.defaults.withCredentials = true;
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8090';

const RegisterModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    role: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        mobile: '',
        email: '',
        address: '',
        role: '',
        password: ''
      });
      setErrors({});
      setApiError('');
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!validators.validateName(formData.name)) newErrors.name = 'Invalid name';
    if (!validators.validatePhone(formData.mobile)) newErrors.mobile = 'Invalid phone number';
    if (!validators.validateEmail(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.role) newErrors.role = 'Please select a role';
    if (!validators.validatePassword(formData.password)) newErrors.password = 'Minimum 8 characters required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const { data } = await axios.post(`${API_BASE}/user/signUp`, {
        ...formData,
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.replace(/\D/g, '')
      });

      dispatch(authActions.login({
        userId: data.User._id,
        role: data.User.role,
        email: data.User.email
      }));

      onSuccess();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            error={errors.name}
          />
          <InputField
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            error={errors.mobile}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            error={errors.email}
          />
          <InputField
            label="Address"
            name="address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            error={errors.address}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">Select Role</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="delivery">Delivery</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
          </div>
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            error={errors.password}
          />
          
          {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {isSubmitting ? <Loader size="small" /> : 'Register'}
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 text-gray-600 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
