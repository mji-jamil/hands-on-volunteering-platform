// import { useState, useEffect } from "react";
// import axios from "axios";
//
// const Profile = () => {
//     const [user, setUser] = useState(null);
//     const [editMode, setEditMode] = useState(false);
//     const [formData, setFormData] = useState({
//         name: "",
//         skills: [],
//         causes: [],
//     });
//     const [validationErrors, setValidationErrors] = useState([]);
//
//     // Predefined options
//     const CAUSE_OPTIONS = ["Environment", "Education", "Healthcare"];
//     const SKILL_OPTIONS = [
//         "Teaching",
//         "Construction",
//         "Medical Care",
//         "Organization",
//     ];
//
//     useEffect(() => {
//         const fetchProfile = async () => {
//             try {
//                 const { data } = await axios.get(
//                     "http://localhost:5000/api/auth/profile",
//                     { withCredentials: true }
//                 );
//
//                 if (data.success) {
//                     setUser(data.data);
//                     setFormData({
//                         name: data.data.name,
//                         skills: data.data.skills,
//                         causes: data.data.causes
//                     });
//                 }
//             } catch (err) {
//                 console.error("Profile fetch error:", err);
//                 if (err.response?.status === 401) {
//                     // Handle unauthorized error
//                     localStorage.removeItem('token');
//                     window.location.href = '/login';
//                 }
//             }
//         };
//         fetchProfile();
//     }, []);
//
//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.put(
//                 "http://localhost:5000/api/auth/profile",
//                 {
//                     ...formData,
//                     skills: formData.skills.filter((s) => s),
//                     causes: formData.causes.filter((c) => c),
//                 },
//                 { withCredentials: true },
//             );
//
//             if (data.success) {
//                 setUser(prev => ({
//                     ...prev,
//                     ...data.data  // Merge existing user data with updated fields
//                 }));
//                 setFormData({
//                     name: data.data.name,
//                     skills: data.data.skills,
//                     causes: data.data.causes
//                 });
//                 setEditMode(false);
//                 setValidationErrors([]);
//             }
//         } catch (err) {
//             setValidationErrors(
//                 err.response?.data?.errors || ["Update failed"],
//             );
//         }
//     };
//
//     if (!user) return <div className="p-8 text-center">Loading profile...</div>;
//
//     return (
//         <div className="max-w-4xl mx-auto p-6">
//             <div className="bg-white rounded-xl shadow-lg p-8">
//                 <div className="flex justify-between items-center mb-8">
//                     <h1 className="text-3xl font-bold text-gray-800">
//                         {user.name}
//                     </h1>
//                     <button
//                         onClick={() => setEditMode(!editMode)}
//                         className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
//                     >
//                         {editMode ? "Cancel" : "Edit Profile"}
//                     </button>
//                 </div>
//
//                 {validationErrors.length > 0 && (
//                     <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
//                         {validationErrors.map((err, i) => (
//                             <p key={i}>{err.msg || err}</p>
//                         ))}
//                     </div>
//                 )}
//
//                 {editMode ? (
//                     <form onSubmit={handleUpdate} className="space-y-6">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Full Name
//                             </label>
//                             <input
//                                 type="text"
//                                 value={formData.name}
//                                 onChange={(e) =>
//                                     setFormData({
//                                         ...formData,
//                                         name: e.target.value,
//                                     })
//                                 }
//                                 className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
//                                 required
//                             />
//                         </div>
//
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Skills
//                             </label>
//                             <div className="grid grid-cols-2 gap-3">
//                                 {SKILL_OPTIONS.map((skill) => (
//                                     <label
//                                         key={skill}
//                                         className="flex items-center space-x-2"
//                                     >
//                                         <input
//                                             type="checkbox"
//                                             checked={formData?.skills?.includes(
//                                                 skill,
//                                             )}
//                                             onChange={(e) => {
//                                                 const skills = e.target.checked
//                                                     ? [
//                                                           ...formData.skills,
//                                                           skill,
//                                                       ]
//                                                     : formData.skills.filter(
//                                                           (s) => s !== skill,
//                                                       );
//                                                 setFormData({
//                                                     ...formData,
//                                                     skills,
//                                                 });
//                                             }}
//                                             className="rounded text-green-600"
//                                         />
//                                         <span>{skill}</span>
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>
//
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Causes You Support
//                             </label>
//                             <div className="grid grid-cols-2 gap-3">
//                                 {CAUSE_OPTIONS.map((cause) => (
//                                     <label
//                                         key={cause}
//                                         className="flex items-center space-x-2"
//                                     >
//                                         <input
//                                             type="checkbox"
//                                             checked={formData?.causes?.includes(
//                                                 cause,
//                                             )}
//                                             onChange={(e) => {
//                                                 const causes = e.target.checked
//                                                     ? [
//                                                           ...formData.causes,
//                                                           cause,
//                                                       ]
//                                                     : formData.causes.filter(
//                                                           (c) => c !== cause,
//                                                       );
//                                                 setFormData({
//                                                     ...formData,
//                                                     causes,
//                                                 });
//                                             }}
//                                             className="rounded text-green-600"
//                                         />
//                                         <span>{cause}</span>
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>
//
//                         <button
//                             type="submit"
//                             className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
//                         >
//                             Save Changes
//                         </button>
//                     </form>
//                 ) : (
//                     <div className="space-y-6">
//                         <div className="bg-gray-50 p-6 rounded-xl">
//                             <h3 className="text-xl font-semibold mb-4">
//                                 Profile Summary
//                             </h3>
//                             <dl className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <dt className="text-sm text-gray-600">
//                                         Volunteer Hours
//                                     </dt>
//                                     <dd className="text-2xl font-bold">
//                                         {user.volunteerHours || 0}
//                                     </dd>
//                                 </div>
//                                 <div>
//                                     <dt className="text-sm text-gray-600">
//                                         Completed Events
//                                     </dt>
//                                     <dd className="text-2xl font-bold">
//                                         {user.volunteerHistory?.length || 0}
//                                     </dd>
//                                 </div>
//                             </dl>
//                         </div>
//
//                         <div>
//                             <h3 className="text-xl font-semibold mb-4">
//                                 Skills & Causes
//                             </h3>
//                             <div className="grid grid-cols-2 gap-6">
//                                 <div>
//                                     <h4 className="text-sm font-medium text-gray-600 mb-2">
//                                         Your Skills
//                                     </h4>
//                                     <div className="flex flex-wrap gap-2">
//                                         {user?.skills?.map((skill, i) => (
//                                             <span
//                                                 key={i}
//                                                 className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
//                                             >
//                                                 {skill}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <h4 className="text-sm font-medium text-gray-600 mb-2">
//                                         Supported Causes
//                                     </h4>
//                                     <div className="flex flex-wrap gap-2">
//                                         {user?.causes?.map((cause, i) => (
//                                             <span
//                                                 key={i}
//                                                 className="bg-green-100 text-green-800 px-3 py-1 rounded-full"
//                                             >
//                                                 {cause}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default Profile;

import { useState, useEffect } from "react";
import axios from "axios";
import ProfileDisplay from "../components/profile/ProfileDisplay.jsx";
import EditForm from "../components/profile/EditForm.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: "", skills: [], causes: [] });
    const [validationErrors, setValidationErrors] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axios.get("http://localhost:5000/api/auth/profile", {
                    withCredentials: true
                });

                if (data.success) {
                    setUser(data.data);
                    setFormData({
                        name: data.data.name,
                        skills: data.data.skills,
                        causes: data.data.causes
                    });
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(
                "http://localhost:5000/api/auth/profile",
                {
                    ...formData,
                    skills: formData.skills.filter(s => s),
                    causes: formData.causes.filter(c => c),
                },
                { withCredentials: true },
            );

            if (data.success) {
                setUser(prev => ({ ...prev, ...data.data }));
                setFormData({
                    name: data.data.name,
                    skills: data.data.skills,
                    causes: data.data.causes
                });
                setEditMode(false);
                setValidationErrors([]);
            }
        } catch (err) {
            setValidationErrors(err.response?.data?.errors || ["Update failed"]);
        }
    };

    if (!user) return <div className="p-8 text-center">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
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