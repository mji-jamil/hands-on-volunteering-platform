import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Profile from "./pages/Profile";
import EventsPage from "./pages/Events";
import Navbar from "./components/ui/Navbar.jsx";
import PrivateRoute from "./components/navigation/PrivateRoute.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import EventDetails from "./components/events/EventDetails.jsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<EventsPage />} />
                        <Route path="/events/:eventId" element={<EventDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<div>404 Not Found</div>} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;