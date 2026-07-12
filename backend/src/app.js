const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const leadRoutes = require("./routes/leadRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const taskRoutes = require("./routes/taskRoutes");
const followUpRoutes = require("./routes/followUpRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 CRM360 Backend API Running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/users", userRoutes); // New
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tasks", taskRoutes); // New
app.use("/api/follow-ups", followUpRoutes); // New
app.use("/api/notifications", notificationRoutes); // New

module.exports = app;