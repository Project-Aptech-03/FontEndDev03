import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {message} from "antd";

const ProtectedRoute = () => {
    // const { isLoggedIn } = useAuth();
    // if (!isLoggedIn) {
    //     message.warning("Bạn cần đăng nhập để truy cập trang này!");
    //     return <Navigate to="/login" replace />;
    // }

    return <Outlet />;
};

export default ProtectedRoute;
