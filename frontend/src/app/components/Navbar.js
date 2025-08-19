
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon,Menu,X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // Load user info from localStorage
    const storedUser =
      localStorage.getItem("user") || localStorage.getItem("name");
    const role = localStorage.getItem("role");
    if (storedUser && role) {
      setUser({ name: storedUser, role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Knowledge Base", href: "/knowledge-base" },
    { name: "Tickets", href: "/alltickets" },
  
    { name: "Feedback", href: "/feedback" },
    { name: "Agents", href: "/allAgents" },
    { name: "FAQs", href: "/faqsPage" },
  ];

  // 🔑 Don’t render until theme is mounted (avoids mismatch between server & client)
  if (!mounted) return null;

  return (
    <>
      <nav
        className={`flex fixed top-0 left-0 w-full items-center justify-between px-6 py-4 shadow-md z-50 transition-colors duration-300
           ${theme === "light" ? "bg-white text-gray-900" : "bg-gray-900 text-white"}`}
      >
        <h1 className="text-2xl font-bold">
          SocialXN Helpdesk
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 font-medium">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-800" />
            )}
          </button>

          {/* User login/logout */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {user.role === "admin"
                  ? "🛡️"
                  : user.role === "agent"
                  ? "🧑‍💼"
                  : "👤"}{" "}
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <a
                href="/login"
                className="hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                Login
              </a>
              <a
                href="/registration"
                className="hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                Signup
              </a>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-[64px] shadow-lg px-6 pb-4 -pt-10 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block hover:text-blue-500 dark:hover:text-blue-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
            >
              Logout
            </button>
          ) : (
            <>
              <a
                href="/login"
                className="block hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                Login
              </a>
              <a
                href="/registration"
                className="block hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                Signup
              </a>
            </>
          )}
        </div>
      )}
    </>
  );
}

