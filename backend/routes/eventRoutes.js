const express = require("express");
const protect = require("../middleware/auth");
const {
    createEvent,
    getAllEvents,
    joinEvent,
    getEventById,
} = require("../controllers/eventController");

const router = express.Router();

// event create route
router.post("/", createEvent);

// get all events
router.get("/", getAllEvents);

// join event route
router.post("/:id/join", protect, joinEvent);

// event by userid route
router.get("/user/:userId", getEventById);

module.exports = router;