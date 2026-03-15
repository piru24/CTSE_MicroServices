import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";
import { FaCreditCard, FaUser, FaEnvelope, FaMobileAlt, FaLock } from "react-icons/fa";

export default function AddPayment() {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  const [payments, setPayments] = useState({
    email: "",
    mobile: "",
    number: "",
    expiration: "",
    cvv: "",
    name: ""
  });

  const handleChangeText = (e) => {
    const { name, value } = e.target;
    setPayments((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const AddPayment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire({
        title: "Not Logged In",
        text: "Please login first",
        icon: "warning"
      });
      return;
    }

    // Safely calculate amount
    const amount =
      cart?.withCommision ||
      cart?.total ||
      (cart?.products
        ? cart.products.reduce(
            (sum, p) => sum + (p.price || 0) * (p.quantity || 1),
            0
          )
        : 0);

    if (!amount || amount <= 0) {
      Swal.fire({
        title: "Cart Empty",
        text: "Your cart has no valid total amount",
        icon: "warning"
      });
      return;
    }

    const paymentData = {
      email: payments.email,
      mobile: payments.mobile,
      amount: String(amount), // backend expects numeric string
      card: {
        number: payments.number,
        expiration: payments.expiration,
        cvv: payments.cvv,
        name: payments.name
      }
    };

    try {
      // PAYMENT REQUEST
      await axios.post(
        "http://localhost:8500/payment/card",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      Swal.fire({
        title: "Payment Successful!",
        icon: "success",
        confirmButtonColor: "#16a34a"
      });

      const orderData = {
        products: cart.products.map((product) => ({
          productId: product._id,
          name: product.name,
          quantity: product.quantity
        })),
        amount: amount,
        status: "pending"
      };

      // ORDER CREATION
      await axios.post(
        "http://localhost:8020/Order/addOrder",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      navigate("/getOrders");
    } catch (error) {
      console.error("Payment error:", error?.response || error);

      Swal.fire({
        title: "Payment Failed",
        text: error?.response?.data?.err || "Something went wrong",
        icon: "error"
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 p-8 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <div className="flex items-center justify-center gap-3 mb-8">
          <FaCreditCard className="text-3xl text-green-600" />
          <h1 className="text-3xl font-bold text-green-800">
            Secure Payment
          </h1>
        </div>

        <form onSubmit={AddPayment} className="space-y-5">

          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-green-500"/>
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              onChange={handleChangeText}
              className="w-full pl-10 p-3 border rounded-lg"
            />
          </div>

          <div className="relative">
            <FaMobileAlt className="absolute left-3 top-3 text-green-500"/>
            <input
              name="mobile"
              type="text"
              placeholder="Mobile"
              required
              onChange={handleChangeText}
              className="w-full pl-10 p-3 border rounded-lg"
            />
          </div>

          <div className="relative">
            <FaCreditCard className="absolute left-3 top-3 text-green-500"/>
            <input
              name="number"
              type="text"
              placeholder="Card Number"
              required
              onChange={handleChangeText}
              className="w-full pl-10 p-3 border rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <input
              name="expiration"
              type="text"
              placeholder="MM/YYYY"
              required
              onChange={handleChangeText}
              className="p-3 border rounded-lg"
            />

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-green-500"/>
              <input
                name="cvv"
                type="number"
                placeholder="CVV"
                required
                onChange={handleChangeText}
                className="w-full pl-10 p-3 border rounded-lg"
              />
            </div>

          </div>

          <div className="relative">
            <FaUser className="absolute left-3 top-3 text-green-500"/>
            <input
              name="name"
              type="text"
              placeholder="Cardholder Name"
              required
              onChange={handleChangeText}
              className="w-full pl-10 p-3 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-4 rounded-xl font-bold hover:bg-green-700"
          >
            Confirm Payment
          </button>

        </form>
      </div>
    </div>
  );
}