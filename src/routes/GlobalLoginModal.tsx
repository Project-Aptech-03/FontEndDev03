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
        setOpen(false);
    };

    return (
        <Modal
            open={open}
            title="Login Required"
            onOk={handleOk}
            onCancel={handleCancel}
            closable={true}
            maskClosable={false}
            okText="Login"
            cancelText="Cancel"
        >
            <p>You need to log in to use this feature.</p>
        </Modal>
    );
}

export default GlobalLoginModal;
