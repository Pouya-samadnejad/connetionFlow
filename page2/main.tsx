import React from "react";
import ReactDOM from "react-dom/client";
import SecondMonitor from "../src/Pages/SecondMonitor";
import AnimatedBackground from "../src/components/AnimatedBackground";
import "../src/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AnimatedBackground />

    <SecondMonitor />
  </React.StrictMode>
);
