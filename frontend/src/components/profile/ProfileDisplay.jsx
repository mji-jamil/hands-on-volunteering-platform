const ProfileDisplay = ({ user }) => (
    <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Profile Summary</h3>
            <dl className="grid grid-cols-2 gap-4">
                <div>
                    <dt className="text-sm text-gray-600">Volunteer Hours</dt>
                    <dd className="text-2xl font-bold">{user.volunteerHours || 0}</dd>
                </div>
                <div>
                    <dt className="text-sm text-gray-600">Completed Events</dt>
                    <dd className="text-2xl font-bold">{user.volunteerHistory?.length || 0}</dd>
                </div>
            </dl>
        </div>

        <div>
            <h3 className="text-xl font-semibold mb-4">Skills & Causes</h3>
            <div className="grid grid-cols-2 gap-6">
                <SkillList skills={user.skills} />
                <CauseList causes={user.causes} />
            </div>
        </div>
    </div>
);

const SkillList = ({ skills }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Your Skills</h4>
        <div className="flex flex-wrap gap-2">
            {skills?.map((skill, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {skill}
        </span>
            ))}
        </div>
    </div>
);

const CauseList = ({ causes }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-600 mb-2">Supported Causes</h4>
        <div className="flex flex-wrap gap-2">
            {causes?.map((cause, i) => (
                <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
          {cause}
        </span>
            ))}
        </div>
    </div>
);

export default ProfileDisplay;