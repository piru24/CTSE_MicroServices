import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../Store";
import axios from "axios";
import validators from "../../utils/validators";
import InputField from "../ui/InputField";
import Loader from "../Loader";
import { Link } from "react-router-dom";

axios.defaults.withCredentials = true;
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8090";

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: "", password: "" });
      setErrors({});
      setApiError("");
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError("");

    try {
      const { data } = await axios.post(`${API_BASE}/user/login`, {
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
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
      setApiError(err.response?.data?.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/80 z-50 m-0">

      {/* Modal Container */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">

        {/* Top Banner */}
        <div className="bg-[#f7941d] text-white text-center py-4 text-xl font-semibold">
          EBuy Login
        </div>

        {/* Form Section */}
        <div className="p-6">

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
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

            {/* Password */}
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

            {/* API Error */}
            {apiError && (
              <p className="text-red-500 text-sm text-center">{apiError}</p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#f7941d] hover:bg-[#ef6c00] transition duration-200 text-white py-3 rounded-lg font-semibold flex justify-center items-center"
            >
              {isSubmitting ? <Loader size="small" /> : "Login"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <hr className="flex-1" />
              OR
              <hr className="flex-1" />
            </div>

            {/* Register Link */}
<p className="text-center text-gray-600 text-sm">
  Don't have an account?{" "}
  <Link
    to="/signUp"
    className="text-[#f7941d] font-semibold hover:underline"
    onClick={onClose}
  >
    Register
  </Link>
</p>

          </form>

          {/* Close Button */}
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

export default LoginModal;