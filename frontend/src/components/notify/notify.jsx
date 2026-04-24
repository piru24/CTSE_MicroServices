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
  Divider,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://order-service.agreeablestone-66d4ad90.southeastasia.azurecontainerapps.io/order/getOrder/${orderId}`,
          { withCredentials: true }
        );
        if (res.data) {
          setOrder(res.data);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('Order ID is missing');
      setLoading(false);
    }
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
    if (!order) return 0;
    const index = statusSteps.findIndex(step => step.value === order.status);
    return index >= 0 ? index : 0;
  };

  const getProgressValue = () => {
    const activeStep = getActiveStep();
    return (activeStep / (statusSteps.length - 1)) * 100;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} thickness={5} color="success" />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={3} sx={{ padding: 3, margin: 3, textAlign: 'center', background: '#fff8f0' }}>
        <Typography color="error" fontWeight="bold">{error}</Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ marginTop: 3, background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' }}
        >
          Back to Orders
        </Button>
      </Paper>
    );
  }

  if (!order) {
    return (
      <Paper elevation={3} sx={{ padding: 3, margin: 3, textAlign: 'center' }}>
        <Typography>No order details available</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/order-history')}
          sx={{ marginTop: 3 }}
        >
          Back to Order History
        </Button>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        margin: { xs: 1, md: 3 },
        padding: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg,rgb(141, 206, 84) 0%,rgb(29, 107, 55) 100%)',
        borderRadius: 4,
        boxShadow: 6,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#43e97b', display: 'flex', alignItems: 'center', gap: 1 }}>
          <RestaurantMenuIcon fontSize="large" sx={{ color: '#43e97b' }} />
          Order Tracking
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{
            borderColor: '#43e97b',
            color: '#256029',
            fontWeight: 'bold',
            '&:hover': { borderColor: '#43e97b', background: '#e6ffe6' }
          }}
        >
          Back
        </Button>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ width: '100%', mb: 4 }}>
        <LinearProgress
          variant="determinate"
          value={getProgressValue()}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: '#e0f7fa',
            '& .MuiLinearProgress-bar': {
              borderRadius: 6,
              background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          {statusSteps.map((step, index) => (
            <Box
              key={step.label}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: `${100 / statusSteps.length}%`
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: index <= getActiveStep() ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: index <= getActiveStep() ? 'white' : 'grey.400',
                  mb: 1,
                  boxShadow: index === getActiveStep() ? 4 : 1,
                }}
              >
                {React.cloneElement(step.icon, { fontSize: 'small' })}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  textAlign: 'center',
                  fontWeight: index === getActiveStep() ? 'bold' : 'normal',
                  color: index <= getActiveStep() ? '#256029' : 'text.secondary'
                }}
              >
                {step.label}
              </Typography>
              {index === getActiveStep() && (
                <Chip
                  label="Current"
                  color="success"
                  size="small"
                  sx={{ mt: 0.5, fontWeight: 'bold' }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Order Summary */}
      <Box sx={{ mb: 4, p: 2, backgroundColor: '#f9fbe7', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#388e3c' }}>Order ID:</Typography>
            <Typography>{order._id}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#388e3c' }}>Order Date:</Typography>
            <Typography>{new Date(order.createdAt).toLocaleString()}</Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#388e3c' }}>Status:</Typography>
            <Typography
              sx={{
                color: order.status === 'delivered' ? 'success.main' :
                  order.status === 'cancelled' ? 'error.main' : 'warning.main',
                fontWeight: 'bold'
              }}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#388e3c' }}>Total Amount:</Typography>
            <Typography>₹{order.amount.toFixed(2)}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Products Table */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#256029' }}>Order Items</Typography>
      <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2, background: '#f8fff6' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#e0f2f1' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#388e3c' }}>Product</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold', color: '#388e3c' }}>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status-specific Information */}
      {order.status !== 'cancelled' && order.status !== 'delivered' && (
        <Box sx={{
          mt: 4,
          p: 3,
          backgroundColor: '#e3f2fd',
          borderRadius: 2,
          borderLeft: '4px solid #1976d2'
        }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#1976d2' }}>
            Order Status Update
          </Typography>
          <Typography>
            {order.status === 'pending' && 'Your order has been received and is being prepared for processing.'}
            {order.status === 'processing' && 'We are currently processing your order and preparing it for delivery.'}
            {order.status === 'dispatched' && 'Your order has been dispatched and is on its way to you!'}
            {order.status === 'on the way' && 'Your order is on its way to you!'}
            {order.status === 'arrived' && 'Driver reached. Pickup your order!'}
            {order.status === 'completed' && 'Your order has been delivered. Thank you!'}
          </Typography>
        </Box>
      )}

      {order.status === 'delivered' && (
        <Box sx={{
          mt: 4,
          p: 3,
          backgroundColor: '#e8f5e9',
          borderRadius: 2,
          borderLeft: '4px solid #4caf50'
        }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#388e3c' }}>
            Delivery Successful
          </Typography>
          <Typography>
            Your order was successfully delivered on {new Date(order.updatedAt).toLocaleDateString()}.
          </Typography>
        </Box>
      )}

      {order.status === 'cancelled' && (
        <Box sx={{
          mt: 4,
          p: 3,
          backgroundColor: '#ffebee',
          borderRadius: 2,
          borderLeft: '4px solid #f44336'
        }}>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', color: '#d32f2f' }}>
            Order Cancelled
          </Typography>
          <Typography>
            This order was cancelled on {new Date(order.updatedAt).toLocaleDateString()}.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Notify;
