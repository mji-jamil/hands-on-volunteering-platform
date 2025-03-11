import { useEffect, useState } from "react";
import EventCard from "../components/events/EventCard";
import EventFilters from "../components/events/EventFilters";
import useAuth from "../hooks/useAuth.js";
import CreateEventButton from "../components/events/CreateEventButton.jsx";
import axios from "axios";

const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [filters, setFilters] = useState({});
    const { user } = useAuth();
    console.log(user);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const query = new URLSearchParams(filters).toString();
                const response = await fetch(
                    `http://localhost:5000/api/events?${query}`,
                );

                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();
    }, [filters]);

    const handleJoin = async (eventId) => {
        try {
            const response = await axios.post(
                `http://localhost:5000/api/events/${eventId}/join`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                    withCredentials: true,
                },
            );

            setEvents(
                events.map((event) =>
                    event._id === eventId ? {
                        ...event,
                        attendees: response.data.attendees
                    } : event
                ),
            );
        } catch (error) {
            console.error("Error joining event:", error);
            throw error;
        }
    };
    const handleNewEvent = (newEvent) => {
        setEvents([newEvent, ...events]);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">
                Discover Volunteer Opportunities
            </h1>
            <CreateEventButton onEventCreated={handleNewEvent} />
            <EventFilters onFilterChange={setFilters} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            onJoin={handleJoin}
                        />
                    ))
                ) : (
                    <p>No events found.</p>
                )}
            </div>
        </div>
    );
};

export default EventsPage;