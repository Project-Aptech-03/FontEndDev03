import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { message } from "antd";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isLoggedIn, user, loading } = useAuth();

    if (loading) return <div>Đang tải...</div>;

    if (!isLoggedIn || !user) {
        message.warning("Bạn cần đăng nhập để truy cập trang này!");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role || "")) {
        message.error("Bạn không có quyền truy cập vào trang này!");
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
