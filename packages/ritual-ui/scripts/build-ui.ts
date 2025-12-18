import fs from "fs";
import path from "path";

console.log("🧿 Ritual UI: Building component stylesheet…");

const DIST = path.resolve(__dirname, "../dist");
const SRC = path.resolve(__dirname, "../src");

// Ensure dist exists
if (!fs.existsSync(DIST)) fs.mkdirSync(DIST);

// ---- 1. Move variables.css from src to dist ----
const srcVariables = path.join(SRC, "variables.css");
const distVariables = path.join(DIST, "variables.css");

if (fs.existsSync(srcVariables)) {
  fs.copyFileSync(srcVariables, distVariables);
  console.log("✅ variables.css copied to dist/");
} else {
  console.warn("⚠ variables.css missing in src/");
}

// ---- 2. Move ritual-ui.css from src to dist ----
const srcUI = path.join(SRC, "ritual-ui.css");
const distUI = path.join(DIST, "ritual-ui.css");

if (fs.existsSync(srcUI)) {
  fs.copyFileSync(srcUI, distUI);
  console.log("✅ ritual-ui.css copied to dist/");
} else {
  console.warn("⚠ ritual-ui.css missing in src/");
}

console.log("✨ Ritual UI build complete.");
