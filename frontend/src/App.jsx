import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
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
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<Login />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;