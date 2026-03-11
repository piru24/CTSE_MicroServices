import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaApple, FaGooglePlay } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-12 pb-2">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Description */}
        <div>
          <h2 className="text-2xl font-bold text-green-400 mb-2">Food@Door</h2>
          <p className="text-gray-400 mb-4">
            Delicious food delivered fast & fresh. Order from your favorite restaurants anytime, anywhere.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF className="hover:text-green-400 transition text-xl" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="hover:text-green-400 transition text-xl" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className="hover:text-green-400 transition text-xl" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/" className="hover:text-green-400 transition">Home</a>
            </li>
            <li>
              <a href="#menu" className="hover:text-green-400 transition">Menu</a>
            </li>
            <li>
              <a href="#about" className="hover:text-green-400 transition">About Us</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-green-400 transition">Contact</a>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="/faq" className="hover:text-green-400 transition">FAQ</a>
            </li>
            <li>
              <a href="/support" className="hover:text-green-400 transition">Support</a>
            </li>
            <li>
              <a href="/terms" className="hover:text-green-400 transition">Terms of Service</a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-green-400 transition">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* App Download */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Get the App</h3>
          <div className="flex flex-col space-y-3">
            <a
              href="https://apps.apple.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-gray-800 px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              <FaApple className="mr-2 text-2xl" />
              <span>App Store</span>
            </a>
            <a
              href="https://play.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-gray-800 px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              <FaGooglePlay className="mr-2 text-2xl" />
              <span>Google Play</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Food@Door. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
