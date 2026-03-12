import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert2";
import axios from "axios";
import { MdFastfood, MdImage, MdDescription } from "react-icons/md";
import { FaRupeeSign, FaWeight, FaCalendarAlt } from "react-icons/fa";

export default function UpdateProducts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState({
    name: "", 
    price: "",
    weight: "",
    upload_date: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const getProductById = () => {
      axios
        .get(`http://localhost:8070/products/getProduct/${id}`)
        .then((res) => {
          setProducts(res.data.product);
        });
    };
    getProductById();
  }, [id]);

  const handleChangeText = (name, val) => {
    setProducts({ ...products, [name]: val.target.value });
  };

  const UpdateProductsHandler = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:8070/products/updateProduct/${id}`, products)
      .then(() => {
        swal.fire(`Successfully updated`);
        navigate("/profile");
      })
      .catch((error) => {
        swal.fire("Update failed", error.response?.data?.message || "", "error");
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-green-100">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-green-500 p-3 rounded-full text-white">
              <MdFastfood className="text-3xl" />
            </div>
            <h1 className="text-3xl font-extrabold text-green-800">Update Product</h1>
          </div>

          <form onSubmit={UpdateProductsHandler} className="space-y-8">
            {/* Name and Brand */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label htmlFor="name" className="block text-green-800 font-semibold mb-2">
                  Product Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={products.name}
                  required
                  onChange={(val) => handleChangeText("name", val)}
                  className="w-full pl-4 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                />
              </div>
              <div className="relative">
                <label htmlFor="description" className="block text-green-800 font-semibold mb-2">
                  Shop
                </label>
                <input
                  name="description"
                  type="text"
                  value={products.description}
                  required
                  onChange={(val) => handleChangeText("description", val)}
                  className="w-full pl-4 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                />
              </div>
            </div>

            {/* Price and Weight */}
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
                    value={products.price}
                    required
                    onChange={(val) => handleChangeText("price", val)}
                    className="w-full pl-4 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                  />
                </div>
              </div>
              <div className="relative">
                <label htmlFor="weight" className="block text-green-800 font-semibold mb-2">
                  Portion for person
                </label>
                <div className="flex items-center">
                  <FaWeight className="text-green-500 mr-2" />
                  <select
                    name="weight"
                    required
                    value={products.weight}
                    onChange={(val) => handleChangeText("weight", val)}
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

            {/* Date and Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label htmlFor="upload_date" className="block text-green-800 font-semibold mb-2">
                  Upload Date
                </label>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-green-500 mr-2" />
                  <input
                    name="upload_date"
                    type="date"
                    value={products.upload_date}
                    required
                    onChange={(val) => handleChangeText("upload_date", val)}
                    className="w-full pl-4 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                  />
                </div>
              </div>
              <div className="relative">
                <label htmlFor="image" className="block text-green-800 font-semibold mb-2">
                  Image URL
                </label>
                <div className="flex items-center">
                  <MdImage className="text-green-500 mr-2" />
                  <input
                    name="image"
                    type="text"
                    value={products.image}
                    required
                    onChange={(val) => handleChangeText("image", val)}
                    className="w-full pl-4 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                  />
                </div>
                {products.image && (
                  <div className="mt-4">
                    <img 
                      src={products.image} 
                      alt="Preview" 
                      className="h-32 w-32 object-cover rounded-lg shadow border border-green-100"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
            >
              Update Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
