import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { langFromPath } from "./i18n";
import { servicePageFromPath } from "./data/servicePages";
import { Analytics } from "@vercel/analytics/react";

const path = window.location.pathname;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App lang={langFromPath(path)} servicePage={servicePageFromPath(path)} />
    {/* Vercel Web Analytics: visitor and page-view counts (browser only). */}
    <Analytics />
  </StrictMode>
);
