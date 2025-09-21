import {
    Form,
    Input,
    Button,
    DatePicker,
    Row,
    Col,
    Alert,
    message,
    Avatar,
    Modal,
} from "antd";
import {
    UserOutlined,
    PhoneOutlined,
    HomeOutlined,
    CalendarOutlined,
    CameraOutlined,
} from "@ant-design/icons";
import { UpdateProfileDto, UsersResponseDto } from "../../../@type/UserResponseDto";
import { useState, useRef } from "react";
import { uploadAvatar } from "../../../api/profile.api";
import { updateUser } from "../../../api/user.api";
import { ApiResponse } from "../../../@type/apiResponse";
import dayjs from "dayjs";

interface Props {
    form: any;
    submitting: boolean;
    user: UsersResponseDto | null;
    openChangePassword: () => void;
}

const ProfileForm: React.FC<Props> = ({ form, submitting, openChangePassword, user }) => {
    const [hasChanges, setHasChanges] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatarUrl || "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleValuesChange = () => {
        setHasChanges(true);
    };

    const handleAvatarClick = () => {
        Modal.confirm({
            title: "Change Profile Picture",
            content: "Do you want to upload a new photo?",
            okText: "Yes",
            cancelText: "No",
            onOk: () => fileInputRef.current?.click(),
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
            setHasChanges(true);
        }
    };

    const handleFinish = async (values: UpdateProfileDto) => {
        setHasChanges(false);
        let avatarUrl = values.avatarUrl;

        try {
            if (avatarFile) {
                const res = await uploadAvatar(avatarFile);
                if (res?.url) {
                    avatarUrl = res.url;
                    message.success("Avatar uploaded successfully!");
                } else {
                    message.error("Failed to upload avatar!");
                    return;
                }
            }
            const payload: UpdateProfileDto = { ...values, avatarUrl };

            await updateUser(user.id, payload);
            message.success("Profile updated successfully!");
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<UsersResponseDto>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "Unknown system error");
            }
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            onValuesChange={handleValuesChange}
            scrollToFirstError
            initialValues={{
                firstName: user?.firstName,
                lastName: user?.lastName,
                phoneNumber: user?.phoneNumber,
                address: user?.address,
                dateOfBirth: user?.dateOfBirth ? dayjs(user.dateOfBirth) : null,
                avatarUrl: user?.avatarUrl,
            }}
        >
            {hasChanges && (
                <Alert
                    message="You have unsaved changes"
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Avatar
                    src={avatarPreview}
                    size={120}
                    icon={<UserOutlined />}
                    style={{ cursor: "pointer", border: "2px solid #eee" }}
                    onClick={handleAvatarClick}
                />
                <div style={{ marginTop: 8, color: "#888" }}>
                    <CameraOutlined /> Click the photo to change
                </div>
                <input
                    type="file"
                    accept="image/jpeg,image/png"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                />
            </div>

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[
                            { required: true, message: "Please enter your first name" },
                            { min: 2, message: "First name must be at least 2 characters" },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Enter your first name" size="large" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[
                            { required: true, message: "Please enter your last name" },
                            { min: 2, message: "Last name must be at least 2 characters" },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Enter your last name" size="large" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Phone Number" name="phoneNumber">
                <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" size="large" />
            </Form.Item>

            <Form.Item label="Address" name="address">
                <Input prefix={<HomeOutlined />} placeholder="Enter your full address" size="large" />
            </Form.Item>

            <Form.Item label="Date of Birth" name="dateOfBirth">
                <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="Select your date of birth"
                    size="large"
                    suffixIcon={<CalendarOutlined />}
                />
            </Form.Item>

            <Form.Item className="action-buttons">
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <Button type="primary" htmlType="submit" loading={submitting} size="large">
                        Save Changes
                    </Button>
                    <Button
                        onClick={openChangePassword}
                        size="large"
                        style={{ backgroundColor: "#FCC61D", color: "#fff" }}
                    >
                        Change Password
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default ProfileForm;
