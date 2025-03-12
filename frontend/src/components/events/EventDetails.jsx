import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../hooks/useAuth.js";
import CommentSection from "./CommentSection.jsx";
import ErrorMessage from "../ui/ErrorMessage.jsx";
import Loader from "../ui/Loader.jsx";

const EventDetails = () => {
    const { eventId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isJoining, setIsJoining] = useState(false);
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/events/${eventId}`,
                );
                setEvent(response.data);
                checkIfJoined(response.data.attendees);
            } catch (err) {
                setError("Failed to load event details. " + err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    const checkIfJoined = (attendees) => {
        if (user && attendees) {
            const joined = attendees.some(
                (attendee) => attendee._id.toString() === user._id,
            );
            setIsJoined(joined);
        }
    };

    const handleJoin = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        setIsJoining(true);
        try {
            await axios.post(
                `http://localhost:5000/api/events/${eventId}/join`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );

            const updatedEvent = { ...event };
            updatedEvent.attendees = [...event.attendees, user._id];
            setEvent(updatedEvent);
            setIsJoined(true);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to join event");
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

    if (loading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;
    if (!event) return <ErrorMessage message="Event not found" />;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 text-indigo-600 hover:text-indigo-700"
                >
                    ← Back to Events
                </button>

                {/* Event Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold">{event.title}</h1>
                        <div className="flex flex-col items-end gap-2">
                            <span
                                className={`px-3 py-1 rounded-full text-sm ${
                                    event.type === "event"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-green-100 text-green-800"
                                }`}
                            >
                                {event.type}
                            </span>
                            {event.type === "communityHelp" &&
                                event.urgency && (
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${getUrgencyStyle()}`}
                                    >
                                        Urgency: {event.urgency}
                                    </span>
                                )}
                        </div>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-600">
                                    {event.description}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold">
                                        📅 Date:
                                    </span>{" "}
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold">
                                        🕒 Time:
                                    </span>{" "}
                                    {event.time}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold">
                                        📍 Location:
                                    </span>{" "}
                                    {event.location}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">
                                    Participants
                                </h3>
                                <p className="text-2xl font-bold text-indigo-600">
                                    {event.attendees.length}
                                </p>
                            </div>
                            <button
                                onClick={handleJoin}
                                disabled={!user || isJoined || isJoining}
                                className={`w-full py-2 px-4 rounded-md transition-colors ${
                                    isJoined
                                        ? "bg-gray-300 cursor-default"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                } ${isJoining ? "opacity-75" : ""}`}
                            >
                                {isJoining
                                    ? "Joining..."
                                    : isJoined
                                      ? "Joined"
                                      : "Join Event"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <CommentSection eventId={eventId} />
            </div>
        </div>
    );
};

export default EventDetails;