# 🌍 AI-Driven Life Cycle Assessment (LCA) Tool  
### *Advancing Circularity and Sustainability in Metallurgy and Mining*  

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?logo=mongodb&logoColor=white)]()  
[![Hackathon](https://img.shields.io/badge/Smart%20India%20Hackathon-2025-orange?logo=hackaday&logoColor=white)]()  
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)]()  

🚀 Developed for **Smart India Hackathon (SIH) 2025**, this project leverages the **MERN Stack** to build an intelligent platform that helps industries adopt **sustainable and circular practices** in the **metallurgy and mining sector**.  

---

## 📖 Problem Statement  

The **metallurgy and mining industry** is one of the largest contributors to environmental degradation:  

- ⚡ High **energy consumption**  
- 🌫️ Significant **carbon emissions**  
- 🌊 Excessive **water usage & pollution**  
- 🗑️ Massive **waste generation**  

Industries lack a **transparent, intelligent, and automated tool** to measure, analyze, and reduce their **life cycle impacts**.  

---

## 🎯 Our Solution  

✨ The **AI-Driven Life Cycle Assessment (LCA) Tool** provides a **web-based sustainability dashboard** that:  

- Evaluates **environmental footprint** across the full cycle (*raw material → processing → product → recycling*)  
- Calculates **circularity metrics** for materials  
- Suggests **AI-powered recommendations** for eco-friendly improvements  
- Generates **PDF/Excel sustainability reports** for stakeholders  

🌱 Helping organizations **transition toward a circular economy** while achieving **net-zero goals**  

---

## 🏗️ System Architecture  

```mermaid
graph TD
A[User Input: Industry Data] --> B[Backend - Node.js/Express]
B --> C[AI & LCA Engine]
C --> D[MongoDB Database]
C --> E[Visualization - Chart.js/Plotly]
E --> F[React Frontend Dashboard]
````

---

## ⚡ How It Works

1️⃣ **Data Collection** → Industry enters/upload data (*energy, material, emissions*)
2️⃣ **Processing** → Backend computes **LCA & circularity metrics**
3️⃣ **Visualization** → Interactive dashboards display reports 📊
4️⃣ **Decision Support** → AI recommends **sustainability actions**
5️⃣ **Export Reports** → One-click **PDF/Excel download** for stakeholders

---

## ✨ Features

* 🤖 **Automated LCA Calculations** – End-to-end impact analysis
* ♻️ **Circularity Index** – Measures reuse, recycling & recovery
* 🌱 **Carbon & Energy Tracking** – Monitor footprints in real-time
* 📊 **Dynamic Dashboards** – Graphs, charts, KPIs for quick insights
* 📂 **Report Generator** – Export **PDF/Excel sustainability reports**
* 🔗 **Material Flow Mapping** – Track resources at each stage
* 🔍 **AI-Powered Recommendations** – Smart insights for optimization
* 🌐 **Multi-User Support** – Roles for industries, auditors & policymakers
* 🔒 **Secure Authentication** – JWT-based login system

---

## 📦 Tech Stack

| Layer             | Technology                              |
| ----------------- | --------------------------------------- |
| 🗄️ Database      | **MongoDB**                             |
| ⚙️ Backend        | **Express.js + Node.js**                |
| 🖥️ Frontend      | **React.js**                            |
| 📊 Visualization  | **Chart.js / D3.js / Plotly**           |
| 🤖 Intelligence   | **Python ML APIs (Future Integration)** |
| 🔐 Authentication | **JWT + bcrypt.js**                     |

---

## 🚀 Installation Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/YourUsername/SIH2025-LCA-Tool.git
cd SIH2025-LCA-Tool
```

### 2️⃣ Install Backend Dependencies

```bash
cd backend
npm install
```

### 3️⃣ Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4️⃣ Configure Environment Variables

Create a `.env` file inside **backend/**:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
```

### 5️⃣ Run the Application

👉 Start backend server:

```bash
cd backend
npm start
```

👉 Start frontend:

```bash
cd ../frontend
npm start
```

🎉 Open the app at: **[http://localhost:3000](http://localhost:3000)**

---

## 🔗 API Endpoints (Sample)

| Method | Endpoint                    | Description                          |
| ------ | --------------------------- | ------------------------------------ |
| `POST` | `/api/auth/register`        | Register new user                    |
| `POST` | `/api/auth/login`           | Login & get JWT                      |
| `POST` | `/api/lca/calculate`        | Submit industry data & calculate LCA |
| `GET`  | `/api/lca/results/:id`      | Fetch LCA results                    |
| `GET`  | `/api/reports/download/:id` | Download report (PDF/Excel)          |

---

## 📚 Use Cases

* 🔹 **Mining Companies** – Track sustainability KPIs
* 🔹 **Metallurgical Industries** – Optimize energy & resource usage
* 🔹 **Government & Policy Makers** – Monitor environmental compliance
* 🔹 **Consulting Firms** – Perform sustainability audits
* 🔹 **Academia & Research** – Study environmental impacts in heavy industries

---


## 🔮 Future Integrations

* 🚀 **Blockchain** – Supply chain traceability
* 📡 **IoT Sensors** – Real-time process monitoring
* ☁️ **Cloud Deployment** – AWS / Azure / GCP scalability
* 📱 **Mobile App** – On-the-go sustainability insights
* 📊 **Advanced Data Analytics** – Forecasting & trend prediction
* 🤝 **Integration with ESG Reporting** – Streamlined compliance

---

## 🌟 Impact & Benefits

✅ Enables industries to achieve **Net-Zero Targets**
✅ Promotes **Circular Economy Practices** 🔄
✅ Reduces **Environmental Footprints** 📉
✅ Empowers **Data-Driven Decision Making**
✅ Improves **Global Competitiveness** via Green Innovation 🌍

---

## 🤝 Contributing

We welcome contributions! 🎉

1. Fork the repo
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature-name`)
5. Open a Pull Request 🚀


---

## 📜 License

This project is licensed under the **MIT License** – free to use, modify, and distribute.

---

⭐ *If you found this useful, consider giving the repo a star!* ⭐


