const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        skills: [String],
        causes: [String],
        volunteerHours: {
            type: Number,
            default: 0,
        },
        points: {
            type: Number,
            default: 0,
        },
        volunteerHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event",
            },
        ],
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("User", userSchema);