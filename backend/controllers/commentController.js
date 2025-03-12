const Comment = require("../models/Comment");
const Event = require("../models/Event");

exports.createComment = async (req, res) => {
    try {
        if (!req.body.content || req.body.content.trim() === "") {
            return res
                .status(400)
                .json({ error: "Comment content is required" });
        }
        const comment = new Comment({
            content: req.body.content.trim(),
            event: req.params.eventId,
            user: req.user._id,
        });

        const savedComment = await comment.save();

        // Add comment to event
        await Event.findByIdAndUpdate(
            req.params.eventId,
            { $push: { comments: savedComment.id } },
            { new: true },
        );

        const populatedComment = await Comment.findById(
            savedComment._id,
        ).populate("user", "name email");

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ event: req.params.eventId })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};