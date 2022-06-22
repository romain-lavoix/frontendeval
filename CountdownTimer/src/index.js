import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import CountdownTimer from "./CountdownTimer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CountdownTimer />
  </React.StrictMode>
);
