"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DarkModeToggle from "../components/UI/DarkModeToggle";
import Sidebar from "../components/UI/Sidebar.js";
import { FiMenu } from "react-icons/fi";
import "./globals.css";

export default function RootLayout({ children }) {
  const [savedTheme, setSavedTheme] = useState("light");

  // On mount, read from localStorage and set theme
  useEffect(() => {
    const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
    setSavedTheme(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const themeClasses =
    savedTheme === "dark"
      ? "bg-black text-white"
      : "bg-white text-black";

  return (
    <html lang="en" className={savedTheme === "dark" ? "dark" : ""}>
      <body className={`transition-colors duration-300 min-h-screen flex flex-col ${themeClasses}`}>
        <DarkModeToggle />
        <div className="flex flex-1 min-h-0">
          <Sidebar/>
          <main className={`flex-1 py-10 px-4 lg:px-10 overflow-auto ${themeClasses}`}>{children}</main>
        </div>
      </body>
    </html>
  );
}
