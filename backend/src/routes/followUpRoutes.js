const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  getFollowUps,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,
} = require("../controllers/followUpController");

// Get all Follow-ups
router.get(
  "/",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  getFollowUps
);

// Create Follow-up
router.post(
  "/",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  createFollowUp
);

// Update Follow-up
router.put(
  "/:id",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  updateFollowUp
);

// Delete Follow-up
router.delete(
  "/:id",
  protect,
  authorize("admin", "sales_manager"),
  deleteFollowUp
);

module.exports = router;