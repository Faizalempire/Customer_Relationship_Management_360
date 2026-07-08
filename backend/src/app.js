const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");

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

module.exports = app;