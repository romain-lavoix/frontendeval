import React from "react";
import ReactDOM from "react-dom/client";
import "./modern-normalize.min.css";
import Snake from "./Snake";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Snake />
  </React.StrictMode>
);
