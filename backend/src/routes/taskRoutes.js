const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Get all tasks
router.get(
  "/",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  getTasks
);

// Create task
router.post(
  "/",
  protect,
  authorize("admin", "sales_manager"),
  createTask
);

// Update task
router.put(
  "/:id",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  updateTask
);

// Delete task
router.delete(
  "/:id",
  protect,
  authorize("admin", "sales_manager"),
  deleteTask
);

module.exports = router;