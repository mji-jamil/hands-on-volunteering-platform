const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const protect = require("../middleware/auth");
const { updateUser, getUser } = require("../controllers/userController");

// Get user profile
router.get("/profile", protect, getUser);

// Update profile
router.put(
    "/profile",
    protect,
    [
        check("name")
            .trim()
            .escape()
            .isLength({ min: 2 })
            .withMessage("Name must be at least 2 characters"),
        check("skills")
            .isArray({ min: 1 })
            .withMessage("Select at least one skill"),
        check("causes")
            .isArray({ min: 1 })
            .withMessage("Select at least one cause"),
    ],
    updateUser,
);

module.exports = router;