import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import sequelize from "./config/database.js";
import Event from "./model/Event.js";
import eventRoutes from "./router/eventRoutes.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://664259004-7153403-final-d.vercel.app",
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  ].filter(Boolean),
);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  if (allowedOrigins.has(origin)) return true;

  return (
    /^https:\/\/.*\.vercel\.app$/.test(origin) ||
    /^https:\/\/.*\.vercel\.app:\d+$/.test(origin) ||
    /^http:\/\/localhost:\d+$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
  );
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Event API is running." });
});

app.use("/api/events", eventRoutes);

app.use((err, req, res, next) => {
  if (err) {
    console.error("Unhandled error:", err.message);
    return res.status(500).json({ message: "Internal server error." });
  }

  return next();
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startServer = async () => {
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    try {
      await sequelize.authenticate();
      await sequelize.sync({ alter: true });

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port http://localhost:${PORT}`);
      });
      return;
    } catch (error) {
      attempts += 1;
      console.error(
        `Database connection failed (attempt ${attempts}/${maxAttempts}):`,
        error.message,
      );

      if (attempts >= maxAttempts) {
        console.error("Unable to start server:", error);
        process.exit(1);
      }

      await wait(2000);
    }
  }
};

startServer();

export default app;
