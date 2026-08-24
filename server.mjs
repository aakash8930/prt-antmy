import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const requestedPort = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
};

const server = createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relative = normalize(pathname === "/" ? "index.html" : pathname.replace(/^\/+/, ""));
  const file = join(root, relative);
  if (!file.startsWith(root) || !existsSync(file) || !statSync(file).isFile()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  response.writeHead(200, {
    "content-type": types[extname(file)] || "application/octet-stream",
    "cache-control": extname(file) === ".jpg" ? "public, max-age=31536000, immutable" : "no-cache",
  });
  createReadStream(file).pipe(response);
});

let port = requestedPort;
let retries = 0;

server.on("error", (error) => {
  if (error.code === "EADDRINUSE" && !process.env.PORT && retries < 10) {
    retries += 1;
    port += 1;
    console.warn(`Port ${port - 1} is in use; trying ${port}…`);
    server.listen(port, host);
    return;
  }
  throw error;
});

server.listen(port, host, () => console.log(`Deep Ocean Expedition running at http://${host}:${port}`));
