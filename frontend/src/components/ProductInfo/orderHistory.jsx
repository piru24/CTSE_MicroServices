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
        const res = await axios.get('http://food-app.127.0.0.1.nip.io/order/orderhistory', { 
          withCredentials: true 
        });
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error fetching order history:', err);
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
    <div className="min-h-screen bg-gradient-to-r from-gray-500 via-gray-400 to-green-300 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-green-300 mb-10 flex items-center gap-3">
          <FiPackage className="text-green-300" />
          Order History
        </h1>

        {orders.length === 0 ? (
          <div className="text-center bg-white/90 p-10 rounded-3xl shadow-xl border border-green-100">
            <MdOutlineDeliveryDining className="text-7xl text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-green-800">No orders found</h2>
            <p className="text-green-600 mt-2">Your upcoming orders will appear here</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div 
                key={order._id}
                className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-green-100 p-8 hover:shadow-2xl transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center text-green-700 mb-2">
                      {getStatusIcon(order.status)}
                      <span className="font-bold text-lg">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <FiClock className="mr-2" />
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 px-5 py-2 rounded-full shadow text-lg">
                      <span className="text-green-800 font-bold">
                        ₹{order.amount}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/notify/${order._id}`)}
                      className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-full flex items-center gap-2 hover:from-green-600 hover:to-green-800 transition-colors font-semibold shadow"
                    >
                      <FiInfo className="mr-2" />
                      Details
                    </button>
                  </div>
                </div>

                <div className="border-t border-green-100 pt-4">
                  <h3 className="text-sm font-semibold text-green-700 mb-3">ITEMS</h3>
                  <div className="grid gap-3">
                    {order.products.map((product, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between bg-green-50 p-3 rounded-lg"
                      >
                        <span className="text-green-800 font-medium">
                          {product.name}
                        </span>
                        <span className="text-green-600 font-bold">
                          Qty: {product.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-green-100 flex items-center gap-2">
                  <div className={`inline-flex items-center px-5 py-2 rounded-full text-base font-bold shadow ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
