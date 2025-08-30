import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../../api/auth.api";
import "./auth.css";
import {INITIAL_FORM_DATA, INITIAL_FORM_ERRORS} from "../../constants/login.constants";
import {LoginErrors, LoginForm} from "../../@type/login";
import { Modal } from "antd";
import {useAuth} from "../../api/AuthContext"; // Import Ant Design Modal

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<LoginErrors>(INITIAL_FORM_ERRORS);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState("");
  const { login } = useAuth();


  const showModal = (message: string) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: LoginErrors = { email: "", password: "", general: "" };

    if (!formData.email) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
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
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        const token = res.result.data.token.token;
        login(token);

        showModal("Đăng nhập thành công! Đang chuyển trang...");
        setTimeout(() => {
          setIsModalVisible(false);
          navigate("/home");
        }, 2000);
      } else {
        showModal(res.error?.message || "Đăng nhập thất bại!");
      }
    } catch (error: any) {
      console.error("Lỗi khi login:", error);
      showModal("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };


  return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="logo">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#4361EE"/>
                  <path d="M26 16L18 24L14 20" stroke="white" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round"/>
                </svg>
                <span>Shradha BookStore</span>
              </div>

              <h2>Chào mừng bạn trở lại !</h2>
              <p>"Sách không chỉ giúp ta hiểu thêm về thế giới, sách giúp ta hiểu rõ hơn về chính mình."</p>
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
                      placeholder="Nhập địa chỉ email"
                  />
                </div>
                {errors.email && (
                    <span className="error-message">{errors.email}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
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
                      placeholder="Nhập mật khẩu"
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
                    <span className="error-message">{errors.password}</span>
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
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="#forgot" className="forgot-password">
                  Quên mật khẩu?
                </a>
              </div>
              <button
                  type="submit"
                  className= "auth-button"
              >
                Đăng nhập

              </button>
            </form>
            <div className="auth-divider">
              <div className="line"></div>
              <span>Hoặc tiếp tục với</span>
              <div className="line"></div>
            </div>
            <div className="social-auth">
              <button className="social-button google">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                      d="M16.5 9.20455C16.5 8.56636 16.4455 7.95273 16.3409 7.36364H9V10.845H13.2955C13.1155 11.97 12.4773 12.9232 11.5091 13.5614V15.6191H13.9818C15.7 14.0491 16.5 11.8273 16.5 9.20455Z"
                      fill="#4285F4"
                  />
                  <path
                      d="M9 17C11.2955 17 13.2682 16.1955 14.7364 14.8409L12.3955 12.8591C11.6318 13.4318 10.6455 13.8341 9.56818 13.8341C7.35909 13.8341 5.49091 12.3591 4.84091 10.3591H2.26364V12.4955C3.72273 15.4091 6.59091 17 9 17Z"
                      fill="#34A853"
                  />
                  <path
                      d="M4.84091 10.3591C4.65909 9.82955 4.55682 9.26273 4.55682 8.68182C4.55682 8.10091 4.65909 7.53409 4.83182 7.00455V4.86818H2.26818C1.63182 6.16364 1.27273 7.62273 1.27273 9.18636C1.27273 10.75 1.63182 12.2091 2.26818 13.5045L4.83182 11.3682L4.84091 10.3591Z"
                      fill="#FBBC05"
                  />
                  <path
                      d="M9 3.57955C10.3864 3.57955 11.6227 4.04545 12.6045 4.95455L14.7818 2.77727C13.2636 1.37727 11.2909 0.5 9 0.5C6.59091 0.5 3.72273 2.09091 2.26364 5.00455L4.82727 7.14091C5.47727 5.14091 7.34545 3.57955 9 3.57955Z"
                      fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button className="social-button facebook">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                      d="M16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 12.6777 4.16437 15.7022 7.6875 16.3205V11.1328H5.66016V9H7.6875V7.35938C7.6875 5.43164 8.90039 4.33594 10.6313 4.33594C11.4475 4.33594 12.3047 4.5 12.3047 4.5V6.28125H11.3426C10.3957 6.28125 10.125 6.87773 10.125 7.49297V9H12.2109L11.8418 11.1328H10.125V16.3205C13.6481 15.7022 16.5 12.6777 16.5 9Z"
                      fill="#1877F2"
                  />
                  <path
                      d="M11.8418 11.1328L12.2109 9H10.125V7.49297C10.125 6.87773 10.3957 6.28125 11.3426 6.28125H12.3047V4.5C12.3047 4.5 11.4475 4.33594 10.6313 4.33594C8.90039 4.33594 7.6875 5.43164 7.6875 7.35938V9H5.66016V11.1328H7.6875V16.3205C8.19258 16.4135 8.71289 16.5 9.23438 16.5C9.75586 16.5 10.2762 16.4135 10.7812 16.3205V11.1328H11.8418Z"
                      fill="white"
                  />
                </svg>
                Facebook
              </button>
            </div>
            <div className="link">
              Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
            </div>
          </div>
        </div>

        {/* Ant Design Modal for error messages */}
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