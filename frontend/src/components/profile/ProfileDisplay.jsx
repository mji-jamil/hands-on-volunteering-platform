import { useEffect, useState } from "react";
import axios from "axios";

const ProfileDisplay = ({ user }) => {
    const [joinedEvents, setJoinedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJoinedEvents = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/events/user/${user._id}`
                );
                if (response.data.success) {
                    setJoinedEvents(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching joined events:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchJoinedEvents();
        }
    }, [user?._id]);
    return (
        <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Profile Summary</h3>
                <dl className="grid grid-cols-2 gap-4">
                    <div>
                        <dt className="text-sm text-gray-600">
                            Volunteer Hours
                        </dt>
                        <dd className="text-2xl font-bold">
                            {user?.volunteerHours || 0}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm text-gray-600">
                            Completed Events
                        </dt>
                        <dd className="text-2xl font-bold">
                            {user?.volunteerHistory?.length || 0}
                        </dd>
                    </div>
                </dl>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-4">Skills & Causes</h3>
                <div className="grid grid-cols-2 gap-6">
                    <SkillList skills={user?.skills} />
                    <CauseList causes={user?.causes} />
                </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Joined Events</h3>
                {loading ? (
                    <div className="text-center py-4">Loading events...</div>
                ) : joinedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {joinedEvents.map((event) => (
                            <div
                                key={event._id}
                                className="bg-white p-4 rounded-lg shadow-sm"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium text-gray-900">
                                            {event.title}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {new Date(
                                                event.date,
                                            ).toLocaleDateString()}{" "}
                                            • {event.location}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                            event.type === "event"
                                                ? "bg-blue-100 text-blue-800"
                                                : "bg-green-100 text-green-800"
                                        }`}
                                    >
                                        {event.type}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {event.description}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-500">
                        You haven't joined any events yet
                    </div>
                )}
            </div>


        </div>
    );
};

const SkillList = ({ skills }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Your Skills</h4>
        <div className="flex flex-wrap gap-2">
            {skills?.map((skill, i) => (
                <span
                    key={i}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                    {skill}
                </span>
            ))}
        </div>
    </div>
);

const CauseList = ({ causes }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">
            Supported Causes
        </h4>
        <div className="flex flex-wrap gap-2">
            {causes?.map((cause, i) => (
                <span
                    key={i}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
                >
                    {cause}
                </span>
            ))}
        </div>
    </div>
);

export default ProfileDisplay;