import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/Styles/index.css";

// biome-ignore lint/style/noNonNullAssertion: Exclude from check
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
