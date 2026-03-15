import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaApple, FaGooglePlay } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-12 pb-4">

      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-2xl font-bold text-[#f7941d]">EBuy</h2>
          <p className="text-gray-400 mt-3">
            EBuy is your trusted online marketplace to shop electronics,
            fashion, gadgets and more at the best prices.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/">Home</a></li>
            <li><a href="/products">Shop</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Get the App</h3>

          <div className="flex flex-col gap-3">

            <a className="flex items-center bg-gray-800 px-4 py-2 rounded-lg">
              <FaApple className="mr-2" /> App Store
            </a>

            <a className="flex items-center bg-gray-800 px-4 py-2 rounded-lg">
              <FaGooglePlay className="mr-2" /> Google Play
            </a>

          </div>

        </div>

      </div>

      <div className="text-center text-gray-500 mt-10">
        © {new Date().getFullYear()} EBuy. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;