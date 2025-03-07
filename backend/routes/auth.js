const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require('express-validator');
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const rateLimit = require('express-rate-limit');

// Rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many attempts, please try again later",
});

// Password validation middleware
const validatePassword = [
    check("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Password must contain uppercase, lowercase, and number"),
];

// Registration route
router.post(
    "/register",
    authLimiter,
    [
        check("email").isEmail().normalizeEmail(),
        check("name").notEmpty().trim().escape(),
        ...validatePassword,
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { name, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const user = new User({ name, email, password });
            const salt = await bcrypt.genSalt(12);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = { id: user.id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            });

            res.status(201).json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    },
);

// login user
router.post('/login',
    authLimiter,
    [
        check('email').isEmail().normalizeEmail(),
        check('password').notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign(
                { id: user.id },
                process.env.JWT_SECRET, // Ensure this exists in .env
                { expiresIn: '1h' }
            );
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000
            });

            res.status(200).json({
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    skills: user.skills,
                    causes: user.causes
                }
            });

        } catch (err) {
            console.error('Login error:', err.message);
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? err.message : null
            });
        }
    }
);

// Get user profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password')
            .populate({
                path: 'volunteerHistory',
                select: 'title date location' // Only get essential event data
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error('Profile error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
});

// Update profile
router.put('/profile',
    protect,
    [
        check('name')
            .trim()
            .escape()
            .isLength({ min: 2 })
            .withMessage('Name must be at least 2 characters'),
        check('skills')
            .isArray({ min: 1 })
            .withMessage('Select at least one skill'),
        check('causes')
            .isArray({ min: 1 })
            .withMessage('Select at least one cause')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, skills, causes } = req.body;

            const updateData = {
                name: name.trim(),
                skills: [...new Set(skills)].slice(0, 10),
                causes: [...new Set(causes)].slice(0, 5)
            };

            const user = await User.findByIdAndUpdate(
                req.user.id,
                updateData,
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: user
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                success: false,
                message: 'Server error during profile update',
                error: process.env.NODE_ENV === 'development' ? err.message : null
            });
        }
    }
);

// logout
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.json({ success: true });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ success: false, message: 'Logout failed' });
    }
});

module.exports = router;