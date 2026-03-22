import React from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDeliveryDining, MdFastfood, MdCheckCircle, MdOutlineTimer } from 'react-icons/md';
import { FaUser, FaMapMarkerAlt, FaRupeeSign } from 'react-icons/fa';

const DeliveryTracking = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { orderDetails, cusid } = location.state || {};
  const [status, setStatus] = useState(orderDetails?.status || '');

  const handleStartDelivery = async () => {
  if (!orderDetails?.orderId) return;

  try {
    await axios.post("http://localhost:8300/delivery/start", {
      orderId: orderDetails.orderId
    });

    setStatus("on the way");
    alert("Delivery started!");

  } catch (error) {
    console.error(error);
    alert("Failed to start delivery");
  }
};

  const handleDoorDelivery = async () => {
  if (!orderDetails?.orderId) return;

  try {
    await axios.post("http://localhost:8300/delivery/arrived", {
      orderId: orderDetails.orderId
    });

    setStatus("arrived");
    alert("Delivery arrived!");

  } catch (error) {
    console.error(error);
    alert("Failed to update delivery");
  }
};

  const handleEndDelivery = async () => {
  if (!orderDetails?.orderId) return;

  try {
    await axios.post("http://localhost:8300/delivery/complete", {
      orderId: orderDetails.orderId
    });

    setStatus("completed");
    alert("Delivery completed!");

  } catch (error) {
    console.error(error);
    alert("Failed to complete delivery");
  }
};


  useEffect(() => {
  if (!cusid) return;

  axios.get(`http://localhost:8090/user/${cusid}`)
    .then(res => setUser(res.data.user))
    .catch(err => console.error("User fetch failed:", err));
}, [cusid]);

  if (!user) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  const statusColors = {
    'completed': 'bg-green-100 text-green-800',
    'on the way': 'bg-yellow-100 text-yellow-800',
    'arrived': 'bg-blue-100 text-blue-800',
    'pending': 'bg-gray-100 text-gray-800'
  };

return (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-12 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-[#f7941d] rounded-full text-white">
            <MdDeliveryDining className="text-3xl" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            Delivery Details
          </h2>
        </div>

        {/* Order Card */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 shadow-sm border border-gray-200">

          <div className="flex items-center justify-between mb-4">

            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <MdFastfood className="text-[#f7941d]" />
              Order #{orderDetails?._id?.slice(-6) || "N/A"}
            </h3>

            <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusColors[status.toLowerCase()]}`}>
              {status}
            </span>

          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Order Details */}
            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <FaRupeeSign className="text-[#f7941d]" />
                <p className="text-gray-700">
                  <span className="font-semibold">Amount:</span> LKR {orderDetails.amount}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <MdOutlineTimer className="text-[#f7941d]" />
                  Products
                </h4>

                <ul className="space-y-2">
                  {orderDetails.products.map((product, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200"
                    >
                      <span className="text-gray-700">{product.name}</span>

                      <span className="text-gray-600 font-medium">
                        Qty: {product.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Customer Details */}
            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <FaUser className="text-[#f7941d]" />

                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-gray-600">{user.mobile}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-[#f7941d] mt-1" />

                <div>
                  <h4 className="font-semibold text-gray-800">
                    Delivery Address
                  </h4>

                  <p className="text-gray-600">{user.address}</p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Delivery Actions */}
        <div className="space-y-4">

          <button
            onClick={handleStartDelivery}
            className="w-full bg-[#f7941d] text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:bg-[#ea7a00] transition-all flex items-center justify-center gap-2"
          >
            <MdDeliveryDining className="text-xl" />
            Start Delivery
          </button>

          <button
            onClick={handleDoorDelivery}
            className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-xl font-semibold shadow-md hover:bg-yellow-500 transition-all flex items-center justify-center gap-2"
          >
            <MdCheckCircle className="text-xl" />
            Mark as Arrived
          </button>

          <button
            onClick={handleEndDelivery}
            className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
          >
            <MdCheckCircle className="text-xl" />
            Complete Delivery
          </button>

        </div>

      </div>
    </div>
  </div>
);
};

export default DeliveryTracking;