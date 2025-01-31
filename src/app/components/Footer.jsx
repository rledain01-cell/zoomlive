"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-blue-600 text-white text-center py-4 mt-10">
      <p className="text-sm">&copy; 2025 Zoom Inc. All rights reserved.</p>
      <div className="mt-2">
        <a href="/privacy-policy" className="underline mx-2">
          Privacy Policy
        </a>
        |
        <a href="/contact" className="underline mx-2">
          Contact Us
        </a>
      </div>
    </footer>
  );
}
