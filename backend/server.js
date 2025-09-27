import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // ✅ required for API call
import authRoutes from "./routes/auth.js";
import predictRoute from "./routes/predict.js";

dotenv.config();
const app = express();

// CORS middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// Body parser
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/predict", predictRoute);

// ✅ New transport route
app.post("/api/transport", async (req, res) => {
  try {
    const { mode, params } = req.body;

    if (!mode || !params) {
      return res.status(400).json({ error: "Mode and parameters are required" });
    }

    const activityIds = {
      truck: "freight_vehicle-vehicle_type_truck-freight_category_tanker-smartway_co2_rank_5",
      train: "freight_train-route_type_na-fuel_type_diesel",
      ship: "sea_freight-vessel_type_container_ship-route_type_na-vessel_length_na-tonnage_na-fuel_source_na",
    };
const requestBody = {
  emission_factor: {
    activity_id: activityIds[mode],
    data_version: "^26",
    region: mode === "truck" ? "US" 
          : mode === "train" ? "EU"   // ✅ explicitly EU for trains
          : mode === "ship" ? "global" 
          : "global"
  },
  parameters: params,
};



    const response = await fetch("https://api.climatiq.io/data/v1/estimate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLIMATIQ_API_KEY}`, // ✅ Use backend key
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Climatiq API Error:", errorText);
      return res.status(response.status).send(errorText);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("Transport API Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Test route
app.get("/", (req, res) => res.send("Backend is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
