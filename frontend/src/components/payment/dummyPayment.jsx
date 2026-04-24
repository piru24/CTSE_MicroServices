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

  // ✅ DEFINE FINAL TOTAL (FIXED)
  const finalTotal =
    cart?.withCommision ||
    cart?.total ||
    (cart?.products
      ? cart.products.reduce(
          (sum, p) => sum + (p.price || 0) * (p.quantity || 1),
          0
        )
      : 0);

  const AddPayment = async (e) => {
    e.preventDefault();

    // ✅ Get and clean token
    const token = localStorage.getItem("token")?.replace(/"/g, "");

    if (!token) {
      Swal.fire({
        title: "Not Logged In",
        text: "Please login first",
        icon: "warning"
      });
      return;
    }

    // ✅ Validate amount
    if (!finalTotal || finalTotal <= 0) {
      Swal.fire({
        title: "Cart Empty",
        text: "Your cart has no valid total amount",
        icon: "warning"
      });
      return;
    }

    // ✅ Payment payload
    const paymentData = {
      email: payments.email,
      mobile: payments.mobile,
      amount: String(finalTotal), // ✅ consistent total
      card: {
        number: payments.number,
        expiration: payments.expiration,
        cvv: payments.cvv,
        name: payments.name
      }
    };

    try {
      // 🔹 PAYMENT REQUEST
      await axios.post(
        "https://payment-service.wittysea-78387375.eastasia.azurecontainerapps.io/payment/card",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      Swal.fire({
        title: "Payment Successful!",
        icon: "success",
        confirmButtonColor: "#16a34a"
      });

      // ✅ Order payload
      const orderData = {
        products: cart.products.map((product) => ({
          productId: product._id,
          name: product.name,
          quantity: product.quantity
        })),
        amount: finalTotal, // ✅ same amount
        status: "pending"
      };

      // 🔹 ORDER CREATION (FIXED URL)
      await axios.post(
        "https://order-service.agreeablestone-66d4ad90.southeastasia.azurecontainerapps.io/order/addOrder",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate("/getOrders");

    } catch (error) {
      console.error("❌ Payment error:", error.response?.data || error.message);

      Swal.fire({
        title: "Payment Failed",
        text: error?.response?.data?.err || "Something went wrong",
        icon: "error"
      });
    }
  };



 return (
  <div className="bg-gradient-to-b from-gray-50 to-gray-200 p-8 flex items-center justify-center min-h-screen">
    <div className="bg-white shadow-2xl border border-gray-200 rounded-2xl p-8 w-full max-w-lg">
      
      <div className="flex items-center justify-center gap-3 mb-8">
        <FaCreditCard className="text-3xl text-[#f7941d]" />
        <h1 className="text-3xl font-bold text-gray-900">
          Secure Payment
        </h1>
      </div>

      <form onSubmit={AddPayment} className="space-y-5">

        <div className="relative">
          <FaEnvelope className="absolute left-3 top-3 text-[#f7941d]" />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            onChange={handleChangeText}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d]"
          />
        </div>

        <div className="relative">
          <FaMobileAlt className="absolute left-3 top-3 text-[#f7941d]" />
          <input
            name="mobile"
            type="text"
            placeholder="Mobile"
            required
            onChange={handleChangeText}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d]"
          />
        </div>

        <div className="relative">
          <FaCreditCard className="absolute left-3 top-3 text-[#f7941d]" />
          <input
            name="number"
            type="text"
            placeholder="Card Number"
            required
            onChange={handleChangeText}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">

          <input
            name="expiration"
            type="text"
            placeholder="MM/YYYY"
            required
            onChange={handleChangeText}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d]"
          />

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-[#f7941d]" />
            <input
              name="cvv"
              type="number"
              placeholder="CVV"
              required
              onChange={handleChangeText}
              className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d]"
            />
          </div>

        </div>

        <div className="relative">
          <FaUser className="absolute left-3 top-3 text-[#f7941d]" />
          <input
            name="name"
            type="text"
            placeholder="Cardholder Name"
            required
            onChange={handleChangeText}
            className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f7941d]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#f7941d] text-white p-4 rounded-xl font-bold hover:bg-[#ea7a00] transition"
        >
          Confirm Payment
        </button>

      </form>
    </div>
  </div>
);
}