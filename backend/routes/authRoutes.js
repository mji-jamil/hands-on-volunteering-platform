const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const rateLimit = require("express-rate-limit");
const {
    registerUser,
    loginUser,
    logoutUser,
} = require("../controllers/authController");

// rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many attempts, please try again later",
});

// password validation middleware
const validatePassword = [
    check("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Password must contain uppercase, lowercase, and number"),
];

// registration route
router.post(
    "/register",
    authLimiter,
    [
        check("email").isEmail().normalizeEmail(),
        check("name").notEmpty().trim().escape(),
        ...validatePassword,
    ],

    registerUser,
);

// login route
router.post(
    "/login",
    authLimiter,
    [check("email").isEmail().normalizeEmail(), check("password").notEmpty()],
    loginUser,
);

// logout route
router.post("/logout", logoutUser);

module.exports = router;