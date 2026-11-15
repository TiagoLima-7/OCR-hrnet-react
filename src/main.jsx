import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// import "@tiagolima-7/hrnet-datatable/dist/hrnet-datatable.css";
import "hrnet-datatable-tiago/dist/hrnet-datatable.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
