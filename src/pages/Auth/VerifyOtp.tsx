import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthService } from "../../services/authService";

import "./auth.css";
import {message} from "antd";

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

    // @ts-ignore
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

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
        } catch (error) {
            message.error("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

// @ts-ignore
    const handleResend = async () => {
        setIsResending(true);

        try {
            const res = await AuthService.resendOtp({ email });

            if (res.success) {
                message.info("OTP mới đã được gửi đến email của bạn.");
            } else {
                message.error(res.error?.message || "Không gửi lại OTP được.");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra. Vui lòng thử lại.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="verify-otp-page">
            <div className="background-container">
                <div className="background-image"></div>
                <div className="background-overlay"></div>
                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>

            <div className="verify-otp-container">
                <div className="verify-otp-card">
                    <div className="verify-otp-header">
                        <div className="logo">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                <circle cx="20" cy="20" r="20" fill="#4361EE" />
                                <path d="M26 16L18 24L14 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>LuxuryStay</span>
                        </div>
                        <h1>Xác Minh OTP</h1>
                        <p>Vui lòng nhập mã OTP đã được gửi đến email <b>{email || "của bạn"}</b></p>
                    </div>

                    <form className="verify-otp-form" onSubmit={handleVerify}>
                        <div className="form-group">
                            <label htmlFor="otp">Mã OTP</label>
                            <div className="input-container">
                                <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M15.8333 9.16669H4.16667C3.24619 9.16669 2.5 9.91288 2.5 10.8334V15.8334C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8334V10.8334C17.5 9.91288 16.7538 9.16669 15.8333 9.16669Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5.83331 9.16669V5.83335C5.83331 4.72828 6.2723 3.66848 7.0537 2.88708C7.8351 2.10568 8.8949 1.66669 9.99998 1.66669C11.1051 1.66669 12.1649 2.10568 12.9463 2.88708C13.7277 3.66848 14.1666 4.72828 14.1666 5.83335V9.16669" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    placeholder="Nhập mã OTP 6 chữ số"
                                    maxLength={6}
                                />
                            </div>
                        </div>

                        <div className="button-group">
                            <button
                                type="submit"
                                className={`verify-button ${isLoading ? "loading" : ""}`}
                                disabled={isLoading || isResending}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="spinner"></div>
                                        Đang xác minh...
                                    </>
                                ) : (
                                    "Xác Minh"
                                )}
                            </button>

                            <button
                                type="button"
                                className={`resend-button ${isResending ? "loading" : ""}`}
                                onClick={handleResend}
                                disabled={isLoading || isResending}
                            >
                                {isResending ? (
                                    <>
                                        <div className="spinner"></div>
                                        Đang gửi lại...
                                    </>
                                ) : (
                                    "Gửi lại OTP"
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="support-text">
                        <p>Không nhận được mã? Kiểm tra thư mục spam hoặc <button type="button" onClick={handleResend}>gửi lại mã</button></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;