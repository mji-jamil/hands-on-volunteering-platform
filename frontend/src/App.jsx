import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import EventsPage from "./pages/Events";
import Navbar from "./components/ui/Navbar.jsx";
import PrivateRoute from "./components/navigation/PrivateRoute.jsx";
import AuthProvider from "./context/AuthProvider.jsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<EventsPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/events"
                            element={<EventsPage />}
                        />
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;