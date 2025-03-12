const express = require("express");
const protect = require("../middleware/auth");
const {
    createEvent,
    getAllEvents,
    joinEvent,
    getEventById,
    getEventByUserId,
} = require("../controllers/eventController");
const {
    createComment,
    getComments,
} = require("../controllers/commentController");

const router = express.Router();

// event create route
router.post("/", createEvent);

// get all events
router.get("/", getAllEvents);
// get single event
router.get("/:eventId", getEventById);

// join event route
router.post("/:id/join", protect, joinEvent);

// event by userid route
router.get("/user/:userId", getEventByUserId);

// comments route
router.post("/:eventId/comments", protect, createComment);
router.get("/:eventId/comments", getComments);

module.exports = router;