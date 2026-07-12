const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
  getSalesExecutives,
} = require("../controllers/userController");

router.get(
  "/sales-executives",
  protect,
  authorize("admin", "sales_manager"),
  getSalesExecutives
);

module.exports = router;