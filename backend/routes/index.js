import express from "express";
import authRoutes from "./authRoutes.js";
import profileRoutes from "./profileRoutes.js";
import checkinRoutes from "./checkinRoutes.js";
import analysisRoutes from "./analysisRoutes.js";
import labRoutes from "./labV1Routes.js";
import chatRoutes from "./chatRoutes.js";

const apiRouter = express.Router();
const v1Router = express.Router();

v1Router.get("/health", (req, res) => {
  res.json({ success: true, message: "HealthGuard AI API v1 is running" });
});

v1Router.use("/auth", authRoutes);
v1Router.use("/profile", profileRoutes);
v1Router.use("/checkins", checkinRoutes);
v1Router.use("/labs", labRoutes);
v1Router.use("/analyses", analysisRoutes);
v1Router.use("/chat", chatRoutes);

apiRouter.use("/v1", v1Router);

export default apiRouter;
