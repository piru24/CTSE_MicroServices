import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdDeliveryDining, MdFastfood, MdPendingActions } from 'react-icons/md';
import { FaUser, FaRupeeSign } from 'react-icons/fa';

axios.defaults.withCredentials = true;

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get(`https://order-service.agreeablestone-66d4ad90.southeastasia.azurecontainerapps.io/order/dispatchedOrders`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching dispatched orders", err);
      }
    };
    getOrders();
  }, []);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await axios.get('https://auth-service.agreeablestone-66d4ad90.southeastasia.azurecontainerapps.io/user/profile');
        setUser(userRes.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleAction = async (orderId, action) => {
    if (action === 'accept') {
      try {
        const selectedOrder = orders.find(order => order._id === orderId);
        if (!selectedOrder) throw new Error("Order not found");
        
        navigate('/test1', { 
          state: { 
            orderDetails: selectedOrder,
            cusid: selectedOrder.userId // Changed to cusid to match your Test1 component
          } 
        });
      } catch (err) {
        console.error(err);
        alert("Error accepting order.");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
    </div>
  );

 return (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-8">
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">

            <div className="p-3 bg-[#f7941d] rounded-full text-white">
              <MdDeliveryDining className="text-3xl" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Delivery Dashboard
            </h1>

          </div>

          {user && (
            <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full">
              <FaUser className="text-gray-600" />
              <span className="text-gray-800 font-semibold">
                {user.name} ({user.role})
              </span>
            </div>
          )}
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order._id}
                className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-200"
              >

                <div className="grid md:grid-cols-5 gap-6 items-center">

                  {/* Customer ID */}
                  <div className="flex items-center gap-2">
                    <MdFastfood className="text-[#f7941d]" />

                    <span className="font-mono text-gray-800">
                      {order.userId.slice(-8).toUpperCase()}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-2">
                    LKR
                    <span className="text-gray-900 font-bold">
                      {order.amount?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "dispatched"
                          ? "bg-yellow-100 text-yellow-700"
                          : order.status === "On the way"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Products */}
                  <div className="md:col-span-2">

                    <div className="grid grid-cols-2 gap-2">

                      {order.products?.map((product, pIndex) => (

                        <div
                          key={pIndex}
                          className="bg-white p-3 rounded-lg border border-gray-200"
                        >

                          <div className="flex justify-between items-center">

                            <span className="text-sm font-medium text-gray-800">
                              {product.name}
                            </span>

                            <span className="text-gray-600 text-sm">
                              Qty: {product.quantity}
                            </span>

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end">

                    <button
                      onClick={() => handleAction(order._id, "accept")}
                      className="bg-[#f7941d] text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-[#ea7a00] transition-all flex items-center gap-2"
                    >
                      <MdPendingActions className="text-xl" />
                      Accept Delivery
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        ) : (

          <div className="text-center bg-gray-50 rounded-xl p-12 shadow-sm border border-gray-200">

            <div className="text-[#f7941d] text-6xl mb-4 flex justify-center">
              <MdDeliveryDining />
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders available for delivery
            </h3>

            <p className="text-gray-500">
              New dispatched orders will appear here automatically
            </p>

          </div>

        )}
      </div>
    </div>
  </div>
);
}
export default DeliveryDashboard;