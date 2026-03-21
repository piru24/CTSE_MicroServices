import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../Store";
import axios from "axios";
import validators from "../../utils/validators";
import InputField from "../ui/InputField";
import Loader from "../Loader";

axios.defaults.withCredentials = true;
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8090";

const RegisterModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    role: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        mobile: "",
        email: "",
        address: "",
        role: "",
        password: "",
      });
      setErrors({});
      setApiError("");
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!validators.validateName(formData.name))
      newErrors.name = "Invalid name";

    if (!validators.validatePhone(formData.mobile))
      newErrors.mobile = "Invalid phone number";

    if (!validators.validateEmail(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.address)
      newErrors.address = "Address is required";

    if (!formData.role)
      newErrors.role = "Please select a role";

    if (!validators.validatePassword(formData.password))
      newErrors.password = "Minimum 8 characters required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const { data } = await axios.post(`${API_BASE}/user/signUp`, {
        ...formData,
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.replace(/\D/g, ""),
      });

      dispatch(
        authActions.login({
          userId: data.User._id,
          role: data.User.role,
          email: data.User.email,
        })
      );

      onSuccess();
    } catch (err) {
      setApiError(err.response?.data?.message || "Verify Ur Email");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 bg-opacity-80 z-[9999] m-0">

      {/* Modal Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#f7941d] text-white text-center py-4 text-xl font-semibold">
          EBuy Register
        </div>

        {/* Body */}
        <div className="p-6">

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={errors.name}
            />

            <InputField
              label="Mobile Number"
              name="mobile"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              error={errors.mobile}
            />

            <InputField
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
            />

            <InputField
              label="Address"
              name="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              error={errors.address}
            />

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d]"
              >
                <option value="">Select Role</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="delivery">Delivery</option>
              </select>

              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              error={errors.password}
            />

            {apiError && (
              <p className="text-red-500 text-sm text-center">{apiError}</p>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#f7941d] hover:bg-[#ef6c00] transition duration-200 text-white py-3 rounded-lg font-semibold flex justify-center items-center"
            >
              {isSubmitting ? <Loader size="small" /> : "Register"}
            </button>

          </form>

          {/* Close */}
          <button
            onClick={onClose}
            className="mt-6 w-full text-gray-500 hover:text-gray-700 text-sm"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
};

export default RegisterModal;