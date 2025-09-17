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
import "./ProfileForm.css";
import { useState, useRef } from "react";
import { uploadAvatar } from "../../../api/profile.api";
import { updateUser } from "../../../api/user.api";
import { ApiResponse } from "../../../@type/apiResponse";
import dayjs from "dayjs";

interface Props {
    form: any;
    submitting: boolean;
    user: UsersResponseDto;
    openChangePassword: () => void;
}

const ProfileForm: React.FC<Props> = ({ form, submitting, openChangePassword, user }) => {
    const [hasChanges, setHasChanges] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string>(user.avatarUrl || "");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleValuesChange = () => {
        setHasChanges(true);
    };

    const handleAvatarClick = () => {
        Modal.confirm({
            title: "Thay đổi ảnh đại diện",
            content: "Bạn có muốn tải ảnh mới lên không?",
            okText: "Có",
            cancelText: "Không",
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
                    message.success("Upload avatar thành công!");
                } else {
                    message.error("Upload avatar thất bại!");
                    return;
                }
            }
            const payload: UpdateProfileDto = { ...values, avatarUrl };

            await updateUser(user.id, payload);
            message.success("Cập nhật thông tin thành công!");
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<UsersResponseDto>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "Lỗi hệ thống không xác định");
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
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
                address: user.address,
                dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
                avatarUrl: user.avatarUrl,
            }}
        >
            {hasChanges && (
                <Alert
                    message="Bạn có thay đổi chưa được lưu"
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
                    <CameraOutlined /> Nhấn vào ảnh để thay đổi
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
                        label="Họ"
                        name="firstName"
                        rules={[
                            { required: true, message: "Vui lòng nhập họ" },
                            { min: 2, message: "Họ phải có ít nhất 2 ký tự" },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Nhập họ của bạn" size="large" />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Tên"
                        name="lastName"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên" },
                            { min: 2, message: "Tên phải có ít nhất 2 ký tự" },
                        ]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Nhập tên của bạn" size="large" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item label="Số điện thoại" name="phoneNumber">
                <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" size="large" />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
                <Input prefix={<HomeOutlined />} placeholder="Nhập địa chỉ đầy đủ" size="large" />
            </Form.Item>

            <Form.Item label="Ngày sinh" name="dateOfBirth">
                <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày sinh"
                    size="large"
                    suffixIcon={<CalendarOutlined />}
                />
            </Form.Item>

            <Form.Item className="action-buttons">
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <Button type="primary" htmlType="submit" loading={submitting} size="large">
                        Lưu thay đổi
                    </Button>
                    <Button
                        onClick={openChangePassword}
                        size="large"
                        style={{ backgroundColor: "#FCC61D", color: "#fff" }}
                    >
                        Đổi mật khẩu
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
};

export default ProfileForm;
