import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const formRef = useRef(null);
  const [form, setForm] = useState({ identifier: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    );
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // detect if it's email or username
    const payload = form.identifier.includes("@")
      ? { email: form.identifier, password: form.password }
      : { username: form.identifier, password: form.password };

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-slate-700/60 p-10 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        
        {/* Username or Email */}
        <input
          name="identifier"
          value={form.identifier}
          onChange={handleChange}
          placeholder="Username or Email"
          className="w-full px-4 py-3 mb-4 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-3 mb-6 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
        />

        {/* Login button */}
        <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-semibold text-lg transition-colors mb-4">
          Login
        </button>

        {/* Forgot Password */}
        <p
          className="text-gray-300 text-center cursor-pointer hover:text-blue-400 transition-colors mb-3"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>

        {/* New User Register */}
        <p className="text-center text-gray-400">
          New user?{" "}
          <span
            className="text-yellow-400 cursor-pointer hover:text-yellow-500 font-semibold"
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
}
