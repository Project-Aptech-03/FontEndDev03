import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/authService";
import "./auth.css";
import { RegisterErrors } from "../../@type/login";
import { INITIAL_REGISTER_ERRORS} from "../../constants/login.constants";
import { message, Modal } from "antd";
import {ApiResponse} from "../../@type/apiResponse";
interface RegisterForm {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterForm>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [, setIsLoading] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword ] = useState(false);
    const [errors, setErrors] = useState<RegisterErrors>(INITIAL_REGISTER_ERRORS);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    // Function to show error modal
    const showErrorModal = (errorMessage: string) => {
        setModalMessage(errorMessage);
        setIsModalVisible(true);
    };

    useEffect(() => {
        const newErrors = validate();
        setErrors(newErrors);
    }, [formData, touched]);

    const validate = (): RegisterErrors => {
        const newErrors: RegisterErrors = {};
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name cannot be empty";
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = "First name must be at least 2 characters";
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name cannot be empty";
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters";
        }
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number cannot be empty";
        } else if (!/^(0|\+84)(\d{9,10})$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Invalid phone number";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email cannot be empty";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }
        if (!formData.address.trim()) {
            newErrors.address = "Address cannot be empty";
        } else if (formData.address.trim().length < 5) {
            newErrors.address = "Address is too short";
        }
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth cannot be empty";
        } else {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            const minDate = new Date();
            minDate.setFullYear(today.getFullYear() - 100);

            if (birthDate > today) {
                newErrors.dateOfBirth = "Date of birth cannot be in the future";
            } else if (birthDate < minDate) {
                newErrors.dateOfBirth = "Invalid date of birth";
            } else {
                const age = today.getFullYear() - birthDate.getFullYear();
                if (age < 16) {
                    newErrors.dateOfBirth = "You must be at least 16 years old to register";
                }
            }
        }
        if (!formData.password) {
            newErrors.password = "Password cannot be empty";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Confirmation password does not match";
        }


        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched({
            ...touched,
            [name]: true,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);

        setTouched(allTouched);

        const newErrors = validate();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);

            try {
                const res = await AuthService.register(formData);

                if (res.success) {
                    message.success("OTP has been sent to your email, please verify!");
                    navigate("/verify-otp", { state: { email: formData.email } });
                } else {
                    showErrorModal(res.error?.message || "Registration failed");
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
        } else {
            message.error("Please check the information you entered");
        }
    };

    const isFieldValid = (fieldName: keyof RegisterErrors) => {
        return touched[fieldName] && errors[fieldName];
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
                            gap: '10px',
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
                        <h2>Sign Up</h2>
                        <p>Fill in the information below to create a new account</p>
                    </div>
                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                    {errors.general && (
                                <div className="error-message general-error">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path
                                            d="M8 6V9M8 11H8.01M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    {errors.general}
                                </div>
                            )}

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">First name</label>
                                    <div className="input-container">
                                        <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20"
                                             fill="none">
                                            <path
                                                d="M10 10C12.3012 10 14.1667 8.13451 14.1667 5.83333C14.1667 3.53215 12.3012 1.66667 10 1.66667C7.69881 1.66667 5.83333 3.53215 5.83333 5.83333C5.83333 8.13451 7.69881 10 10 10Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M17.5 18.3333C17.5 14.6667 14.1425 11.6667 10 11.6667C5.8575 11.6667 2.5 14.6667 2.5 18.3333"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            placeholder="First name..."
                                            className={isFieldValid("firstName") ? "error" : ""}
                                        />
                                    </div>
                                    {isFieldValid("firstName") && (
                                        <span className="error-message-login">{errors.firstName}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Last name</label>
                                    <div className="input-container">
                                        <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20"
                                             fill="none">
                                            <path
                                                d="M10 10C12.3012 10 14.1667 8.13451 14.1667 5.83333C14.1667 3.53215 12.3012 1.66667 10 1.66667C7.69881 1.66667 5.83333 3.53215 5.83333 5.83333C5.83333 8.13451 7.69881 10 10 10Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M17.5 18.3333C17.5 14.6667 14.1425 11.6667 10 11.6667C5.8575 11.6667 2.5 14.6667 2.5 18.3333"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            placeholder="Last name..."
                                            className={isFieldValid("lastName") ? "error" : ""}
                                        />
                                    </div>
                                    {isFieldValid("lastName") && (
                                        <span className="error-message-login">{errors.lastName}</span>
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="phoneNumber">Phone number</label>
                                <div className="input-container">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path
                                            d="M14.1667 1.66667H5.83333C4.91286 1.66667 4.16667 2.41286 4.16667 3.33333V16.6667C4.16667 17.5871 4.91286 18.3333 5.83333 18.3333H14.1667C15.0871 18.3333 15.8333 17.5871 15.8333 16.6667V3.33333C15.8333 2.41286 15.0871 1.66667 14.1667 1.66667Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M10 15H10.0083"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        placeholder="Phone number..."
                                        className={isFieldValid("phoneNumber") ? "error" : ""}
                                    />
                                </div>
                                {isFieldValid("phoneNumber") && (
                                    <span className="error-message-login">{errors.phoneNumber}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-container">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path
                                            d="M2.5 6.66669L9.0755 11.0504C9.63533 11.4236 10.3647 11.4236 10.9245 11.0504L17.5 6.66669M4.16667 15.8334H15.8333C16.7538 15.8334 17.5 15.0872 17.5 14.1667V5.83335C17.5 4.91288 16.7538 4.16669 15.8333 4.16669H4.16667C3.24619 4.16669 2.5 4.91288 2.5 5.83335V14.1667C2.5 15.0872 3.24619 15.8334 4.16667 15.8334Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        placeholder="Enter email..."
                                        className={isFieldValid("email") ? "error" : ""}
                                    />
                                </div>
                                {isFieldValid("email") && (
                                    <span className="error-message-login">{errors.email}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <div className="input-container">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path
                                            d="M17.5 8.33333C17.5 14.1667 10 19.1667 10 19.1667C10 19.1667 2.5 14.1667 2.5 8.33333C2.5 6.3442 3.29018 4.43655 4.6967 3.03003C6.10322 1.62351 8.01088 0.833328 10 0.833328C11.9891 0.833328 13.8968 1.62351 15.3033 3.03003C16.7098 4.43655 17.5 6.3442 17.5 8.33333Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M10 10.8333C11.3807 10.8333 12.5 9.71404 12.5 8.33333C12.5 6.95262 11.3807 5.83333 10 5.83333C8.61929 5.83333 7.5 6.95262 7.5 8.33333C7.5 9.71404 8.61929 10.8333 10 10.8333Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        placeholder="Enter your address..."
                                        className={isFieldValid("address") ? "error" : ""}
                                    />
                                </div>
                                {isFieldValid("address") && (
                                    <span className="error-message-login">{errors.address}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="dateOfBirth">Date of birth</label>
                                <div className="input-container">
                                    <svg className="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path
                                            d="M15.8333 3.33333H4.16667C3.24619 3.33333 2.5 4.07952 2.5 5V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V5C17.5 4.07952 16.7538 3.33333 15.8333 3.33333Z"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M2.5 8.33333H17.5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M13.3333 1.66667V5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M6.66667 1.66667V5"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required
                                        className={isFieldValid("dateOfBirth") ? "error" : ""}
                                    />
                                </div>
                                {isFieldValid("dateOfBirth") && (
                                    <span className="error-message-login">{errors.dateOfBirth}</span>
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
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={isFieldValid("password") ? "error" : ""}
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
                                {isFieldValid("password") && (
                                    <span className="error-message-login">{errors.password}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm password</label>
                                <div className="input-container">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="input-icon">
                                        <path
                                            d="M15.8333 9.16669H4.16667C3.24619 9.16669 2.5 9.91288 2.5 10.8334V15.8334C2.5 16.7538 3.24619 17.5 4.16667 17.5H15.8333C16.7538 17.5 17.5 16.7538 17.5 15.8334V10.8334C17.5 9.91288 16.7538 9.16669 15.8333 9.16669Z"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M5.83331 9.16669V5.83335C5.83331 4.72828 6.2723 3.66848 7.0537 2.88708C7.8351 2.10568 8.8949 1.66669 9.99998 1.66669C11.1051 1.66669 12.1649 2.10568 12.9463 2.88708C13.7277 3.66848 14.1666 4.72828 14.1666 5.83335V9.16669"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={isFieldValid("confirmPassword") ? "error" : ""}
                                        placeholder="Confirm password..."

                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                {isFieldValid("confirmPassword") && (
                                    <span className="error-message-login">{errors.confirmPassword}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="auth-button"
                            >
                                Sign Up
                            </button>
                        </form>

                        <div className="link">
                            You have a account ? <a href="/login">Sign In</a>
                        </div>
                    </div>
                </div>

                {/* Ant Design Modal for API error messages */}
                <Modal
                    title="Error"
                    open={isModalVisible}
                    onOk={() => setIsModalVisible(false)}
                    onCancel={() => setIsModalVisible(false)}
                    cancelButtonProps={{style: {display: 'none'}}}
            >
                <p>{modalMessage}</p>
            </Modal>
        </div>

    );
};
const logoTextStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1890ff',
    marginLeft: '8px',
    letterSpacing: '-0.5px',
};
export default Register;