import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import gsap from "gsap";
import MiningFeature from "./MiningFeature";
import TransportPage from "./TransportPage";

// Custom red and blue icons for mines & production
const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const blueIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Coal & Iron Ore data
const minerals = [
  {
    name: "Coal",
    mine: { name: "Jharia Coal Mine", position: [23.7833, 86.43] },
    production: { name: "Jamshedpur Steel Hub", position: [22.8046, 86.2029] },
  },
  {
    name: "Iron Ore",
    mine: { name: "Noamundi Iron Mine", position: [22.08, 85.4] },
    production: { name: "Jamshedpur Steel Hub", position: [22.8046, 86.2029] },
  },
];

const phases = ["Mining", "Transportation", "Production", "Recycling"];

const DashboardPage = () => {
  const [selectedMineral, setSelectedMineral] = useState(null);
  const [activePhase, setActivePhase] = useState(null);
  const [distance, setDistance] = useState(null);

  // Haversine formula to calculate distance in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  const handleMineClick = (mineral) => {
    setSelectedMineral(mineral);
    setActivePhase("Mining");

    const d = calculateDistance(
      mineral.mine.position[0],
      mineral.mine.position[1],
      mineral.production.position[0],
      mineral.production.position[1]
    );
    setDistance(d);

    // Animate phase section entrance
    gsap.fromTo(
      ".phase-section",
      { x: -300, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );

    // Animate title fade-in
    gsap.fromTo(
      ".phase-title",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: 0.2 }
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-gray-200">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 shadow-lg flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold text-yellow-400 tracking-wide animate-fadeIn">
          AI-Driven LCA Tool
        </h1>
        <p className="mt-2 text-lg text-gray-300 font-medium animate-fadeIn delay-200">
          Assess environmental impact for mining & metallurgy processes
        </p>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 space-y-4 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-indigo-300 border-b-2 border-indigo-400 pb-2 animate-slideUp">
            LCA Phases
          </h2>
          {phases.map((phase) => (
            <button
              key={phase}
              className={`w-full py-3 px-4 rounded-lg text-left hover:bg-indigo-700 transition-all duration-300 ${
                activePhase === phase ? "bg-indigo-600 text-white" : "bg-gray-700"
              }`}
              onClick={() => {
                setActivePhase(phase);
                gsap.fromTo(
                  ".phase-content",
                  { y: 20, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.5 }
                );
              }}
            >
              {phase}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-auto">
          {/* Map Section */}
          <div className="flex-1">
            {!selectedMineral && (
              <>
                <p className="text-gray-200 mb-4 text-xl font-semibold text-center animate-fadeIn">
                  Click a red mine marker to begin the LCA process
                </p>
                <MapContainer
                  center={[22.9734, 78.6569]}
                  zoom={5}
                  className="w-full h-80 md:h-[450px] rounded-xl shadow-lg border border-gray-600"
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {minerals.map((mineral) => (
                    <Marker
                      key={mineral.name}
                      position={mineral.mine.position}
                      icon={redIcon}
                      eventHandlers={{
                        click: () => handleMineClick(mineral),
                      }}
                    >
                      <Popup className="p-2 bg-white text-gray-800 rounded shadow">
                        {mineral.mine.name}
                      </Popup>
                      <Tooltip>{mineral.mine.name}</Tooltip>
                    </Marker>
                  ))}
                  {minerals.map((mineral) => (
                    <Marker
                      key={mineral.name + "-prod"}
                      position={mineral.production.position}
                      icon={blueIcon}
                    >
                      <Popup className="p-2 bg-white text-gray-800 rounded shadow">
                        {mineral.production.name}
                      </Popup>
                      <Tooltip>{mineral.production.name}</Tooltip>
                    </Marker>
                  ))}
                </MapContainer>
              </>
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 p-6 rounded-xl shadow-lg overflow-auto border border-gray-600">
            {!selectedMineral ? (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-indigo-300 animate-slideUp">
                  Mining & Metallurgy Overview
                </h2>
                <ul className="list-none space-y-2 animate-fadeIn">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-400">✅</span>
                    Calculates water usage across mining phases.
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-yellow-400">⏳</span>
                    Tracks energy consumption in metallurgy processes.
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-red-400">🌱</span>
                    Measures CO₂ emissions for environmental impact.
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-blue-400">⚙️</span>
                    Analyzes gas composition during production.
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-purple-400">📊</span>
                    Provides detailed insights for each lifecycle stage.
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-gray-400">➡️</span>
                    Click a mine on the map to start the LCA process.
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-indigo-300 animate-slideUp">
                  Selected Mineral Details
                </h2>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Mineral:</span>{" "}
                  <span className="text-red-400">{selectedMineral.name}</span>
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Mine:</span>{" "}
                  {selectedMineral.mine.name}
                </p>
                <p className="text-gray-300 mb-2">
                  <span className="font-semibold">Production:</span>{" "}
                  {selectedMineral.production.name}
                </p>
                <p className="text-gray-300">
                  <span className="font-semibold">Distance:</span>{" "}
                  <span className="text-green-400 font-bold">{distance} km</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Phase Section */}
        {selectedMineral && (
          <div className="phase-section absolute top-0 left-64 w-[calc(100%-16rem)] h-full bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-l-2xl shadow-2xl overflow-auto">
            <h2 className="phase-title text-3xl font-extrabold mb-6 text-indigo-300 border-b-4 border-indigo-400 pb-2">
              {activePhase} Phase
            </h2>

            <div className="phase-content">
              {activePhase === "Mining" && <MiningFeature />}
              {activePhase === "Transportation" && (
                <TransportPage mineral={selectedMineral} distance={distance} />
              )}
              {activePhase !== "Mining" && activePhase !== "Transportation" && (
                <p className="text-gray-300 text-lg animate-fadeIn">
                  Phase content for {activePhase} will appear here...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add CSS keyframes for animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
  .animate-fadeIn.delay-100 { animation-delay: 0.1s; }
  .animate-fadeIn.delay-200 { animation-delay: 0.2s; }
  .animate-fadeIn.delay-300 { animation-delay: 0.3s; }
  .animate-fadeIn.delay-400 { animation-delay: 0.4s; }
  .animate-slideUp { animation: slideUp 0.5s ease-out; }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default DashboardPage;