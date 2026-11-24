import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { langFromPath } from "./i18n";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App lang={langFromPath(window.location.pathname)} />
    {/* Vercel Web Analytics: visitor and page-view counts (browser only). */}
    <Analytics />
  </StrictMode>
);
