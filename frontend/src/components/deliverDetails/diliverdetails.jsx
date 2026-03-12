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
    if (!orderDetails?._id) return;
    

    try {
      const response = await axios.put(
        `http://localhost:8020/order/updateOrder/${orderDetails._id}`,
        { status: 'on the way' }
      );
      
      setStatus(response.data.status);
      alert('Delivery started! Customer has been notified.');
      
      // You can add additional logic here to notify the customer
    } catch (error) {
      console.error('Error starting delivery:', error);
      alert('Failed to start delivery');
    } finally {
    
    }
  };

  const handleDoorDelivery = async () => {
    if (!orderDetails?._id) return;
    

    try {
      const response = await axios.put(
        `http://localhost:8020/order/updateOrder/${orderDetails._id}`,
        { status: 'arrived' }
      );
      
      setStatus(response.data.status);
      alert('Delivery arrived! Customer has been notified.');
      
      // You can add additional logic here to notify the customer
    } catch (error) {
      console.error('Error ending delivery:', error);
      alert('Failed to end delivery');
    } finally {
    
    }
  };

  const handleEndDelivery = async () => {
    if (!orderDetails?._id) return;
    

    try {
      const response = await axios.put(
        `http://localhost:8020/order/updateOrder/${orderDetails._id}`,
        { status: 'completed' }
      );
      
      setStatus(response.data.status);
      alert('Delivery completed! Customer has been notified.');
      
      // You can add additional logic here to notify the customer
    } catch (error) {
      console.error('Error ending delivery:', error);
      alert('Failed to end delivery');
    } finally {
    
    }
  };


  useEffect(() => {
    axios.get(`http://localhost:8090/user/${cusid}`)
      .then(response => setUser(response.data.user))
      .catch(error => console.error('Error fetching user details:', error));
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-green-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-green-500 rounded-full text-white">
              <MdDeliveryDining className="text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-green-800">Order Delivery Details</h2>
          </div>

          {/* Order Card */}
          <div className="bg-green-50 rounded-xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-green-800 flex items-center gap-2">
                <MdFastfood className="text-green-500" />
                Order #{orderDetails._id.slice(-6).toUpperCase()}
              </h3>
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusColors[status.toLowerCase()]}`}>
                {status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Order Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaRupeeSign className="text-green-500" />
                  <p className="text-gray-700"><span className="font-semibold">Amount:</span> LKR {orderDetails.amount}</p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <MdOutlineTimer className="text-green-500" />
                    Products
                  </h4>
                  <ul className="space-y-2">
                    {orderDetails.products.map((product, index) => (
                      <li key={index} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                        <span className="text-gray-700">{product.name}</span>
                        <span className="text-green-600 font-medium">Qty: {product.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaUser className="text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-gray-600">{user.mobile}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800">Delivery Address</h4>
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
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MdDeliveryDining className="text-xl" />
              Start Delivery
            </button>

            <button 
              onClick={handleDoorDelivery}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MdCheckCircle className="text-xl" />
              Mark as Arrived
            </button>

            <button 
              onClick={handleEndDelivery}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
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