import { Modal, Form, Input } from "antd";

interface Props {
    visible: boolean;
    onCancel: () => void;
    onOk: () => void;
    passwordForm: any;
}

const ChangePasswordModal: React.FC<Props> = ({ visible, onCancel, onOk, passwordForm }) => (
    <Modal title="Đổi mật khẩu" open={visible} onOk={onOk} onCancel={onCancel} okText="Cập nhật">
        <Form form={passwordForm} layout="vertical">
            <Form.Item label="Mật khẩu hiện tại" name="currentPassword" rules={[{ required: true }]}><Input.Password /></Form.Item>
            <Form.Item label="Mật khẩu mới" name="newPassword" rules={[{ required: true, min: 6 }]}><Input.Password /></Form.Item>
            <Form.Item label="Xác nhận mật khẩu mới" name="confirmPassword" rules={[{ required: true }]}><Input.Password /></Form.Item>
        </Form>
    </Modal>
);

export default ChangePasswordModal;
