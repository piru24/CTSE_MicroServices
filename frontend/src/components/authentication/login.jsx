// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { authActions } from '../Store';
// import validators from '../../utils/validators';
// import InputField from '../ui/InputField';
// import Loader from '../Loader';

// axios.defaults.withCredentials = true;
// const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8090';

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState('');

//   useEffect(() => {
//     return () => setIsSubmitting(false);
//   }, []);

//   const validateForm = () => {
//     const newErrors = {};
//     if (!validators.validateEmail(formData.email)) newErrors.email = 'Invalid email format';
//     if (!validators.validatePassword(formData.password)) newErrors.password = 'Password must be at least 8 characters';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const sendData = async () => {
//     const res = await axios
//       .post(`${API_BASE}/User/login`, {
//         email: formData.email.trim().toLowerCase(),
//         password: formData.password.trim(),
//       })
//       .catch((err) => {
//         console.error('Error during login request:', err);
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

//       if (response && response.User && response.User.role) {
//         // Dispatch login action to update Redux state
//         dispatch(
//           authActions.login({
//             userId: response.User._id,
//             role: response.User.role,
//             email: response.User.email,
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
//             navigate('/deliveryDashboard', { replace: true });
//             break;
//           default:
//             navigate('/products', { replace: true });
//         }
//       } else {
//         throw new Error('Invalid response structure from backend');
//       }
//     } catch (err) {
//       const errorMessage = err?.response?.data?.message || err.message || 'Authentication failed';
//       setApiError(errorMessage);
//       console.error('Login Error:', err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-gray-50 flex flex-col justify-center py-2 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Sign in to your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Or{' '}
//           <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
//             create a new account
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <InputField
//               label="Email address"
//               id="email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               error={errors.email}
//               autoComplete="email"
//               required
//             />

//             <InputField
//               label="Password"
//               id="password"
//               name="password"
//               type="password"
//               value={formData.password}
//               onChange={handleChange}
//               error={errors.password}
//               autoComplete="current-password"
//               required
//             />

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
//                 {isSubmitting ? <Loader size="small" /> : 'Sign in'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

// New components/LoginModal.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../Store';
import axios from 'axios';
import validators from '../../utils/validators';
import InputField from '../ui/InputField';
import Loader from '../Loader';

axios.defaults.withCredentials = true;
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8090';

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: '', password: '' });
      setErrors({});
      setApiError('');
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    // if (!validators.validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    // if (!validators.validatePassword(formData.password)) newErrors.password = 'Password must be at least 8 characters';
    // setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      const { data } = await axios.post(`${API_BASE}/user/login`, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim()
      });

      dispatch(authActions.login({
        userId: data.User._id,
        role: data.User.role,
        email: data.User.email
      }));

      onSuccess();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            error={errors.email}
          />
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
            {isSubmitting ? <Loader size="small" /> : 'Login'}
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

export default LoginModal;
