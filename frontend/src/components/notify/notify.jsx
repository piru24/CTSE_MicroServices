import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  LinearProgress,
  Chip,
} from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

const Notify = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState(null); // 🔥 added
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);

        // ✅ ORDER
        const res = await axios.get(
          `http://localhost:8020/order/getOrder/${orderId}`,
          { withCredentials: true }
        );

        // ✅ DELIVERY
        const deliveryRes = await axios.get(
          `http://localhost:8300/delivery`
        );

        const delivery = deliveryRes.data.find(
          d => d.orderId === orderId
        );

        if (res.data) {
          setOrder(res.data);
          setDeliveryStatus(delivery?.status || res.data.status); // 🔥 FIX
        } else {
          setError('Order not found');
        }

      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const statusSteps = [
    { label: 'Order Placed', value: 'pending', icon: <PaymentIcon /> },
    { label: 'Processing', value: 'processing', icon: <HourglassTopIcon /> },
    { label: 'Dispatched', value: 'dispatched', icon: <LocalShippingIcon /> },
    { label: 'On the Way', value: 'on the way', icon: <AssignmentTurnedInIcon /> },
    { label: 'Arrived', value: 'arrived', icon: <CheckCircleIcon /> },
    { label: 'Completed', value: 'completed', icon: <CheckCircleIcon /> }
  ];

  const getActiveStep = () => {
    if (!deliveryStatus) return 0;
    const index = statusSteps.findIndex(step => step.value === deliveryStatus);
    return index >= 0 ? index : 0;
  };

  const getProgressValue = () => {
    return (getActiveStep() / (statusSteps.length - 1)) * 100;
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress size={60} color="success" />
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Typography color="error">{error}</Typography>
          <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-8">
      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#f7941d] rounded-full text-white">
                <RestaurantMenuIcon />
              </div>

              <h1 className="text-3xl font-bold text-gray-900">
                Order Tracking
              </h1>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="bg-gray-100 px-4 py-2 rounded-full font-semibold text-gray-700 hover:bg-gray-200"
            >
              Back
            </button>
          </div>

          {/* PROGRESS BAR */}
          <LinearProgress
            variant="determinate"
            value={getProgressValue()}
            sx={{ height: 10, borderRadius: 5, mb: 4 }}
          />

          {/* STEPS */}
          <div className="flex justify-between mb-8">
            {statusSteps.map((step, i) => (
              <div key={i} className="text-center">

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i <= getActiveStep()
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {step.icon}
                </div>

                <p className="text-sm mt-2">{step.label}</p>

                {i === getActiveStep() && (
                  <span className="text-xs bg-green-100 px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="grid md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-xl">

            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold">{order._id}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-bold text-orange-600">
                {deliveryStatus?.charAt(0).toUpperCase() + deliveryStatus?.slice(1)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-semibold">₹{order.amount}</p>
            </div>

          </div>

          {/* PRODUCTS */}
          <h3 className="font-bold mb-3">Order Items</h3>

          <div className="space-y-2">
            {order.products?.map((p, i) => (
              <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                <span>{p.name}</span>
                <span>Qty: {p.quantity}</span>
              </div>
            ))}
          </div>

          {/* STATUS MESSAGE */}
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">

            {deliveryStatus === 'dispatched' && "Your order has been dispatched 🚚"}
            {deliveryStatus === 'on the way' && "Driver is on the way 🚚"}
            {deliveryStatus === 'arrived' && "Driver has arrived 📍"}
            {deliveryStatus === 'completed' && "Delivered successfully ✅"}

          </div>

        </div>
      </div>
    </div>
  );
};

export default Notify;