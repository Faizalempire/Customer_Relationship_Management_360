const Customer = require("../models/Customer");
const createNotification = require("../utils/createNotification");

// Create Customer
const createCustomer = async (req, res) => {
    try {
        const {
            customerName,
            email,
            phone,
            company,
            status,
            assignedTo,

        } = req.body;

        // Required fields validation
        if (!customerName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Customer Name, Email and Phone are required.",
            });
        }

        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ email });

        if (existingCustomer) {
            return res.status(400).json({
                success: false,
                message: "Customer already exists.",
            });
        }

        // Create customer
        const customer = await Customer.create({
            customerName,
            email,
            phone,
            company,
            status,
            assignedTo,
            createdBy: req.user.id,

            activityHistory: [
                {
                    action: "Customer Created",
                    performedBy: req.user.id,

                },
            ],
        });
        if (customer.assignedTo) {
            await createNotification({
                title: "New Customer Added",
                message: `Customer "${customer.customerName}" has been created.`,
                type: "user",
                userId: customer.assignedTo,
            });
        }

        res.status(201).json({
            success: true,
            message: "Customer created successfully.",
            customer,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

/// Get All Customers (Search + Filter + Pagination + Sorting)
const getAllCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const filter = {};

        // Search
        if (req.query.search) {
            filter.$or = [
                {
                    customerName: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
                {
                    email: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
                {
                    company: {
                        $regex: req.query.search,
                        $options: "i",
                    },
                },
            ];
        }

        // Status Filter
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Sorting
        let sort = { createdAt: -1 };

        if (req.query.sort === "oldest") {
            sort = { createdAt: 1 };
        }

        if (req.query.sort === "name") {
            sort = { customerName: 1 };
        }

        const totalCustomers = await Customer.countDocuments(filter);

        const customers = await Customer.find(filter)
            .populate("createdBy", "fullName email role")
            .populate("assignedTo", "fullName email role")
            .sort(sort)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            totalCustomers,
            currentPage: page,
            totalPages: Math.ceil(totalCustomers / limit),
            customers,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// Get Customer By ID
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
            .populate("createdBy", "fullName email role")
            .populate("assignedTo", "fullName email role");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        res.status(200).json({
            success: true,
            customer,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Update Customer
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate("createdBy", "fullName email role")
            .populate("assignedTo", "fullName email role");

        res.status(200).json({
            success: true,
            message: "Customer updated successfully.",
            customer: updatedCustomer,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Delete Customer
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        await customer.deleteOne();

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully.",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// Assign Customer to Sales Executive
const assignCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        customer.assignedTo = req.body.assignedTo;

        customer.activityHistory.push({
            action: "Customer Assigned",
            performedBy: req.user.id,
            assignedTo: req.body.assignedTo,
        });

        await customer.save();

        const updatedCustomer = await Customer.findById(req.params.id)
            .populate("createdBy", "fullName email role")
            .populate("assignedTo", "fullName email role");

        res.status(200).json({
            success: true,
            message: "Customer assigned successfully.",
            customer: updatedCustomer,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};


// Get Customer Activity History
const getCustomerHistory = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
            .populate("activityHistory.performedBy", "fullName email role");

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found.",
            });
        }

        res.status(200).json({
            success: true,
            activityHistory: customer.activityHistory,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    assignCustomer,
    getCustomerHistory,
};

