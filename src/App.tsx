import { Route, Routes } from "react-router-dom";
import "./App.css";
import FirstMonitor from "./Pages/FirstMonitor";
import SecondMonitor from "./Pages/SecondMonitor";
import AnimatedBackground from "./components/AnimatedBackground";

function App() {
  return (
    <>
      <div>
        <div className="app-container relative z-10">
          <Routes>
            <Route path="/" element={<FirstMonitor />} />

            <Route path="/second" element={<SecondMonitor />} />

            <Route path="*" element={<h1>404: صفحه پیدا نشد</h1>} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
