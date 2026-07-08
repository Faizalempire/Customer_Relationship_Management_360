const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");


const {
    registerUser,
    loginUser,
    getProfile,
    adminDashboard,
    managerDashboard,
    employeeDashboard,
} = require("../controllers/authController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Get Profile (Protected Route)
router.get("/profile", protect, getProfile);

// Admin only
router.get(
  "/admin",
  protect,
  authorize("admin"),
  adminDashboard
);

// Admin + Sales Manager
router.get(
  "/manager",
  protect,
  authorize("admin", "sales_manager"),
  managerDashboard
);

// All logged-in users
router.get(
  "/employee",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  employeeDashboard
);

module.exports = router;