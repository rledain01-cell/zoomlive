"use client";
import React from "react";
import Image from "next/image";
import logo from "../../../public/logo.png";

export default function Header() {
  return (
    <header className="w-full bg-blue-600 flex justify-center py-4">
      <Image src={logo} alt="Zoom Logo" width={100} height={50} />
    </header>
  );
}
