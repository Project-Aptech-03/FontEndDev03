import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const AdminRoute = () => {
    const { isLoggedIn, user } = useAuth();

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    if (user?.role !== "Admin") return <Navigate to="/admin/dashboard" replace />;

    return <Outlet />;
};

export default AdminRoute;



