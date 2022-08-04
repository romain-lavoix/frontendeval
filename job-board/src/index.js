import React from "react";
import ReactDOM from "react-dom/client";
import JobBoard from "./JobBoard";
import "./modern-normalize.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <JobBoard />
  </React.StrictMode>
);
