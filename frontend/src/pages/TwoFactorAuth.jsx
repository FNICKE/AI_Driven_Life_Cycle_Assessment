import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useLocation, useNavigate } from "react-router-dom";

export default function TwoFactorAuth() {
  const formRef = useRef(null);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, email } = location.state || {};

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        navigate("/login");
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
        <h2 className="text-3xl font-bold mb-6 text-center">Two-Factor Authentication</h2>
        <p className="text-gray-300 text-center mb-4">
          Enter the OTP sent to <span className="text-blue-400">{email}</span>
        </p>
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full px-4 py-3 mb-6 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
        />
        <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-semibold text-lg transition-colors">
          Verify OTP
        </button>
      </form>
    </div>
  );
}
