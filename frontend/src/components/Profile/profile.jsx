import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaTrashAlt, FaEdit } from "react-icons/fa";
import { MdOutlineFastfood } from "react-icons/md";

axios.defaults.withCredentials = true;

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000";

const Profile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  // ✅ HELPER (IMPORTANT)
  const getAuthConfig = () => ({
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ✅ GET PROFILE
  const getProfile = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/user/profile`,
        getAuthConfig()
      );
      return res.data;
    } catch (err) {
      console.error("Profile error:", err);
      throw err;
    }
  };

  // ✅ LOAD PROFILE
  useEffect(() => {
    getProfile()
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        // If not authenticated → redirect login
        navigate("/");
      });
  }, [navigate]);

  // ✅ DELETE ACCOUNT
  const handleDeleteAcc = () => {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete your account?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${API_BASE}/user/deleteUser`, getAuthConfig())
          .then(() => {
            localStorage.removeItem("token"); // 🔥 important
            swal("Account deleted", { icon: "success" });
            navigate("/");
          });
      }
    });
  };

  return (
    <div className="bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 py-12">
      <div className="container mx-auto px-4">

        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-2xl mx-auto">

          {/* HEADER */}
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-green-600 rounded-full h-24 w-24 flex items-center justify-center">
              {user.image ? (
                <img
                  src={user.image}
                  alt="profile"
                  className="h-20 w-20 rounded-full"
                />
              ) : (
                <FaUserCircle className="text-white text-5xl" />
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-green-800">
                Profile
              </h1>
              <p>
                Welcome, <b>{user.name}</b>
              </p>
            </div>
          </div>

          {/* USER DETAILS */}
          <div className="grid gap-4">
            <p><b>Mobile:</b> {user.mobile}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Address:</b> {user.address}</p>
            <p>
              <b>Role:</b>{" "}
              <span className="bg-green-200 px-3 py-1 rounded">
                {user.role}
              </span>
            </p>
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex gap-3 flex-wrap">
            <button
              onClick={() => navigate(`/updateUser/${user._id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              <FaEdit /> Update
            </button>

            <button
              onClick={() => navigate(`/updatePWD/${user._id}`)}
              className="bg-yellow-400 px-4 py-2 rounded"
            >
              <FaEdit /> Password
            </button>

            <button
              onClick={handleDeleteAcc}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              <FaTrashAlt /> Delete
            </button>
          </div>
        </div>

        {/* DELIVERY SECTION */}
        {user.role === "delivery" && (
          <div className="bg-green-50 p-6 rounded mt-10 max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-center mb-3">
              Delivery Profile
            </h2>

            <p><b>ID:</b> {user._id}</p>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Contact:</b> {user.mobile}</p>
            <p><b>Area:</b> {user.address}</p>

            <div className="text-center mt-4">
              <button
                onClick={() => navigate("/deliveryDashboard")}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                View Deliveries
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;