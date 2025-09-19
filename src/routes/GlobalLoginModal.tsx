import { Modal } from "antd";
import { useEffect, useState } from "react";
import { registerShowLoginModal } from "../services/authModalService";

function GlobalLoginModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        registerShowLoginModal(() => setOpen(true));
    }, []);

    const handleOk = () => {
        setOpen(false);
        window.location.href = "/login";
    };

    const handleCancel = () => {
        setOpen(false); // chỉ đóng modal, không chuyển trang
    };

    return (
        <Modal
            open={open}
            title="Cần đăng nhập"
            onOk={handleOk}
            onCancel={handleCancel}
            closable={true}
            maskClosable={false}
            okText="Đăng nhập"
            cancelText="Hủy"
        >
            <p>Bạn cần đăng nhập để thực hiện thao tác này.</p>
        </Modal>
    );
}

export default GlobalLoginModal;
