# 🌍 Earthquake Visualizer

A **real-time earthquake monitoring web application** built with **React + Vite + Leaflet** that visualizes global seismic events on an interactive map.  
It supports **heatmap, clustering, and standard views** with advanced filters and a responsive sidebar.

---

## 🔥 Features

- **Interactive Map (Leaflet.js)**  
  - Standard, Heatmap, and Cluster views  
  - Multiple base map styles (Terrain, Satellite, Dark, Light)  

- **Filters & Search**  
  - Filter earthquakes by **intensity (Low, Medium, High)**  
  - Search earthquakes by **country** and auto-focus map  

- **Sidebar with Tabs**  
  - Filters, Stats, and Settings sections  
  - Smooth transitions with **hamburger toggle**  
  - Auto hides on mobile, overlays the map  

- **Heatmap Visualization**  
  - Intensity-based gradient with clear high/medium/low zones  

- **Responsive Design**  
  - Works seamlessly on **desktop, tablet, and mobile**  
  - Sidebar behaves like a **drawer on mobile**  

- **Real-Time Earthquake Feed**  
  - Fetches data live from the **USGS Earthquake API**  
  - Shows total number of current events  

---

## 🛠 Tech Stack

- Frontend: React, Vite, TailwindCSS
- Maps & Visualization: Leaflet.js, react-leaflet, leaflet.heat, clustering
- Icons: Lucide-react
- Data Source: USGS Earthquake API

---

## 🌐 Live Demo

👉 [Earthquake Visualizer Website](https://preeminent-kleicha-70bb07.netlify.app/)  

---

## ⚡ Installation & Running Locally

Follow these steps to set up and run the project locally:

### 1. Fork the Repository
Click the **Fork** button on the top right of this repository (GitHub) to make your own copy.

### 2. Clone the Fork
```bash
https://github.com/boyidapuvivek/earthquake-visualizer.git
cd earthquake-visualizer
```
### 3. Install Dependencies
```bash
# using npm
npm install

# OR using yarn
yarn install
```
### 4. Start the Development Server
```bash
# with npm
npm run dev

# OR with yarn
yarn dev
```

### 5.📦 Build for Production
```bash
# with npm
npm run build

# OR with yarn
yarn build
```
