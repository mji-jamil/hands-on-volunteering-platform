const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        location: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ["environmental", "education", "healthcare", "other"],
        },
        type: {
            type: String,
            enum: ["event", "communityHelp"],
            default: "event",
        },
        urgency: {
            type: String,
            enum: ["low", "medium", "urgent"],
            required: function () {
                return this.type === "communityHelp";
            },
        },
        attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Event", eventSchema);