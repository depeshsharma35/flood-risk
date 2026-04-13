import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Python executable path (virtual env)
  const pythonExecutable =
    process.platform === "win32"
      ? path.resolve(__dirname, "..", ".venv", "Scripts", "python.exe")
      : path.resolve(__dirname, "..", ".venv", "bin", "python");

  // ✅ FINAL FIX: Correct path
  const mlAppPath = path.resolve(__dirname, "..", "server", "ml_app.py");

  console.log("Starting Python ML backend...");
  const pythonProcess = spawn(pythonExecutable, [mlAppPath]);

  pythonProcess.stdout.on("data", (data) => {
    console.log(`[ML Backend]: ${data.toString().trim()}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`[ML Backend Error]: ${data.toString().trim()}`);
  });

  pythonProcess.on("close", (code) => {
    console.log(`[ML Backend] exited with code ${code}`);
  });

  // Proxy /api → Python backend
  const apiProxy = createProxyMiddleware({
    target: "http://127.0.0.1:5000",
    changeOrigin: true,
  });
  
  app.use((req, res, next) => {
    if (req.url.startsWith("/api")) {
      return apiProxy(req, res, next);
    }
    next();
  });

  // Static files
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public") // dist/public
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // SPA fallback
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);