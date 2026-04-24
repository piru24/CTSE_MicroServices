import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { MdOutlineFastfood } from "react-icons/md";

axios.defaults.withCredentials = true;

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

const UpdateACC = () => {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
  });

  // ✅ AUTH HEADER HELPER
  const getAuthConfig = () => ({
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ GET PROFILE (FIXED)
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/user/profile`,
          getAuthConfig()
        );

        setInputs(res.data.user);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        navigate("/"); // redirect if not auth
      }
    };

    getUser();
  }, [navigate]);

  // ✅ UPDATE USER (FIXED)
  const sendData = async () => {
    try {
      const res = await axios.patch(
        `${API_BASE}/user/update`,
        {
          name: inputs.name,
          mobile: inputs.mobile,
          email: inputs.email,
          address: inputs.address,
        },
        getAuthConfig()
      );

      swal({
        title: "Details updated successfully!",
        icon: "success",
        button: "OK",
        timer: 3000,
      });

      navigate("/profile");
      return res.data;

    } catch (err) {
      console.error("Update error:", err);

      swal({
        title: "Update failed!",
        text: err.response?.data?.message || "Invalid input",
        icon: "error",
      });

      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 py-12">
      <div className="container mx-auto px-4">

        <div className="bg-white/90 shadow-2xl rounded-3xl p-10 max-w-lg mx-auto">

          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-tr from-green-400 to-green-700 rounded-full h-20 w-20 flex items-center justify-center mb-2">
              <FaUserEdit className="text-white text-4xl" />
            </div>

            <h1 className="text-3xl font-extrabold text-green-800 flex items-center gap-2">
              <MdOutlineFastfood className="text-yellow-400" />
              Update Account Details
            </h1>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="text"
              name="name"
              value={inputs.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border rounded"
            />

            <input
              type="text"
              name="mobile"
              value={inputs.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="w-full p-2 border rounded"
            />

            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />

            <input
              type="text"
              name="address"
              value={inputs.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 border rounded"
            />

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded"
            >
              Update
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateACC;