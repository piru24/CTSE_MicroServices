import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaUtensils, FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import { MdOutlineFastfood } from "react-icons/md";

axios.defaults.withCredentials = true;

const Profile = () => {
  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);

  const handleUpdate = (productId) => {
    navigate(`/updateProduct/${productId}`);
  };

  const handleViewOrders = () => {
    navigate("/viewOrders");
  };

  const navigate = useNavigate();

  const sendRequest = async () => {
    const res = await axios
      .get("http://food-app.127.0.0.1.nip.io/user/profile", {
        withCredentials: true,
      })
      .catch((err) => console.log(err));

    const data = await res.data;
    return data;
  };

  const sendProductRequest = async (sellerId) => {
    const res = await axios
      .get(`http://food-app.127.0.0.1.nip.io/products/${sellerId}/products`, {
        withCredentials: true,
      })
      .catch((err) => console.log(err));

    const data = await res.data;
    return data;
  };

  useEffect(() => {
    sendRequest().then((data) => {
      setUser(data.user);
      sendProductRequest(data.user._id).then((data) => setProducts(data));
    });
  }, []);

  const handleDeleteAcc = () => {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete your account?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal({
          title: "Your account is being deleted",
          icon: "info",
          buttons: false,
          timer: 2000,
        });

        axios.delete("http://food-app.127.0.0.1.nip.io/user/deleteUser").then(() => {
          swal({
            title: "Your account has been deleted",
            icon: "success",
            buttons: false,
            timer: 2000,
          }).then(() => {
            setTimeout(() => {
              window.location.href = "/login";
            }, 1500);
          });
        });
      } else {
        swal({
          title: "Your account is saved",
          buttons: false,
          timer: 2000,
        });
      }
    });
  };

  const handleDelete = (product_id) => {
    swal({
      title: "Are you sure?",
      text: "You want to delete this Product?",
      icon: "warning",
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        swal("Product is deleted", {
          icon: "success",
          buttons: false,
          timer: 2000,
        });

        axios.delete(
          `http://food-app.127.0.0.1.nip.io/products/deleteProduct/${product_id}`
        );

        const newProductlist = products.filter(
          (product) => product._id !== product_id
        );

        setProducts(newProductlist);
      } else {
        swal({
          text: "Your Products is saved!",
          buttons: false,
          timer: 2000,
        });
      }
    });
  };

  return (
    <div className=" bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 py-12 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-white/90 shadow-2xl rounded-3xl p-10 max-w-2xl mx-auto border border-green-100">
          <div className="flex items-center gap-6 mb-8">
            <div className="bg-gradient-to-tr from-green-400 to-green-700 rounded-full h-24 w-24 flex items-center justify-center shadow-lg border-4 border-white">
              {user.image ? (
                <img
                  src={user.image}
                  alt="profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-white text-5xl" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-green-800 mb-1 flex items-center gap-2">
                <MdOutlineFastfood className="text-yellow-400" /> Profile
              </h1>
              <p className="text-gray-500 text-lg">Welcome, <span className="font-semibold text-green-700">{user.name}</span></p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Mobile:</span> {user.mobile}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">Address:</span> {user.address}
              </p>
            </div>
            <div>
              <p className="text-gray-700 mb-3">
                <span className="font-semibold">Role:</span>
                <span className="ml-2 px-3 py-1 rounded-full bg-green-200 text-green-800 font-semibold text-sm capitalize shadow">
                  {user.role}
                </span>
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition flex items-center gap-2"
                  onClick={() => navigate(`/updateUser/${user._id}`)}
                >
                  <FaEdit /> Update Account
                </button>
                <button
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-green-900 px-4 py-2 rounded-full shadow hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 transition flex items-center gap-2"
                  onClick={() => navigate(`/updatePWD/${user._id}`)}
                >
                  <FaEdit /> Update Password
                </button>
                <button
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full shadow hover:scale-105 hover:from-red-600 hover:to-red-700 transition flex items-center gap-2"
                  onClick={handleDeleteAcc}
                >
                  <FaTrashAlt /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Seller's Products */}
        {/* {user.role === "seller" && (
          <div className="mt-16">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-800 flex items-center gap-2">
                <FaUtensils className="text-yellow-400" /> My Products
              </h2>
              <button
                className="bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-full shadow hover:scale-105 hover:from-green-600 hover:to-green-800 transition flex items-center gap-2"
                onClick={() => navigate("/addProduct")}
              >
                <FaPlus /> Add Product
              </button>
              <button
          className="btn btn-danger btn-small-width float-end"
          onClick={handleViewOrders}
        >
          View Orders
        </button>
            </div>
            {products.length > 0 ? (
              <div className="overflow-x-auto bg-white/90 shadow-xl rounded-2xl border border-green-100">
                <table className="min-w-full text-sm">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-green-800 uppercase">Name</th>
                      <th className="px-4 py-2 text-left font-semibold text-green-800 uppercase">Price</th>
                      <th className="px-4 py-2 text-left font-semibold text-green-800 uppercase">Shop </th>
                      <th className="px-4 py-2 text-left font-semibold text-green-800 uppercase">package</th>
                      <th className="px-4 py-2 text-left font-semibold text-green-800 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-100">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-green-50 transition">
                        <td className="px-4 py-2 text-gray-800">{product.name}</td>
                        <td className="px-4 py-2 text-gray-800">Rs. {product.price}</td>
                        <td className="px-4 py-2 text-gray-800">{product.description}</td>
                        <td className="px-4 py-2 text-gray-800">for-{product.weight}-person</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button
                              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full shadow hover:scale-110 hover:from-blue-600 hover:to-blue-700 transition flex items-center gap-1"
                               onClick={() => handleUpdate(product._id)}
                            >
                              <FaEdit /> Update
                            </button>
                            <button
                              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full shadow hover:scale-110 hover:from-red-600 hover:to-red-700 transition flex items-center gap-1"
                              onClick={() => handleDelete(product._id)}
                            >
                              <FaTrashAlt /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-600 mt-4">No products available.</p>
            )}
          </div>
        )} */}

        {/* Delivery Profile */}
        {user.role === "delivery" && (
          <div className="bg-green-50 p-6 rounded-2xl shadow-xl my-8 max-w-lg mx-auto border border-green-100">
            <h2 className="text-xl font-bold text-green-800 mb-3 text-center flex items-center gap-2">
              <MdOutlineFastfood className="text-yellow-400" /> My Delivery Profile
            </h2>
            <div className="bg-white rounded-xl shadow p-6">
              <p><strong>Delivery Person ID:</strong> <span className="text-gray-700">{user._id}</span></p>
              <p><strong>Name:</strong> <span className="text-gray-700">{user.name}</span></p>
              <p><strong>Contact Number:</strong> <span className="text-gray-700">{user.mobile}</span></p>
              <p><strong>Area:</strong> <span className="text-gray-700">{user.address}</span></p>
              <div className="text-center mt-4">
                <button
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition"
                  onClick={() => navigate("/deliveryDashboard")}
                >
                  View Assigned Deliveries
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
