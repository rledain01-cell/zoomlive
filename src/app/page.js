"use client";
import React, { useState } from "react";
import ZoomLandingPage from "./components/ZoomLandingPage";
import UpdateBox from "./components/UpdateBox";

export default function HomePage() {
  const [showUpdatePage, setShowUpdatePage] = useState(false);

  const handleNavigateToUpdate = () => {
    setShowUpdatePage(true);
  };

  return (
    <div>
      {showUpdatePage ? (
        <UpdateBox />
      ) : (
        <ZoomLandingPage onNavigateToUpdate={handleNavigateToUpdate} />
      )}
    </div>
  );
}
