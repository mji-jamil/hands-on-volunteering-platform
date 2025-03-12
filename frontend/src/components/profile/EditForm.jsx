import { CAUSE_OPTIONS, SKILL_OPTIONS } from "../../constants/index.js";

const EditForm = ({ formData, setFormData, handleUpdate }) => {
    const handleSkillChange = (e, skill) => {
        const skills = e.target.checked
            ? [...formData.skills, skill]
            : formData.skills.filter((s) => s !== skill);
        setFormData({ ...formData, skills });
    };

    const handleCauseChange = (e, cause) => {
        const causes = e.target.checked
            ? [...formData.causes, cause]
            : formData.causes.filter((c) => c !== cause);
        setFormData({ ...formData, causes });
    };

    return (
        <form onSubmit={handleUpdate} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {SKILL_OPTIONS.map((skill) => (
                        <label
                            key={skill}
                            className="flex items-center space-x-2"
                        >
                            <input
                                type="checkbox"
                                checked={formData.skills.includes(skill)}
                                onChange={(e) => handleSkillChange(e, skill)}
                                className="rounded text-green-600"
                            />
                            <span>{skill}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Causes You Support
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {CAUSE_OPTIONS.map((cause) => (
                        <label
                            key={cause}
                            className="flex items-center space-x-2"
                        >
                            <input
                                type="checkbox"
                                checked={formData.causes.includes(cause)}
                                onChange={(e) => handleCauseChange(e, cause)}
                                className="rounded text-green-600"
                            />
                            <span>{cause}</span>
                        </label>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
                Save Changes
            </button>
        </form>
    );
};

export default EditForm;