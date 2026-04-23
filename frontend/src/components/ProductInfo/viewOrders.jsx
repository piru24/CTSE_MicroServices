import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdRestaurant, MdDeliveryDining, MdOutlineTimer } from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ORDER_API = process.env.REACT_APP_ORDER_API || "http://localhost:8020/order";

const statusOptions = [
  { value: "pending", label: "Pending", className: "bg-yellow-100 text-yellow-800" },
  { value: "confirmed", label: "Confirmed", className: "bg-blue-100 text-blue-800" },
  { value: "dispatched", label: "Dispatched", className: "bg-purple-100 text-purple-800" },
  { value: "delivered", label: "Delivered", className: "bg-green-100 text-green-800" }
];

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders
  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get(`${ORDER_API}/getOrders`);
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    getOrders();
  }, []);

  // Update order status
  const handleUpdateState = async (orderId, newState) => {
    try {
      const res = await axios.put(
        `${ORDER_API}/updateOrder/${orderId}`,
        { status: newState }
      );
      const updatedOrder = res.data;
      setOrders((prevOrders) => {
        const newOrders = [...prevOrders];
        const index = newOrders.findIndex((order) => order._id === updatedOrder._id);
        newOrders[index] = updatedOrder;
        return newOrders;
      });
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 py-12">
    <div className="container mx-auto px-4">

      <div className="flex items-center justify-center gap-3 mb-10">
        <div className="bg-[#f7941d] p-3 rounded-full text-white shadow-lg">
          <MdRestaurant className="text-4xl" />
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900">
          Manage Orders
        </h1>
      </div>

      {orders.length === 0 ? (

        <div className="text-center bg-white rounded-2xl p-12 shadow-sm border border-gray-200">

          <MdOutlineTimer className="text-6xl text-[#f7941d] mx-auto mb-4" />

          <h3 className="text-xl font-semibold text-gray-900">
            No orders waiting
          </h3>

          <p className="text-gray-500 mt-2">
            New orders will appear here automatically
          </p>

        </div>

      ) : (

        <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200">

          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-100 font-semibold text-gray-800 text-sm uppercase tracking-wide">

            <div className="col-span-1">#</div>
            <div className="col-span-2">User ID</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Products</div>
            <div className="col-span-2 text-center">Actions</div>

          </div>

          {/* Table rows */}
          {orders.map((order, key) => (

            <div
              key={key}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-gray-100 hover:bg-gray-50 transition"
            >

              {/* Index */}
              <div className="col-span-1 text-gray-700 font-bold">
                {key + 1}
              </div>

              {/* User ID */}
              <div className="col-span-2 font-mono text-gray-700">
                {order.userId.slice(-8).toUpperCase()}
              </div>

              {/* Amount */}
              <div className="col-span-2 flex items-center gap-1 text-gray-900 font-bold">
                LKR {order.amount}
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium text-xs ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "confirmed"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "dispatched"
                      ? "bg-purple-100 text-purple-700"
                      : order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status === "delivered" ? (
                    <CheckCircleIcon fontSize="small" />
                  ) : null}

                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Products */}
              <div className="col-span-3">

                <div className="flex flex-wrap gap-2">

                  {order.products.map((product, pkey) => (

                    <span
                      key={pkey}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded-lg text-xs font-medium"
                    >
                      {product.name}{" "}
                      <span className="text-gray-600">x{product.quantity}</span>
                    </span>

                  ))}

                </div>

              </div>

              {/* Actions - Dropdown */}
              <div className="col-span-2 flex justify-center">

                <select
                  value={order.status}
                  onChange={(e) =>
                    handleUpdateState(order._id, e.target.value)
                  }
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-[#f7941d] transition"
                >

                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}

                </select>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  </div>
);
}

export default ViewOrders;
