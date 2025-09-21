import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Papa from "papaparse";
import * as d3 from "d3";
import gsap from "gsap";

const MiningFeature = () => {
  const [model, setModel] = useState(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [ore, setOre] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [weight, setWeight] = useState("");
  const [csvData, setCsvData] = useState([]);
  const [showVisualization, setShowVisualization] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // Load AI model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("/models/ore-classifier/model.json");
        setModel(loadedModel);
        console.log("✅ Model loaded");
      } catch (err) {
        console.error("❌ Error loading model:", err);
      } finally {
        setLoadingModel(false);
      }
    };
    loadModel();
  }, []);

  // Load CSV Data once
  useEffect(() => {
    Papa.parse("/data/mining_ranges_dataset.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cleanedData = results.data.map(row => ({
          ...row,
          weight_range_ton: String(row.weight_range_ton).trim(),
          water_liters: parseFloat(row.water_liters) || 0,
          energy_MJ: parseFloat(row.energy_MJ) || 0,
          co2_kg: parseFloat(row.co2_kg) || 0,
          gases: {
            CO2: parseFloat(row.CO2_pct) || 0,
            CH4: parseFloat(row.CH4_pct) || 0,
            SO2: parseFloat(row.SO2_pct) || 0,
          },
        }));
        setCsvData(cleanedData);
        console.log("✅ CSV Loaded", cleanedData);
      },
      error: (err) => console.error("❌ CSV Error:", err),
    });
  }, []);

  // Handle image upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !model) return;

    setProcessing(true);
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        const tensor = tf.browser
          .fromPixels(img)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .expandDims();

        const predictions = model.predict(tensor);
        const data = await predictions.data();

        const classes = ["Bauxite", "Iron", "Copper", "Silver"];
        const maxIndex = data.indexOf(Math.max(...data));

        setOre(classes[maxIndex]);
        setConfidence((data[maxIndex] * 100).toFixed(2));
      } catch (err) {
        console.error("❌ Error processing image:", err);
      } finally {
        setProcessing(false);
      }
    };
  };

  // Generate visualization and recommendations
  const handleGenerate = () => {
    if (!ore || !weight) {
      alert("Please upload an ore image and enter a weight!");
      return;
    }

    setProcessing(true);

    const row = csvData.find(item => {
      if (!item.ore_type) return false;
      if (item.ore_type.toLowerCase() !== ore.toLowerCase()) return false;

      const [minStr, maxStr] = item.weight_range_ton.split("-");
      const min = parseFloat(minStr);
      const max = parseFloat(maxStr);

      return parseFloat(weight) >= min && parseFloat(weight) <= max;
    });

    if (row) {
      setRecommendations([
        "Implement carbon capture and storage (CCUS) to reduce CO2 emissions.",
        "Use hydrogen-based reduction processes for low-carbon production.",
        "Switch to renewable energy sources like solar for mining operations.",
        "Maximize the use of recycled scrap to minimize virgin ore extraction.",
        "Adopt sustainable biomass as a reductant to replace coal.",
        "Prioritize efficient design and reused materials to lower resource demand."
      ]);
    }

    setShowVisualization(true);
    setProcessing(false);
    renderVisualization(row);
  };

  // D3 visualization
  const renderVisualization = (row) => {
    const svg = d3.select("#visualization");
    svg.selectAll("*").remove();

    if (!row) return;

    const width = 800;
    const height = 900;  // Increased to accommodate pie and recommendations
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };

    svg.attr("viewBox", `0 0 ${width} ${height}`)
       .attr("preserveAspectRatio", "xMidYMid meet");

    // Title for both diagrams
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("class", "diagram-title")
      .text("Bargraph Representation, Pie Diagram");

    // 1️⃣ Environmental Impact Bar Chart
    const impact = [
      { label: "Water (L)", value: row.water_liters },
      { label: "Energy (MJ)", value: row.energy_MJ },
      { label: "CO₂ (kg)", value: row.co2_kg },
    ];

    const barColor = d3.scaleOrdinal(["#60a5fa", "#34d399", "#f87171"]);  // Blue, green, red

    const xScale = d3.scaleBand()
      .domain(impact.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(impact, d => d.value)])
      .nice()
      .range([height / 2.5, margin.top + 50]);  // Adjusted range for title

    // Bars with hover tooltips and different colors
    svg.selectAll(".bar")
      .data(impact)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.label))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height / 2.5 - yScale(d.value) + margin.top)
      .attr("fill", d => barColor(d.label))
      .attr("title", d => `${d.label}: ${d.value.toLocaleString()}`);

    // Values
    svg.selectAll(".label")
      .data(impact)
      .enter()
      .append("text")
      .attr("x", d => xScale(d.label) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.value) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text(d => d.value.toLocaleString());

    // X Axis
    svg.append("g")
      .attr("transform", `translate(0,${height / 2.5})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("fill", "white");

    // Y Axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .attr("fill", "white");

    // 2️⃣ Gas Emissions Pie Chart
    const gasData = Object.entries(row.gases).map(([key, value]) => ({ label: key, value }));

    const pieRadius = 150;  // Larger pie
    const pieX = width / 2;
    const pieY = height / 2 + margin.top + 200;  // Moved further down

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(pieRadius);

    const labelArc = d3.arc()
      .innerRadius(pieRadius)
      .outerRadius(pieRadius + 70);  // Extended for better label spacing

    const color = d3.scaleOrdinal()
      .domain(gasData.map(d => d.label))
      .range(["#ef4444", "#10b981", "#6366f1"]);

    // Pie slices with hover tooltips
    const arcs = svg.selectAll(".pie-arc")
      .data(pie(gasData))
      .enter()
      .append("g")
      .attr("class", "pie-arc")
      .attr("transform", `translate(${pieX}, ${pieY})`);

    arcs.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.label))
      .attr("title", d => `${d.data.value}% ${d.data.label}`);  // Updated hover format

    // Connector lines for labels
    arcs.append("polyline")
      .attr("stroke", "white")
      .attr("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", d => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        const posA = arc.centroid(d);
        const posB = labelArc.centroid(d);
        const posC = [pieRadius * (midAngle < Math.PI ? 1.2 : -1.2) * 1.1, posB[1]];
        return [posA, posB, posC];
      });

    // Outer labels
    arcs.append("text")
      .attr("transform", d => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        const pos = labelArc.centroid(d);
        pos[0] = pieRadius * (midAngle < Math.PI ? 1.2 : -1.2) * 1.1;
        return `translate(${pos})`;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", d => {
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midAngle < Math.PI ? "start" : "end";
      })
      .attr("fill", "white")
      .text(d => `${d.data.label}: ${d.data.value}%`);

    // Title for pie
    svg.append("text")
      .attr("x", pieX)
      .attr("y", pieY - pieRadius - 30)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text("Gas Emissions Distribution");

    // GSAP Animations
    gsap.from(".bar", { duration: 1, y: 50, opacity: 0, stagger: 0.2, ease: "power2.out" });
    gsap.from(".pie-arc path", { duration: 1, scale: 0, stagger: 0.2, ease: "elastic.out(1, 0.3)", delay: 1 });
  };

  return (
    <div className="p-6 min-h-screen max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Mining Phase – AI Classifier</h1>

      {/* Upload Image */}
      <div className="p-6 border-2 border-dashed border-indigo-400 rounded-lg text-center bg-gray-100">
        {loadingModel ? (
          <p className="text-gray-600">Loading AI model...</p>
        ) : (
          <>
            <input type="file" onChange={handleUpload} className="mb-4" />
            <p className="text-sm text-gray-500">Upload an ore/rock image</p>
          </>
        )}
      </div>

      {/* Detected ore + weight input */}
      {ore && (
        <div className="mt-4 flex items-center space-x-2">
          <h2 className="text-lg">
            Detected: <span className="text-yellow-600">{ore}</span> ({confidence}%)
          </h2>
          <input
            type="number"
            placeholder="Enter weight (tons)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="p-2 rounded bg-gray-100 text-gray-800 flex-1"
          />
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-indigo-600 rounded text-white hover:bg-indigo-700"
          >
            Generate
          </button>
        </div>
      )}

      {/* Processing loader */}
      {processing && <p className="mt-4 text-yellow-600 animate-pulse">Processing...</p>}

      {/* Visualization */}
      {showVisualization && (
        <svg id="visualization" width="100%" height="900" className="mt-6"></svg>
      )}

      {/* AI Recommendation Section */}
      {showVisualization && recommendations.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2 text-gray-800">AI Recommendations for Reducing Emissions</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default MiningFeature;