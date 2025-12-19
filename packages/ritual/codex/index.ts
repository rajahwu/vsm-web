import fs from "fs";
import path from "path";

const CONTENT_ROOT = path.join(
  process.cwd(),
  "packages/ritual/codex/content"
);

/**
 * Retrieves a codex entry by slug.
 *
 * Supports both flat slugs (e.g., "naming-doctrine") and nested slugs (e.g., "genesis/dot").
 *
 * @param slug - The slug identifier for the codex entry
 * @returns The markdown content as a string
 * @throws Error if the file is not found or path is invalid
 */
export function getCodexEntry(slug: string): string {
  // Security: prevent path traversal attacks
  if (slug.includes('..')) {
    throw new Error(`Invalid slug: path traversal not allowed`);
  }

  // Normalize slug (remove leading/trailing slashes)
  const normalizedSlug = slug.replace(/^\/+|\/+$/g, '');

  // Construct file path
  const filePath = path.join(CONTENT_ROOT, `${normalizedSlug}.md`);

  // Security: ensure resolved path is within CONTENT_ROOT
  const resolvedPath = path.resolve(filePath);
  const resolvedRoot = path.resolve(CONTENT_ROOT);

  if (!resolvedPath.startsWith(resolvedRoot)) {
    throw new Error(`Invalid slug: path outside content directory`);
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Codex entry not found: ${slug}`);
  }

  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    throw new Error(`Failed to read codex entry "${slug}": ${error}`);
  }
}

/**
 * Lists all available codex entries in a given directory.
 *
 * @param directory - Optional subdirectory (e.g., "genesis", "source-code")
 * @returns Array of slug strings
 */
export function listCodexEntries(directory?: string): string[] {
  const searchPath = directory
    ? path.join(CONTENT_ROOT, directory)
    : CONTENT_ROOT;

  if (!fs.existsSync(searchPath)) {
    return [];
  }

  const entries: string[] = [];

  function scanDirectory(dir: string, prefix: string = '') {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        scanDirectory(
          path.join(dir, item.name),
          prefix ? `${prefix}/${item.name}` : item.name
        );
      } else if (item.isFile() && item.name.endsWith('.md')) {
        const slug = prefix
          ? `${prefix}/${item.name.replace(/\.md$/, '')}`
          : item.name.replace(/\.md$/, '');
        entries.push(slug);
      }
    }
  }

  scanDirectory(searchPath);
  return entries.sort();
}
