import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const user = localStorage.getItem("user");

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children || <Outlet />;
};

export default PrivateRoute;