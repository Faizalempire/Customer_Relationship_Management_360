const User = require("../models/User");

const getSalesExecutives = async (req, res) => {
  try {
    const users = await User.find({
      role: "sales_executive",
    }).select("_id fullName email role");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

module.exports = {
  getSalesExecutives,
};