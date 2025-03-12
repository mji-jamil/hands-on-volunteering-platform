import { useState } from "react";

const EventFilters = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        category: "",
        type: "",
        location: "",
    });

    const handleChange = (e) => {
        const newFilters = { ...filters, [e.target.name]: e.target.value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="p-2 rounded border"
                >
                    <option value="">All Categories</option>
                    <option value="environmental">Environmental</option>
                    <option value="education">Education</option>
                    <option value="healthcare">Healthcare</option>
                </select>

                <select
                    name="type"
                    value={filters.type}
                    onChange={handleChange}
                    className="p-2 rounded border"
                >
                    <option value="">All Types</option>
                    <option value="event">Events</option>
                    <option value="communityHelp">Community Help</option>
                </select>

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={filters.location}
                    onChange={handleChange}
                    className="p-2 rounded border"
                />
            </div>
        </div>
    );
};

export default EventFilters;