import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from "../../hooks/useAuth.js";

export default function Navbar() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, {
                withCredentials: true
            });
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            logout();
            window.location.href = '/login';
        }
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-green-600">
                        HandsOn
                    </Link>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <Link to="/profile" className="text-gray-700 hover:text-green-600">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-green-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-gray-700 hover:text-green-600">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}