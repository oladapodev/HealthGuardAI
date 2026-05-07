import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import analyzeRoutes from "./routes/analyzeRoute.js";
import userRoutes from "./routes/userRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/healthguard")
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/health", analyzeRoutes);
app.use("/api/users", userRoutes);

// Basic Health Check
app.get("/", (req, res) => {
    res.json({ message: "HealthGuard AI Backend is Running 🛡️" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
