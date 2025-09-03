import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import {forgotPasswordApi} from "../../api/auth.api";
import {ApiResponse} from "../../@type/apiResponse";
import "./auth.css";

const ForgotPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const handleForgotPassword = async (values: { email: string }) => {
        setLoading(true);
        try {
            const res = await forgotPasswordApi(values.email);
            if (res.success) {
                message.success(res.message || "Nếu email tồn tại, hướng dẫn đã được gửi! Vui lòng check mail của bạn <3");
            } else {
                message.error(res.error?.message || "Không thể gửi email reset password.");
            }
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<string>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
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
                    <h2>Quên mật khẩu</h2>
                    </div>
                    <Form layout="vertical" onFinish={handleForgotPassword}>
                        <Form.Item
                            label={<span style={{ color: "white" }}>Email</span>}
                            name="email"
                            style={{ marginBottom: 16 }}
                            rules={[
                                { required: true, message: "Vui lòng nhập email!" },
                                { type: "email", message: "Email không hợp lệ!" },
                            ]}
                        >
                            <Input placeholder="Nhập email đã đăng ký"/>
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block loading={loading}
                                style={{ marginTop: 16 }}>
                            Gửi yêu cầu đặt lại mật khẩu
                        </Button>
                    </Form>

                </div>
                    </div>
                </div>
                );
                };

                export default ForgotPassword;
