import fs from "fs";
import path from "path";
import { VsmBrand } from "../src/VsmBrand";

console.log("🔮 VSM Brand: Building design tokens...");

try {
  const distDir = path.resolve(__dirname, "../dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const themeCSS = VsmBrand.toTailwindCSS(); 
  fs.writeFileSync(path.join(distDir, "vsm.css"), themeCSS);
  console.log("✔ Theme CSS emitted to dist/vsm.css");

  const varsCSS = VsmBrand.toCSSVariables();
  fs.writeFileSync(path.join(distDir, "variables.css"), varsCSS);
  console.log("✔ CSS Variables emitted to dist/variables.css");

  console.log("✨ VSM Brand build complete.");
} catch (err) {
  console.error("❌ VSM Brand build failed:", err);
  process.exit(1);
}