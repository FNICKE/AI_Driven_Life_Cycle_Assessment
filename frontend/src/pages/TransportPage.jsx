import React, { useState, useEffect, useCallback } from "react";
import * as d3 from "d3";
import gsap from "gsap";

const TransportPage = () => {
  const [mode, setMode] = useState("ship");
  const [distance, setDistance] = useState(450);
  const [weight, setWeight] = useState(30);
  const [emissions, setEmissions] = useState(null);
  const [showViz, setShowViz] = useState(false);

  // 🚀 Calculation function
  const calculateEmissions = () => {
    const factor = mode === "ship" ? 0.02 : 0.1; // Example factors
    const co2e = distance * weight * factor;
    return { co2e };
  };

  // 🚀 Visualization function wrapped in useCallback
  const renderVisualization = useCallback(
    (data) => {
      const svg = d3.select("#transport-viz");
      svg.selectAll("*").remove();

      if (!data || !data.co2e) return;

      const container = document.getElementById("transport-viz");
      const width = container?.clientWidth || 800;
      const height = 400;
      const margin = { top: 60, right: 30, bottom: 60, left: 60 };

      const g = svg
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      // X and Y scales
      const x = d3
        .scaleBand()
        .domain(["Total CO₂e (kg)"])
        .range([0, innerWidth])
        .padding(0.4);

      const y = d3
        .scaleLinear()
        .domain([0, data.co2e * 1.2]) // 20% headroom
        .nice()
        .range([innerHeight, 0]);

      // Bar
      const bar = g
        .selectAll(".bar")
        .data([data.co2e])
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => x("Total CO₂e (kg)"))
        .attr("width", x.bandwidth())
        .attr("y", innerHeight)
        .attr("height", 0)
        .attr("fill", "red");

      gsap.to(bar.nodes(), {
        duration: 1,
        attr: {
          y: y(data.co2e),
          height: innerHeight - y(data.co2e),
        },
        ease: "power3.out",
      });

      // Axes
      g.append("g")
        .attr("transform", `translate(0,${innerHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("font-size", "14px")
        .attr("transform", "rotate(-25)")
        .style("text-anchor", "end");

      g.append("g").call(d3.axisLeft(y).ticks(6));

      // Title
      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text(`Emissions for Iron Ore Transport (${mode.toUpperCase()})`);

      // Value above bar
      g.append("text")
        .attr("x", x("Total CO₂e (kg)") + x.bandwidth() / 2)
        .attr("y", y(data.co2e) - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "#fff")
        .text(data.co2e.toFixed(2));
    },
    [mode]
  );

  // 🚀 Effect hook
  useEffect(() => {
    if (showViz && emissions) {
      renderVisualization(emissions);
    }
  }, [showViz, emissions, renderVisualization]);

  // 🚀 Handle Generate Button
  const handleGenerate = () => {
    const result = calculateEmissions();
    setEmissions(result);
    setShowViz(true);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#4f46e5" }}>Transportation Phase</h2>
      <p>
        Mineral: <span style={{ color: "red" }}>Iron Ore</span> | Default
        Distance: 115.33 km
      </p>

      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{
            fontSize: "16px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="ship">Ship (Container)</option>
          <option value="truck">Truck</option>
          <option value="train">Train</option>
        </select>

        <input
          type="number"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          placeholder="Distance (km)"
          style={{
            fontSize: "16px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "150px",
          }}
        />

        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          placeholder="Weight (tonnes)"
          style={{
            fontSize: "16px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "150px",
          }}
        />
      </div>

      <div style={{ marginTop: "10px", textAlign: "left" }}>
        <button
          onClick={handleGenerate}
          style={{
            background: "#4f46e5",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Generate Emissions
        </button>
      </div>

      <svg id="transport-viz" width="100%" height="400"></svg>
    </div>
  );
};

export default TransportPage;
