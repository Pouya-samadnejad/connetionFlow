import React from "react";
import ReactDOM from "react-dom/client";
import FirstMonitor from "../src/Pages/FirstMonitor";
import AnimatedBackground from "../src/components/AnimatedBackground";
import "../src/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AnimatedBackground />

    <FirstMonitor />
  </React.StrictMode>
);
