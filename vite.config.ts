import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The clinic's official domain. Canonical, Open Graph and structured-data
// URLs always point here so Google and link previews use kahlotdental.com,
// never a *.vercel.app address. Override with SITE_URL only if the domain changes.
const PRODUCTION_SITE_URL = "https://www.kahlotdental.com";

function resolveSiteUrl(): string {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/+$/, "");
  }
  return PRODUCTION_SITE_URL;
}

function injectSiteUrlPlugin(): Plugin {
  const siteUrl = resolveSiteUrl();
  return {
    name: "inject-site-url",
    transformIndexHtml(html) {
      return html.replace(/__SITE_URL__/g, siteUrl);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), injectSiteUrlPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
