import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Modal } from "antd";
import { useState, useEffect } from "react";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isLoggedIn, user, loading } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [redirectToHome, setRedirectToHome] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!isLoggedIn || !user) {
                setShowModal(true);
                return;
            }
            if (allowedRoles && user && !allowedRoles.includes(user.role || "")) {
                setRedirectToHome(true);
            }
        }
    }, [isLoggedIn, user, loading, allowedRoles]);

    const handleLoginOk = () => {
        setShowModal(false);
        setRedirectToLogin(true);
    };

    const handleLoginCancel = () => {
    };

    if (loading) return <div>Đang tải...</div>;
    if (redirectToLogin) return <Navigate to="/login" replace />;
    if (redirectToHome) return <Navigate to="/home" replace />;
    if (isLoggedIn && user && (!allowedRoles || allowedRoles.includes(user.role || ""))) {
        return <Outlet />;
    }

    return (
        <>
            <div>Đang kiểm tra quyền truy cập...</div>
            <Modal
                open={showModal}
                title="Cần đăng nhập"
                onOk={handleLoginOk}
                onCancel={handleLoginCancel}
                closable={false}
                maskClosable={false}
                okText="Đăng nhập"
                cancelText="Hủy"
            >
                <p>Bạn cần đăng nhập để truy cập trang này!</p>
            </Modal>
        </>
    );
};

export default ProtectedRoute;
