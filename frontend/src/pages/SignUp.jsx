import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/register",
                formData,
                { withCredentials: true },
            );

            if (res.status === 201) {
                navigate("/login", { replace: true });
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.errors?.[0]?.msg ||
                err.response?.data?.message ||
                "Registration failed";
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Create Account
                </h2>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                confirmPassword: e.target.value,
                            })
                        }
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                    >
                        Sign Up
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}