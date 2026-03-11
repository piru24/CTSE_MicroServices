import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import swal from "sweetalert2";
import axios from "axios";
import { FaCreditCard, FaUser, FaEnvelope, FaMobileAlt, FaLock } from "react-icons/fa";

export default function AddPayment() {
  const cart = useSelector((state) => state.cart);
  const [payments, setPayments] = useState({
    email: "",
    mobile: "",
    number: "",
    expiration: "",
    cvv: "",
    name: "",
    amount: "",
  });

  const handleChangeText = (name, value) => {
    setPayments({ ...payments, [name]: value.target.value });
  };

  const newPayment = {
    email: payments.email,
    mobile: payments.mobile,
    card: {
      number: payments.number,
      expiration: payments.expiration,
      cvv: payments.cvv,
      name: payments.name,
    },
    amount: payments.amount,
  };

  const AddPayment = async (e) => {
    e.preventDefault();
    try {
      const paymentRes = await axios.post(
        "http://food-app.127.0.0.1.nip.io/payment/card",
        newPayment,
        { withCredentials: true }
      );
      swal.fire({
        title: 'Payment Successful!',
        icon: 'success',
        background: '#f0fdf4',
        confirmButtonColor: '#16a34a'
      });

      const orderData = {
        products: cart.products.map((product) => ({
          productId: product._id,
          name: product.name,
          quantity: product.quantity,
        })),
        amount: cart.withCommision,
        status: "pending",
      };
      const orderRes = await axios.post(
        "http://food-app.127.0.0.1.nip.io/order/addOrder",
        orderData,
        { withCredentials: true }
      );

      navigate("/getOrders");
    } catch (error) {
      console.error(error);
      swal.fire({
        title: 'Payment Failed',
        text: 'Please check your details and try again',
        icon: 'error',
        background: '#fef2f2',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 p-8 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-lg border border-green-100">
        <div className="flex items-center justify-center gap-3 mb-8">
          <FaCreditCard className="text-3xl text-green-600" />
          <h1 className="text-3xl font-bold text-center text-green-800">
            Secure Payment
          </h1>
        </div>
        
        <form onSubmit={AddPayment} className="space-y-6">
          {/* Email and Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                onChange={(val) => handleChangeText("email", val)}
                className="w-full pl-10 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
              />
            </div>
            <div className="relative">
              <FaMobileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              <input
                name="mobile"
                type="number"
                placeholder="Mobile"
                required
                onChange={(val) => handleChangeText("mobile", val)}
                className="w-full pl-10 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
              />
            </div>
          </div>

          {/* Credit Card Details */}
          <div className="space-y-4">
            <div className="relative">
              <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              <input
                name="number"
                type="text"
                placeholder="Card Number"
                required
                onChange={(val) => handleChangeText("number", val)}
                className="w-full pl-10 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  name="expiration"
                  type="text"
                  placeholder="MM/YY"
                  required
                  onChange={(val) => handleChangeText("expiration", val)}
                  className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                <input
                  name="cvv"
                  type="number"
                  placeholder="CVV"
                  required
                  onChange={(val) => handleChangeText("cvv", val)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
                />
              </div>
            </div>
          </div>

          {/* Name and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
              <input
                name="name"
                type="text"
                placeholder="Cardholder Name"
                required
                onChange={(val) => handleChangeText("name", val)}
                className="w-full pl-10 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 font-bold">₹</span>
              <input
                name="amount"
                type="number"
                placeholder="Amount"
                required
                onChange={(val) => handleChangeText("amount", val)}
                className="w-full pl-10 pr-4 py-3 border-2 border-green-100 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 bg-green-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-bold shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FaCreditCard className="text-xl" />
            Confirm Payment
          </button>
        </form>
      </div>
    </div>
  );
}
