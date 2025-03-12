import { useEffect, useState } from "react";
import axios from "axios";
import ProfileDisplay from "../components/profile/ProfileDisplay.jsx";
import EditForm from "../components/profile/EditForm.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        skills: [],
        causes: [],
    });
    const [validationErrors, setValidationErrors] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:5000/api/users/profile",
                    {
                        withCredentials: true,
                    },
                );

                if (data.success) {
                    setUser(data.data);
                    setFormData({
                        name: data.data.name,
                        skills: data.data.skills,
                        causes: data.data.causes,
                    });
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                }
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                "http://localhost:5000/api/users/profile",
                {
                    ...formData,
                    skills: formData.skills.filter((s) => s),
                    causes: formData.causes.filter((c) => c),
                },
                { withCredentials: true },
            );

            if (data.success) {
                setUser((prev) => ({ ...prev, ...data.data }));
                setFormData({
                    name: data.data.name,
                    skills: data.data.skills,
                    causes: data.data.causes,
                });
                setEditMode(false);
                setValidationErrors([]);
            }
        } catch (err) {
            setValidationErrors(
                err.response?.data?.errors || ["Update failed"],
            );
        }
    };

    if (!user) return <div className="p-8 text-center">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {user.name}
                    </h1>
                    <button
                        onClick={() => setEditMode(!editMode)}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        {editMode ? "Cancel" : "Edit Profile"}
                    </button>
                </div>

                <ErrorMessage errors={validationErrors} />

                {editMode ? (
                    <EditForm
                        formData={formData}
                        setFormData={setFormData}
                        handleUpdate={handleUpdate}
                    />
                ) : (
                    <ProfileDisplay user={user} />
                )}
            </div>
        </div>
    );
};

export default Profile;