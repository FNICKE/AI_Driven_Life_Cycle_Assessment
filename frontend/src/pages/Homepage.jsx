import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import {
  Cpu,
  Activity,
  BarChart3,
  LayoutDashboard,
  Lightbulb,
  Scale,
  TrendingUp,
  ShieldCheck,
  Eye,
  Building2,
  Landmark,
  Microscope,
} from "lucide-react";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Simple Tailwind Button component
const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function Homepage() {
  const navigate = useNavigate();

  // Refs for GSAP animations
  const heroRefs = useRef([]);
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const esgRef = useRef(null);
  const useCaseRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    // Hero animations
    gsap.fromTo(
      heroRefs.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.3 }
    );

    // Scroll animations
    const sections = [aboutRef, featuresRef, esgRef, useCaseRef, contactRef];
    sections.forEach((ref) => {
      gsap.fromTo(
        ref.current,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hero Section with Background Video */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Video Background */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-30 z-0"
          autoPlay
          loop
          muted
          src="/videos/hero.mp4"
        ></video>

        {/* Top-Right Buttons */}
        <div className="absolute top-6 right-6 flex gap-4 z-20">
          <Button
            onClick={() => navigate("/register")}
            className="bg-blue-500 hover:bg-blue-600 px-5 py-2 text-sm md:text-base transition-transform transform hover:scale-105"
          >
            Register
          </Button>
          <Button
            onClick={() => navigate("/login")}
            className="bg-green-500 hover:bg-green-600 px-5 py-2 text-sm md:text-base transition-transform transform hover:scale-105"
          >
            Login
          </Button>
        </div>

        {/* Overlay Content */}
        <div className="relative z-10">
          <h1
            ref={(el) => (heroRefs.current[0] = el)}
            className="text-4xl md:text-6xl font-extrabold mb-4"
          >
            AI-Driven Life Cycle Assessment (LCA) Tool
          </h1>
          <p
            ref={(el) => (heroRefs.current[1] = el)}
            className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto"
          >
            Advancing Circularity and Sustainability in Metallurgy and Mining
          </p>
          <div
            ref={(el) => (heroRefs.current[2] = el)}
            className="mt-10 bg-slate-700/50 p-10 rounded-2xl shadow-xl max-w-3xl mx-auto"
          >
            <p className="text-xl font-semibold">
              Track, Predict & Optimize Environmental Impacts 🌍
            </p>
          </div>
          <div
            ref={(el) => (heroRefs.current[3] = el)}
            className="mt-10 flex gap-6 justify-center"
          >
            <Button
              onClick={() => navigate("/register")}
              className="bg-green-500 hover:bg-green-600 px-6 py-3 text-lg"
            >
              Get Started
            </Button>
            <Button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 px-6 py-3 text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className="py-20 px-6 text-center max-w-5xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">About the Tool</h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          This AI-powered platform is designed for the{" "}
          <span className="text-blue-400 font-semibold">Ministry of Mines</span>{" "}
          to evaluate the environmental impact of mining and metallurgy
          activities. By integrating life cycle assessment datasets, the tool
          helps in predicting <span className="text-indigo-400">carbon footprints</span>,{" "}
          <span className="text-purple-400">water consumption</span>, and{" "}
          <span className="text-pink-400">energy use</span> — promoting
          sustainable and circular mining practices.
        </p>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-slate-800 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Core Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Cpu className="w-10 h-10 text-blue-400 mb-4" />,
              title: "AI-Powered Predictions",
              desc: "Estimate CO₂ emissions, energy, and water for new projects using ML models.",
            },
            {
              icon: <Activity className="w-10 h-10 text-purple-400 mb-4" />,
              title: "Scenario Simulation",
              desc: "Test 'what-if' cases like replacing virgin ore with recycled scrap.",
            },
            {
              icon: <BarChart3 className="w-10 h-10 text-pink-400 mb-4" />,
              title: "Benchmarking",
              desc: "Compare mines or processes to identify the greener option.",
            },
            {
              icon: <LayoutDashboard className="w-10 h-10 text-indigo-400 mb-4" />,
              title: "Visualization Dashboard",
              desc: "Sankey diagrams, lifecycle charts, and emissions maps for clear insights.",
            },
            {
              icon: <Lightbulb className="w-10 h-10 text-yellow-400 mb-4" />,
              title: "Recommendation Engine",
              desc: "Suggest sustainable alternatives like renewable energy or better transport.",
            },
            {
              icon: <Scale className="w-10 h-10 text-red-400 mb-4" />,
              title: "Policy Support",
              desc: "Provide evidence-based data for decision making and ESG compliance.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-slate-700/50 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              {f.icon}
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ESG Impact Section */}
      <section ref={esgRef} className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">ESG Impact</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <TrendingUp className="w-10 h-10 text-green-400 mb-4 mx-auto" />,
              title: "Economic",
              value: "↑ 25% efficiency",
              desc: "Boost productivity with optimized resource use.",
              color: "bg-green-500",
            },
            {
              icon: <ShieldCheck className="w-10 h-10 text-blue-400 mb-4 mx-auto" />,
              title: "Social",
              value: "↑ Safer Mining",
              desc: "Improved practices reduce risks to workers & communities.",
              color: "bg-blue-500",
            },
            {
              icon: <Eye className="w-10 h-10 text-yellow-400 mb-4 mx-auto" />,
              title: "Governance",
              value: "100% Transparency",
              desc: "Compliant with global sustainability standards.",
              color: "bg-yellow-500",
            },
          ].map((e, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-700/50 shadow-lg hover:scale-105 transition-transform"
            >
              {e.icon}
              <h3 className="text-2xl font-semibold mb-2">{e.title}</h3>
              <p className={`text-lg font-bold ${e.color} text-white rounded-md inline-block px-3 py-1 mb-3`}>
                {e.value}
              </p>
              <p className="text-gray-300">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section
        ref={useCaseRef}
        className="py-20 bg-slate-800 px-6 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Who Can Use?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Building2 className="w-10 h-10 text-blue-400 mb-4 mx-auto" />,
              title: "Mining Companies",
              desc: "Track sustainability performance and optimize operations.",
            },
            {
              icon: <Landmark className="w-10 h-10 text-purple-400 mb-4 mx-auto" />,
              title: "Policy Makers",
              desc: "Get reliable data for ESG regulations and national goals.",
            },
            {
              icon: <Microscope className="w-10 h-10 text-pink-400 mb-4 mx-auto" />,
              title: "Researchers",
              desc: "Analyze mining lifecycle impacts for innovation and policy.",
            },
          ].map((u, i) => (
            <div
              key={i}
              className="bg-slate-700/50 p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              {u.icon}
              <h3 className="text-xl font-semibold mb-2">{u.title}</h3>
              <p className="text-gray-300">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <footer
        ref={contactRef}
        className="py-10 px-6 text-center bg-slate-900 border-t border-slate-700"
      >
        <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
        <form className="max-w-3xl mx-auto grid gap-6">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <Button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 text-lg">
            Send Message
          </Button>
        </form>
        <p className="text-gray-500 mt-6">
          Ministry of Mines – AI LCA Tool | Driving Circularity & Sustainability
        </p>
        <p className="text-gray-600 mt-2">© 2025 Ministry of Mines. All rights reserved.</p>
      </footer>
    </div>
  );
}
