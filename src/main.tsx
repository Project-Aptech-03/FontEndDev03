import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";  // dùng default export
import "./index.css";
import "./style/App.css";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
