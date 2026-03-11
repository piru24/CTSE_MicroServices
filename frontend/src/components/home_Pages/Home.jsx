import React, { useState, useEffect } from "react";
import { FiClock, FiStar, FiSearch } from "react-icons/fi";
import { MdDeliveryDining } from "react-icons/md";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


axios.defaults.withCredentials = true;

// Static product data
const staticProducts = [
  {
    _id: 1,
    name: "Margherita Pizza",
    category: "pizza",
    price: 12.99,
    image: "/images/pizza.jpeg",
    sellerName: "Pizza Palace",
    sellerAvailable: true,
    desc: "Classic tomato and mozzarella",
    avgRating: 4.5
  },
  {
    _id: 2,
    name: "Cheese Burger",
    category: "burger",
    price: 9.99,
    image: "/images/burger.jpg",
    sellerName: "Burger Barn",
    sellerAvailable: true,
    desc: "Juicy beef patty with cheese",
    avgRating: 4.3
  },
  {
    _id: 3,
    name: "Chapathi Thosa",
    category: "thosa",
    price: 9.99,
    image: "/images/thosa.jpg",
    sellerName: "Thosa Kada",
    sellerAvailable: true,
    desc: "Soft chapathi style thosa served hot",
    avgRating: 4.3
  },
  {
    _id: 4,
    name: "Chicken Biryani",
    category: "biryani",
    price: 14.99,
    image: "/images/biryani.jpeg",
    sellerName: "Biryani House",
    sellerAvailable: true,
    desc: "Spicy aromatic chicken biryani",
    avgRating: 4.7
  }
];


const Home = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch products based on login status
  useEffect(() => {
    const getProducts = async () => {
      try {
        let fetched = [];
        if (isLoggedIn) {
          const res = await axios.get(
            "http://food-app.127.0.0.1.nip.io/products/getProducts",
            {
              withCredentials: true,
            }
          );
          fetched = res.data;
        }
        // Merge static + fetched (if any)
        const combined = [...staticProducts, ...fetched];
        setProducts(combined);
        extractCategories(combined);
      } catch (err) {
        setProducts(staticProducts);
        extractCategories(staticProducts);
      }
    };
    getProducts();
    // eslint-disable-next-line
  }, [isLoggedIn]);

  // Extract unique categories
  const extractCategories = (prods) => {
    const unique = Array.from(new Set(prods.map((p) => p.category)));
    setCategories([
      { name: "All", value: "all" },
      ...unique.map((cat) => ({
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: cat.toLowerCase(),
      })),
    ]);
  };

  // // Search products
  // const searchProduct = async (e) => {
  //   const searchValue = e.target.value;
  //   setSearchQuery(searchValue);

  //   try {
  //     const { data } = await axios.get(
  //       `http://localhost:8070/products/search/?search=${searchValue}`
  //     );
  //     setProducts(data.data.products);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const searchProduct = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-500 via-gray-400 to-green-700 min-h-screen">
      {/* Hero Section with Search */}
      <section
        className="relative h-80 bg-cover bg-center mb-2"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/food-bg2.jpg')",
          backgroundSize: "fill",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "40vh",
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center max-w-2xl w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Craving something delicious?
            </h1>
            <div className="relative items-center">
              <input
                type="text"
                placeholder="Search restaurants or dishes..."
                className="w-full px-4 py-2 rounded-full shadow-lg focus:outline-none"
                value={searchQuery}
                onChange={searchProduct}
              />
              <FiSearch className="absolute right-6 top-2 text-gray-500 text-2xl" />
            </div>
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="container mx-auto px-4 py-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Popular Near You
        </h2>
        <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`flex-shrink-0 px-6 py-2 rounded-full ${
                selectedCategory === category.value
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              } transition-colors shadow-sm`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black">
                  <h3 className="text-xl font-semibold text-white">
                    {product.sellerName}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{product.desc}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    ${product.price}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <FiStar className="text-yellow-500" />
                    <span>{product.avgRating?.toFixed(1) || "4.5"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiClock />
                    <span>30-40 min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MdDeliveryDining className="text-green-600" />
                    <span>Free</span>
                  </div>
                </div>
                <Link to="/products">
                  <button className="w-full mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors">
                    Browse
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        className="bg-white py-16"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/delii.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "50vh",
        }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            {[
              {
                icon: <FiSearch size={40} />,
                title: "Search",
                text: "Find your favorite food or restaurant",
              },
              {
                icon: <MdDeliveryDining size={40} />,
                title: "Order",
                text: "Customize your order and checkout",
              },
              {
                icon: <FiClock size={40} />,
                title: "Enjoy",
                text: "Track delivery and enjoy your meal",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-green-600 bg-green-100 rounded-full p-4 inline-flex items-center justify-center shadow-lg gap-2"
              >
                <div className="text-green-600 bg-white rounded-full p-4 inline-flex items-center justify-center shadow">
                  {step.icon}
                  <h3 className="text-xl font-semibold ">{step.title}</h3>
                </div>
                <p className="text-gray-600 font-semibold">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
