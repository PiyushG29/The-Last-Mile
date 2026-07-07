import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// For Vercel serverless deployment
let server;

(async () => {
  server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    const fs = await import('fs');
    const path = await import('path');
    // Only try to use Vite in development
    try {
      await setupVite(app, server);
    } catch (error) {
      console.error("Failed to set up Vite:", error);
    }
  } else {
    // For production, use simpler static file serving that doesn't require Vite
    const distPath = "build";
    app.use(express.static(distPath));
    app.use("*", (_req, res) => {
      res.sendFile("index.html", { root: distPath });
    });
  }

  // Bind locally for development; production entrypoints handle deployment ports separately.
  const PORT = parseInt(process.env.PORT || "5000", 10);
  const HOST = "127.0.0.1";

  // Log before attempting to start
  console.log(`BINDING: Attempting to bind to port ${PORT} on host ${HOST}...`);

  try {
    // Bind only to localhost during local development.
    server.listen(PORT, HOST, () => {
      console.log(`SERVER STARTED: Successfully bound to port ${PORT} on host ${HOST}`);
      log(`Server is running at http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error(`FATAL ERROR: Could not bind to port ${PORT}:`, error);
    process.exit(1);
  }
})();

// Export for serverless environments
export default app;
