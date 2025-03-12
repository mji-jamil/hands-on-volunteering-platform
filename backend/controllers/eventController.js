const Event = require("../models/Event");
const mongoose = require("mongoose");

// create an event
exports.createEvent = async (req, res) => {
    try {
        // urgency level
        if (req.body.type === "communityHelp") {
            if (!req.body.urgency) {
                return res.status(400).json({
                    error: "Urgency level is required for community help events"
                });
            }
        }
        // validate date & time
        const eventDateTime = new Date(`${req.body.date}T${req.body.time}`);
        if (eventDateTime < new Date()) {
            return res.status(400).json({
                error: "Event date/time must be in the future"
            });
        }
        // create and save event
        const event = new Event({
            ...req.body,
            date: eventDateTime
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: errors.join(', ') });
        }
        res.status(500).json({ error: error.message });
    }
};

// get all events
exports.getAllEvents = async (req, res) => {
    try {
        const { category, type, search, urgency } = req.query;
        const query = {};

        if (category) query.category = category;
        if (type) query.type = type;

        if (type === "communityHelp" && urgency) {
            query.urgency = urgency;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const events = await Event.find(query)
            .populate("attendees", "_id")
            .sort({ date: 1 });

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

// get event by id
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId)
            .populate("attendees", "_id name")
            .populate("comments");

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// get event by userid
exports.getEventByUserId = async (req, res) => {
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