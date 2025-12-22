import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import AnimatedBackground from "./components/AnimatedBackground.tsx";

declare global {
  interface Window {
    apiHUB1: string;
    apiHUB2: string;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AnimatedBackground />

      <App />
    </BrowserRouter>
  </StrictMode>
);
