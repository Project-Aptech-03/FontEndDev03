import {
    Modal,
    Form,
    Input,
    DatePicker,
    Select,
    message,
    Row,
    Col,
    Card,
    Space,
    Typography,
    Avatar
} from 'antd';
import {
    UserAddOutlined,
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    UserOutlined,
    CrownOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { createUser, updateUser } from "../../../api/user.api";
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import { UsersResponseDto } from "../../../@type/UserResponseDto";

const { Title, Text } = Typography;

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
                const res = await updateUser(editingUser.id, payload);
                if (res.success) {
                    message.success("User updated successfully!");
                } else {
                    message.error(res.message || "Update failed");
                }
            } else {
                const res = await createUser(payload);
                if (res.success) {
                    message.success("Account created successfully! Please check email for verification.");
                } else {
                    message.error(res.message || "Create failed");
                }
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
                message.error("System error occurred");
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
                form.setFieldsValue({ role: 'user' }); // Default role
            }
        }
    }, [visible, editingUser]);

    const getRoleIcon = (role: string) => {
        return role === 'admin' ? <CrownOutlined /> : <TeamOutlined />;
    };

    const getRoleColor = (role: string) => {
        return role === 'admin' ? '#ff4d4f' : '#1890ff';
    };

    return (
        <Modal
            open={visible}
            title={null}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText={editingUser ? "Update User" : "Create User"}
            cancelText="Cancel"
            confirmLoading={loading}
            width={700}
            centered
            destroyOnClose
            styles={{
                body: { padding: 0 },
                header: { display: 'none' }
            }}
            okButtonProps={{
                size: 'large',
                style: {
                    borderRadius: 8,
                    fontWeight: 600,
                    height: 42,
                    minWidth: 120
                }
            }}
            cancelButtonProps={{
                size: 'large',
                style: {
                    borderRadius: 8,
                    height: 42,
                    minWidth: 100
                }
            }}
        >
            {/* Header Section */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px 32px',
                color: 'white',
                borderRadius: '8px 8px 0 0'
            }}>
                <Space align="center" size={16}>
                    <Avatar
                        size={48}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            border: '2px solid rgba(255, 255, 255, 0.3)'
                        }}
                        icon={editingUser ? <EditOutlined /> : <UserAddOutlined />}
                    />
                    <div>
                        <Title level={3} style={{ margin: 0, color: 'white' }}>
                            {editingUser ? 'Update User Information' : 'Create New User'}
                        </Title>
                        <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                            {editingUser
                                ? 'Modify user details and permissions'
                                : 'Fill in the form below to add a new user'
                            }
                        </Text>
                    </div>
                </Space>
            </div>

            {/* Form Section */}
            <div style={{ padding: '32px' }}>
                <Form
                    form={form}
                    layout="vertical"
                    requiredMark={false}
                    size="large"
                >
                    {/* Personal Information */}
                    <Card
                        size="small"
                        title={
                            <Space>
                                <UserOutlined style={{ color: '#1890ff' }} />
                                <span style={{ fontWeight: 600 }}>Personal Information</span>
                            </Space>
                        }
                        style={{
                            marginBottom: 20,
                            borderRadius: 8,
                            border: '1px solid #f0f0f0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                        headStyle={{
                            background: '#fafafa',
                            borderRadius: '8px 8px 0 0'
                        }}
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="firstName"
                                    label={<Text strong>First Name</Text>}
                                    rules={[
                                        { required: true, message: "Please enter first name!" },
                                        { min: 2, message: "First name must be at least 2 characters" }
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter first name..."
                                        prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                        style={{ borderRadius: 6 }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="lastName"
                                    label={<Text strong>Last Name</Text>}
                                    rules={[
                                        { required: true, message: "Please enter last name!" },
                                        { min: 2, message: "Last name must be at least 2 characters" }
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter last name..."
                                        style={{ borderRadius: 6 }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="dateOfBirth"
                                    label={<Text strong>Date of Birth</Text>}
                                    rules={[{ required: true, message: "Please select date of birth!" }]}
                                >
                                    <DatePicker
                                        format="DD/MM/YYYY"
                                        style={{ width: "100%", borderRadius: 6 }}
                                        placeholder="Select date of birth..."
                                        suffixIcon={<CalendarOutlined style={{ color: '#bfbfbf' }} />}
                                        disabledDate={(current) => {
                                            return current && current > dayjs().subtract(13, 'year');
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="phoneNumber"
                                    label={<Text strong>Phone Number</Text>}
                                    rules={[
                                        { required: true, message: "Please enter phone number!" },
                                        { pattern: /^[0-9]{10,11}$/, message: "Phone must be 10-11 digits!" },
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter phone number..."
                                        prefix={<PhoneOutlined style={{ color: '#bfbfbf' }} />}
                                        style={{ borderRadius: 6 }}
                                        maxLength={11}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="address"
                            label={<Text strong>Address</Text>}
                            rules={[
                                { required: true, message: "Please enter address!" },
                                { min: 10, message: "Address must be at least 10 characters" }
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Enter full address..."
                                rows={3}
                                style={{ borderRadius: 6 }}
                            />
                        </Form.Item>
                    </Card>

                    {/* Account Information */}
                    <Card
                        size="small"
                        title={
                            <Space>
                                <MailOutlined style={{ color: '#52c41a' }} />
                                <span style={{ fontWeight: 600 }}>Account Information</span>
                            </Space>
                        }
                        style={{
                            marginBottom: !editingUser ? 20 : 0,
                            borderRadius: 8,
                            border: '1px solid #f0f0f0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                        headStyle={{
                            background: '#f6ffed',
                            borderRadius: '8px 8px 0 0'
                        }}
                    >
                        <Row gutter={16}>
                            {!editingUser && (
                                <Col span={24}>
                                    <Form.Item
                                        name="email"
                                        label={<Text strong>Email Address</Text>}
                                        rules={[
                                            { required: true, message: "Please enter email!" },
                                            { type: 'email', message: "Please enter a valid email!" }
                                        ]}
                                    >
                                        <Input
                                            placeholder="Enter email address..."
                                            prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                                            style={{ borderRadius: 6 }}
                                        />
                                    </Form.Item>
                                </Col>
                            )}

                            <Col span={24}>
                                <Form.Item
                                    name="role"
                                    label={<Text strong>User Role</Text>}
                                    rules={[{ required: true, message: "Please choose a role!" }]}
                                >
                                    <Select
                                        placeholder="Select user role"
                                        style={{ borderRadius: 6 }}
                                        optionRender={(option) => (
                                            <Space>
                                                {getRoleIcon(option.value)}
                                                <span style={{
                                                    color: getRoleColor(option.value),
                                                    fontWeight: 500
                                                }}>
                                                    {option.label}
                                                </span>
                                            </Space>
                                        )}
                                        options={[
                                            {
                                                label: "Administrator",
                                                value: "admin",
                                                style: { color: '#ff4d4f' }
                                            },
                                            {
                                                label: "Regular User",
                                                value: "user",
                                                style: { color: '#1890ff' }
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Form>
            </div>

            <style jsx>{`
                .ant-modal-content {
                    border-radius: 8px !important;
                    overflow: hidden;
                }
                .ant-form-item-label > label {
                    font-weight: 500;
                    color: #262626;
                }
                .ant-input:focus,
                .ant-input-focused {
                    border-color: #40a9ff;
                    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
                }
                .ant-select:not(.ant-select-disabled):hover .ant-select-selector {
                    border-color: #40a9ff;
                }
                .ant-picker:hover {
                    border-color: #40a9ff;
                }
            `}</style>
        </Modal>
    );
};

export default UserForm;