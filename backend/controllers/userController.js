const User = require("../models/User");
const { validationResult } = require("express-validator");

// get user data
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate({
                path: "volunteerHistory",
                select: "title date location",
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        console.error("Profile error:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error while fetching profile",
        });
    }
};

// update user data
exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, skills, causes } = req.body;

        const updateData = {
            name: name.trim(),
            skills: [...new Set(skills)].slice(0, 10),
            causes: [...new Set(causes)].slice(0, 5),
        };

        const user = await User.findByIdAndUpdate(req.user.id, updateData, {
            new: true,
            runValidators: true,
        }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: "Server error during profile update",
            error: process.env.NODE_ENV === "development" ? err.message : null,
        });
    }
};