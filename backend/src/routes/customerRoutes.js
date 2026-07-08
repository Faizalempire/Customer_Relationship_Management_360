const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

const {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    assignCustomer,
    getCustomerHistory,
} = require("../controllers/customerController");

// Get All Customers
router.get(
    "/",
    protect,
    authorize("admin", "sales_manager", "sales_executive"),
    getAllCustomers
);

// Get Customer By ID
router.get(
    "/:id",
    protect,
    authorize("admin", "sales_manager", "sales_executive"),
    getCustomerById
);

router.put(
  "/:id",
  protect,
  authorize("admin", "sales_manager"),
  updateCustomer
);

// Create Customer
router.post(
    "/",
    protect,
    authorize("admin", "sales_manager", "sales_executive"),
    createCustomer
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCustomer
);

// Assign Customer to Sales Executive
router.put(
  "/:id/assign",
  protect,
  authorize("admin", "sales_manager"),
  assignCustomer
);

// Customer Activity History
router.get(
    "/:id/history",
    protect,
    authorize("admin", "sales_manager", "sales_executive"),
    getCustomerHistory
);

module.exports = router;