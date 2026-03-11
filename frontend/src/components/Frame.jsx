import React from "react";

export default function Frame() {
  return (
    <div>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <a href="#" className="text-2xl font-bold text-gray-800">
            {/* Uncomment and replace with your logo */}
            {/* <img src={logo} alt="Logo" className="h-10 w-auto" /> */}
            BrandName
          </a>

          {/* Hamburger Menu for Mobile */}
          <button
            className="lg:hidden text-gray-800 focus:outline-none"
            type="button"
            aria-label="Toggle navigation"
          >
            <span className="material-icons">menu</span>
          </button>

          {/* Navigation Links */}
          <div className="hidden lg:flex space-x-6">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 transition"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 transition"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 transition"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-gray-400 cursor-not-allowed"
              aria-disabled="true"
            >
              Disabled
            </a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Hello</h1>
      </div>
    </div>
  );
}