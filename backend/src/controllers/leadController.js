const Lead = require("../models/Lead");
const createNotification = require("../utils/createNotification");

// Get all leads
const getLeads = async (req, res) => {
    try {
        const leads = await Lead.find().populate("assignedTo", "fullName email role");

        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch leads",
            error: error.message,
        });
    }
};

// Create a new lead
const createLead = async (req, res) => {
    try {

        const lead = new Lead(req.body);

        await lead.save();

        if (lead.assignedTo) {
            await createNotification({
                title: "New Lead Added",
                message: `Lead "${lead.name}" has been created.`,
                type: "lead",
                userId: lead.assignedTo,
            });
        }

        res.status(201).json({
            message: "Lead created successfully",
            lead,
        });

    } catch (error) {
        res.status(400).json({
            message: "Failed to create lead",
            error: error.message,
        });
    }
};


// Update a lead
const updateLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }

        res.status(200).json({
            message: "Lead updated successfully",
            lead,
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to update lead",
            error: error.message,
        });
    }
};

// Delete a lead
const deleteLead = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }

        res.status(200).json({
            message: "Lead deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete lead",
            error: error.message,
        });
    }
};

module.exports = {
    getLeads,
    createLead,
    updateLead,
    deleteLead,
};