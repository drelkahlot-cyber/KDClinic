import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { langFromPath } from "./i18n";
import { servicePageFromPath } from "./data/servicePages";
import { Analytics } from "@vercel/analytics/react";

const path = window.location.pathname;

// Google Analytics: count clicks on the booking/contact buttons as events
// (whatsapp_click, call_click, map_click, vezeeta_click, review_click).
declare global {
  interface Window { gtag?: (...args: unknown[]) => void }
}
document.addEventListener("click", (e) => {
  const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
  if (!a || !window.gtag) return;
  const href = a.href;
  let name = "";
  if (/wa\.me|whatsapp/i.test(href)) name = "whatsapp_click";
  else if (href.startsWith("tel:")) name = "call_click";
  else if (/google\.[a-z.]+\/maps|maps\.app|maps\?cid/i.test(href)) name = "map_click";
  else if (/vezeeta/i.test(href)) name = "vezeeta_click";
  else if (/g\.page\/r\/.*review/i.test(href)) name = "review_click";
  if (!name) return;
  window.gtag("event", name, { link_url: href.slice(0, 100), page_path: window.location.pathname, transport_type: "beacon" });
}, { capture: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App lang={langFromPath(path)} servicePage={servicePageFromPath(path)} />
    {/* Vercel Web Analytics: visitor and page-view counts (browser only). */}
    <Analytics />
  </StrictMode>
);
