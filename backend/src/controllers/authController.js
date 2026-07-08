const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, phone, role } = req.body;

        // Check if all required fields are provided
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields.",
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists.",
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            phone,
            role,
        });

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            user: userWithoutPassword,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required.",
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials.",
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        // Remove password from response
        const { password: _, ...userData } = user.toObject();

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: userData,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected Route Accessed Successfully",
    user: req.user,
  });
};


const adminDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin!",
  });
};

const managerDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Sales Manager!",
  });
};

const employeeDashboard = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Sales Executive!",
  });
};



module.exports = {
    registerUser,
    loginUser,
    getProfile,
    adminDashboard,
    managerDashboard,
    employeeDashboard,
};



