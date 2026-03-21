import React from "react";

import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Register from "./components/authentication/register";
import Login from "./components/authentication/login";
import Profile from "./components/Profile/profile";
import Header from "./components/header";
import Admin from "./components/home_Pages/Admin";
import Products from "./components/home_Pages/Products";
import Productinfo from "./components/ProductInfo/productinfo";
import Cart from "./components/ProductInfo/cart";
import OrderHistory from "./components/ProductInfo/orderHistory";
import ViewOrders from "./components/ProductInfo/viewOrders";
import RateForm from "./components/rate&Review/RateForm";
import AddProducts from "./components/products/addProduct";
import UpdateProducts from "./components/products/updateProduct";
import UpdateACC from "./components/Profile/updateProfile";
import UpdatePWD from "./components/Profile/updatePWD";
import AddPayment from "./components/payment/dummyPayment";
import RateFormSeller from "./components/rate&Review/RateFormSeller";
import Test1 from "./components/deliverDetails/diliverdetails"
import { useSelector } from "react-redux";
import SellerDashboard from "./components/seller/Dashboard";

import DeliveryDashboard from "./components/delivery/DeliveryDashboard";
// import RealTimeTracking from "./components/delivery/RealTimeTracking";
import Notify from "./components/notify/notify";
import Home from "./components/home_Pages/Home";
import Footer from "./components/footer";

const App = () => {

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  console.log(isLoggedIn);

  return (
    <BrowserRouter>
    <Header/>
      <Routes>
      <Route path="/" element={<Home/>}/>
        <Route path="/signUp" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>

       {isLoggedIn && <Route path="/profile" element={<Profile/>}/>}
       {isLoggedIn && <Route path="/admin" element={<Admin/>}/>} 
        <Route path="/products" element={<Products/>}/>
        <Route path="/viewOrders" element={<ViewOrders/>}/>
       {isLoggedIn && <Route path="/getProduct/:id" element={<Productinfo/>}/>}
       {isLoggedIn && <Route path="/cart" element={<Cart/>}/>}
       {isLoggedIn && <Route path="/getOrders" element={<OrderHistory/>}/>}
        {isLoggedIn && <Route path="/seller/dashboard" element={<SellerDashboard/>}/>}
       {isLoggedIn && <Route path="/admin/viewOrders" element={<ViewOrders/>}/>}
       {isLoggedIn && <Route path="/addProduct" element={<AddProducts/>}/>}
       {isLoggedIn && <Route path="/updateProduct/:id" element={<UpdateProducts/>}/>}
       {isLoggedIn && <Route path="/updateUser/:id" element={<UpdateACC/>}/>}
       {isLoggedIn && <Route path="/updatePWD/:id" element={<UpdatePWD/>}/>}
       {isLoggedIn && <Route path="/dummyPayment" element={<AddPayment/>}/>}
       {isLoggedIn && <Route path="/rateBuyer/:id" element={<RateForm/>}/>}
       {isLoggedIn && <Route path="/rateSeller/:sellerName/:id" element={<RateFormSeller/>}/>}
       {isLoggedIn && <Route path="/test1" element={<Test1/>}/>}
       {isLoggedIn && <Route path="/deliveryDashboard" element={<DeliveryDashboard/>}/>}
       {/* {isLoggedIn && <Route path="/track/:orderId" element={<RealTimeTracking />}/>} */}
       {isLoggedIn && <Route path="/notify/:orderId" element={<Notify />}/>}

       
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
