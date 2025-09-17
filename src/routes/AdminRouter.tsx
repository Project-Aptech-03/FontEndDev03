import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminRoute = () => {
    const { isLoggedIn, user, loading } = useAuth();

    if (loading) return <div>Đang tải...</div>;

    if (!isLoggedIn || !user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "Admin") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
