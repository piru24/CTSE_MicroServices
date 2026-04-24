import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdAdd, MdEdit, MdDelete, MdFastfood } from "react-icons/md";
import Swal from "sweetalert2";
import ProductForm from "./ProductForm";
import { Link } from "react-router-dom";
import Loader from "../Loader";

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sellerInfo, setSellerInfo] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const sellerRes = await axios.get(
          "http://localhost:5000/user/profile",
          { withCredentials: true }
        );

        setSellerInfo(sellerRes.data.user);
        setIsAvailable(sellerRes.data.user.isAvailable);

        const productsRes = await axios.get(
          `http://localhost:8072/products/${sellerRes.data.user._id}/products`,
          { withCredentials: true }
        );

        setProducts(productsRes.data);
      } catch (error) {
        Swal.fire("Error", "Failed to load data", "error");
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const toggleAvailability = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/user/seller/availability",
        {
          isAvailable: !isAvailable,
        },
        {
          withCredentials: true,
        }
      );

      setIsAvailable(res.data.isAvailable);

      Swal.fire(
        "Success",
        res.data.isAvailable ? "Shop is now OPEN" : "Shop is now CLOSED",
        "success"
      );
    } catch (error) {
      Swal.fire("Error", "Failed to update availability", "error");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProducts({ ...products, image: reader.result });
    };

    reader.readAsDataURL(file);
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:8072/products/deleteProduct/${productId}`,
        { withCredentials: true }
      );

      setProducts(products.filter((p) => p._id !== productId));

      Swal.fire("Deleted!", "Product removed successfully", "success");
    } catch (error) {
      Swal.fire("Error", "Deletion failed", "error");
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const productData = {
        ...formData,
        sellerId: sellerInfo._id,
        sellerName: sellerInfo.name,
      };

      if (editingProduct) {
        const res = await axios.put(
          `http://localhost:8072/products/updateProduct/${editingProduct._id}`,
          productData,
          { withCredentials: true }
        );

        setProducts(
          products.map((p) => (p._id === res.data._id ? res.data : p))
        );
      } else {
        const res = await axios.post(
          "http://localhost:8072/products/addProduct",
          productData,
          { withCredentials: true }
        );

        setProducts([...products, res.data]);
      }

      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Operation failed",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-gray-400 to-green-700">
      <div className="container mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-green-500 p-3 rounded-full text-white shadow-lg">
              <MdFastfood className="text-3xl" />
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-green-800">
                {sellerInfo.name}'s Products
              </h1>

              {/* Availability Status */}
              <span
                className={`text-sm font-semibold ${
                  isAvailable ? "text-green-600" : "text-red-600"
                }`}
              >
                {isAvailable ? "Shop Open" : "Shop Closed"}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            {/* Availability Toggle */}
            <button
              onClick={toggleAvailability}
              className={`px-5 py-2 rounded-full font-bold shadow transition ${
                isAvailable
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              }`}
            >
              {isAvailable ? "Close Shop" : "Open Shop"}
            </button>

            <Link to="/addProduct">
              <button className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full font-bold shadow hover:from-green-600 hover:to-green-800 transition flex items-center gap-2">
                <MdAdd className="text-xl" /> Add Product
              </button>
            </Link>
          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="text-center bg-white/90 rounded-2xl p-12 shadow-sm mt-6">
            <MdFastfood className="text-6xl text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-800">
              No products found
            </h3>
            <p className="text-green-600 mt-2">
              Start by adding your first product
            </p>
          </div>
        ) : (
          <div className="bg-white/90 rounded-2xl shadow-xl border border-green-100 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-green-100 font-semibold text-green-800 text-sm uppercase">
              <div className="col-span-2">Product</div>
              <div className="col-span-1">Price</div>
              <div className="col-span-2">Package</div>
              <div className="col-span-2">Uploaded Date</div>
              <div className="col-span-2">Shop</div>
              <div className="col-span-2 text-center">Actions</div>
            </div>

            {products.map((product) => (
              <div
                key={product._id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-green-50 hover:bg-green-50 transition"
              >
                <div className="col-span-2 flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <span className="font-semibold text-green-800">
                    {product.name}
                  </span>
                </div>

                <div className="col-span-1 flex items-center gap-1">
                  LKR <span className="font-bold">{product.price}</span>
                </div>

                <div className="text-green-700 col-span-2">
                  for-{product.weight}-person
                </div>

                <div className="col-span-2 text-gray-600 text-sm">
                  {product.upload_date
                    ? new Date(product.upload_date).toLocaleDateString()
                    : ""}
                </div>

                <div className="col-span-2 text-gray-600 text-sm">
                  {product.description}
                </div>

                <div className="col-span-2 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                    className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-yellow-200 text-sm"
                  >
                    <MdEdit /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product._id)}
                    className="bg-red-100 text-red-800 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-200 text-sm"
                  >
                    <MdDelete /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCT FORM */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full">
              <ProductForm
                initialData={editingProduct}
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                onImageUpload={handleImageUpload}
                isUploading={isUploading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;