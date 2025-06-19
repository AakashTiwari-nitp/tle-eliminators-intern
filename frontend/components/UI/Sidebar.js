"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CiMenuBurger } from "react-icons/ci";
import { FiGrid, FiUsers } from "react-icons/fi";

const menuItems = [
  { label: "Dashboard", path: "/", icon: <FiGrid /> },
  { label: "Students", path: "/students", icon: <FiUsers /> },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [theme, setTheme] = useState("0");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setTheme(stored || "0");
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const navigate = (path) => window.location.href = path;

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden p-4">
        <button
          onClick={toggleSidebar}
          className={`sticky top-5 z-50 flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-transform duration-300 hover:scale-110
            ${theme === "1" ? "text-white" : "text-black"}`}
        >
          {!isOpen && <CiMenuBurger size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
          w-64 min-h-screen flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          ${theme === "1" ? "bg-black text-white" : "bg-white text-black"}`}
      >
        {/* Header */}
        <div
          className={`flex items-center gap-3 px-6 py-4 border-b ${
            theme === "1" ? "border-gray-700" : "border-blue-300"
          }`}
        >
          <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
            <span>V</span>
          </div>
          <h1 className="text-xl font-extrabold truncate">Vidyarthi</h1>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col flex-1 overflow-y-auto px-2 py-4 space-y-2">
          {menuItems.map((item) => {
            const isSelected = pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 w-full
                  ${
                    isSelected
                      ? `bg-blue-100 text-blue-900 ${
                          theme === "1" ? "bg-gray-900 text-blue-100" : ""
                        } font-semibold shadow-md`
                      : `${
                          theme === "1"
                            ? "hover:bg-gray-800 text-white"
                            : "text-blue-700 hover:bg-blue-50 hover:text-blue-900"
                        }`
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <footer
          className={`p-4 text-center text-sm border-t ${
            theme === "1"
              ? "text-blue-300 border-gray-700"
              : "text-blue-700 border-blue-300"
          }`}
        >
          © {new Date().getFullYear()} Vidyarthi
        </footer>
      </aside>
    </>
  );
}
