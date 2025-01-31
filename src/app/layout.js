import "./globals.css";
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "One platform to connect | Zoom",
  description: "One platform to connect | Zoom",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}