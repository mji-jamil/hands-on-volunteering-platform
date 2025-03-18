import useAuth from "../../hooks/useAuth.js";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const EventCard = ({ event, onJoin }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isJoined, setIsJoined] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

    useEffect(() => {
        if (user && event.attendees) {
            const joined = event.attendees.some((attendee) => {
                const attendeeId = attendee._id
                    ? attendee._id.toString()
                    : attendee.toString();
                return attendeeId === user._id;
            });
            setIsJoined(joined);
        }
    }, [user, event.attendees]);
    useEffect(() => {
        const fetchCommentCount = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/events/${event._id}/comments`,
                );
                setCommentCount(response.data.length);
            } catch (error) {
                console.error("Error fetching comments:", error);
                setCommentCount(0);
            }
        };

        fetchCommentCount();
    }, [event._id]);

    const handleJoin = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (isJoined) return;
        setIsJoining(true);

        try {
            await onJoin(event._id);
            setIsJoined(true);
        } catch (error) {
            console.error("Error joining event:", error);
            setIsJoined(false);
        } finally {
            setIsJoining(false);
        }
    };

    const getUrgencyStyle = () => {
        if (event.type !== "communityHelp") return "";
        switch (event.urgency) {
            case "low":
                return "bg-green-100 text-green-800";
            case "medium":
                return "bg-yellow-100 text-yellow-800";
            case "urgent":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex justify-between items-start mb-4">
                <Link
                    to={`/events/${event._id}`}
                    className="text-xl font-semibold hover:text-indigo-600"
                >
                    {event?.title}
                </Link>

                <div className="flex flex-col items-end gap-1">
                    <span
                        className={`px-3 py-1 rounded-full text-sm ${
                            event?.type === "event"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                        }`}
                    >
                        {event?.type}
                    </span>
                    {event.type === "communityHelp" && event?.urgency && (
                        <span
                            className={`px-3 py-1 rounded-full text-sm ${getUrgencyStyle()}`}
                        >
                            Urgency: {event?.urgency}
                        </span>
                    )}
                </div>
            </div>
            <p className="text-gray-600 mb-4">{event?.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-500">
                        📅 {new Date(event?.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">🕒 {event?.time}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">
                        📍 {event?.location}
                    </p>
                    <p className="text-sm text-gray-500">
                        👥 {event?.attendees?.length} participants
                    </p>
                    <Link
                        to={`/events/${event._id}`}
                        className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                        💬 {commentCount} comments
                    </Link>
                </div>
            </div>
            <button
                onClick={handleJoin}
                disabled={isJoined || isJoining}
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                    isJoined
                        ? "bg-gray-300 cursor-default"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                } ${isJoining ? "opacity-75" : ""}`}
            >
                {isJoining ? "Joining..." : isJoined ? "Joined" : "Join Event"}
            </button>
        </div>
    );
};

export default EventCard;