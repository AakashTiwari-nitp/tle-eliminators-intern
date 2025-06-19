"use client";
import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, set theme from localStorage
    const stored = localStorage.getItem("theme");
    if (stored === "1") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "1");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "0");
    }
    window.location.reload();
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className={`absolute top-2 right-4 z-2 flex items-center w-24 h-9 ${isDark ? "bg-gray-7 00": "bg-gray-200 "} rounded-full transition-all duration-500`}
    >
      {/* Sun Icon */}
      <span
        className={`text-md flex items-center z-100 ml-2 justify-center w-8 h-8 rounded-full transition-all duration-500 ${isDark ? "text-yellow-500" : "text-slate-500 scale-125"
          }`}
      >
        <MdSunny size={20} />
      </span>

      {/* Sliding knob */}
      <div
        className={`w-12 h-9 rounded-full z-80 absolute transition-transform duration-500 transform
              ${isDark
            ? "translate-x-[3rem] bg-slate-500"
            : "translate-x-0 bg-yellow-400"}
              `}>
      </div>

      {/* Moon Icon */}
      <span
        className={`text-md flex items-center z-100 mr-2 justify-center w-8 h-8 rounded-full transition-all duration-500 ml-auto ${isDark ? "text-slate-100" : "text-slate-400"
          }`}
      >
        <FaMoon size={20} />
      </span>
    </button>
  );
}