import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/authService";
import { Button, Card, Form, Input, Typography, message } from "antd";
import {ApiResponse} from "../../@type/apiResponse";

const { Title, Text } = Typography;

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
            message.error("Vui lòng nhập mã OTP");
            return;
        }

        setIsLoading(true);

        try {
            const res = await AuthService.verifyOtp({ email, otp });

            if (res.success) {
                message.success("Xác minh OTP thành công!");
                navigate("/login");
            } else {
                message.error(res.error?.message || "OTP không hợp lệ");
            }
        } catch (err: any) {
        const apiError = err?.response?.data as ApiResponse<string>;
        if (apiError?.errors) {
            Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
        } else {
            message.error(apiError?.message || "Lỗi hệ thống không xác định");
        }
    }  finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);

        try {
            const res = await AuthService.resendOtp({ email });

            if (res.success) {
                message.info("OTP mới đã được gửi đến email của bạn.");
            } else {
                message.error(res.error?.message || "Không gửi lại OTP được.");
            }
        } catch (err: any) {
            const apiError = err?.response?.data as ApiResponse<string>;
            if (apiError?.errors) {
                Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
            } else {
                message.error(apiError?.message || "Lỗi hệ thống không xác định");
            }
        }  finally {
            setIsResending(false);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f0f5ff, #e6f7ff)",
                padding: "16px",
            }}
        >
            <Card
                style={{
                    width: "100%",
                    maxWidth: 420,
                    borderRadius: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={3} style={{ marginBottom: 8 }}>
                        Xác Minh OTP
                    </Title>
                    <Text type="secondary">
                        Vui lòng nhập mã OTP đã được gửi tới email{" "}
                        <Text strong>{email || "của bạn"}</Text>
                    </Text>
                </div>

                <Form layout="vertical" onFinish={handleVerify}>
                    <Form.Item
                        label="Mã OTP"
                        name="otp"
                        rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
                    >
                        <Input
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                            }
                            maxLength={6}
                            placeholder="Nhập mã OTP 6 chữ số"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={isLoading}
                        >
                            Xác Minh
                        </Button>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            block
                            size="large"
                            onClick={handleResend}
                            loading={isResending}
                        >
                            Gửi lại OTP
                        </Button>
                    </Form.Item>
                </Form>

                <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Text type="secondary">
                        Không nhận được mã?{" "}
                        <Button
                            type="link"
                            onClick={handleResend}
                            disabled={isLoading || isResending}
                            style={{ padding: 0 }}
                        >
                            Gửi lại
                        </Button>
                    </Text>
                </div>
            </Card>
        </div>
    );
};

export default VerifyOtp;
