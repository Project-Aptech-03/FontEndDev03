import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Modal } from "antd";
import { useState, useEffect } from "react";

const AdminRoute = () => {
    const { isLoggedIn, user, loading } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const allowedRoles = ["Admin", "Employee"];

    useEffect(() => {
        if (!loading && (!isLoggedIn || !user)) {
            setShowModal(true);
        }
    }, [isLoggedIn, user, loading]);

    const handleOk = () => {
        setShowModal(false);
        setRedirect(true);
    };

    const handleCancel = () => {
        setShowModal(true);
    };

    if (loading) return <div>Loading...</div>;
    if (redirect) return <Navigate to="/login" replace />;

    if (isLoggedIn && user) {
        // Nếu có quyền thì cho vào
        if (allowedRoles.includes(user.role)) {
            return <Outlet />;
        }
        // Nếu không có quyền thì quăng về home
        return <Navigate to="/home" replace />;
    }

    return (
        <>
            <div>Checking access rights...</div>
            <Modal
                open={showModal}
                title="Login Required"
                onOk={handleOk}
                onCancel={handleCancel}
                closable={false}
                maskClosable={false}
                okText="Login"
                cancelText="Cancel"
            >
                <p>You need to log in with Admin or Employee privileges to access this page!</p>
            </Modal>
        </>
    );
};

export default AdminRoute;
