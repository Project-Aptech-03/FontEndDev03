import {Form, Input, Button, DatePicker, Upload, Row, Col, Alert, message, FormInstance, Space} from "antd";
import {
    UploadOutlined,
    UserOutlined,
    PhoneOutlined,
    HomeOutlined,
    CalendarOutlined,

} from "@ant-design/icons";
import {UpdateProfileDto, UsersResponseDto} from "../../../@type/UserResponseDto";
import "./ProfileForm.css";
import { useState } from "react";
import {uploadAvatar} from "../../../api/profile.api";
import {updateUser} from "../../../api/user.api";
import {ApiResponse} from "../../../@type/apiResponse";
import dayjs from "dayjs";

interface Props {
    form: FormInstance<UpdateProfileDto>;
    submitting: boolean;
    onFinish: (values: UpdateProfileDto) => void;
    openChangePassword: () => void;
    onBack?: () => void;
    user: UsersResponseDto;

}

const ProfileForm: React.FC<Props> = ({ form, submitting, openChangePassword, user}) => {
    const [hasChanges, setHasChanges] = useState(false);
    const [avatarFile, setAvatarFile] = useState<any>(null);

    const handleValuesChange = () => {
        setHasChanges(true);
    };

    const handleFinish = async (values: UpdateProfileDto) => {
        setHasChanges(false);
        let avatarUrl = values.avatarUrl;

        try {
            if (avatarFile) {
                const res = await uploadAvatar(avatarFile.originFileObj);
                if (res?.url) {
                    avatarUrl = res.url;
                    message.success("Upload avatar thành công!");
                } else {
                    message.error("Upload avatar thất bại, server không trả về URL");
                    return;
                }
            }
            const payload: UpdateProfileDto = {
                ...values,
                avatarUrl: avatarUrl,
            };

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

            <Row gutter={16}>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Họ"
                        name="firstName"
                        rules={[
                            { required: true, message: "Vui lòng nhập họ" },
                            { min: 2, message: "Họ phải có ít nhất 2 ký tự" }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Nhập họ của bạn"
                            size="large"
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                    <Form.Item
                        label="Tên"
                        name="lastName"
                        rules={[
                            { required: true, message: "Vui lòng nhập tên" },
                            { min: 2, message: "Tên phải có ít nhất 2 ký tự" }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Nhập tên của bạn"
                            size="large"
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                    { pattern: /^[0-9]{10,11}$/, message: "Số điện thoại không hợp lệ" }
                ]}
            >
                <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Nhập số điện thoại"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                label="Địa chỉ"
                name="address"
            >
                <Input
                    prefix={<HomeOutlined />}
                    placeholder="Nhập địa chỉ đầy đủ"
                    size="large"
                />
            </Form.Item>

            <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
            >
                <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày sinh"
                    size="large"
                    suffixIcon={<CalendarOutlined />}
                />
            </Form.Item>

            <Form.Item
                label="Ảnh đại diện"
                name="avatarUrl"
                extra="Chỉ hỗ trợ định dạng JPG, PNG. Kích thước tối đa 2MB."
            >
                <Upload
                    name="avatar"
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={() => false}
                    accept="image/jpeg,image/png"
                    onChange={(info) => setAvatarFile(info.fileList[0] || null)}
                >
                    <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                    </div>
                </Upload>
            </Form.Item>


            <Form.Item className="action-buttons">

                        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={submitting}
                                size="large"
                            >
                                Lưu thay đổi
                            </Button>
                            <Button onClick={openChangePassword} size="large" style={{backgroundColor: "#FCC61D", color:"#fff"}}>
                                Đổi mật khẩu
                            </Button>
                        </div>


            </Form.Item>
        </Form>
    );
};

export default ProfileForm;
