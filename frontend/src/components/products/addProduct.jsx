import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";
import axios from "axios";
import { MdFastfood, MdAddPhotoAlternate } from "react-icons/md";
import { FaRegCalendarAlt, FaRupeeSign, FaWeight } from "react-icons/fa";

export default function AddProducts() {
  const { token } = useSelector((state) => state.auth);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const [products, setProducts] = useState({
    name: "",
    price: "",
    weight: "",
    upload_date: "",
    description: "",
    image: "",
  });

  // Unified handler for all text/number/date fields
  const handleChangeText = (e) => {
    const { name, value } = e.target;
    setProducts({ ...products, [name]: value });
  };

  // For select (portion/weight), ensure number
  const handleWeightChange = (e) => {
    setProducts({ ...products, weight: Number(e.target.value) });
  };

  const addProducts = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8070/products/addProduct", products, { withCredentials: true, headers: {
      Authorization: `Bearer ${token}`
    } })
      .then(() => {
        swal.fire({
          title: "Product added successfully!",
          icon: "success",
          background: "#f0fdf4",
          confirmButtonColor: "#16a34a"
        });
        navigate("/seller/dashboard");
      })
      .catch((error) => {
        swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to add product.",
          icon: "error",
          background: "#fef2f2",
          confirmButtonColor: "#dc2626"
        });
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProducts({ ...products, image: reader.result });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 py-12 flex items-center">
      <div className="container mx-auto px-4">
        <div className="bg-white/90 shadow-2xl rounded-3xl p-10 max-w-2xl mx-auto border border-green-100">
          <div className="flex items-center justify-center gap-3 mb-8">
            <MdFastfood className="text-4xl text-yellow-500" />
            <h1 className="text-3xl font-extrabold text-green-800">
              Add New Product
            </h1>
          </div>
          <form onSubmit={addProducts} className="space-y-8">
            {/* Name and Portion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label htmlFor="name" className="block text-green-800 font-semibold mb-2">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter product name"
                  required
                  onChange={handleChangeText}
                  className="w-full pl-4 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                />
              </div>
              <div className="relative">
                <label htmlFor="weight" className="block text-green-800 font-semibold mb-2">
                  Portion
                </label>
                <div className="flex items-center">
                  <FaWeight className="text-green-500 mr-2" />
                  <select
                    name="weight"
                    required
                    value={products.weight}
                    onChange={handleWeightChange}
                    className="w-full pl-4 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Price and Upload Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label htmlFor="price" className="block text-green-800 font-semibold mb-2">
                  Price (Rs.)
                </label>
                <div className="flex items-center">
                  <FaRupeeSign className="text-green-500 mr-2" />
                  <input
                    name="price"
                    type="number"
                    placeholder="Enter price"
                    required
                    onChange={handleChangeText}
                    className="w-full pl-4 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                  />
                </div>
              </div>
              <div className="relative">
                <label htmlFor="upload_date" className="block text-green-800 font-semibold mb-2">
                  Upload Date
                </label>
                <div className="flex items-center">
                  <FaRegCalendarAlt className="text-green-500 mr-2" />
                  <input
                    name="upload_date"
                    type="date"
                    required
                    onChange={handleChangeText}
                    className="w-full pl-4 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-green-800 font-semibold mb-2">
                Shop
              </label>
              <input
                name="description"
                type="text"
                placeholder="Enter Shop name"
                required
                onChange={handleChangeText}
                className="w-full pl-4 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
              />
            </div>

            {/* Image Upload */}
            <div className="relative">
              <label htmlFor="image" className="block text-green-800 font-semibold mb-2">
                Product Image
              </label>
              <div className="flex items-center">
                <MdAddPhotoAlternate className="text-green-500 mr-2" />
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="w-full pl-4 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                  accept="image/*"
                  required
                  disabled={isUploading}
                />
              </div>
              {isUploading && (
                <p className="text-green-600 text-sm mt-2">Uploading image...</p>
              )}
              {products.image && (
                <div className="mt-4">
                  <p className="text-green-700 text-sm mb-2">Uploaded Image:</p>
                  <img
                    src={products.image}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg shadow"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
              disabled={isUploading}
            >
              <MdFastfood className="text-2xl" />
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
