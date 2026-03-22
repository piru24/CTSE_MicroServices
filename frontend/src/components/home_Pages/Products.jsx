import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSearch, FiInfo, FiStar, FiHeart } from "react-icons/fi";
import { MdAddShoppingCart } from "react-icons/md";
import { useSelector } from "react-redux";

axios.defaults.withCredentials = true;

const Products = () => {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { isLoggedIn, token } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {

    const getProducts = async () => {

      try {

    const storedToken = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8070/products/getProducts",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        }
      );

        const backendProducts = res.data.map((p) => ({
          ...p,
          sellerAvailable:
            p.sellerAvailable !== undefined ? p.sellerAvailable : true
        }));

        setProducts(backendProducts);

      } catch (err) {

        console.log(err);
        setProducts([]);

      }
    };

    if (isLoggedIn) {
      getProducts();
    }

  }, [isLoggedIn]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">

      <div className="container mx-auto px-4 py-10">

        <h1 className="text-4xl font-extrabold text-center text-[#f7941d] mb-10 tracking-tight drop-shadow">
          Explore Our Products
        </h1>

        {/* Search */}

        <div className="flex justify-center mb-12">

          <div className="relative w-full max-w-lg items-center">

            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-lg"
            />

            <FiSearch className="absolute left-4 top-3 text-[#f7941d] text-2xl mt-1" />

          </div>

        </div>

        {/* Products */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

          {filteredProducts.map((product, key) => (

            <div
              key={key}
              className={`relative group bg-white shadow-2xl rounded-3xl overflow-hidden border border-green-100 transition-all duration-300 ${
                !product.sellerAvailable
                  ? "opacity-60"
                  : "hover:shadow-green-300"
              }`}
            >

              {/* Category + Favorite */}

              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">

                <span className="bg-yellow-400 text-green-900 text-xs font-bold px-3 py-1 rounded-full shadow">
                  {product.category}
                </span>

                <button className="bg-white/80 rounded-full p-2 shadow hover:bg-red-100 transition">
                  <FiHeart className="text-red-400" />
                </button>

              </div>

              {/* Image */}

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="p-6 flex flex-col h-full">

                <div className="flex items-center justify-between mb-3">

                  <h2 className="text-xl font-bold text-green-900 truncate">
                    {product.name}
                  </h2>

                  <span className="ml-2 text-yellow-400 flex items-center font-bold">
                    <FiStar className="mr-1" />
                    {product.avgRating ? product.avgRating.toFixed(1) : "4.5"}
                  </span>

                </div>

                {/* Seller + Availability */}

                <p className="text-gray-500 text-sm mb-4">

                  <span className="font-semibold text-green-700">
                    Seller:
                  </span>{" "}
                  {product.sellerName}

                  <br />

                  <span
                    className={`font-semibold ${
                      product.sellerAvailable
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {product.sellerAvailable ? "In Stock" : "Out of Stock"}
                  </span>

                </p>

                <div className="flex-1"></div>

                {/* Buttons */}

                <div className="flex justify-between items-center mt-2">

                  <button
                    disabled={!product.sellerAvailable}
                    className={`flex items-center px-4 py-2 rounded-full font-semibold shadow transition ${
                      product.sellerAvailable
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                    onClick={() =>
                      navigate(`/getProduct/${product._id}`)
                    }
                  >
                    <FiInfo className="mr-2" /> Info
                  </button>

                  <button
                    className="flex items-center bg-yellow-400 text-green-900 px-4 py-2 rounded-full font-bold shadow hover:bg-yellow-500 transition"
                    onClick={() =>
                      navigate(`/rateBuyer/${product._id}`)
                    }
                  >
                    <FiStar className="mr-2" /> Rate
                  </button>

                </div>

                {/* Add to Cart */}

                <button
                  disabled={!product.sellerAvailable}
                  className={`absolute bottom-4 right-4 p-3 rounded-full shadow-lg transition transform ${
                    product.sellerAvailable
                      ? "bg-gradient-to-tr from-green-500 to-green-700 hover:scale-110"
                      : "bg-gray-400 cursor-not-allowed"
                  } text-white`}
                  title="Add to Cart"
                  onClick={() =>
                    navigate(`/getProduct/${product._id}`)
                  }
                >
                  <MdAddShoppingCart size={22} />
                </button>

                {/* Price */}

                <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full text-green-800 font-bold shadow text-sm">
                  LKR {product.price}
                </div>

              </div>

            </div>

          ))}

        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 text-lg mt-20">
            No products found.
          </div>
        )}

      </div>

    </div>

  );
};

export default Products;