import { watch } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const clients = new Set();
const reloadableExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".jpeg",
  ".jpg",
  ".png",
  ".svg",
  ".webp",
]);

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
]);

const liveReloadScript = `
<script type="module">
  const key = "aditi-site-live-reload-count";
  const count = Number(sessionStorage.getItem(key) || "0") + 1;
  sessionStorage.setItem(key, String(count));
  document.documentElement.dataset.liveReloadCount = String(count);

  const source = new EventSource("/__live-reload");
  source.addEventListener("reload", () => window.location.reload());
</script>`;

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, headers);
  res.end(body);
}

function isAllowedPath(filePath) {
  return filePath === rootDir || filePath.startsWith(`${rootDir}${path.sep}`);
}

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
  return path.resolve(rootDir, relativePath);
}

function withLiveReload(filePath, body) {
  if (path.basename(filePath) !== "index.html") {
    return body;
  }

  return body.toString("utf8").replace("</body>", `${liveReloadScript}\n  </body>`);
}

function serveStatic(req, res) {
  const requestedPath = resolveRequestPath(req.url);

  if (!isAllowedPath(requestedPath)) {
    send(res, 403, "Forbidden\n", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  stat(requestedPath).then(
    (fileStat) => {
      const filePath = fileStat.isDirectory()
        ? path.join(requestedPath, "index.html")
        : requestedPath;

      readFile(filePath).then(
        (body) => {
          const responseBody = withLiveReload(filePath, body);
          const contentType =
            mimeTypes.get(path.extname(filePath)) || "application/octet-stream";

          send(res, 200, responseBody, {
            "Cache-Control": "no-store",
            "Content-Type": contentType,
          });
        },
        () => send(res, 404, "Not found\n", { "Content-Type": "text/plain; charset=utf-8" }),
      );
    },
    () => send(res, 404, "Not found\n", { "Content-Type": "text/plain; charset=utf-8" }),
  );
}

function serveLiveReload(req, res) {
  res.writeHead(200, {
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
  });
  res.write("retry: 500\n\n");
  clients.add(res);
  req.on("close", () => clients.delete(res));
}

function broadcastReload(filename) {
  const payload = `event: reload\ndata: ${JSON.stringify({ filename })}\n\n`;
  for (const client of clients) {
    client.write(payload);
  }
  console.log(`Reloaded ${filename}`);
}

function shouldReload(filename) {
  const normalized = filename.split(path.sep).join("/");

  if (
    normalized.startsWith(".git/") ||
    normalized.startsWith("dist/") ||
    normalized.startsWith("node_modules/")
  ) {
    return false;
  }

  return reloadableExtensions.has(path.extname(normalized));
}

let reloadTimer;

watch(rootDir, { recursive: true }, (_eventType, filename) => {
  if (!filename || !shouldReload(filename)) return;

  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => broadcastReload(filename), 80);
});

const server = createServer((req, res) => {
  if (req.url === "/__live-reload") {
    serveLiveReload(req, res);
    return;
  }

  serveStatic(req, res);
});

server.listen(port, host, () => {
  console.log(`Live local preview: http://${host}:${port}`);
  console.log("Watching index.html and assets/* for changes");
});
