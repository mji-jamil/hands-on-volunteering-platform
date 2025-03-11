import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from "../hooks/useAuth.js";

export default function Login() {
    const {login} = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const url = `http://localhost:5000/api/auth/${isLogin ? 'login' : 'register'}`;
            const res = await axios.post(url, formData, {
                withCredentials: true
            });

            console.log(res.data);

            if (res.data.success) {
                login(res.data.user)
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/profile', {replace: true});
            }
        } catch (err) {
            const errorMessage = err.response?.data?.errors?.[0]?.msg ||
                err.response?.data?.message ||
                'An error occurred';
            setError(errorMessage);
            console.error('Login error:', err.response?.data);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isLogin ? 'Sign In' : 'Create Account'}
                </h2>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Name"
                            required
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
                    >
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}