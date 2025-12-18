import fs from "fs";
import path from "path";
import { RitualBrand } from "../src/RitualBrand";

console.log("🔮 Ritual Brand: Building design tokens...");

try {
  // Ensure dist directory exists
  const distDir = path.resolve(__dirname, "../dist");
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // ---- 1. Generate CSS theme (@theme block) ----
  // UNCOMMENTED: This generates the actual Tailwind 4 theme config
  const themeCSS = RitualBrand.toTailwindCSS(); 
  fs.writeFileSync(path.join(distDir, "ritual.css"), themeCSS);
  console.log("✔ Theme CSS emitted to dist/ritual.css");

  // ---- 2. Generate PURE CSS Variables ----
  // This generates the fallback variables (e.g. for non-Tailwind usage)
  const varsCSS = RitualBrand.toCSSVariables();
  fs.writeFileSync(path.join(distDir, "variables.css"), varsCSS);
  console.log("✔ CSS Variables emitted to dist/variables.css");

  // ---- 3. Copy JS + .d.ts from src (Simple copy for distribution) ----
  const srcDir = path.resolve(__dirname, "../src");
  if (fs.existsSync(srcDir)) {
      const files = fs.readdirSync(srcDir);
      for (const file of files) {
        if (file.endsWith(".js") || file.endsWith(".d.ts")) {
          fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
        }
      }
  }

  console.log("✨ Ritual Brand build complete.");
} catch (err) {
  console.error("❌ Ritual Brand build failed:", err);
  process.exit(1);
}