const Event = require("../models/Event");
const mongoose = require("mongoose");

// create an event
exports.createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({}).populate("attendees", "_id");
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// join events
exports.joinEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { attendees: req.user._id } },
            { new: true },
        ).populate("attendees", "_id");

        if (!event) return res.status(404).json({ error: "Event not found" });
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get event by userid
exports.getEventById = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid user ID format",
            });
        }

        const events = await Event.find({
            attendees: new mongoose.Types.ObjectId(userId),
        })
            .populate("attendees", "_id")
            .lean();

        const formattedEvents = events.map((event) => ({
            ...event,
            _id: event._id.toString(),
            attendees: event.attendees.map((a) => a._id.toString()),
            createdBy: event.createdBy.toString(),
        }));

        res.status(200).json({
            success: true,
            data: formattedEvents,
        });
    } catch (error) {
        console.error("Error fetching user events:", error);
        res.status(500).json({
            success: false,
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Server error",
        });
    }
};