import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// ✅ FIX: put override here (after imports)
const originalError = window.console.error;
window.console.error = (...args) => {
  if (args[0]?.includes?.("ResizeObserver loop")) return;
  originalError(...args);
};

const root = ReactDOM.createRoot(document.getElementById("root"));

// ❌ Remove StrictMode
root.render(
  <App />
);

reportWebVitals();