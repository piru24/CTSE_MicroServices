import React, { useState, useEffect } from "react";
import { FiStar, FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdLocalShipping } from "react-icons/md";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

axios.defaults.withCredentials = true;

const staticProducts = [
  {
    _id: 1,
    name: "Wireless Headphones",
    category: "electronics",
    price: 89.99,
    image: "/images/headphone.jpg",
    sellerName: "TechWorld",
    desc: "Noise cancelling wireless headphones",
    avgRating: 4.5
  },
  {
    _id: 2,
    name: "Smart Watch",
    category: "wearables",
    price: 129.99,
    image: "/images/smartwatch.jpg",
    sellerName: "Gadget Store",
    desc: "Track fitness, health & notifications",
    avgRating: 4.3
  },
  {
    _id: 3,
    name: "Gaming Keyboard",
    category: "gaming",
    price: 59.99,
    image: "/images/keyboard.jpg",
    sellerName: "GameHub",
    desc: "RGB mechanical gaming keyboard",
    avgRating: 4.6
  },
  {
    _id: 4,
    name: "Bluetooth Speaker",
    category: "electronics",
    price: 49.99,
    image: "/images/speaker.jpg",
    sellerName: "SoundTech",
    desc: "Portable powerful bass speaker",
    avgRating: 4.7
  }
];

const Home = () => {

  const { isLoggedIn, token } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {

    const getProducts = async () => {

      try {

        let fetched = [];

        if (isLoggedIn) {

          const res = await axios.get(
            "http://localhost:8070/products/getProducts",
            {
              headers: { Authorization: `Bearer ${token}` },
              withCredentials: true
            }
          );

          fetched = res.data;

        }

        const combined = [...staticProducts, ...fetched];

        setProducts(combined);
        extractCategories(combined);

      } catch {
        setProducts(staticProducts);
        extractCategories(staticProducts);
      }

    };

    getProducts();
  }, [isLoggedIn, token]);

  const extractCategories = (prods) => {
    const unique = Array.from(new Set(prods.map((p) => p.category)));

    setCategories([
      { name: "All", value: "all" },
      ...unique.map((cat) => ({
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: cat,
      })),
    ]);
  };

  const filteredProducts = products.filter((product) => {
    const search =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sellerName.toLowerCase().includes(searchQuery.toLowerCase());

    const category =
      selectedCategory === "all" || product.category === selectedCategory;

    return search && category;
  });

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section
        className="h-[40vh] flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/images/shop-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-2xl w-full px-4">

          <h1 className="text-4xl md:text-5xl text-white font-bold mb-6">
            Discover Amazing Deals on EBuy
          </h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Search products, brands or categories..."
              className="w-full px-6 py-3 rounded-full shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute right-5 top-3 text-gray-500 text-xl" />
          </div>

        </div>
      </section>

      {/* PRODUCTS */}
      <section className="container mx-auto px-4 py-10">

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Trending Products
        </h2>

        {/* CATEGORY FILTER */}
        <div className="flex gap-3 overflow-x-auto pb-4">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-2 rounded-full whitespace-nowrap ${
                selectedCategory === category.value
                  ? "bg-[#f7941d] text-white"
                  : "bg-white border"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition"
            >

              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-t-xl"
              />

              <div className="p-5">

                <h3 className="font-semibold text-lg">{product.name}</h3>

                <p className="text-sm text-gray-500">{product.desc}</p>

                <div className="flex justify-between items-center mt-3">

                  <span className="text-[#f7941d] font-bold">
                    ${product.price}
                  </span>

                  <div className="flex items-center text-sm">
                    <FiStar className="text-yellow-500 mr-1" />
                    {product.avgRating}
                  </div>

                </div>

                <div className="flex items-center text-sm text-gray-600 mt-3">
                  <MdLocalShipping className="text-[#f7941d] mr-1" />
                  Fast Shipping
                </div>

                <Link to="/products">
                  <button className="w-full mt-4 bg-[#f7941d] hover:bg-[#ef6c00] text-white py-2 rounded-lg flex items-center justify-center gap-2">
                    <FiShoppingCart />
                    View Product
                  </button>
                </Link>

              </div>

            </div>
          ))}
        </div>

      </section>

    </div>
  );
};

export default Home;
