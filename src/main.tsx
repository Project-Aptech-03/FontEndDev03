
//==========file gốc============

// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App.js";
// import "./index.css";
// import "./style/App.css";
// import { BrowserRouter } from "react-router-dom";

// createRoot(document.getElementById("root") as HTMLElement).render(
//   <StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </StrictMode>
// );

//============file sau khi sửa===============
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./style/App.css";
import { BrowserRouter } from "react-router-dom";

// ✅ KIỂM TRA ROOT ELEMENT TRƯỚC KHI RENDER
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);