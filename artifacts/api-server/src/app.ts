import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Simple session middleware using a signed cookie
app.use((req, _res, next) => {
  const sessionCookie = req.cookies?.["nexus_session"];
  (req as any).session = sessionCookie
    ? JSON.parse(Buffer.from(sessionCookie, "base64").toString())
    : null;
  next();
});

// API routes
app.use("/api", router);

// Serve frontend static files in production
if (process.env.NODE_ENV === "production") {
  // __dirname = artifacts/api-server/dist/ → go up 2 = artifacts/ → nexus-comm/dist/public
  const staticDir = path.resolve(__dirname, "..", "..", "nexus-comm", "dist", "public");
  app.use(express.static(staticDir));
  // SPA fallback — send index.html for all non-API routes
  app.get("/:splat*", (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
}

export default app;
