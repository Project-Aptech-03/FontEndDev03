import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Input, Button, message, Card } from "antd";
import { resetPasswordApi } from "../../api/auth.api";
import { ApiResponse } from "../../@type/apiResponse";

const ResetPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";



    const handleResetPassword = async (values: {
        newPassword: string;
        confirmPassword: string;
    }) => {
        setLoading(true);
        try {
            const res = await resetPasswordApi({
                email,
                token,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
            });

            if (res.success) {
                message.success(res.message || "Đặt lại mật khẩu thành công!");
                navigate("/login");
            } else {
                message.error(res.error?.message || "Đặt lại mật khẩu thất bại.");
            }
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<string>;
            if (apiError?.errors) {
                Object.values(apiError.errors)
                    .flat()
                    .forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "Lỗi hệ thống không xác định");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-header">
                        <h2>Đặt lại mật khẩu</h2>
                    </div>
                    <Form
                        layout="vertical"
                        onFinish={handleResetPassword}
                        className="reset-form"
                    >
                        <Form.Item
                            label={<span style={{ color: "white" }}>Mật khẩu mới</span>}
                            name="newPassword"
                            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu mới" />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ color: "white" }}>Xác nhận mật khẩu</span>}
                            name="confirmPassword"
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("Mật khẩu xác nhận không khớp!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu mới" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Đặt lại mật khẩu
                        </Button>
                    </Form>

                </div>
            </div>
        </div>
        </div>
    );
};

export default ResetPassword;
