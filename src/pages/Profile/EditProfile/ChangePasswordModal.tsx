import { Modal, Form, Input } from "antd";

interface Props {
    visible: boolean;
    onCancel: () => void;
    onOk: () => void;
    passwordForm: any;
}

const ChangePasswordModal: React.FC<Props> = ({ visible, onCancel, onOk, passwordForm }) => (
    <Modal
        title="Change Password"
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        okText="Update"
    >
        <Form form={passwordForm} layout="vertical">
            <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[{ required: true, message: "Please enter your current password" }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                    { required: true, message: "Please enter your new password" },
                    { min: 6, message: "Password must be at least 6 characters" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || value !== getFieldValue("currentPassword")) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error("New password must not be the same as the current password")
                            );
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                    { required: true, message: "Please confirm your new password" },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("newPassword") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error("Passwords do not match")
                            );
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>
        </Form>
    </Modal>
);

export default ChangePasswordModal;
