import React, { useState } from "react";
import { MdPendingActions, MdOutlineDeliveryDining, MdDoneAll, MdCancel } from "react-icons/md";
import { GiCookingPot } from "react-icons/gi";

const UpdateStatus = () => {
  const [status, setStatus] = useState("pending"); // Example status

  const statusConfig = {
    pending: {
      class: "bg-orange-100 text-orange-800",
      icon: <MdPendingActions className="text-xl mr-2" />,
      label: "Order Received"
    },
    "in-progress": {
      class: "bg-blue-100 text-blue-800",
      icon: <GiCookingPot className="text-xl mr-2" />,
      label: "Preparing Order"
    },
    completed: {
      class: "bg-green-100 text-green-800",
      icon: <MdDoneAll className="text-xl mr-2" />,
      label: "Delivered"
    },
    cancelled: {
      class: "bg-red-100 text-red-800",
      icon: <MdCancel className="text-xl mr-2" />,
      label: "Cancelled"
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-green-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-green-100 w-16 h-16 rounded-full mb-4">
              <MdOutlineDeliveryDining className="text-3xl text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Order Status Update</h1>
            <p className="text-gray-600">Manage the order preparation and delivery status</p>
          </div>

          {/* Current Status */}
          <div className="bg-green-50 rounded-xl p-4 text-center mb-8 shadow-sm">
            <p className="text-sm text-green-600 mb-1">Current Status</p>
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${statusConfig[status].class}`}>
              {statusConfig[status].icon}
              <span className="font-semibold">{statusConfig[status].label}</span>
            </div>
          </div>

          {/* Status Controls */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleStatusChange("pending")}
              className={`p-4 rounded-xl transition-all flex items-center justify-center ${
                status === "pending" 
                  ? "border-2 border-orange-300 bg-orange-50 shadow-lg" 
                  : "bg-white border border-gray-200 hover:border-orange-200"
              }`}
            >
              <div className="text-center">
                <MdPendingActions className={`text-3xl mx-auto ${status === "pending" ? "text-orange-600" : "text-gray-400"}`} />
                <span className={`block mt-2 text-sm font-medium ${
                  status === "pending" ? "text-orange-700" : "text-gray-600"
                }`}>
                  Order Received
                </span>
              </div>
            </button>

            <button
              onClick={() => handleStatusChange("in-progress")}
              className={`p-4 rounded-xl transition-all flex items-center justify-center ${
                status === "in-progress" 
                  ? "border-2 border-blue-300 bg-blue-50 shadow-lg" 
                  : "bg-white border border-gray-200 hover:border-blue-200"
              }`}
            >
              <div className="text-center">
                <GiCookingPot className={`text-3xl mx-auto ${status === "in-progress" ? "text-blue-600" : "text-gray-400"}`} />
                <span className={`block mt-2 text-sm font-medium ${
                  status === "in-progress" ? "text-blue-700" : "text-gray-600"
                }`}>
                  Preparing
                </span>
              </div>
            </button>

            <button
              onClick={() => handleStatusChange("completed")}
              className={`p-4 rounded-xl transition-all flex items-center justify-center ${
                status === "completed" 
                  ? "border-2 border-green-300 bg-green-50 shadow-lg" 
                  : "bg-white border border-gray-200 hover:border-green-200"
              }`}
            >
              <div className="text-center">
                <MdDoneAll className={`text-3xl mx-auto ${status === "completed" ? "text-green-600" : "text-gray-400"}`} />
                <span className={`block mt-2 text-sm font-medium ${
                  status === "completed" ? "text-green-700" : "text-gray-600"
                }`}>
                  Delivered
                </span>
              </div>
            </button>

            <button
              onClick={() => handleStatusChange("cancelled")}
              className={`p-4 rounded-xl transition-all flex items-center justify-center ${
                status === "cancelled" 
                  ? "border-2 border-red-300 bg-red-50 shadow-lg" 
                  : "bg-white border border-gray-200 hover:border-red-200"
              }`}
            >
              <div className="text-center">
                <MdCancel className={`text-3xl mx-auto ${status === "cancelled" ? "text-red-600" : "text-gray-400"}`} />
                <span className={`block mt-2 text-sm font-medium ${
                  status === "cancelled" ? "text-red-700" : "text-gray-600"
                }`}>
                  Cancelled
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;
