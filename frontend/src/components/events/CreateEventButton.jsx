import { useState } from 'react';
import useAuth from "../../hooks/useAuth.js";
import EventForm from "./EventForm.jsx";


const CreateEventButton = ({ onEventCreated }) => {
    const [showForm, setShowForm] = useState(false);
    const { user } = useAuth();

    const handleButtonClick = () => {
        if (!user) {
            window.location.href = '/login';
            return;
        }
        setShowForm(true);
    };

    return (
        <div className="mb-8">
            <button
                onClick={handleButtonClick}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
                Create New Event
            </button>

            {showForm && (
                <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
                    <EventForm
                        onCancel={() => setShowForm(false)}
                        onSuccess={(newEvent) => {
                            setShowForm(false);
                            onEventCreated(newEvent);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default CreateEventButton;