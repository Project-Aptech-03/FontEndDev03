import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminRoute = () => {
    const { isLoggedIn, user } = useAuth();
    if (!isLoggedIn || !user) return <Navigate to="/login" replace />;

    if (user.role !== "Admin") return <Navigate to="/" replace />;

    return <Outlet />;
};

export default AdminRoute;
