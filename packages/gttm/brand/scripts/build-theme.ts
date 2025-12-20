import fs from "fs";
import path from "path";
import { GttmBrand } from "../src/GttmBrand";

console.log("🔮 GTTM Brand: Building design tokens...");

try {
  const distDir = path.resolve(__dirname, "../dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const themeCSS = GttmBrand.toTailwindCSS(); 
  fs.writeFileSync(path.join(distDir, "gttm.css"), themeCSS);
  console.log("✔ Theme CSS emitted to dist/gttm.css");

  const varsCSS = GttmBrand.toCSSVariables();
  fs.writeFileSync(path.join(distDir, "variables.css"), varsCSS);
  console.log("✔ CSS Variables emitted to dist/variables.css");

  console.log("✨ GTTM Brand build complete.");
} catch (err) {
  console.error("❌ GTTM Brand build failed:", err);
  process.exit(1);
}