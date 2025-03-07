const ErrorMessage = ({ errors }) => {
    if (!errors.length) return null;

    return (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {errors.map((err, i) => (
                <p key={i}>{err?.msg || err}</p>
            ))}
        </div>
    );
};

export default ErrorMessage;