import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {message} from "antd";

const AdminRoute = () => {
    const { isLoggedIn, user } = useAuth();
    // if (!isLoggedIn) {
    //     message.warning("Bạn cần đăng nhập để truy cập trang quản trị!");
    //     return <Navigate to="/login" replace />;
    // }

    console.log("AdminRoute - isLoggedIn:", isLoggedIn);
    console.log("AdminRoute - user:", user);


    // if (user?.role !== "Admin") {
    //
    //     message.error("Bạn không có quyền truy cập trang này!");
    //     return <Navigate to="/" replace />;
    // }


    return <Outlet />;
};

export default AdminRoute;
