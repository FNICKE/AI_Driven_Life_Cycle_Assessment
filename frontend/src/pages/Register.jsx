import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const formRef = useRef(null);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    );
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        navigate("/two-factor", { state: { userId: data.userId, email: form.email } });
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-6">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-slate-700/60 p-10 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full px-4 py-3 mb-4 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-3 mb-4 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-3 mb-6 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
        />
        <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-semibold text-lg transition-colors">
          Register
        </button>
      </form>
    </div>
  );
}
