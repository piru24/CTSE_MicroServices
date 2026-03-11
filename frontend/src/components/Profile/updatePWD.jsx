import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { FaKey, FaUserShield } from "react-icons/fa";
import { MdOutlineFastfood } from "react-icons/md";

const UpdatePWD = () => {
  const navigate = useNavigate();

  // State for both passwords
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // (Optional) User info state
  const [user, setUser] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    role: "",
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get("http://food-app.127.0.0.1.nip.io/user/profile", {
          withCredentials: true,
        });
        setUser(res.data.user || {});
      } catch (err) {
        console.log(err);
        swal("Error fetching user info", "", "error");
      }
    };
    getUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      swal("Both old and new password are required.", "", "warning");
      return;
    }
    try {
      await axios.patch(
        "http://food-app.127.0.0.1.nip.io/user/update/pwd",
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      swal({
        title: "Password updated!",
        icon: "success",
        button: "OK",
        timer: 3000,
      });
      navigate("/profile");
    } catch (err) {
      swal("Error updating password", err.response?.data?.message || "", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 py-12 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white/90 shadow-2xl rounded-3xl p-10 max-w-lg mx-auto border border-green-100">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-tr from-green-400 to-green-700 rounded-full h-20 w-20 flex items-center justify-center shadow-lg border-4 border-white mb-2">
              <FaKey className="text-white text-4xl" />
            </div>
            <h1 className="text-3xl font-extrabold text-green-800 flex items-center gap-2">
              <MdOutlineFastfood className="text-yellow-400" /> Update Your Password
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Old Password */}
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-gray-700 font-semibold mb-2"
              >
                Enter Your Old Password
              </label>
              <input
                type="password"
                name="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
                placeholder="Enter old password"
              />
            </div>

            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-semibold mb-2"
              >
                Enter Your New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
                placeholder="Enter new password"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-4 rounded-full font-bold shadow hover:scale-105 hover:from-green-600 hover:to-green-800 transition flex items-center justify-center gap-2 text-lg"
              >
                <FaUserShield /> Update Password
              </button>
            </div>
          </form>

          {/* User Info */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
              <MdOutlineFastfood className="text-yellow-400" /> User Info
            </h2>
            <div className="bg-green-50 rounded-xl p-4 shadow flex flex-col gap-2">
              <p className="text-gray-700">
                <span className="font-semibold">Name:</span> {user.name}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Mobile:</span> {user.mobile}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Address:</span> {user.address}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Role:</span> {user.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePWD;
