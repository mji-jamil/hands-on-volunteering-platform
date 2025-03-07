require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
require('./models/Event');
const app = express();

app.use(cookieParser());
app.use(express.json());

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

// Database Connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));