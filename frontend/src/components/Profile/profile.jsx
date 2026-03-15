import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaTrashAlt, FaEdit } from "react-icons/fa";
import { MdOutlineFastfood } from "react-icons/md";

axios.defaults.withCredentials = true;

const Profile = () => {

  const [user, setUser] = useState({});
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  // ---------------------------
  // GET USER PROFILE
  // ---------------------------
  const sendRequest = async () => {
    try {

      const res = await axios.get(
        "http://localhost:8090/user/profile",
        { withCredentials: true }
      );

      return res.data;

    } catch (err) {

      console.log("Profile fetch error:", err);
      return null;

    }
  };

  // ---------------------------
  // GET SELLER PRODUCTS
  // ---------------------------
  const sendProductRequest = async (sellerId) => {

    try {

      const res = await axios.get(
        `http://localhost:8070/products/${sellerId}/products`,
        { withCredentials: true }
      );

      return res.data;

    } catch (err) {

      console.log("Product fetch error:", err);
      return [];

    }
  };

  // ---------------------------
  // INITIAL LOAD
  // ---------------------------
  useEffect(() => {

    const fetchData = async () => {

      const data = await sendRequest();

      if (!data || !data.user) return;

      setUser(data.user);

      const productData = await sendProductRequest(data.user._id);

      setProducts(productData);

    };

    fetchData();

  }, []);

  // ---------------------------
  // DELETE ACCOUNT
  // ---------------------------
  const handleDeleteAcc = () => {

    swal({
      title: "Are you sure?",
      text: "Do you want to delete your account?",
      icon: "warning",
      dangerMode: true,
    }).then(async (willDelete) => {

      if (willDelete) {

        swal({
          title: "Deleting account...",
          icon: "info",
          buttons: false,
          timer: 1500,
        });

        try {

          await axios.delete(
            "http://localhost:8090/user/deleteUser",
            { withCredentials: true }
          );

          swal({
            title: "Account deleted successfully",
            icon: "success",
            buttons: false,
            timer: 2000,
          }).then(() => {

            window.location.href = "/login";

          });

        } catch (err) {

          console.log(err);
          swal("Error deleting account");

        }
      }
    });
  };

  // ---------------------------
  // DELETE PRODUCT
  // ---------------------------
  const handleDelete = async (product_id) => {

    const willDelete = await swal({
      title: "Are you sure?",
      text: "You want to delete this product?",
      icon: "warning",
      dangerMode: true,
    });

    if (!willDelete) return;

    try {

      await axios.delete(
        `http://localhost:8070/products/deleteProduct/${product_id}`
      );

      swal({
        title: "Product deleted",
        icon: "success",
        buttons: false,
        timer: 2000,
      });

      const newList = products.filter(
        (product) => product._id !== product_id
      );

      setProducts(newList);

    } catch (err) {

      console.log(err);
      swal("Error deleting product");

    }
  };

  // ---------------------------
  // UPDATE PRODUCT
  // ---------------------------
  const handleUpdate = (productId) => {

    navigate(`/updateProduct/${productId}`);

  };

  // ---------------------------
  // PROFILE UI
  // ---------------------------
  return (
    <div className="bg-gradient-to-br from-gray-500 via-gray-400 to-green-700 py-12 relative">

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

              <p className="text-gray-500 text-lg">
                Welcome,
                <span className="font-semibold text-green-700">
                  {" "}
                  {user.name}
                </span>
              </p>

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
                  className="bg-blue-600 text-white px-4 py-2 rounded-full"
                  onClick={() => navigate(`/updateUser/${user._id}`)}
                >
                  <FaEdit /> Update Account
                </button>

                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-full"
                  onClick={() => navigate(`/updatePWD/${user._id}`)}
                >
                  <FaEdit /> Update Password
                </button>

                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-full"
                  onClick={handleDeleteAcc}
                >
                  <FaTrashAlt /> Delete Account
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* DELIVERY PROFILE */}

        {user.role === "delivery" && (

          <div className="bg-green-50 p-6 rounded-2xl shadow-xl my-8 max-w-lg mx-auto border border-green-100">

            <h2 className="text-xl font-bold text-green-800 mb-3 text-center flex items-center gap-2">
              <MdOutlineFastfood className="text-yellow-400" />
              My Delivery Profile
            </h2>

            <div className="bg-white rounded-xl shadow p-6">

              <p>
                <strong>ID:</strong> {user._id}
              </p>

              <p>
                <strong>Name:</strong> {user.name}
              </p>

              <p>
                <strong>Contact:</strong> {user.mobile}
              </p>

              <p>
                <strong>Area:</strong> {user.address}
              </p>

              <div className="text-center mt-4">

                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-full"
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