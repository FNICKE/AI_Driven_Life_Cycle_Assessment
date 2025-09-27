import React, { useState, useCallback, useEffect } from "react";
import * as d3 from "d3";
import * as tf from "@tensorflow/tfjs";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";

// Red and Blue Marker icons
const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const NOAMUNDI = { lat: 22.160299, lng: 85.496902 };
const JAMSHEDPUR = { lat: 22.805618, lng: 86.203110 };
const API_URL = "http://localhost:5000/api/transport";

const TransportPage = () => {
  const [mode, setMode] = useState("truck");
  const [distanceKm, setDistanceKm] = useState(102.05);
  const [weight, setWeight] = useState("");
  const [ore, setOre] = useState("iron"); // UI-only
  const [loading, setLoading] = useState(false);
  const [emissions, setEmissions] = useState({ truck: null, train: null });

  const fetchEmissionsFor = async (mode, params) => {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, params }),
    });
    if (!resp.ok) throw new Error(await resp.text());
    return await resp.json();
  };

  const handleGenerate = async () => {
    const w = parseFloat(weight);
    const d = parseFloat(distanceKm);
    if (isNaN(w) || w <= 0 || isNaN(d) || d <= 0) {
      alert("Enter valid weight and distance.");
      return;
    }

    setLoading(true);
    // Only send weight and distance to API; ore is UI-only
    const params = { weight: w, weight_unit: "t", distance: d, distance_unit: "km" };

    try {
      const data = await fetchEmissionsFor(mode, params);
      setEmissions((prev) => ({ ...prev, [mode]: data }));
    } catch (err) {
      console.error(err);
      alert("Error fetching emissions: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderViz = useCallback((data, containerId, title) => {
    const svgEl = document.getElementById(containerId);
    if (!svgEl || !data) return;

    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    const width = svgEl.clientWidth || 360;
    const height = svgEl.clientHeight || 240;
    const margin = { top: 28, right: 12, bottom: 48, left: 48 };

    const co2e = data.co2e || 0;
    const gases = data.constituent_gases || { co2: 0, ch4: 0, n2o: 0 };

    const barData = [
      { label: "Total CO₂e (kg)", value: co2e },
      { label: "CO₂ (kg)", value: gases.co2 || 0 },
      { label: "CH₄ (kg)", value: gases.ch4 || 0 },
      { label: "N₂O (kg)", value: gases.n2o || 0 },
    ];

    const x = d3.scaleBand().domain(barData.map((d) => d.label)).range([margin.left, width - margin.right]).padding(0.18);
    const y = d3.scaleLinear().domain([0, Math.max(1, d3.max(barData, (d) => d.value)) * 1.1]).nice().range([height - margin.bottom, margin.top]);

    svg.selectAll(".bar")
      .data(barData)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.label))
      .attr("width", x.bandwidth())
      .attr("y", y(0))
      .attr("height", 0)
      .attr("fill", (d, i) => ["#ef4444", "#10b981", "#f59e0b", "#8b5cf6"][i % 4])
      .transition().duration(800).attr("y", (d) => y(d.value)).attr("height", (d) => height - margin.bottom - y(d.value));

    svg.selectAll(".bar-label")
      .data(barData)
      .enter()
      .append("text")
      .attr("x", (d) => x(d.label) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 6)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .style("font-size", "12px")
      .text((d) => (d.value ? d.value.toFixed(2) : "0.00"));

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.6em")
      .attr("dy", "0.12em")
      .attr("transform", "rotate(-40)")
      .attr("fill", "white");

    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .attr("fill", "white");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-weight", "600")
      .style("font-size", "13px")
      .attr("fill", "white")
      .text(title);
  }, []);

  useEffect(() => {
    if (emissions.truck) renderViz(emissions.truck, "viz-truck", "TRUCK (Diesel) 🚚");
    if (emissions.train) renderViz(emissions.train, "viz-train", "TRAIN (Rail Freight) 🚂");
  }, [emissions, renderViz]);

  const bestMode = (() => {
    if (!emissions.truck || !emissions.train) return null;
    const vals = [emissions.truck.co2e || Infinity, emissions.train.co2e || Infinity];
    const t = tf.tensor(vals);
    const idx = t.argMin().dataSync()[0];
    return idx === 0 ? "truck" : "train";
  })();

  return (
    <div className="p-6 text-white bg-gray-800 min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🚛</span>
        <h2 className="text-2xl font-bold">Transportation Phase</h2>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT INPUTS */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex gap-4 items-center flex-wrap">
            <div>
              <label className="font-bold text-white mb-1 block">Select Transport</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="p-2 rounded w-40 bg-gray-700 text-white"
              >
                <option value="truck">Truck</option>
                <option value="train">Train</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-white mb-1 block">Distance (km)</label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="p-2 rounded w-32 bg-gray-700 text-white"
              />
            </div>

            <div>
              <label className="font-bold text-white mb-1 block">Weight (tonnes)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="p-2 rounded w-32 bg-gray-700 text-white"
              />
            </div>

            <div>
              <label className="font-bold text-white mb-1 block">Select Ore</label>
              <select
                value={ore}
                onChange={(e) => setOre(e.target.value)}
                className="p-2 rounded w-40 bg-gray-700 text-white"
              >
                <option value="iron">Iron</option>
                <option value="copper">Copper</option>
                <option value="bauxite">Bauxite</option>
                <option value="silver">Silver</option>
                <option value="manganese">Manganese</option>
              </select>
            </div>
          </div>

          {/* Generate button below inputs */}
          <div className="mt-4">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded font-semibold"
            >
              {loading ? "Calculating..." : "Generate"}
            </button>
          </div>

          {/* Emission visualizations */}
          <div className="mt-6 flex flex-col gap-4">
            {emissions.truck && (
              <div className="bg-gray-900 rounded-lg p-4 shadow-md">
                <h3 className="font-semibold mb-2">🚚 Truck (Diesel)</h3>
                <div className="h-52">
                  <svg id="viz-truck" width="100%" height="100%"></svg>
                </div>
              </div>
            )}
            {emissions.train && (
              <div className="bg-gray-900 rounded-lg p-4 shadow-md">
                <h3 className="font-semibold mb-2">🚂 Train (Rail Freight)</h3>
                <div className="h-52">
                  <svg id="viz-train" width="100%" height="100%"></svg>
                </div>
              </div>
            )}
          </div>

          {/* Best mode */}
          {bestMode && (
            <div className="mt-6 p-4 rounded-lg bg-green-900">
              <p className="font-semibold text-green-300">
                ✅ {bestMode.toUpperCase()} emits less CO₂ for this route.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT MAP */}
        <div className="w-full md:w-1/3">
          <MapContainer center={[22.5, 85.85]} zoom={9} className="h-72 w-full rounded-lg shadow-md" scrollWheelZoom={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[NOAMUNDI.lat, NOAMUNDI.lng]} icon={redIcon}>
              <Popup>Noamundi Mine</Popup>
            </Marker>
            <Marker position={[JAMSHEDPUR.lat, JAMSHEDPUR.lng]} icon={blueIcon}>
              <Popup>Jamshedpur Steel Hub</Popup>
            </Marker>
            <Polyline positions={[[NOAMUNDI.lat, NOAMUNDI.lng], [JAMSHEDPUR.lat, JAMSHEDPUR.lng]]} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default TransportPage;
