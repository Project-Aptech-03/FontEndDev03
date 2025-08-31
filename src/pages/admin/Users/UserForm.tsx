import {Modal, Form, Input, DatePicker, Select, Divider, message, Row, Col} from 'antd';
import { UserAddOutlined, EditOutlined } from '@ant-design/icons';
import { UsersResponseDto } from "../../../@type/apiResponse";
import { createUser, updateUser } from "../../../api/user.api";
import dayjs from 'dayjs';
import {useEffect, useState} from "react";

interface UserFormProps {
    visible: boolean;
    editingUser: UsersResponseDto | null;
    onCancel: () => void;
    onSuccess: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
                                               visible,
                                               editingUser,
                                               onCancel,
                                               onSuccess
                                           }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                ...values,
                dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format("YYYY-MM-DD") : null,
            };

            setLoading(true);

            if (editingUser) {
                await updateUser(editingUser.id, payload);
                message.success("Cập nhật người dùng thành công!");
            } else {
                await createUser(payload);
                message.success("Thêm người dùng thành công!");
            }

            onSuccess();
        } catch (err: any) {
            const apiError = err.response?.data;

            if (apiError?.errors && typeof apiError.errors === "object") {
                const messages = Object.values(apiError.errors).flat() as string[];
                messages.forEach(msg => message.error(msg));
            } else if (apiError?.message) {
                message.error(apiError.message);
            } else if (err.message) {
                message.error(err.message);
            } else {
                message.error("Lỗi hệ thống không xác định");
            }
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        if (visible) {
            if (editingUser) {
                form.setFieldsValue({
                    ...editingUser,
                    dateOfBirth: editingUser.dateOfBirth ? dayjs(editingUser.dateOfBirth) : null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, editingUser]);

    return (
        <Modal
            open={visible}
            title={
                <div>
                    {editingUser ? (
                        <>
                            <EditOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                            Edit User
                        </>
                    ) : (
                        <>
                            <UserAddOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                            Add New User
                        </>
                    )}
                </div>
            }
            onCancel={onCancel}
            onOk={handleSubmit}
            okText={editingUser ? "Update" : "Create"}
            cancelText="Cancel"
            confirmLoading={loading}
            width={600}
            centered
        >
            <Divider style={{ margin: "10px 0" }} />
            <Form form={form} layout="vertical" style={{ padding: "0 24px" }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="firstName"
                            label="First Name"
                            rules={[{ required: true, message: "Please enter first name!" }]}
                        >
                            <Input
                                placeholder="Enter first name..."
                                size="large"
                                prefix={<UserAddOutlined style={{ color: "#bfbfbf" }} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="lastName"
                            label="Last Name"
                            rules={[{ required: true, message: "Please enter last name!" }]}
                        >
                            <Input placeholder="Enter last name..." size="large" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: "Please enter email!" },
                        { type: "email", message: "Invalid email!" },
                    ]}
                >
                    <Input
                        placeholder="Enter email..."
                        size="large"
                        prefix={<span style={{ color: "#bfbfbf" }}>@</span>}
                    />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    label="Phone Number"
                    rules={[
                        { required: true, message: "Please enter phone number!" },
                        { pattern: /^[0-9]{10,11}$/, message: "Invalid phone number!" },
                    ]}
                >
                    <Input
                        placeholder="Enter phone number..."
                        size="large"
                        prefix={<span style={{ color: "#bfbfbf" }}>📱</span>}
                    />
                </Form.Item>

                <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                    rules={[{ required: true, message: "Please select date of birth!" }]}
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        style={{ width: "100%" }}
                        placeholder="Select date of birth..."
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: "Please enter address!" }]}
                >
                    <Input.TextArea placeholder="Enter address..." rows={3} />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="Role"
                    rules={[{ required: true, message: "Please choose a role!" }]}
                >
                    <Select
                        placeholder="Select role"
                        options={[
                            { label: "Admin", value: "admin" },
                            { label: "User", value: "user" },
                        ]}
                    />
                </Form.Item>

                {/* Chỉ hiển thị khi Add */}
                {!editingUser && (
                    <>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: "Please enter password!" }]}
                        >
                            <Input.Password placeholder="Enter password..." size="large" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Please confirm password!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("Passwords do not match!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm password..." size="large" />
                        </Form.Item>
                    </>
                )}
            </Form>


        </Modal>
    );
};

export default UserForm;