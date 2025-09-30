import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Leaf, Zap, Droplets, Trash2, Calculator, TrendingUp, Award, Target, AlertTriangle, Factory, Truck, Recycle, Globe, Shield, Building, Users, DollarSign, Activity, BarChart3, PieChart as PieChartIcon, MapPin, Clock, Thermometer, MessageCircle } from "lucide-react";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';

// Custom icons
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

const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// Enhanced sample data with more comprehensive information
const minerals = [
  {
    name: "Coal",
    mine: { name: "Jharia Coal Mine", position: [23.7833, 86.43], capacity: "15 MT/year", established: "1894" },
    production: { name: "Jamshedpur Steel Hub", position: [22.8046, 86.2029], capacity: "10 MT steel/year", employees: 45000 },
    emissions: 120,
    water: 850,
    energy: 45,
    waste: 35,
    sustainability_score: 'C',
    costPerTon: 4500,
    transportEmissions: 25,
    processingEmissions: 75,
    recyclingPotential: 15,
    healthImpactScore: 6.8,
    biodiversityImpact: 7.2,
    communityImpact: 5.9,
    economicImpact: 8.5
  },
  {
    name: "Iron Ore",
    mine: { name: "Noamundi Iron Mine", position: [22.08, 85.4], capacity: "8 MT/year", established: "1904" },
    production: { name: "Jamshedpur Steel Hub", position: [22.8046, 86.2029], capacity: "10 MT steel/year", employees: 45000 },
    emissions: 95,
    water: 720,
    energy: 38,
    waste: 28,
    sustainability_score: 'B',
    costPerTon: 3200,
    transportEmissions: 18,
    processingEmissions: 65,
    recyclingPotential: 25,
    healthImpactScore: 5.4,
    biodiversityImpact: 6.1,
    communityImpact: 6.8,
    economicImpact: 8.2
  },
  {
    name: "Aluminum",
    mine: { name: "Bauxite Hills Mine", position: [21.25, 81.5], capacity: "5 MT/year", established: "1962" },
    production: { name: "Renukoot Aluminum Plant", position: [24.2, 83.0], capacity: "2 MT aluminum/year", employees: 12000 },
    emissions: 180,
    water: 1200,
    energy: 85,
    waste: 45,
    sustainability_score: 'D',
    costPerTon: 8500,
    transportEmissions: 35,
    processingEmissions: 125,
    recyclingPotential: 85,
    healthImpactScore: 7.8,
    biodiversityImpact: 8.5,
    communityImpact: 6.2,
    economicImpact: 7.8
  }
];

const phases = [
  { name: "Mining", icon: Factory },
  { name: "Transportation", icon: Truck },
  { name: "Production", icon: Building },
  { name: "Recycling", icon: Recycle },
  { name: "Impact Calculator", icon: Calculator },
  { name: "Circularity Simulator", icon: Globe },
  { name: "AI Recommendations", icon: Target },
  { name: "ESG Dashboard", icon: BarChart3 }
];

const COLORS = ['#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];

const DashboardPage = () => {
  const [selectedMineral, setSelectedMineral] = useState(null);
  const [activePhase, setActivePhase] = useState(null);
  const [distance, setDistance] = useState(null);
  const [circularityPercentage, setCircularityPercentage] = useState(20);
  const [carbonTax, setCarbonTax] = useState(1000);
  const [forecastData, setForecastData] = useState([]);
  const [realTimeData, setRealTimeData] = useState({});
  const [selectedMaterial, setSelectedMaterial] = useState("Coal");
  const [productionVolume, setProductionVolume] = useState(1000);
  const [miningMethod, setMiningMethod] = useState("Open Pit");
  const [equipment, setEquipment] = useState("Hydraulic Excavator");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // Enhanced forecast data
  useEffect(() => {
    const data = [];
    for (let year = 2025; year <= 2035; year++) {
      data.push({
        year: year,
        traditional: 150 + (year - 2025) * 8 + Math.random() * 10,
        green: 150 - (year - 2025) * 12 + Math.random() * 5,
        circular: 150 - (year - 2025) * 18 + Math.random() * 8,
      });
    }
    setForecastData(data);
  }, []);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        currentProduction: Math.floor(Math.random() * 100 + 850),
        energyEfficiency: Math.floor(Math.random() * 10 + 82),
        waterRecycling: Math.floor(Math.random() * 15 + 65),
        emissionReduction: Math.floor(Math.random() * 8 + 25)
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
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
    setActivePhase("Impact Calculator");

    const d = calculateDistance(
      mineral.mine.position[0],
      mineral.mine.position[1],
      mineral.production.position[0],
      mineral.production.position[1]
    );
    setDistance(d);
  };

  const calculateCircularityBenefit = () => {
    if (!selectedMineral) return 0;
    const baseEmissions = selectedMineral.emissions;
    const reduction = (baseEmissions * circularityPercentage * 0.6) / 100;
    return reduction.toFixed(1);
  };

  const calculateCarbonTaxImpact = () => {
    if (!selectedMineral) return 0;
    return ((selectedMineral.emissions * carbonTax) / 1000).toFixed(0);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', text: chatInput }]);
    
    // Simulate bot response
    let botResponse = "I'm analyzing your query...";
    if (chatInput.toLowerCase().includes('emissions')) {
      botResponse = `Current emissions for ${selectedMineral?.name || 'selected mineral'}: ${selectedMineral?.emissions || 'N/A'} kg/ton. Suggestions: Increase recycling to reduce by up to 30%.`;
    } else if (chatInput.toLowerCase().includes('sustainability')) {
      botResponse = `Sustainability score: ${selectedMineral?.sustainability_score || 'N/A'}. To improve, focus on water recycling and energy efficiency.`;
    } else {
      botResponse = `Interesting question! For ${chatInput}, I recommend checking the ESG Dashboard for more insights.`;
    }
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 1000);
    
    setChatInput("");
  };

  const renderImpactCalculator = () => {
    const emissionBreakdown = [
      { name: 'Mining', value: 45, color: '#EF4444' },
      { name: 'Transport', value: selectedMineral?.transportEmissions || 20, color: '#F59E0B' },
      { name: 'Processing', value: selectedMineral?.processingEmissions || 60, color: '#8B5CF6' },
      { name: 'Waste', value: 15, color: '#6B7280' }
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Real-time metrics with enhanced animations */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-medium">CO₂ Emissions</p>
                <p className="text-3xl font-bold animate-pulse">{selectedMineral?.emissions}</p>
                <p className="text-xs opacity-75">kg/ton</p>
              </div>
              <Leaf className="h-10 w-10 opacity-75 animate-bounce" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-medium">Water Usage</p>
                <p className="text-3xl font-bold animate-pulse">{selectedMineral?.water}</p>
                <p className="text-xs opacity-75">L/ton</p>
              </div>
              <Droplets className="h-10 w-10 opacity-75 animate-bounce" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-medium">Energy Use</p>
                <p className="text-3xl font-bold animate-pulse">{selectedMineral?.energy}</p>
                <p className="text-xs opacity-75">kWh/ton</p>
              </div>
              <Zap className="h-10 w-10 opacity-75 animate-bounce" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gray-500 to-gray-600 p-6 rounded-xl text-white shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 font-medium">Waste Generated</p>
                <p className="text-3xl font-bold animate-pulse">{selectedMineral?.waste}</p>
                <p className="text-xs opacity-75">kg/ton</p>
              </div>
              <Trash2 className="h-10 w-10 opacity-75 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Economic and Social Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-green-500 transition-colors">
            <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center animate-slide-in">
              <DollarSign className="mr-2 animate-spin-slow" /> Economic Impact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <p className="text-sm text-gray-300">Cost per Ton</p>
                <p className="text-2xl font-bold text-green-400">₹{selectedMineral?.costPerTon}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
                <p className="text-sm text-gray-300">Jobs Created</p>
                <p className="text-2xl font-bold text-blue-400">{selectedMineral?.production?.employees?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-purple-500 transition-colors">
            <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center animate-slide-in">
              <Users className="mr-2 animate-spin-slow" /> Social & Health Impact
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Health Impact Score</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-600 rounded mr-2">
                    <div 
                      className="h-2 bg-red-500 rounded animate-fill-bar" 
                      style={{width: `${(selectedMineral?.healthImpactScore / 10) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-red-400">{selectedMineral?.healthImpactScore}/10</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Community Impact</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-600 rounded mr-2">
                    <div 
                      className="h-2 bg-yellow-500 rounded animate-fill-bar" 
                      style={{width: `${(selectedMineral?.communityImpact / 10) * 100}%`}}
                    ></div>
                  </div>
                  <span className="text-yellow-400">{selectedMineral?.communityImpact}/10</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emission Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-indigo-500 transition-colors">
            <h3 className="text-xl font-bold mb-4 text-indigo-300 flex items-center animate-slide-in">
              <PieChartIcon className="mr-2 animate-spin-slow" /> Emission Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={emissionBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {emissionBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-indigo-500 transition-colors">
            <h3 className="text-xl font-bold mb-4 text-indigo-300 flex items-center animate-slide-in">
              <BarChart3 className="mr-2 animate-spin-slow" /> Comparative Analysis
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={minerals} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Bar dataKey="emissions" fill="#EF4444" name="CO₂ (kg/ton)" />
                <Bar dataKey="energy" fill="#F59E0B" name="Energy (kWh/ton)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderCircularitySimulator = () => (
    <div className="space-y-6 animate-fade-in">
      {/* Circularity Controls */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-green-500 transition-colors">
        <h3 className="text-2xl font-bold mb-6 text-green-400 flex items-center animate-slide-in">
          <Recycle className="mr-3 animate-spin-slow" /> Advanced Circularity Simulator
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Recycled Content: {circularityPercentage}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={circularityPercentage}
                onChange={(e) => setCircularityPercentage(e.target.value)}
                className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer hover:h-4 transition-height"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg text-white hover:scale-105 transition-transform">
                <p className="text-sm font-medium">CO₂ Reduction</p>
                <p className="text-2xl font-bold">{calculateCircularityBenefit()}</p>
                <p className="text-xs opacity-90">kg/ton saved</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg text-white hover:scale-105 transition-transform">
                <p className="text-sm font-medium">Energy Savings</p>
                <p className="text-2xl font-bold">{(circularityPercentage * 0.7).toFixed(0)}%</p>
                <p className="text-xs opacity-90">efficiency gain</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3 text-indigo-300">3D Material Flow Visualization</h4>
            <div className="h-64 bg-gray-900 rounded-xl overflow-hidden">
              <Canvas>
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />
                <OrbitControls enableZoom={false} />
                <mesh>
                  <Sphere args={[1, 32, 32]}>
                    <MeshDistortMaterial
                      color="#10B981"
                      attach="material"
                      distort={0.5}
                      speed={2}
                      roughness={0}
                    />
                  </Sphere>
                </mesh>
              </Canvas>
            </div>
          </div>
        </div>
      </div>

      {/* Circular Economy Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-green-700 p-6 rounded-xl text-white shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center mb-4">
            <Globe className="h-8 w-8 mr-3 animate-spin-slow" />
            <h4 className="text-lg font-bold">Environmental Impact</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Waste Reduction</span>
              <span className="font-bold">{(circularityPercentage * 0.8).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Water Savings</span>
              <span className="font-bold">{(circularityPercentage * 0.6).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Land Use Reduction</span>
              <span className="font-bold">{(circularityPercentage * 0.4).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl text-white shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center mb-4">
            <DollarSign className="h-8 w-8 mr-3 animate-spin-slow" />
            <h4 className="text-lg font-bold">Economic Benefits</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Cost Savings</span>
              <span className="font-bold">₹{(circularityPercentage * 150).toFixed(0)}/ton</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Revenue from Scrap</span>
              <span className="font-bold">₹{(circularityPercentage * 80).toFixed(0)}/ton</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">ROI Timeline</span>
              <span className="font-bold">{Math.max(12 - circularityPercentage/10, 2).toFixed(0)} months</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-pink-700 p-6 rounded-xl text-white shadow-2xl hover:scale-105 transition-all duration-300">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 mr-3 animate-spin-slow" />
            <h4 className="text-lg font-bold">Risk Mitigation</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Supply Chain Risk</span>
              <span className="font-bold">{Math.max(100 - circularityPercentage, 0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Price Volatility</span>
              <span className="font-bold">{Math.max(80 - circularityPercentage * 0.6, 20).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Regulatory Risk</span>
              <span className="font-bold">{Math.max(70 - circularityPercentage * 0.5, 10).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAIRecommendations = () => (
    <div className="space-y-6 animate-fade-in">
      {/* AI Insights Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 rounded-xl text-white shadow-2xl hover:shadow-purple-500/50 transition-shadow">
        <h3 className="text-2xl font-bold mb-4 flex items-center animate-slide-in">
          <Target className="mr-3 animate-bounce" /> AI-Powered Sustainability Recommendations
        </h3>
        <p className="text-lg opacity-90">Based on advanced machine learning analysis of your operation data</p>
      </div>

      {/* Priority Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-green-400 mb-4 animate-slide-in">High Priority Actions</h4>
          
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 p-6 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <Recycle className="h-6 w-6 text-green-400 mr-2 animate-spin-slow" />
                <h5 className="font-bold text-green-400">Switch to Electric Arc Furnace</h5>
              </div>
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">HIGH</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">Replace blast furnace with electric arc technology for steel production</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400">CO₂ Reduction:</span>
                <span className="text-green-400 font-bold ml-1">40%</span>
              </div>
              <div>
                <span className="text-gray-400">Annual Savings:</span>
                <span className="text-green-400 font-bold ml-1">₹2.5M</span>
              </div>
              <div>
                <span className="text-gray-400">Implementation:</span>
                <span className="text-yellow-400 font-bold ml-1">18 months</span>
              </div>
              <div>
                <span className="text-gray-400">Payback Period:</span>
                <span className="text-green-400 font-bold ml-1">3.2 years</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 p-6 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <Droplets className="h-6 w-6 text-blue-400 mr-2 animate-spin-slow" />
                <h5 className="font-bold text-blue-400">Advanced Water Recycling</h5>
              </div>
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">HIGH</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">Implement closed-loop water recycling system with AI monitoring</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Water Savings:</span>
                <span className="text-blue-400 font-bold ml-1">65%</span>
              </div>
              <div>
                <span className="text-gray-400">Cost Reduction:</span>
                <span className="text-blue-400 font-bold ml-1">₹1.8M/year</span>
              </div>
              <div>
                <span className="text-gray-400">Implementation:</span>
                <span className="text-yellow-400 font-bold ml-1">12 months</span>
              </div>
              <div>
                <span className="text-gray-400">ROI:</span>
                <span className="text-blue-400 font-bold ml-1">2.8 years</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xl font-bold text-yellow-400 mb-4 animate-slide-in">Medium Priority Actions</h4>
          
          <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 p-6 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <Zap className="h-6 w-6 text-yellow-400 mr-2 animate-spin-slow" />
                <h5 className="font-bold text-yellow-400">Renewable Energy Integration</h5>
              </div>
              <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">MED</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">Install solar panels and wind turbines for 60% renewable energy mix</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Emission Reduction:</span>
                <span className="text-yellow-400 font-bold ml-1">35%</span>
              </div>
              <div>
                <span className="text-gray-400">Energy Cost Savings:</span>
                <span className="text-yellow-400 font-bold ml-1">₹3.2M/year</span>
              </div>
              <div>
                <span className="text-gray-400">Implementation:</span>
                <span className="text-yellow-400 font-bold ml-1">24 months</span>
              </div>
              <div>
                <span className="text-gray-400">Payback Period:</span>
                <span className="text-green-400 font-bold ml-1">4 years</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-6 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <Activity className="h-6 w-6 text-purple-400 mr-2 animate-spin-slow" />
                <h5 className="font-bold text-purple-400">Predictive Maintenance AI</h5>
              </div>
              <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold">MED</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">Deploy IoT sensors and AI algorithms for equipment failure prediction</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400">Downtime Reduction:</span>
                <span className="text-purple-400 font-bold ml-1">45%</span>
              </div>
              <div>
                <span className="text-gray-400">Maintenance Savings:</span>
                <span className="text-purple-400 font-bold ml-1">₹1.5M/year</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderESGDashboard = () => {
    const sustainabilityData = [
      {
        subject: 'Carbon Footprint',
        A: 85,
        B: 65,
        fullMark: 100,
      },
      {
        subject: 'Water Management',
        A: 70,
        B: 80,
        fullMark: 100,
      },
      {
        subject: 'Waste Reduction',
        A: 60,
        B: 75,
        fullMark: 100,
      },
      {
        subject: 'Energy Efficiency',
        A: 90,
        B: 70,
        fullMark: 100,
      },
      {
        subject: 'Social Impact',
        A: 75,
        B: 85,
        fullMark: 100,
      },
      {
        subject: 'Governance',
        A: 95,
        B: 90,
        fullMark: 100,
      },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        {/* ESG Overview Cards with enhanced effects */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-xl text-white text-center shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all duration-300 hover:shadow-green-500/50">
            <Award className="h-10 w-10 mx-auto mb-3 animate-bounce" />
            <p className="text-sm font-medium opacity-90">Sustainability Score</p>
            <p className="text-4xl font-bold">{selectedMineral?.sustainability_score}</p>
            <p className="text-xs opacity-75">Industry Grade</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white text-center shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all duration-300 hover:shadow-blue-500/50">
            <TrendingUp className="h-10 w-10 mx-auto mb-3 animate-bounce" />
            <p className="text-sm font-medium opacity-90">ESG Progress</p>
            <p className="text-4xl font-bold">67%</p>
            <p className="text-xs opacity-75">vs Target</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white text-center shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all duration-300 hover:shadow-purple-500/50">
            <Target className="h-10 w-10 mx-auto mb-3 animate-bounce" />
            <p className="text-sm font-medium opacity-90">Net-Zero Target</p>
            <p className="text-4xl font-bold">2035</p>
            <p className="text-xs opacity-75">Timeline</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-xl text-white text-center shadow-2xl transform hover:scale-105 hover:rotate-2 transition-all duration-300 hover:shadow-orange-500/50">
            <Clock className="h-10 w-10 mx-auto mb-3 animate-bounce" />
            <p className="text-sm font-medium opacity-90">Progress to Date</p>
            <p className="text-4xl font-bold">32%</p>
            <p className="text-xs opacity-75">Emissions Reduced</p>
          </div>
        </div>

        {/* Real-time Monitoring */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-green-500 transition-colors">
            <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center animate-slide-in">
              <Activity className="mr-2 animate-pulse" /> Real-time Operations
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors">
                <p className="text-sm text-gray-300">Current Production</p>
                <p className="text-2xl font-bold text-green-400">{realTimeData.currentProduction || 875}</p>
                <p className="text-xs text-gray-400">tons/day</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors">
                <p className="text-sm text-gray-300">Energy Efficiency</p>
                <p className="text-2xl font-bold text-blue-400">{realTimeData.energyEfficiency || 87}%</p>
                <p className="text-xs text-gray-400">vs target</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors">
                <p className="text-sm text-gray-300">Water Recycling</p>
                <p className="text-2xl font-bold text-cyan-400">{realTimeData.waterRecycling || 72}%</p>
                <p className="text-xs text-gray-400">current rate</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors">
                <p className="text-sm text-gray-300">Emission Reduction</p>
                <p className="text-2xl font-bold text-purple-400">{realTimeData.emissionReduction || 28}%</p>
                <p className="text-xs text-gray-400">this month</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-purple-500 transition-colors">
            <h3 className="text-xl font-bold mb-4 text-purple-400 flex items-center animate-slide-in">
              <BarChart3 className="mr-2 animate-pulse" /> ESG Performance Radar
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={sustainabilityData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Current" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                <Radar name="Industry Avg" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.1} />
                <RechartsTooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Emission Forecast */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 hover:border-indigo-500 transition-colors">
          <h3 className="text-xl font-bold mb-4 text-indigo-300 flex items-center animate-slide-in">
            <TrendingUp className="mr-2 animate-pulse" /> 10-Year Emission Forecast
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={forecastData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorTraditional" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCircular" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="year" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Area type="monotone" dataKey="traditional" stackId="1" stroke="#EF4444" fillOpacity={1} fill="url(#colorTraditional)" name="Traditional Methods" />
              <Area type="monotone" dataKey="green" stackId="2" stroke="#10B981" fillOpacity={1} fill="url(#colorGreen)" name="Green Technology" />
              <Area type="monotone" dataKey="circular" stackId="3" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCircular)" name="Circular Economy" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 p-6 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="flex items-center mb-3">
              <AlertTriangle className="h-6 w-6 text-red-400 mr-3 animate-pulse" />
              <div>
                <h4 className="font-bold text-red-400">Critical Alert</h4>
                <p className="text-sm text-gray-300">Water usage exceeds regulatory limits by 12%</p>
              </div>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Threshold: 800 L/ton | Current: 896 L/ton</div>
              <div>Action Required: Implement water recycling immediately</div>
              <div>Deadline: 15 days remaining</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 p-6 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="flex items-center mb-3">
              <Thermometer className="h-6 w-6 text-yellow-400 mr-3 animate-pulse" />
              <div>
                <h4 className="font-bold text-yellow-400">Warning</h4>
                <p className="text-sm text-gray-300">CO₂ emissions trending 8% above target</p>
              </div>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              <div>Target: 95 kg/ton | Current: 103 kg/ton</div>
              <div>Trend: Increasing over last 30 days</div>
              <div>Recommendation: Review energy mix optimization</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPhaseContent = () => {
    switch (activePhase) {
      case "Mining":
        const materialOptions = ["Coal", "Iron Ore", "Copper", "Aluminum", "Gold", "Silver", "Limestone", "Bauxite"];
        const miningMethods = ["Open Pit", "Underground", "Strip Mining", "Mountaintop Removal"];
        const equipmentTypes = ["Hydraulic Excavator", "Dragline", "Shovel", "Bulldozer", "Haul Truck", "Drill Rig"];

        // Gas emission calculations based on material and method
        const calculateGasEmissions = () => {
          const baseEmissions = {
            "Coal": { co2: 2.4, ch4: 0.028, n2o: 0.0008, so2: 0.016 },
            "Iron Ore": { co2: 1.8, ch4: 0.015, n2o: 0.0005, so2: 0.008 },
            "Copper": { co2: 3.2, ch4: 0.035, n2o: 0.0012, so2: 0.024 },
            "Aluminum": { co2: 4.1, ch4: 0.045, n2o: 0.0015, so2: 0.032 },
            "Gold": { co2: 18.5, ch4: 0.125, n2o: 0.0085, so2: 0.095 },
            "Silver": { co2: 12.3, ch4: 0.089, n2o: 0.0056, so2: 0.067 },
            "Limestone": { co2: 0.9, ch4: 0.008, n2o: 0.0003, so2: 0.004 },
            "Bauxite": { co2: 2.1, ch4: 0.022, n2o: 0.0007, so2: 0.012 }
          };

          const methodMultiplier = {
            "Open Pit": 1.0,
            "Underground": 1.3,
            "Strip Mining": 1.1,
            "Mountaintop Removal": 1.5
          };

          const equipmentMultiplier = {
            "Hydraulic Excavator": 1.0,
            "Dragline": 1.4,
            "Shovel": 1.2,
            "Bulldozer": 0.8,
            "Haul Truck": 1.1,
            "Drill Rig": 0.9
          };

          const base = baseEmissions[selectedMaterial] || baseEmissions["Coal"];
          const methodFactor = methodMultiplier[miningMethod] || 1.0;
          const equipmentFactor = equipmentMultiplier[equipment] || 1.0;
          const totalFactor = methodFactor * equipmentFactor * (productionVolume / 1000);

          return {
            co2: (base.co2 * totalFactor).toFixed(2),
            ch4: (base.ch4 * totalFactor).toFixed(3),
            n2o: (base.n2o * totalFactor).toFixed(4),
            so2: (base.so2 * totalFactor).toFixed(3),
            totalWeight: ((base.co2 + base.ch4 + base.n2o + base.so2) * totalFactor).toFixed(2)
          };
        };

        const emissions = calculateGasEmissions();

        return (
          <div className="space-y-6 animate-fade-in">
            {/* Material Selection Interface */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 p-6 shadow-2xl hover:shadow-orange-500/30 transition-shadow">
              <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center animate-slide-in">
                <Factory className="mr-3 animate-spin-slow" /> Manual Mining Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition-colors">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Material Type</label>
                  <select 
                    value={selectedMaterial}
                    onChange={(e) => setSelectedMaterial(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  >
                    {materialOptions.map(material => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition-colors">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mining Method</label>
                  <select 
                    value={miningMethod}
                    onChange={(e) => setMiningMethod(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  >
                    {miningMethods.map(method => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition-colors">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Equipment</label>
                  <select 
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                  >
                    {equipmentTypes.map(eq => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-800 p-4 rounded-xl hover:bg-gray-700 transition-colors">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Production Volume: {productionVolume.toLocaleString()} tons/day
                  </label>
                  <input 
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={productionVolume}
                    onChange={(e) => setProductionVolume(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider hover:h-3 transition-height"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>100</span>
                    <span>5,050</span>
                    <span>10,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Carbon Cost</span>
                    <span className="text-red-400 font-bold">₹{(parseFloat(emissions.totalWeight) * 2.5).toFixed(0)}/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Profit Margin</span>
                    <span className="text-yellow-400 font-bold">{Math.max(15, 45 - (parseFloat(emissions.totalWeight) / 100)).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Monitoring */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 shadow-2xl hover:border-blue-500 transition-colors">
              <h3 className="text-xl font-bold text-indigo-300 mb-4 flex items-center animate-slide-in">
                <Activity className="mr-2 animate-pulse" /> Real-time Mining Operations
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors">
                  <div className="text-2xl font-bold text-green-400">{(productionVolume * 0.85 + Math.random() * 50).toFixed(0)}</div>
                  <div className="text-sm text-gray-300">Current Production</div>
                  <div className="text-xs text-gray-400">tons/day</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors">
                  <div className="text-2xl font-bold text-blue-400">{(85 + Math.random() * 10).toFixed(1)}%</div>
                  <div className="text-sm text-gray-300">Equipment Uptime</div>
                  <div className="text-xs text-gray-400">operational</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors">
                  <div className="text-2xl font-bold text-yellow-400">{(20 + Math.random() * 15).toFixed(0)}</div>
                  <div className="text-sm text-gray-300">Workers Active</div>
                  <div className="text-xs text-gray-400">current shift</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors">
                  <div className="text-2xl font-bold text-red-400">{emissions.co2}</div>
                  <div className="text-sm text-gray-300">CO₂ Today</div>
                  <div className="text-xs text-gray-400">kg emitted</div>
                </div>
              </div>
            </div>

            {/* Gas Emissions Breakdown */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-6 shadow-2xl hover:border-red-500 transition-colors">
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center animate-slide-in">
                <Thermometer className="mr-3 animate-pulse" /> Detailed Gas Emissions Analysis
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-xl text-white text-center hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold">{emissions.co2}</div>
                  <div className="text-sm opacity-90">kg CO₂</div>
                  <div className="text-xs opacity-75">Carbon Dioxide</div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-xl text-white text-center hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold">{emissions.ch4}</div>
                  <div className="text-sm opacity-90">kg CH₄</div>
                  <div className="text-xs opacity-75">Methane</div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-xl text-white text-center hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold">{emissions.n2o}</div>
                  <div className="text-sm opacity-90">kg N₂O</div>
                  <div className="text-xs opacity-75">Nitrous Oxide</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white text-center hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold">{emissions.so2}</div>
                  <div className="text-sm opacity-90">kg SO₂</div>
                  <div className="text-xs opacity-75">Sulfur Dioxide</div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-4 rounded-xl text-white text-center hover:scale-105 transition-transform">
                  <div className="text-2xl font-bold">{emissions.totalWeight}</div>
                  <div className="text-sm opacity-90">kg Total</div>
                  <div className="text-xs opacity-75">Combined Weight</div>
                </div>
              </div>

              {/* Gas Composition Chart */}
              <div className="bg-gray-700 p-6 rounded-xl hover:bg-gray-600 transition-colors">
                <h4 className="text-lg font-bold text-white mb-4">Gas Composition by Weight</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'CO₂', value: parseFloat(emissions.co2), fill: '#EF4444' },
                        { name: 'CH₄', value: parseFloat(emissions.ch4), fill: '#F97316' },
                        { name: 'N₂O', value: parseFloat(emissions.n2o), fill: '#EAB308' },
                        { name: 'SO₂', value: parseFloat(emissions.so2), fill: '#8B5CF6' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value}kg (${(percent * 100).toFixed(1)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    />
                    <RechartsTooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Environmental Impact Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 p-6 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform">
                <h4 className="text-lg font-bold text-green-400 mb-4 flex items-center animate-slide-in">
                  <Leaf className="mr-2 animate-pulse" /> Environmental Impact Score
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Air Quality Impact</span>
                    <span className="text-red-400 font-bold">{(parseFloat(emissions.totalWeight) / 100).toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">GWP (100-year)</span>
                    <span className="text-orange-400 font-bold">{(parseFloat(emissions.co2) + parseFloat(emissions.ch4) * 25 + parseFloat(emissions.n2o) * 298).toFixed(1)} kg CO₂eq</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Toxicity Level</span>
                    <span className="text-yellow-400 font-bold">Moderate</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 p-6 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform">
                <h4 className="text-lg font-bold text-blue-400 mb-4 flex items-center animate-slide-in">
                  <Activity className="mr-2 animate-pulse" /> Equipment Efficiency
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Fuel Consumption</span>
                    <span className="text-blue-400 font-bold">{(productionVolume * 0.08).toFixed(1)} L/ton</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Energy Efficiency</span>
                    <span className="text-green-400 font-bold">{Math.max(95 - (parseFloat(emissions.totalWeight) / 10), 60).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Operating Hours</span>
                    <span className="text-white font-bold">{Math.max(16, Math.min(24, Math.round(productionVolume / 500)))} hrs/day</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-6 rounded-xl backdrop-blur-sm hover:scale-105 transition-transform">
                <h4 className="text-lg font-bold text-purple-400 mb-4 flex items-center animate-slide-in">
                  <DollarSign className="mr-2 animate-pulse" /> Economic Impact
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Daily Revenue</span>
                    <span className="text-green-400 font-bold">₹{(productionVolume * (selectedMaterial === "Gold" ? 5200 : selectedMaterial === "Silver" ? 85 : 45)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Carbon Cost</span>
                    <span className="text-red-400 font-bold">₹{(parseFloat(emissions.totalWeight) * 2.5).toFixed(0)}/day</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Profit Margin</span>
                    <span className="text-yellow-400 font-bold">{Math.max(15, 45 - (parseFloat(emissions.totalWeight) / 100)).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "Transportation":
        return (
          <div className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 shadow-2xl hover:shadow-blue-500/30 transition-shadow animate-fade-in">
            <h3 className="text-2xl font-bold text-blue-400 mb-6 flex items-center animate-slide-in">
              <Truck className="mr-3 animate-bounce" /> Transportation Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors">
                <h4 className="font-bold text-white mb-4">Route Information</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Distance:</span>
                    <span className="text-blue-400 font-bold">{distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transport Mode:</span>
                    <span className="text-white">Railway + Truck</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CO₂ Emissions:</span>
                    <span className="text-yellow-400">{selectedMineral?.transportEmissions} kg/ton</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transit Time:</span>
                    <span className="text-white">18-24 hours</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors">
                <h4 className="font-bold text-white mb-4">Optimization Opportunities</h4>
                <div className="space-y-3">
                  <div className="bg-green-600/20 p-3 rounded-lg hover:bg-green-600/30 transition-colors">
                    <div className="text-green-400 font-semibold text-sm">Electric Trucks</div>
                    <div className="text-xs text-gray-300">Reduce emissions by 40%</div>
                  </div>
                  <div className="bg-blue-600/20 p-3 rounded-lg hover:bg-blue-600/30 transition-colors">
                    <div className="text-blue-400 font-semibold text-sm">Route Optimization</div>
                    <div className="text-xs text-gray-300">Save 12% distance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "Production":
        return (
          <div className="p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20 shadow-2xl hover:shadow-purple-500/30 transition-shadow animate-fade-in">
            <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center animate-slide-in">
              <Building className="mr-3 animate-bounce" /> Production Facility Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors">
                <h4 className="font-bold text-white mb-4">Facility Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white">{selectedMineral?.production?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capacity:</span>
                    <span className="text-white">{selectedMineral?.production?.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Employees:</span>
                    <span className="text-white">{selectedMineral?.production?.employees?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors">
                <h4 className="font-bold text-white mb-4">Process Efficiency</h4>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">94.2%</div>
                    <div className="text-xs text-gray-400">Overall Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">87%</div>
                    <div className="text-xs text-gray-400">Capacity Utilization</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors">
                <h4 className="font-bold text-white mb-4">Quality Metrics</h4>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">99.1%</div>
                    <div className="text-xs text-gray-400">Quality Grade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">0.8%</div>
                    <div className="text-xs text-gray-400">Defect Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "Recycling":
        return (
          <div className="p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 shadow-2xl hover:shadow-green-500/30 transition-shadow animate-fade-in">
            <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center animate-slide-in">
              <Recycle className="mr-3 animate-spin-slow" /> Recycling & Circular Economy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors">
                <h4 className="font-bold text-white mb-4">Recycling Potential</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Current Rate</span>
                    <span className="text-green-400 font-bold">{selectedMineral?.recyclingPotential}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-600 rounded">
                    <div 
                      className="h-3 bg-green-500 rounded animate-fill-bar" 
                      style={{width: `${selectedMineral?.recyclingPotential}%`}}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Maximum achievable: {selectedMineral?.recyclingPotential + 15}%
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-colors">
                <h4 className="font-bold text-white mb-4">Circular Benefits</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Material Recovery:</span>
                    <span className="text-green-400">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Energy Savings:</span>
                    <span className="text-blue-400">60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cost Reduction:</span>
                    <span className="text-yellow-400">₹2,400/ton</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "Impact Calculator":
        return renderImpactCalculator();
      case "Circularity Simulator":
        return renderCircularitySimulator();
      case "AI Recommendations":
        return renderAIRecommendations();
      case "ESG Dashboard":
        return renderESGDashboard();
      default:
        return (
          <div className="p-8 text-center">
            <p className="text-gray-300 text-lg animate-pulse">
              Select a phase from the sidebar to view detailed analysis and insights.
            </p>
          </div>
        );
    }
  };

  const renderChatbot = () => (
    <div className="fixed bottom-4 right-4 w-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden animate-slide-up">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
        <h3 className="font-bold">AI Chat Assistant</h3>
        <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-gray-300">
          ✕
        </button>
      </div>
      <div className="h-64 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3/4 p-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleChatSubmit} className="p-4 border-t border-gray-700 flex">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask about emissions, sustainability..."
          className="flex-1 bg-gray-700 text-white rounded-l-lg p-2 border border-gray-600 focus:border-blue-400 outline-none"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 transition-colors">
          Send
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 text-white p-6 shadow-2xl border-b border-gray-700">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent tracking-wide animate-gradient-x">
              AI-Driven LCA Tool
            </h1>
            <p className="mt-2 text-lg text-gray-300 font-medium">
              Comprehensive Environmental Impact Assessment for Mining & Metallurgy
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <div className="bg-green-600 px-4 py-2 rounded-lg text-center hover:scale-105 transition-transform">
              <div className="text-sm text-green-200">Status</div>
              <div className="font-bold">Active</div>
            </div>
            <div className="bg-blue-600 px-4 py-2 rounded-lg text-center hover:scale-105 transition-transform">
              <div className="text-sm text-blue-200">Sites</div>
              <div className="font-bold">{minerals.length}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Enhanced Left Sidebar */}
        <div className="w-80 bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 text-white p-6 shadow-2xl overflow-y-auto border-r border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text border-b-2 border-indigo-400 pb-3 animate-gradient-x">
            LCA Analysis Suite
          </h2>
          <div className="space-y-3">
            {phases.map((phase) => {
              const IconComponent = phase.icon;
              return (
                <button
                  key={phase.name}
                  className={`w-full py-4 px-5 rounded-xl text-left hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium flex items-center group shadow-md hover:shadow-lg ${
                    activePhase === phase.name 
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" 
                      : "bg-gray-700/50 hover:bg-gray-600/50"
                  }`}
                  onClick={() => setActivePhase(phase.name)}
                >
                  <IconComponent className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  {phase.name}
                </button>
              );
            })}
          </div>

          {/* Sidebar Stats */}
          {selectedMineral && (
            <div className="mt-8 p-4 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl border border-gray-600 hover:border-yellow-500 transition-colors">
              <h3 className="text-lg font-bold text-yellow-400 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Material:</span>
                  <span className="text-white font-semibold">{selectedMineral.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Sustainability:</span>
                  <span className={`font-bold ${selectedMineral.sustainability_score === 'A' ? 'text-green-400' : 
                    selectedMineral.sustainability_score === 'B' ? 'text-blue-400' : 
                    selectedMineral.sustainability_score === 'C' ? 'text-yellow-400' : 'text-red-400'}`}>
                    Grade {selectedMineral.sustainability_score}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Distance:</span>
                  <span className="text-green-400 font-semibold">{distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cost Impact:</span>
                  <span className="text-orange-400 font-semibold">₹{selectedMineral.costPerTon}/ton</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!selectedMineral ? (
            <div className="p-8 space-y-8 overflow-auto">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-4 animate-gradient-x">
                  Interactive Mining LCA Dashboard
                </h2>
                <p className="text-gray-300 text-xl mb-8 animate-pulse">
                  Click on any mining location (red markers) to begin comprehensive lifecycle assessment
                </p>
              </div>

              {/* Enhanced Map */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-blue-500 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-indigo-300 flex items-center animate-slide-in">
                    <MapPin className="mr-2 animate-bounce" /> Mining Operations Map
                  </h3>
                  <div className="flex space-x-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-gray-300">Mining Sites</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-gray-300">Production Facilities</span>
                    </div>
                  </div>
                </div>
                
                <MapContainer
                  center={[22.9734, 78.6569]}
                  zoom={5}
                  className="w-full h-96 rounded-xl shadow-lg border border-gray-600"
                  style={{ height: '400px' }}
                >
                  <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {minerals.map((mineral, index) => (
                    <Marker
                      key={`mine-${index}`}
                      position={mineral.mine.position}
                      icon={redIcon}
                      eventHandlers={{
                        click: () => handleMineClick(mineral),
                      }}
                    >
                      <Popup>
                        <div className="text-center p-2">
                          <h4 className="font-bold text-gray-800">{mineral.mine.name}</h4>
                          <p className="text-sm text-gray-600">Material: {mineral.name}</p>
                          <p className="text-sm text-gray-600">Capacity: {mineral.mine.capacity}</p>
                          <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                            Start LCA Analysis
                          </button>
                        </div>
                      </Popup>
                      <Tooltip>{mineral.mine.name} - {mineral.name}</Tooltip>
                    </Marker>
                  ))}
                  {minerals.map((mineral, index) => (
                    <Marker
                      key={`prod-${index}`}
                      position={mineral.production.position}
                      icon={blueIcon}
                    >
                      <Popup>
                        <div className="text-center p-2">
                          <h4 className="font-bold text-gray-800">{mineral.production.name}</h4>
                          <p className="text-sm text-gray-600">Capacity: {mineral.production.capacity}</p>
                          <p className="text-sm text-gray-600">Employees: {mineral.production.employees?.toLocaleString()}</p>
                        </div>
                      </Popup>
                      <Tooltip>{mineral.production.name}</Tooltip>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Feature Overview */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-700 hover:border-indigo-500 transition-colors">
                <h2 className="text-2xl font-bold mb-6 text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text animate-gradient-x">
                  Advanced LCA Features & Capabilities
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      icon: Calculator,
                      title: "Smart Impact Calculator",
                      desc: "Real-time calculations of emissions, water, energy, and waste with AI-powered predictions",
                      color: "from-green-500 to-emerald-600"
                    },
                    {
                      icon: Globe,
                      title: "Circularity Simulator", 
                      desc: "Interactive tools to optimize recycling rates and measure sustainability benefits",
                      color: "from-blue-500 to-cyan-600"
                    },
                    {
                      icon: Target,
                      title: "AI Recommendations",
                      desc: "Machine learning-driven suggestions for process improvements and cost optimization",
                      color: "from-purple-500 to-pink-600"
                    },
                    {
                      icon: BarChart3,
                      title: "ESG Dashboard",
                      desc: "Comprehensive tracking of compliance, sustainability scores, and regulatory forecasts",
                      color: "from-yellow-500 to-orange-600"
                    }
                  ].map((feature, i) => (
                    <div key={i} className={`bg-gradient-to-br ${feature.color} p-6 rounded-xl text-white shadow-2xl transform hover:scale-105 hover:rotate-3 transition-all duration-300 hover:shadow-xl`}>
                      <feature.icon className="h-12 w-12 mb-4 opacity-90 animate-bounce" />
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm opacity-90 leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl text-white text-center shadow-2xl hover:scale-105 transition-all">
                  <Factory className="h-12 w-12 mx-auto mb-4 animate-spin-slow" />
                  <h3 className="text-2xl font-bold">{minerals.length}</h3>
                  <p className="text-indigo-200">Active Mining Operations</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 rounded-xl text-white text-center shadow-2xl hover:scale-105 transition-all">
                  <Leaf className="h-12 w-12 mx-auto mb-4 animate-spin-slow" />
                  <h3 className="text-2xl font-bold">28%</h3>
                  <p className="text-green-200">Average Emission Reduction</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-cyan-700 p-6 rounded-xl text-white text-center shadow-2xl hover:scale-105 transition-all">
                  <Award className="h-12 w-12 mx-auto mb-4 animate-spin-slow" />
                  <h3 className="text-2xl font-bold">B+</h3>
                  <p className="text-blue-200">Average Sustainability Grade</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 overflow-auto">
              {/* Selected Operation Header */}
              <div className="mb-8 bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl border border-gray-700 hover:border-purple-500 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text animate-gradient-x">
                    Selected Operation Analysis
                  </h2>
                  <button 
                    onClick={() => setSelectedMineral(null)}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    ← Back to Map
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                  <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                    <span className="font-semibold text-gray-300">Material:</span>
                    <p className="text-yellow-400 font-bold">{selectedMineral.name}</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                    <span className="font-semibold text-gray-300">Mine:</span>
                    <p className="text-white">{selectedMineral.mine.name}</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                    <span className="font-semibold text-gray-300">Production:</span>
                    <p className="text-white">{selectedMineral.production.name}</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                    <span className="font-semibold text-gray-300">Distance:</span>
                    <p className="text-green-400 font-bold">{distance} km</p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                    <span className="font-semibold text-gray-300">Grade:</span>
                    <p className={`font-bold ${selectedMineral.sustainability_score === 'A' ? 'text-green-400' : 
                      selectedMineral.sustainability_score === 'B' ? 'text-blue-400' : 
                      selectedMineral.sustainability_score === 'C' ? 'text-yellow-400' : 'text-red-400'}`}>
                      {selectedMineral.sustainability_score}
                    </p>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-colors">
                    <span className="font-semibold text-gray-300">Status:</span>
                    <p className="text-green-400 font-bold">Active</p>
                  </div>
                </div>
              </div>
              
              {/* Dynamic Content */}
              <div className="space-y-6">
                {renderPhaseContent()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chatbot Toggle Button */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-bounce"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {isChatOpen && renderChatbot()}
    </div>
    
  );
};

export default DashboardPage;