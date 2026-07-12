const FollowUp = require("../models/FollowUp");
const createNotification = require("../utils/createNotification");
// Get all Follow-ups
const getFollowUps = async (req, res) => {
    try {
        const followUps = await FollowUp.find()
            .populate("customer", "customerName email")
            .populate("assignedTo", "fullName email role");

        res.status(200).json(followUps);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch follow-ups",
            error: error.message,
        });
    }
};

// Create Follow-up
const createFollowUp = async (req, res) => {
    try {
        const followUp = await FollowUp.create(req.body);

        // Create notification for assigned user
        if (followUp.assignedTo) {
            await createNotification({
                title: "New Follow-up Scheduled",
                message: `Follow-up "${followUp.title}" has been scheduled.`,
                type: "task",
                userId: followUp.assignedTo,
            });
        }

        res.status(201).json({
            message: "Follow-up created successfully",
            followUp,
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to create follow-up",
            error: error.message,
        });
    }
};


// Update Follow-up
const updateFollowUp = async (req, res) => {
    try {
        const followUp = await FollowUp.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!followUp) {
            return res.status(404).json({
                message: "Follow-up not found",
            });
        }

        res.status(200).json({
            message: "Follow-up updated successfully",
            followUp,
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update follow-up",
            error: error.message,
        });
    }
};

// Delete Follow-up
const deleteFollowUp = async (req, res) => {
    try {
        const followUp = await FollowUp.findByIdAndDelete(req.params.id);

        if (!followUp) {
            return res.status(404).json({
                message: "Follow-up not found",
            });
        }

        res.status(200).json({
            message: "Follow-up deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete follow-up",
            error: error.message,
        });
    }
};

module.exports = {
    getFollowUps,
    createFollowUp,
    updateFollowUp,
    deleteFollowUp,
};