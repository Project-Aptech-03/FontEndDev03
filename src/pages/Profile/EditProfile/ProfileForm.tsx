// ProfileForm.tsx
import { Form, Input, Button, DatePicker, Upload, Row, Col, Alert } from "antd";
import {
    UploadOutlined,
    UserOutlined,
    PhoneOutlined,
    HomeOutlined,
    CalendarOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";
import { UpdateProfileDto } from "../../../@type/UserResponseDto";
import "./ProfileForm.css";
import {useState} from "react";

interface Props {
    form: any;
    submitting: boolean;
    onFinish: (values: UpdateProfileDto) => void;
    openChangePassword: () => void;
    onBack?: () => void;
}

const ProfileForm: React.FC<Props> = ({ form, submitting, onFinish, openChangePassword, onBack }) => {
    const [hasChanges, setHasChanges] = useState(false);

    const handleValuesChange = () => {
        setHasChanges(true);
    };

    return (

        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark="optional"
            onValuesChange={handleValuesChange}
            scrollToFirstError
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
                name="avataUrl"
                valuePropName="fileList"
                getValueFromEvent={(e) => e.fileList}
                extra="Chỉ hỗ trợ định dạng JPG, PNG. Kích thước tối đa 2MB."
            >
                <Upload
                    name="avatar"
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={() => false}
                    accept="image/jpeg,image/png"
                >
                    <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                    </div>
                </Upload>
            </Form.Item>

            <Form.Item className="action-buttons">
                <Row justify="space-between" align="middle" style={{ width: "100%" }}>
                    <Col>
                        <Button
                            type="link"
                            icon={<ArrowLeftOutlined/>}
                            onClick={onBack}
                            style={{ marginBottom: 16 }}
                        >
                            Quay lại
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                            size="large"
                            className="save-button"
                        >
                            Lưu thay đổi
                        </Button>
                        <Button
                            style={{ marginLeft: 8 }}
                            onClick={openChangePassword}
                            size="large"
                        >
                            Đổi mật khẩu
                        </Button>
                    </Col>
                </Row>
            </Form.Item>

        </Form>

    );
};

export default ProfileForm;