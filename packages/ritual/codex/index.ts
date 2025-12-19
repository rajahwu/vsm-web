import fs from "fs";
import path from "path";

const CONTENT_ROOT = path.join(
  process.cwd(),
  "packages/ritual/codex/content"
);

export function getCodexEntry(slug: string): string {
  const filePath = path.join(CONTENT_ROOT, `${slug}.md`);
  return fs.readFileSync(filePath, "utf-8");
}
