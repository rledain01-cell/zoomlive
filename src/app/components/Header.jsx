"use client";
import React, { useState, useEffect } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`w-full bg-white fixed top-0 left-0 right-0 z-10 transition-all duration-200 ${scrolled ? 'shadow-md' : 'border-b border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="https://www.zoom.com/dist/assets/icons/zoom-logo.svg"
              alt="Zoom Logo"
              width={114}
              height={26}
              className="h-6 sm:h-8 w-auto"
            />
          </div>

          {/* Navigation and Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex space-x-3 lg:space-x-6">
              <a href="#" className="text-gray-700 hover:text-blue-600 text-xs lg:text-sm">
                Products
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 flex items-center text-xs lg:text-sm">
                <span className="mr-1">+ AI</span>
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 text-xs lg:text-sm">
                Solutions
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 text-xs lg:text-sm hidden lg:block">
                Resources
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 text-xs lg:text-sm">
                Pricing
              </a>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-full py-1 px-4 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-24 lg:w-auto"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3 w-3 lg:h-4 lg:w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a href="#" className="text-gray-700 hover:text-blue-600 text-xs lg:text-sm hidden lg:block">
                Support
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 text-xs lg:text-sm hidden lg:block">
                Meet 
                <span className="hidden xl:inline">+</span>
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 text-xs lg:text-sm hidden md:block">
                Sign In
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 text-xs lg:text-sm hidden xl:block">
                Contact Sales
              </a>
              <button className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-blue-700 transition-colors text-xs sm:text-sm">
                <span className="hidden sm:inline">Try for FREE</span>
                <span className="sm:hidden">Try Free</span>
              </button>
              <button 
                className="text-gray-700 md:hidden p-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
          <nav className="flex flex-col space-y-3">
            <a href="#" className="text-gray-700 hover:text-blue-600 py-2 text-sm">
              Products
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 py-2 text-sm">
              + AI
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 py-2 text-sm">
              Solutions
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 py-2 text-sm">
              Resources
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 py-2 text-sm">
              Pricing
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 py-2 text-sm">
              Support
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 py-2 text-sm">
              Meet
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 py-2 text-sm">
              Sign In
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 py-2 text-sm">
              Contact Sales
            </a>
            <div className="relative pt-2 pb-3">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}