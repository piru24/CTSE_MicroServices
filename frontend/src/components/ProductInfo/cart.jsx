import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import { useNavigate } from "react-router-dom";
import { MdFastfood, MdDeliveryDining } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";

const KEY =
  "pk_test_51Q5kUrKs4ldJ96PWJsuoDCG9WwlLqb5rS6eBXsrdEGMMifKnRIrabnhta1MvPcabDAZEsuf3lK4V3I01d7eUcvWp00o91jsc6s";

const Cart = () => {
  const cart = useSelector((state) => state.cart);

  const [stripeToken, setStripeToken] = useState(null);
  const [deliveryType, setDeliveryType] = useState();
  const [address, setAddress] = useState("");
  const [cheapDelivery, setCheapDelivery] = useState();
  const [fastDelivery, setFastDelivery] = useState();
  const [deliveryCharge, setDeliveryCharge] = useState();
  const [finalTotal, setFinalTotal] = useState();
  const [cheapDeliveryTime, setCheapDeliveryTime] = useState();
  const [fastDeliveryTime, setFastDeliveryTime] = useState();
  const [visibility, setVisibility] = useState(false);

  const getDeliveryPrices = async () => {
    const randomWeight = Math.random() * 4.9 + 1.0;
    const deliveryData = {
      shipfrom: "Colombo",
      shipto: address,
      weight: randomWeight,
    };
    const deliveryResult = await axios.post(
      "http://localhost:8300/delivery/rate",
      deliveryData
    );
    setVisibility(true);
    setCheapDelivery(deliveryResult.data.cheapDelivery.rate / 10);
    setFastDelivery(deliveryResult.data.fastDelivery.rate / 10);
    setCheapDeliveryTime(deliveryResult.data.cheapDelivery.duration);
    setFastDeliveryTime(deliveryResult.data.fastDelivery.duration);
  };

  const handleOptionChange = (event) => {
    setDeliveryType(event.target.value);
    setDeliveryCharge(
      event.target.value === "fast" ? fastDelivery : cheapDelivery
    );
    setFinalTotal(cart.withCommision + (event.target.value === "fast" ? fastDelivery : cheapDelivery));
  };

  const navigate = useNavigate();

  useEffect(() => {
    setFinalTotal(cart.withCommision);
  }, [cheapDelivery, fastDelivery, address, deliveryCharge, cart.withCommision]);

  const onToken = (token) => {
    setStripeToken(token);
  };

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const res = await axios.post("http://localhost:8020/order/payment", {
          tokenId: stripeToken.id,
          amount: cart.total,
        });
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    stripeToken && makeRequest();
  }, [stripeToken, cart.total]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold text-center text-[#f7941d] mb-10 tracking-tight drop-shadow flex items-center justify-center gap-2">
          <MdFastfood className="text-yellow-500" /> Your Cart
        </h1>

        {/* Cart Table */}
        <div className="overflow-x-auto bg-white/90 shadow-2xl rounded-3xl p-8 border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-[#f7941d] uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-[#f7941d]uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-sm font-bold text-[#f7941d] uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cart.products.map((product, index) => (
                <tr key={index} className="hover:bg-orange-50 transition">
                  <td className="px-6 py-4 text-lg text-green-900 font-semibold flex items-center gap-2">
                    <img
                      src={product.image || "/images/food-bg1.jpg"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-full shadow"
                    />
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-lg text-green-900">{product.quantity}</td>
                  <td className="px-6 py-4 text-lg text-green-900">
                    {product.quantity} x LKR {product.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delivery Options */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-[#f7941d] mb-4 flex items-center gap-2">
            <MdDeliveryDining className="text-yellow-500" /> Delivery Options
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <input
              type="text"
              placeholder="Enter your address"
              className="w-full px-4 py-3 border border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              type="button"
              onClick={getDeliveryPrices}
              className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 hover:from-green-600 hover:to-green-800 transition flex items-center gap-2"
            >
              Get Prices
            </button>
          </div>

          {visibility && (
            <div className="mt-6 flex flex-col md:flex-row gap-6">
              <label className="flex items-center gap-3 bg-white rounded-xl shadow px-6 py-4 cursor-pointer w-full md:w-auto">
                <input
                  type="radio"
                  id="fastDelivery"
                  name="delivery"
                  value="fast"
                  checked={deliveryType === "fast"}
                  onChange={handleOptionChange}
                  className="accent-green-600 w-5 h-5"
                />
                <span className="text-[#f7941d] font-semibold">
                  Fast Delivery
                </span>
                <span className="text-yellow-600 font-bold">
                  LKR {fastDelivery} / {fastDeliveryTime} hrs
                </span>
              </label>
              <label className="flex items-center gap-3 bg-white rounded-xl shadow px-6 py-4 cursor-pointer w-full md:w-auto">
                <input
                  type="radio"
                  id="cheapDelivery"
                  name="delivery"
                  value="cheap"
                  checked={deliveryType === "cheap"}
                  onChange={handleOptionChange}
                  className="accent-green-600 w-5 h-5"
                />
                <span className="text-[#f7941d] font-semibold">
                  Cheap Delivery
                </span>
                <span className="text-yellow-600 font-bold">
                LKR {cheapDelivery} / {cheapDeliveryTime+2} hrs
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="mt-10 bg-white/90 shadow-2xl rounded-3xl p-8 border border-green-100 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-[#f7941d] mb-6 flex items-center gap-2">
            <FaRegCreditCard className="text-yellow-500" /> Order Summary
          </h2>
          <div className="flex justify-between text-green-700 text-lg mb-2">
            <span>Cart Total:</span>
            <span>LKR {cart.total}</span>
          </div>
          <div className="flex justify-between text-green-700 text-lg mb-2">
            <span>With Commission:</span>
            <span>LKR {cart.withCommision}</span>
          </div>
          <div className="flex justify-between text-green-700 text-lg mb-2">
            <span>Delivery Charges:</span>
            <span>LKR {deliveryCharge || 0}</span>
          </div>
          <div className="flex justify-between font-bold text-green-900 text-xl border-t border-green-200 pt-4 mt-4">
            <span>Total:</span>
            <span>LKR {finalTotal || cart.withCommision}</span>
          </div>
        </div>

        {/* Checkout Buttons */}
        <div className="mt-10 flex flex-col md:flex-row gap-6 justify-center">
          <StripeCheckout
            name="Pay Food @ Door "
            description={`Your total is LKR${cart.total}`}
            amount={cart.total * 100}
            token={onToken}
            stripeKey={KEY}
          >
            <button className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-full font-bold shadow hover:scale-105 hover:from-green-600 hover:to-green-800 transition text-lg flex items-center gap-2">
              <FaRegCreditCard /> Checkout with Stripe
            </button>
          </StripeCheckout>
          <button
            onClick={() => navigate("/dummyPayment")}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900 px-8 py-3 rounded-full font-bold shadow hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 transition text-lg flex items-center gap-2"
          >
            <MdFastfood /> Checkout with Dummy
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
