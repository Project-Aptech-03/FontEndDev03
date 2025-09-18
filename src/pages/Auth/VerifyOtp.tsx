import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/authService";
import { Button, Form, Input, Typography, message } from "antd";
import { ApiResponse } from "../../@type/apiResponse";
import "./auth.css";

const { Text } = Typography;

interface LocationState {
    email?: string;
}

const VerifyOtp: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = (location.state as LocationState)?.email || "";

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const handleVerify = async () => {
        if (!otp) {
            message.error("Please enter the OTP");
            return;
        }

        setIsLoading(true);

        try {
            const res = await AuthService.verifyOtp({ email, otp });

            if (res.success) {
                message.success("OTP verified successfully!");
                navigate("/login");
            } else {
                message.error(res.error?.message || "Invalid OTP");
            }
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<string>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "An unknown system error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);

        try {
            const res = await AuthService.resendOtp({ email });

            if (res.success) {
                message.info("A new OTP has been sent to your email.");
            } else {
                message.error(res.error?.message || "Failed to resend OTP.");
            }
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<string>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "An unknown system error occurred");
            }
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Verify OTP</h2>
                        <Text type="secondary" style={{ fontSize: 16, color: "#fff" }}>
                            Please enter the OTP sent to your email{" "}
                            <Text style={{ fontSize: 16, color: "#3338A0" }} strong>
                                {email || "your email"}
                            </Text>
                        </Text>
                    </div>

                    <Form layout="vertical" onFinish={handleVerify}>
                        <Form.Item
                            label={<span style={{ color: "white" }}>OTP</span>}
                            name="otp"
                            rules={[{ required: true, message: "Please enter the OTP" }]}
                        >
                            <Input
                                value={otp}
                                onChange={(e) => {
                                    const numbersOnly = e.target.value.replace(/\D/g, "");
                                    if (numbersOnly.length <= 6) {
                                        setOtp(numbersOnly);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (
                                        otp.length >= 6 &&
                                        e.key !== "Backspace" &&
                                        !e.ctrlKey &&
                                        !e.metaKey &&
                                        !e.altKey
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                placeholder="______"
                                size="large"
                                style={{
                                    textAlign: "center",
                                    letterSpacing: "16px",
                                    fontSize: "20px",
                                    width: "100%",
                                }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
                                Verify
                            </Button>
                        </Form.Item>

                        <Form.Item>
                            <Button block size="large" onClick={handleResend} loading={isResending}>
                                Resend OTP
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
