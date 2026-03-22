import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaTrashAlt, FaEdit } from "react-icons/fa";


axios.defaults.withCredentials = true;

const Profile = () => {

  const [user, setUser] = useState({});

  const navigate = useNavigate();

  // ---------------------------
  // GET USER PROFILE
  // ---------------------------
  const sendRequest = async () => {
    try {

      const res = await axios.get(
        "http://localhost:8090/user/profile",
        { withCredentials: true }
      );

      return res.data;

    } catch (err) {

      console.log("Profile fetch error:", err);
      return null;

    }
  };

  // ---------------------------
  // INITIAL LOAD
  // ---------------------------
  useEffect(() => {

    const fetchData = async () => {

      const data = await sendRequest();

      if (!data || !data.user) return;

      setUser(data.user);

    };

    fetchData();

  }, []);

  // ---------------------------
  // DELETE ACCOUNT
  // ---------------------------
  const handleDeleteAcc = () => {

    swal({
      title: "Are you sure?",
      text: "Do you want to delete your account?",
      icon: "warning",
      dangerMode: true,
    }).then(async (willDelete) => {

      if (willDelete) {

        swal({
          title: "Deleting account...",
          icon: "info",
          buttons: false,
          timer: 1500,
        });

        try {

          await axios.delete(
            "http://localhost:8090/user/deleteUser",
            { withCredentials: true }
          );

          swal({
            title: "Account deleted successfully",
            icon: "success",
            buttons: false,
            timer: 2000,
          }).then(() => {

            window.location.href = "/login";

          });

        } catch (err) {

          console.log(err);
          swal("Error deleting account");

        }
      }
    });
  };

// ---------------------------
// PROFILE UI
// ---------------------------
return (
  <div className="bg-gradient-to-b from-gray-50 to-gray-200 py-12 relative">

    <div className="container mx-auto px-4 relative z-10">

      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-2xl mx-auto border border-gray-200">

        <div className="flex items-center gap-6 mb-8">

          <div className="bg-[#f7941d] rounded-full h-24 w-24 flex items-center justify-center shadow-lg border-4 border-white">

            {user.image ? (

              <img
                src={user.image}
                alt="profile"
                className="h-20 w-20 rounded-full object-cover"
              />

            ) : (

              <FaUserCircle className="text-white text-5xl" />

            )}

          </div>

          <div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
              Profile
            </h1>

            <p className="text-gray-500 text-lg">
              Welcome,
              <span className="font-semibold text-gray-800">
                {" "}
                {user.name}
              </span>
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

          <div>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Mobile:</span> {user.mobile}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Email:</span> {user.email}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Address:</span> {user.address}
            </p>

          </div>

          <div>

            <p className="text-gray-700 mb-3">
              <span className="font-semibold">Role:</span>

              <span className="ml-2 px-3 py-1 rounded-full bg-gray-200 text-gray-800 font-semibold text-sm capitalize shadow">
                {user.role}
              </span>

            </p>

            <div className="mt-2 flex flex-wrap gap-3">

              <button
                className="bg-[#f7941d] text-white px-4 py-2 rounded-full hover:bg-[#ea7a00] transition"
                onClick={() => navigate(`/updateUser/${user._id}`)}
              >
                <FaEdit /> Update Account
              </button>

              <button
                className="bg-gray-700 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
                onClick={() => navigate(`/updatePWD/${user._id}`)}
              >
                <FaEdit /> Update Password
              </button>

              <button
                className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
                onClick={handleDeleteAcc}
              >
                <FaTrashAlt /> Delete Account
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* DELIVERY PROFILE */}

      {user.role === "delivery" && (

        <div className="bg-white p-6 rounded-2xl shadow-xl my-8 max-w-lg mx-auto border border-gray-200">

          <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">
            My Delivery Profile
          </h2>

          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-6">

            <p>
              <strong>ID:</strong> {user._id}
            </p>

            <p>
              <strong>Name:</strong> {user.name}
            </p>

            <p>
              <strong>Contact:</strong> {user.mobile}
            </p>

            <p>
              <strong>Area:</strong> {user.address}
            </p>

            <div className="text-center mt-4">

              <button
                className="bg-[#f7941d] text-white px-4 py-2 rounded-full hover:bg-[#ea7a00] transition"
                onClick={() => navigate("/deliveryDashboard")}
              >
                View Assigned Deliveries
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  </div>
);
};

export default Profile;