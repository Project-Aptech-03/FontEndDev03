import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../api/auth.api";
import "./auth.css";
import {INITIAL_FORM_DATA, INITIAL_FORM_ERRORS} from "../../constants/login.constants";
import {AuthUser, LoginErrors, LoginForm,} from "../../@type/login";
import {message, Modal, Typography} from "antd";
import {useAuth} from "../../routes/AuthContext";
import {ApiResponse} from "../../@type/apiResponse";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<LoginErrors>(INITIAL_FORM_ERRORS);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { login } = useAuth();
  const { Link } = Typography;

  const showModal = (message: string) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: LoginErrors = { email: "", password: "", general: "" };
    if (!formData.email) {
      newErrors.email = "Email cannot be empty";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password cannot be empty";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await loginApi(formData);

      if (res.success) {
        const { token, role, fullName, userId, email } = res.data;

        const userObject: AuthUser = {
          id: userId ?? "",
          email: email ?? "",
          fullName: fullName ?? "",
          role: role ?? "",
          token: token.token,
        };

        login(userObject, rememberMe);
        const messageText =
            role === "Admin"
                ? `Login successful! Welcome Admin: ${fullName}!`
                : `Login successful! Welcome ${fullName}!`;
        message.success(messageText);

        setTimeout(() => {
          setIsModalVisible(false);
          navigate(role === "Admin" ? "/admin/dashboard" : "/home");
        }, 2000);
      } else {
        showModal(res.errors?.message || res.message || "Login failed!");
        setTimeout(() => setIsModalVisible(false), 2000);
      }
    } catch (err: any) {
      const apiError = err?.response?.data as ApiResponse<string>;
      if (apiError?.errors) {
        Object.values(apiError.errors).flat().forEach((msg: string) => message.error(msg));
      }
    }
  };


  return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div
                className="auth-header"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '16px',
                }}
            >
              <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                  }}
                  onClick={() => navigate('/')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
              >
                <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: 'linear-gradient(45deg, #1890ff, #722ed1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                >
                  S
                </div>
                <span style={logoTextStyle}>Shradha Book Store</span>
              </div>

              <h2>Welcome Back!</h2>
              <p>"Books not only help us understand the world better, they also help us understand ourselves more
                deeply."</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
              <label htmlFor="email">Email</label>
                <div className="input-container">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="input-icon">
                    <path
                        d="M2.5 6.66669L9.0755 11.0504C9.63533 11.4236 10.3647 11.4236 10.9245 11.0504L17.5 6.66669M4.16667 15.8334H15.8333C16.7538 15.8334 17.5 15.0872 17.5 14.1667V5.83335C17.5 4.91288 16.7538 4.16669 15.8333 4.16669H4.16667C3.24619 4.16669 2.5 4.91288 2.5 5.83335V14.1667C2.5 15.0872 3.24619 15.8334 4.16667 15.8334Z"
                        stroke="currentColor"
                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "error" : ""}
                      placeholder="Enter your email..."
                  />
                </div>
                {errors.email && (
                    <span className="error-message-login">{errors.email}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-container">
                  <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="input-icon"
                  >
                    <path
                        d="M15.8333 9.16669H4.16667C3.24619 9.16669 2.5 9.91288 2.5 10.8334V15.8334C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8334V10.8334C17.5 9.91288 16.7538 9.16669 15.8333 9.16669Z"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M5.83331 9.16669V5.83335C5.83331 4.72828 6.2723 3.66848 7.0537 2.88708C7.8351 2.10568 8.8949 1.66669 9.99998 1.66669C11.1051 1.66669 12.1649 2.10568 12.9463 2.88708C13.7277 3.66848 14.1666 4.72828 14.1666 5.83335V9.16669"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                  </svg>

                  <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={errors.password ? "error" : ""}
                      placeholder="Enter password..."
                  />
                  <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274
          4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478
           0-8.268-2.943-9.542-7a9.97 9.97 0
           012.1-3.592M6.223 6.223A9.969 9.969
           0 0112 5c4.478 0 8.268 2.943 9.542
           7a10.025 10.025 0 01-4.132 5.411M15
           12a3 3 0 11-6 0 3 3 0 016 0zM3
           3l18 18"/>
                        </svg>
                    )}
                  </button>
                </div>

                {errors.password && (
                    <span className="error-message-login">{errors.password}</span>
                )}
              </div>
              <div className="form-options">
                <label className="remember-me">
                  <div className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                    />
                    <span className="checkmark"></span>
                  </div>
                  <span>Remember me</span>
                </label>
                <Link
                    onClick={() => navigate("/forgot-password")}
                    style={{ color: '#1890ff', textDecoration: 'underline' }}
                >
                  Forgot password ?
                </Link>

              </div>
              <button
                  type="submit"
                  className= "auth-button"
              >
                Sign In
              </button>
            </form>
            <div className="auth-divider">
              <div className="line"></div>
              <div className="line"></div>
            </div>
            <div className="link">  Don't have an account? <a style={{color: '#1890ff'}} href="/register">Sign Up</a>
            </div>
          </div>
        </div>
        <Modal
            title="Thông báo"
            open={isModalVisible}
            onOk={() => setIsModalVisible(false)}
            onCancel={() => setIsModalVisible(false)}
            cancelButtonProps={{ style: { display: "none" } }}
        >
          <p>{modalMessage}</p>
        </Modal>
      </div>
  );
};
export default Login;
const logoTextStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#1890ff', // màu xanh trực tiếp
  marginLeft: '8px',
  letterSpacing: '-0.5px',
};

