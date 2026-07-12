const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} = require("../controllers/leadController");

// Get all leads
router.get(
  "/",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  getLeads
);

// Create lead
router.post(
  "/",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  createLead
);

// Update lead
router.put(
  "/:id",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  updateLead
);

// Delete lead
router.delete(
  "/:id",
  protect,
  authorize("admin", "sales_manager"),
  deleteLead
);

module.exports = router;