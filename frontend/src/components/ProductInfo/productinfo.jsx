import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { addProduct } from "../Store";
import { useDispatch } from "react-redux";
import { FiStar, FiPackage, FiDollarSign, FiUser } from "react-icons/fi";
import { MdFastfood } from "react-icons/md";

const Productinfo = () => {
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/products/getProduct/${id}`
        );
        setProduct(response.data.product);
      } catch (err) {
        console.log(err);
      }
    };
    getProduct();
  }, [id]);

  const handleQuantity = (type) => {
    if (type === "dec") {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      setQuantity(quantity + 1);
    }
  };

  const handleAddtoCart = () => {
    dispatch(addProduct({ ...product, quantity }));
    navigate("/cart");
  };

  return (
    <div className="bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white/90 shadow-2xl rounded-3xl p-8 flex flex-col md:flex-row gap-10 border border-green-100">
          {/* Product Image */}
          <div className="flex-shrink-0 w-full md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Details */}
          <div className="flex-grow space-y-6">
            <h1 className="text-4xl font-extrabold text-green-800 mb-2">
              {product.name}
            </h1>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-lg text-green-700">
                <FiDollarSign className="text-2xl text-yellow-500" />
                <span className="font-bold">Price:</span>
                <span className="bg-green-100 px-4 py-1 rounded-full">₹{product.price}</span>
              </div>
              
              <div className="flex items-center gap-3 text-lg text-green-700">
                <FiPackage className="text-2xl text-yellow-500" />
                <span className="font-bold">Portion:</span>
                <span className="bg-green-100 px-4 py-1 rounded-full">for - {product.weight}</span>
              </div>

              <div className="flex items-center gap-3 text-lg text-green-700">
                <FiUser className="text-2xl text-yellow-500" />
                <span className="font-bold">Seller:</span>
                <span className="bg-green-100 px-4 py-1 rounded-full">{product.description}</span>
              </div>
            </div>

            {/* Rate Seller Button */}
            <button
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900 px-6 py-3 rounded-xl font-bold shadow hover:scale-[1.02] transition flex items-center justify-center gap-2"
              onClick={() => navigate(`/rateSeller/${product.sellerName}/${product.sellerId}`)}
            >
              <FiStar className="text-xl" />
              Rate This Seller
            </button>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-green-50 p-4 rounded-xl">
              <span className="text-lg font-semibold text-green-800">Quantity:</span>
              <div className="flex items-center gap-4">
                <button
                  className="bg-green-600 text-white w-10 h-10 rounded-full hover:bg-green-700 transition flex items-center justify-center"
                  onClick={() => handleQuantity("dec")}
                >
                  -
                </button>
                <span className="text-2xl font-bold text-green-800 w-8 text-center">
                  {quantity}
                </span>
                <button
                  className="bg-green-600 text-white w-10 h-10 rounded-full hover:bg-green-700 transition flex items-center justify-center"
                  onClick={() => handleQuantity("inc")}
                >
                  +
                </button>
              </div>
            </div>

            <button
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl font-bold shadow hover:scale-[1.02] transition flex items-center justify-center gap-2 text-lg"
              onClick={handleAddtoCart}
            >
              <MdFastfood className="text-xl" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productinfo;
