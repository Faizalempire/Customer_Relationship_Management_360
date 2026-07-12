const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

router.get(
  "/",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  getDashboardStats
);

module.exports = router;