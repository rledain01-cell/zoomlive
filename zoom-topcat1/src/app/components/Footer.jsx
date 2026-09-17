"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Left Side - Tagline */}
          <p className="text-sm mb-4 md:mb-0 text-center md:text-left">A work platform for human connection</p>

          {/* Right Side - Buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full md:w-auto">
            <button className="bg-gray-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-gray-600 transition-colors text-xs sm:text-sm whitespace-nowrap">
              AI Companion
            </button>
            <button className="bg-gray-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-gray-600 transition-colors text-xs sm:text-sm whitespace-nowrap">
              Business Services
            </button>
            <button className="bg-gray-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-gray-600 transition-colors text-xs sm:text-sm whitespace-nowrap">
              Developer Ecosystem
            </button>
          </div>
        </div>

        {/* Bottom Section - Logo and Copyright */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center border-t border-gray-700 pt-4">
          <div className="flex flex-col sm:flex-row items-center mb-4 w-full justify-center sm:justify-between">
            <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
              <svg
                width="90"
                height="26"
                viewBox="0 0 120 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-2 sm:mb-0 sm:mr-4"
              >
                <path d="M58.1 11V26h-4.9V11h-4.6V7h13.9v4H58.1z" fill="white"></path>
                <path
                  d="M35 7v14.5c0 2.6-2.1 4.7-4.7 4.7s-4.7-2.1-4.7-4.7V7h-4.9v14.5c0 5.3 4.3 9.6 9.6 9.6s9.6-4.3 9.6-9.6V7H35z"
                  fill="white"
                ></path>
                <path d="M69 6L60 16v10h5V16l8.9-10H69z" fill="white"></path>
                <path
                  d="M89 10c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4 4-1.8 4-4zM19.8 5.2c-.6-.5-1.5-.3-2.1.3L5.5 18.3V7.8c0-.8-.7-1.5-1.5-1.5H1c-.8 0-1.5.7-1.5 1.5v14.5c0 .8.7 1.5 1.5 1.5h3c.8 0 1.5-.7 1.5-1.5V10l12.1 12.7.3.3.7.2.3.1h.1c.1 0 .2 0 .3-.1l.3-.2.3-.3.1-.1.1-.1.1-.2.1-.2.1-.3v-.4c0-.1-.1-.2-.1-.3l-.1-.2-.2-.3-.3-.4L3.6 9.8l10.8-7.7c.7-.5.9-1.4.4-2.1v-.1c-.3-.2-.5-.2-.8-.2-.4 0-.8 0-1 0-.7.1-1.2.4-1.4.8v5c0 .4.3.7.6.7h.1v.1l.1.1h.1l.1.1c0 .1.1.1 0 0"
                  fill="white"
                ></path>
              </svg>
              <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                © 2025 Zoom Video Communications, Inc. All rights reserved.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <a href="/privacy" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/contact" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                Contact Us
              </a>
            </div>
          </div>
          
          {/* Mobile-only social links */}
          <div className="flex items-center justify-center space-x-4 sm:hidden mt-2">
            <a href="#" className="text-gray-400 hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}