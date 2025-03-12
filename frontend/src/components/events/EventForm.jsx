import { useEffect, useState } from "react";
import axios from "axios";
import ErrorMessage from "../ui/ErrorMessage";
import useAuth from "../../hooks/useAuth.js";

const EventForm = ({ onCancel, onSuccess }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "environmental",
        type: "event",
        urgency: "low",
    });
    const [errors, setErrors] = useState([]);

    const [currentDateTime, setCurrentDateTime] = useState({
        date: new Date().toISOString().split("T")[0],
        time: new Date().toLocaleTimeString("en-GB", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
        }),
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentDateTime({
                date: now.toISOString().split("T")[0],
                time: now.toLocaleTimeString("en-GB", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            });
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
        const now = new Date();

        if (selectedDateTime < now) {
            setErrors(["Event date/time must be in the future"]);
            return;
        }
        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/events",
                {
                    ...formData,
                    createdBy: user._id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );

            if (data._id) {
                onSuccess(data);
                setErrors([]);
            }
        } catch (err) {
            setErrors(
                err.response?.data?.error
                    ? [err.response.data.error]
                    : ["Failed to create event"],
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorMessage errors={errors} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Category</label>
                    <select
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                category: e.target.value,
                            })
                        }
                        className="w-full p-2 border rounded"
                    >
                        <option value="environmental">Environmental</option>
                        <option value="education">Education</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-gray-700 mb-2">Type</label>
                <select
                    value={formData.type}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            type: e.target.value,
                            urgency:
                                e.target.value === "communityHelp"
                                    ? "low"
                                    : undefined,
                        })
                    }
                    className="w-full p-2 border rounded"
                >
                    <option value="event">Event</option>
                    <option value="communityHelp">Community Help</option>
                </select>
            </div>
            {formData.type === "communityHelp" && (
                <div>
                    <label className="block text-gray-700 mb-2">
                        Urgency Level
                    </label>
                    <select
                        value={formData.urgency}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                urgency: e.target.value,
                            })
                        }
                        className="w-full p-2 border rounded"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
            )}

            <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            description: e.target.value,
                        })
                    }
                    className="w-full p-2 border rounded h-32"
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 mb-2">Date</label>
                    <input
                        type="date"
                        value={formData.date}
                        min={currentDateTime.date}
                        onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-2">Time</label>
                    <input
                        type="time"
                        value={formData.time}
                        min={
                            formData.date === currentDateTime.date
                                ? currentDateTime.time
                                : undefined
                        }
                        onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                    Create Event
                </button>
            </div>
        </form>
    );
};

export default EventForm;