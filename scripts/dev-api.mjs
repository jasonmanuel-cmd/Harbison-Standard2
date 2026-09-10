import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";

const envFiles = ["./.env", "./.env.local"];
for (const file of envFiles) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const routes = {
  "/api/lead": "lead.mjs",
  "/api/leads": "leads.mjs",
  "/api/stats": "stats.mjs",
  "/api/track": "track.mjs",
  "/api/properties": "properties.mjs",
  "/api/buyer-lead": "buyer-lead.mjs",
};

const server = createServer(async (req, res) => {
  const route = routes[req.url.split("?")[0]];
  if (!route) {
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: "Not found" }));
  }
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const url = "http://localhost:" + (process.env.PORT || 8787) + req.url;
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: chunks.length ? Buffer.concat(chunks) : undefined,
    });
    const handler = (await import("../api/" + route)).default;
    const response = await handler.fetch(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    console.error("[dev-api]", err);
    if (!res.headersSent) res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal error" }));
  }
});

const port = Number(process.env.PORT) || 8787;
server.listen(port, () => {
  console.log("Harbison Standard CRM API on http://localhost:" + port);
  if (!process.env.DATABASE_URL) console.log("No DATABASE_URL set — API will return 503 until it is added to .env");
});
