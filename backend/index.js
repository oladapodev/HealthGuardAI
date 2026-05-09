import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/db.js";
import analyzeRoutes from "./routes/analyzeRoute.js";
import userRoutes from "./routes/userRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
sequelize.sync()
    .then(() => console.log("✅ PostgreSQL Connected"))
    .catch(err => console.error("❌ PostgreSQL Connection Error:", err));

// Routes
app.use("/api/health", analyzeRoutes);
app.use("/api/users", userRoutes);
app.use("/analyze", analyzeRoutes);

// Basic Health Check
app.get("/", (req, res) => {
    res.json({ message: "HealthGuard AI Backend is Running 🛡️" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
