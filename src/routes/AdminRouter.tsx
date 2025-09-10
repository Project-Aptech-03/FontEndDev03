// src/routes/AdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext"; // context bạn đang dùng

const AdminRoute = () => {
    const { isLoggedIn, user } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "Admin") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
