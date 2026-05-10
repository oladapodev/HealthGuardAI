import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize, { dbDebugConfig } from "./config/db.js";
import apiRouter from "./routes/index.js";
import { setupSwagger } from "./docs/swagger.js";
import { debug } from "./utils/debug.js";
import "./models/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log("[DB] index loaded db config", dbDebugConfig);

// Middleware
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
const corsOptions = {
    origin(origin, callback) {
        if (!origin || corsOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
    const startedAt = Date.now();
    res.on("finish", () => {
        debug.api(`${req.method} ${req.originalUrl} -> ${res.statusCode}`, {
            ms: Date.now() - startedAt,
            userId: req.user,
        });
    });
    next();
});

// Database Connection
sequelize.sync()
    .then(() => console.log("✅ PostgreSQL Connected"))
    .catch(err => {
        console.error("❌ PostgreSQL Connection Error:", {
            name: err?.name,
            message: err?.message,
            parentCode: err?.parent?.code,
            parentMessage: err?.parent?.message,
            originalCode: err?.original?.code,
            originalMessage: err?.original?.message,
        });
    });

setupSwagger(app);

// Routes
app.use("/api", apiRouter);

// Basic Health Check
app.get("/", (req, res) => {
    res.json({ message: "HealthGuard AI Backend is Running 🛡️" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    debug.env("runtime config", {
        nodeEnv: process.env.NODE_ENV || "development",
        corsOrigins,
        dbHost: process.env.DB_HOST || "localhost",
        dbName: process.env.DB_NAME || "healthguard",
        hasGroqKey: Boolean(process.env.GROQ_API_KEY),
        hasWeatherKey: Boolean(process.env.WEATHER_API_KEY),
    });
});
