import { cp, mkdir, readFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, "dist");
const files = [
  "index.html",
  "styles.css",
  "script.js",
  "story-scene.js",
  "server.mjs",
  "favicon.svg",
  "package.json",
  "package-lock.json",
  "README.md",
  "assets",
];

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of files) await cp(join(root, file), join(output, file), { recursive: true });

const html = await readFile(join(output, "index.html"), "utf8");
const required = ["styles.css", "script.js", "story-scene.js", "assets/vendor/three.module.min.js", "assets/vendor/three.core.min.js"];
for (const file of required) {
  await stat(join(output, file));
  if (file !== "story-scene.js" && !html.includes(file) && !["assets/vendor/three.module.min.js", "assets/vendor/three.core.min.js"].includes(file)) {
    throw new Error(`Production reference missing: ${file}`);
  }
}
console.log("Production build ready in dist/");
