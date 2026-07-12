const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} = require("../controllers/notificationController");

// Get notifications
router.get(
  "/",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  getNotifications
);

// Mark one notification as read
router.put(
  "/:id/read",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  markNotificationRead
);

// Mark all notifications as read
router.put(
  "/read-all",
  protect,
  authorize("admin", "sales_manager", "sales_executive"),
  markAllNotificationsRead
);

module.exports = router;