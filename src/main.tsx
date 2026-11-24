import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { langFromPath } from "./i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App lang={langFromPath(window.location.pathname)} />
  </StrictMode>
);
