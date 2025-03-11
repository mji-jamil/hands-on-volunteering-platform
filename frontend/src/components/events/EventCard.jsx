import useAuth from "../../hooks/useAuth.js";
import { useState, useEffect } from "react";

const EventCard = ({ event, onJoin }) => {
    const { user } = useAuth();
    const [isJoined, setIsJoined] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        if (user && event.attendees) {
            const joined = event.attendees.some((attendee) =>
                {
                    const attendeeId = attendee._id ? attendee._id.toString() : attendee.toString();
                    return attendeeId === user._id;
                }
            );
            setIsJoined(joined);
        }
    }, [user, event.attendees]);

    const handleJoin = async () => {
        if (!user || isJoined) return;

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

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <span
                    className={`px-3 py-1 rounded-full text-sm ${event.type === "event" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                >
                    {event.type}
                </span>
            </div>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-500">
                        📅 {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">🕒 {event.time}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">📍 {event.location}</p>
                    <p className="text-sm text-gray-500">
                        👥 {event.attendees.length} participants
                    </p>
                </div>
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
                {isJoining ? "Joining..." : isJoined ? "Joined" : "Join Event"}
            </button>
        </div>
    );
};

export default EventCard;