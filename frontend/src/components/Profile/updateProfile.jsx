import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { MdOutlineFastfood } from "react-icons/md";

const UpdateACC = () => {
  const id = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        await axios.get("http://food-app.127.0.0.1.nip.io/user/profile").then((res) => {
          setInputs(res.data.user);
        });
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [id]);

  const sendData = async () => {
    try {
      const res = await axios.patch("http://food-app.127.0.0.1.nip.io/user/update", {
        name: inputs.name,
        mobile: inputs.mobile,
        email: inputs.email,
        address: inputs.address,
      });
      swal({
        title: "Details updated successfully!",
        icon: "success",
        button: "OK",
        timer: 3000,
      });
      navigate("/profile");
      return res.data;
    } catch (err) {
      if (err.response) {
        swal({
          title: "Update failed!",
          text: err.response.data.message || "Invalid input",
          icon: "error",
        });
      }
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 py-12 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white/90 shadow-2xl rounded-3xl p-10 max-w-lg mx-auto border border-green-100">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-tr from-green-400 to-green-700 rounded-full h-20 w-20 flex items-center justify-center shadow-lg border-4 border-white mb-2">
              <FaUserEdit className="text-white text-4xl" />
            </div>
            <h1 className="text-3xl font-extrabold text-green-800 flex items-center gap-2">
              <MdOutlineFastfood className="text-yellow-400" /> Update Account Details
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-semibold mb-2"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={inputs.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
                placeholder="Enter your name"
              />
            </div>

            {/* Mobile */}
            <div>
              <label
                htmlFor="mobile"
                className="block text-gray-700 font-semibold mb-2"
              >
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                value={inputs.mobile}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
                placeholder="Enter your mobile number"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold mb-2"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={inputs.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
                placeholder="Enter your email"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-gray-700 font-semibold mb-2"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                value={inputs.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
                placeholder="Enter your address"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-4 rounded-full font-bold shadow hover:scale-105 hover:from-green-600 hover:to-green-800 transition flex items-center justify-center gap-2 text-lg"
              >
                <FaUserEdit /> Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateACC;
