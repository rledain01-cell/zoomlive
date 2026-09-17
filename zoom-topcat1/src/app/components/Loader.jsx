"use client";
import React from "react";

export default function Loader() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 border-blue-200"></div>
    </div>
  );
}