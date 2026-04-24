import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { FaKey, FaUserShield } from "react-icons/fa";
import { MdOutlineFastfood } from "react-icons/md";

axios.defaults.withCredentials = true;

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

const UpdatePWD = () => {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [user, setUser] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    role: "",
  });

  // ✅ AUTH HEADER HELPER
  const getAuthConfig = () => ({
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ✅ GET USER PROFILE (FIXED)
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/user/profile`,
          getAuthConfig()
        );
        setUser(res.data.user || {});
      } catch (err) {
        console.error("Profile error:", err);
        swal("Session expired. Please login again", "", "error");
        navigate("/");
      }
    };

    getUser();
  }, [navigate]);

  // ✅ UPDATE PASSWORD (FIXED)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      swal("Both old and new password are required.", "", "warning");
      return;
    }

    try {
      await axios.patch(
        `${API_BASE}/user/update/pwd`,
        { oldPassword, newPassword },
        getAuthConfig()
      );

      swal({
        title: "Password updated!",
        icon: "success",
        timer: 3000,
      });

      navigate("/profile");

    } catch (err) {
      console.error("Password update error:", err);

      swal(
        "Error updating password",
        err.response?.data?.message || "",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 py-12">
      <div className="container mx-auto px-4">

        <div className="bg-white/90 shadow-2xl rounded-3xl p-10 max-w-lg mx-auto">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-green-600 rounded-full h-20 w-20 flex items-center justify-center mb-2">
              <FaKey className="text-white text-4xl" />
            </div>

            <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
              <MdOutlineFastfood className="text-yellow-400" />
              Update Password
            </h1>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Old Password"
              className="w-full p-2 border rounded"
            />

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full p-2 border rounded"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded"
            >
              Update Password
            </button>
          </form>

          {/* USER INFO */}
          <div className="mt-6 bg-green-50 p-4 rounded">
            <p><b>Name:</b> {user.name}</p>
            <p><b>Mobile:</b> {user.mobile}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Address:</b> {user.address}</p>
            <p><b>Role:</b> {user.role}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UpdatePWD;