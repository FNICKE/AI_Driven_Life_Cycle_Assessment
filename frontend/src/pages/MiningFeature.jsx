import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as d3 from "d3";
import gsap from "gsap";

const MiningFeature = ({ onEmissionsCalculated }) => {
  const [model, setModel] = useState(null);
  const [loadingModel, setLoadingModel] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [ore, setOre] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [weight, setWeight] = useState("");
  const [showVisualization, setShowVisualization] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [prediction, setPrediction] = useState(null);

  // Load AI image classifier model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel(
          "/models/ore-classifier/model.json"
        );
        setModel(loadedModel);
        console.log("✅ Image classifier model loaded");
      } catch (err) {
        console.error("❌ Error loading model:", err);
      } finally {
        setLoadingModel(false);
      }
    };
    loadModel();
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
        console.log(
          "Detected ore:",
          classes[maxIndex],
          "Confidence:",
          data[maxIndex]
        );
      } catch (err) {
        console.error("❌ Error processing image:", err);
      } finally {
        setProcessing(false);
      }
    };
  };

  // Fetch ML prediction from backend
  const handleGenerate = async () => {
    if (!ore || !weight) {
      alert("Please upload an ore image and enter a weight!");
      return;
    }

    setProcessing(true);
    try {
      console.log("Fetching prediction from backend...");
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ore_type: ore, weight }),
      });

      const data = await response.json();
      console.log("Prediction data received:", data);

      if (!data || data.error) {
        alert("Prediction failed: " + (data?.error || "No data returned"));
        setProcessing(false);
        return;
      }

      setPrediction(data);

      // Generate insights
      const insights = [];
      if (data.co2_kg > data.water_liters && data.co2_kg > data.energy_MJ) {
        insights.push("CO₂ emissions dominate environmental impact.");
      }
      if (data.water_liters > data.energy_MJ) {
        insights.push("Water usage is higher than energy consumption.");
      } else {
        insights.push("Energy consumption is higher than water usage.");
      }
      const gases = { CO2: data.CO2_pct, CH4: data.CH4_pct, SO2: data.SO2_pct };
      const dominantGas = Object.entries(gases).reduce((a, b) =>
        a[1] > b[1] ? a : b
      );
      insights.push(`${dominantGas[0]} is the most emitted gas.`);

      setRecommendations(insights);

      if (onEmissionsCalculated) onEmissionsCalculated(data.co2_kg);

      setShowVisualization(true);
    } catch (err) {
      console.error("❌ Error fetching prediction:", err);
    } finally {
      setProcessing(false);
    }
  };

  // Visualization
  useEffect(() => {
    if (!showVisualization || !prediction) return;

    console.log("Rendering visualization...");
    const row = prediction;

    // --- Bar Chart ---
    const barSvg = d3.select("#barChart");
    barSvg.selectAll("*").remove();

    const barWidth = barSvg.node()?.clientWidth || 400;
    const barHeight = 400;
    const margin = { top: 40, right: 20, bottom: 60, left: 60 };

    const impact = [
      { label: "Water (L)", value: Number(row.water_liters), color: "#60a5fa" },
      { label: "Energy (MJ)", value: Number(row.energy_MJ), color: "#34d399" },
      { label: "CO₂ (kg)", value: Number(row.co2_kg), color: "#f87171" },
    ];

    const xScale = d3
      .scaleBand()
      .domain(impact.map((d) => d.label))
      .range([margin.left, barWidth - margin.right])
      .padding(0.4);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(impact, (d) => d.value) * 1.1])
      .nice()
      .range([barHeight - margin.bottom, margin.top]);

    // Bars (initial height = 0)
    const bars = barSvg
      .selectAll(".bar")
      .data(impact)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.label))
      .attr("y", yScale(0))
      .attr("width", xScale.bandwidth())
      .attr("height", 0)
      .attr("fill", (d) => d.color);

    // Value labels above bars
    const labels = barSvg
      .selectAll(".bar-label")
      .data(impact)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", (d) => xScale(d.label) + xScale.bandwidth() / 2)
      .attr("y", yScale(0) - 5)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text((d) => d.value.toFixed(2));

    // Axes
    barSvg
      .append("g")
      .attr("transform", `translate(0,${barHeight - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("fill", "white");

    barSvg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .attr("fill", "white");

    // GSAP animate bars + labels
    bars.each(function (d, i) {
      gsap.to(this, {
        duration: 1,
        attr: {
          y: yScale(d.value),
          height: barHeight - margin.bottom - yScale(d.value),
        },
        delay: i * 0.2,
        ease: "power2.out",
      });
    });

    labels.each(function (d, i) {
      gsap.to(this, {
        duration: 1,
        attr: { y: yScale(d.value) - 5 },
        delay: i * 0.2,
        ease: "power2.out",
      });
    });

    // --- Pie Chart ---
    // --- Pie Chart ---
const pieSvg = d3.select("#pieChart");
pieSvg.selectAll("*").remove();

const pieWidth = 400;
const pieHeight = 400;
const radius = Math.min(pieWidth, pieHeight) / 2 - 20;

const pieData = [
  { label: "CO2", value: Number(row.CO2_pct) },
  { label: "CH4", value: Number(row.CH4_pct) },
  { label: "SO2", value: Number(row.SO2_pct) },
];

const pieGroup = pieSvg
  .append("g")
  .attr("transform", `translate(${pieWidth / 2}, ${pieHeight / 2})`);

const pie = d3.pie().value((d) => d.value).sort(null);
const arc = d3.arc().innerRadius(0).outerRadius(radius);
const outerArc = d3.arc().innerRadius(radius * 1.2).outerRadius(radius * 1.2);

const color = d3
  .scaleOrdinal()
  .domain(pieData.map((d) => d.label))
  .range(["#ef4444", "#10b981", "#6366f1"]);

const arcs = pieGroup
  .selectAll(".arc")
  .data(pie(pieData))
  .enter()
  .append("g")
  .attr("class", "arc");

const paths = arcs
  .append("path")
  .attr("fill", (d) => color(d.data.label));

// Animate slices with GSAP
paths.each(function (d, i) {
  const path = d3.select(this);
  const interpolate = d3.interpolate(
    { startAngle: 0, endAngle: 0 },
    d
  );

  gsap.to({ t: 0 }, {
    duration: 1,
    delay: i * 0.2,
    t: 1,
    ease: "power2.out",
    onUpdate: function () {
      path.attr("d", arc(interpolate(this.targets()[0].t)));
    },
  });
});

// ✅ Show % inside slices
arcs
  .append("text")
  .attr("transform", (d) => `translate(${arc.centroid(d)})`)
  .attr("dy", "0.35em")
  .attr("text-anchor", "middle")
  .attr("fill", "white")
  .text((d) => `${d.data.value}%`);

// ❌ Removed leader lines

// ✅ Outside labels (just gas names, no %)
pieGroup.selectAll(".label")
  .data(pie(pieData))
  .enter()
  .append("text")
  .attr("transform", (d) => {
    const [x, y] = outerArc.centroid(d);
    const constrainedX = Math.max(-pieWidth / 2 + 10, Math.min(x, pieWidth / 2 - 10));
    const constrainedY = Math.max(-pieHeight / 2 + 10, Math.min(y, pieHeight / 2 - 10));
    return `translate(${constrainedX}, ${constrainedY})`;
  })
  .attr("dy", "0.35em")
  .attr("text-anchor", "middle")
  .style("fill", "white")
  .style("font-size", "14px")
  .text((d) => `${d.data.label}`);


  }, [showVisualization, prediction]);

  return (
    <div className="p-6 min-h-screen max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 flex items-center space-x-2">
        <span>⛏️</span>
        <span>Mining Phase – AI Classifier</span>
      </h1>

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
        <div className="mt-4 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
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
      {processing && (
        <p className="mt-4 text-yellow-600 animate-pulse">Processing...</p>
      )}

      {/* Visualization */}
      {showVisualization && prediction && (
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1 p-4 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2 text-center">
              Consumption Factors
            </h3>
            <svg id="barChart" width="100%" height="450"></svg>
          </div>
          <div className="flex-1 p-4 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2 text-center">
              Gas Emissions Distribution
            </h3>
            <svg id="pieChart" width="100%" height="450"></svg>
          </div>
        </div>
      )}

      {/* AI Insights Section */}
      {showVisualization && recommendations.length > 0 && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2 text-gray-800">
            AI Review of Environmental Impact
          </h3>
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
