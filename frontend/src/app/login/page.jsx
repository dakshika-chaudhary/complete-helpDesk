
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name); // ✅ store name too
      alert("Login successful!");
      router.push("/");
    } else {
      alert(data.message || "Login failed");
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex justify-center items-center min-h-screen pt-20  transition-colors duration-500 pb-10">
      <form
        className=" p-8 rounded-2xl shadow-lg w-full max-w-md border"
        onSubmit={handleSubmit}
      >
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Sign In
        </h2>

        {/* Email */}
        <label className="block mb-2 font-medium">
          Email
        </label>
        <input
          placeholder="Enter your email"
          className="w-full h-11 px-4 mb-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <label className="block mb-2  font-medium">
          Password
        </label>
        <input
          placeholder="Enter your password"
          className="w-full h-11 px-4 mb-4 rounded-lg border  focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Forgot Password */}
        <div className="flex justify-between items-center mb-4">
          <a
            href="/forgot-password"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 mt-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-300"
        >
          Sign In
        </button>

        {/* Sign Up Redirect */}
        <p className="mt-5 text-center ">
          Don’t have an account?{" "}
          <a
            href="/registration"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Sign Up
          </a>
        </p>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-2 text-gray-500 dark:text-gray-400 text-sm">
            Or
          </span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Google
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-black dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition"
          >
            Apple
          </button>
        </div>
      </form>
    </div>
  );
}

