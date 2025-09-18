import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { resetPasswordApi } from "../../api/auth.api";
import { ApiResponse } from "../../@type/apiResponse";

const ResetPassword: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const email = searchParams.get("email") || "";
    const token = searchParams.get("token") || "";
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).+$/;

    const handleResetPassword = async (values: {
        newPassword: string;
        confirmPassword: string;
    }) => {
        const newErrors: Record<string, string> = {};

        // Kiểm tra mật khẩu
        if (!values.newPassword) {
            newErrors.newPassword = "Password cannot be empty";
        } else if (values.newPassword.length < 6) {
            newErrors.newPassword = "Password must be at least 6 characters";
        } if (!passwordRegex.test(values.newPassword)) {
            newErrors.newPassword = "Password must contain at least one uppercase letter, one number, and one special character";
        }
        if (values.confirmPassword !== values.newPassword) {
            newErrors.confirmPassword = "Confirmation password does not match";
        }

        if (Object.keys(newErrors).length > 0) {
            Object.values(newErrors).forEach(msg => message.error(msg));
            return;
        }

        setLoading(true);
        try {
            const res = await resetPasswordApi({
                email,
                token,
                newPassword: values.newPassword,
                confirmPassword: values.confirmPassword,
            });

            if (res.success) {
                message.success(res.message || "Password reset successful!");
                navigate("/login");
            } else {
                message.error(res.error?.message || "Password reset failed.");
            }
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<string>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "An unknown system error occurred");
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
                        <h2>Reset Password</h2>
                    </div>
                    <Form layout="vertical" onFinish={handleResetPassword} className="reset-form">
                        <Form.Item
                            label={<span style={{ color: "white" }}>New Password</span>}
                            name="newPassword"
                            rules={[{ required: true, message: "Please enter a new password!" }]}
                        >
                            <Input.Password placeholder="Enter new password" />
                        </Form.Item>

                        <Form.Item
                            label={<span style={{ color: "white" }}>Confirm Password</span>}
                            name="confirmPassword"
                            dependencies={["newPassword"]}
                            rules={[
                                { required: true, message: "Please confirm your password!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("newPassword") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(
                                            new Error("Confirmation password does not match!")
                                        );
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Re-enter new password" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Reset Password
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
