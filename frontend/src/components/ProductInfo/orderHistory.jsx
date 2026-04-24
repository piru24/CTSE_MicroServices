import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiPackage, FiClock, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { MdOutlineDeliveryDining } from 'react-icons/md';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const getOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const cleanToken = token?.replace(/"/g, "");

      const res = await axios.get(
        "https://order-service.agreeablestone-66d4ad90.southeastasia.azurecontainerapps.io/order/orderhistory",
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );

      setOrders(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.error(
        "Error fetching order history:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  getOrders();
}, []);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FiCheckCircle className="text-green-500 mr-2" />;
      case 'cancelled':
        return <FiClock className="text-red-500 mr-2" />;
      default:
        return <MdOutlineDeliveryDining className="text-yellow-500 mr-2" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-8">
    <div className="max-w-4xl mx-auto">

      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 flex items-center gap-3">
        <FiPackage className="text-[#f7941d]" />
        Order History
      </h1>

      {orders.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl border border-gray-200">
          <MdOutlineDeliveryDining className="text-7xl text-[#f7941d] mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">
            No orders found
          </h2>
          <p className="text-gray-500 mt-2">
            Your upcoming orders will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 hover:shadow-2xl transition-all"
            >

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">

                <div className="mb-4 md:mb-0">

                  <div className="flex items-center text-gray-800 mb-2">
                    {getStatusIcon(order.status)}
                    <span className="font-bold text-lg">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <FiClock className="mr-2" />
                    {new Date(order.createdAt).toLocaleString()}
                  </div>

                </div>

                <div className="flex items-center space-x-4">

                  <div className="bg-gray-100 px-5 py-2 rounded-full shadow text-lg">
                    <span className="text-gray-900 font-bold">
                      LKR {order.amount}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/notify/${order._id}`)}
                    className="bg-[#f7941d] text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-[#ea7a00] transition-colors font-semibold shadow"
                  >
                    <FiInfo className="mr-2" />
                    Details
                  </button>

                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">

                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  ITEMS
                </h3>

                <div className="grid gap-3">

                  {order.products.map((product, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <span className="text-gray-800 font-medium">
                        {product.name}
                      </span>

                      <span className="text-gray-600 font-bold">
                        Qty: {product.quantity}
                      </span>
                    </div>
                  ))}

                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center gap-2">

                <div
                  className={`inline-flex items-center px-5 py-2 rounded-full text-base font-bold shadow ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() +
                    order.status.slice(1)}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}
export default OrderHistory;
