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
                message.success(res.message || "If the email exists, instructions have been sent! Please check your inbox <3");
            } else {
                message.error(res.error?.message || "Unable to send reset password email.");
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
                        <h2>Forgot Password</h2>
                    </div>
                    <Form layout="vertical" onFinish={handleForgotPassword}>
                        <Form.Item
                            label={<span style={{color: "white"}}>Email</span>}
                            name="email"
                            style={{marginBottom: 16}}
                            rules={[
                                {required: true, message: "Please enter your email!"},
                                {type: "email", message: "Invalid email address!"},
                            ]}
                        >
                            <Input placeholder="Enter your registered email"/>
                        </Form.Item>

                        <Button
                            className="auth-button"
                            type="primary"
                            htmlType="submit"
                            block
                            loading={loading}
                            style={{marginTop: 16}}
                        >
                            Send Password Reset Request
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
