const Customer = require("../models/Customer");
const Lead = require("../models/Lead");
const User = require("../models/User");
const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
    try {
        const totalCustomers = await Customer.countDocuments();

        const totalLeads = await Lead.countDocuments();

        const activeLeads = await Lead.countDocuments({
            stage: { $nin: ["Won", "Lost"] },
        });

        const wonDeals = await Lead.countDocuments({
            stage: "Won",
        });

        const lostDeals = await Lead.countDocuments({
            stage: "Lost",
        });

        const revenue = await Lead.aggregate([

            {
                $match: { stage: "Won" },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$value" },
                },
            },
        ]);

        // ================= LEAD STAGES =================
        const leadStageData = await Lead.aggregate([
            {
                $group: {
                    _id: "$stage",
                    count: { $sum: 1 },
                },
            },
        ]);

        // ================= USERS =================
        const totalUsers = await User.countDocuments();

        const admins = await User.countDocuments({
            role: "admin",
        });

        const salesManagers = await User.countDocuments({
            role: "sales_manager",
        });

        const salesExecutives = await User.countDocuments({
            role: "sales_executive",
        });

        // ================= TASKS =================
        const totalTasks = await Task.countDocuments();

        const completedTasks = await Task.countDocuments({
            status: "Completed",
        });

        const pendingTasks = await Task.countDocuments({
            status: "Pending",
        });

        const inProgressTasks = await Task.countDocuments({
            status: "In Progress",
        });

        // ================= RECENT ACTIVITY =================
        const recentCustomers = await Customer.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("customerName createdAt");

        const recentLeads = await Lead.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name createdAt");

        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title createdAt");

        res.status(200).json({
            totalCustomers,
            totalLeads,
            activeLeads,
            wonDeals,
            lostDeals,
            revenue: revenue.length ? revenue[0].total : 0,
            totalUsers,
            admins,
            salesManagers,
            salesExecutives,
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
            leadStageData,
            recentCustomers,
            recentLeads,
            recentTasks,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to load dashboard",
            error: error.message,
        });
    }
};

module.exports = {
    getDashboardStats,
};