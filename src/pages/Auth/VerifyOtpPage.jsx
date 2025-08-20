import React, {useEffect, useState} from "react";
import styles from "./VerifyOtpPage.module.css";
const VerifyOtpPage = ({ onSubmit,onResend, email }) => {
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    useEffect(() => {
        setCountdown(60);
    }, []);

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        if (onSubmit) {
            try {
                const response = await onSubmit({ email, otp });

                if (response?.success) {
                    setMessage("Xác thực OTP thành công! Bạn có thể đăng nhập.");
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 2000);
                } else {
                    setMessage("Xác thực OTP thất bại: " + (response?.message || "Mã OTP không hợp lệ"));
                }
            } catch (err) {
                setMessage("Xác thực OTP thất bại: " + (err?.message || "Lỗi không xác định"));
            } finally {
                setIsLoading(false);
            }
        }
    };


    const handleResendOtp = async () => {
        if (countdown > 0) return;

        setResendLoading(true);
        setMessage("");

        try {
            const response = await onResend({ email });
            if (response?.success) {
                setMessage("Đã gửi lại mã OTP thành công!");
                setCountdown(60);
            } else {
                setMessage("Gửi lại mã thất bại: " + (response?.message || "Lỗi không xác định"));
            }
        } catch (err) {
            setMessage("Gửi lại mã thất bại: " + (err?.message || "Lỗi không xác định"));
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Xác thực OTP</h2>
                    <p className={styles.subtitle}>Vui lòng nhập mã xác minh đã gửi đến</p>
                    <p className={styles.email}>{email}</p>
                </div>

                <form onSubmit={handleVerify} className={styles.form}>
                    <div className={styles.inputContainer}>
                        <input
                            name="otp"
                            placeholder="Nhập mã OTP"
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ""); // loại bỏ ký tự không phải số
                                if (value.length <= 6) {
                                    setOtp(value);
                                }
                            }}
                            required
                            className={styles.input}
                            maxLength="6"
                            inputMode="numeric"
                            pattern="[0-9]*"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`${styles.button} ${isLoading ? styles.buttonLoading : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className={styles.buttonText}>Đang xác thực...</span>
                        ) : (
                            <span className={styles.buttonText}>Xác thực OTP</span>
                        )}
                    </button>

                    {message && (
                        <div className={styles.message} style={{
                            color: message.includes("thành công") ? "#10B981" : "#EF4444"
                        }}>
                            {message}
                        </div>
                    )}
                </form>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Không nhận được mã?{" "}
                        {countdown > 0 ? (
                            <span className={styles.resendLinkDisabled}>
                Gửi lại sau {countdown}s
            </span>
                        ) : (
                            <a
                                onClick={handleResendOtp}
                                className={styles.resendLink}
                            >
                                {resendLoading ? "Đang gửi..." : "Gửi lại mã"}
                            </a>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
