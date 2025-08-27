import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import {MdEmail, MdLock, MdPhone} from "react-icons/md";
import {FaBirthdayCake, FaMapMarkerAlt, FaUser} from "react-icons/fa";

const AuthPage = ({ onLogin, onRegister, isAuthenticated }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [registerForm, setRegisterForm] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: ''
    });

    const [errors, setErrors] = useState({
        login: { email: '', password: '' },
        register: { name: '', email: '', password: '', confirmPassword: '' }
    });
    const [generalError, setGeneralError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (generalError) {
            const timer = setTimeout(() => {
                setGeneralError('');
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [generalError]);
    if (isAuthenticated) {
        navigate('/products');
        return null;
    }

    const validateLoginForm = () => {
        const newErrors = { email: '', password: '' };
        let isValid = true;

        if (!loginForm.email) {
            newErrors.email = 'Email không được để trống';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
            newErrors.email = 'Email không hợp lệ';
            isValid = false;
        }
        if (!loginForm.password) {
            newErrors.password = 'Mật khẩu không được để trống';
            isValid = false;
        } else if (loginForm.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            isValid = false;
        }

        setErrors(prev => ({ ...prev, login: newErrors }));
        return isValid;
    };

    const validateRegisterForm = () => {
        const newErrors = {
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            email: '',
            password: '',
            confirmPassword: '',
            dateOfBirth: ''
        };
        let isValid = true;

        if (!registerForm.firstName.trim()) {
            newErrors.firstName = 'Họ không được để trống';
            isValid = false;
        }

        if (!registerForm.lastName.trim()) {
            newErrors.lastName = 'Tên không được để trống';
            isValid = false;
        }

        if (!registerForm.email) {
            newErrors.email = 'Email không được để trống';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
            newErrors.email = 'Email không hợp lệ';
            isValid = false;
        }

        if (!registerForm.password) {
            newErrors.password = 'Mật khẩu không được để trống';
            isValid = false;
        } else if (registerForm.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            isValid = false;
        }

        if (!registerForm.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
            isValid = false;
        } else if (registerForm.password !== registerForm.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
            isValid = false;
        }

        setErrors(prev => ({ ...prev, register: newErrors }));
        return isValid;
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors.login[name]) {
            setErrors(prev => ({
                ...prev,
                login: { ...prev.login, [name]: '' }
            }));
        }
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors.register[name]) {
            setErrors(prev => ({
                ...prev,
                register: { ...prev.register, [name]: '' }
            }));
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');

        if (!validateLoginForm()) return;

        const response = await onLogin(loginForm);

        if (response.success) {
            navigate('/products');
        } else {
            if (response.error && response.error.errors) {
                const apiErrors = response.error.errors;
                setErrors(prev => ({
                    ...prev,
                    login: {
                        ...prev.login,
                        email: apiErrors.Email?.[0] || '',
                        password: apiErrors.Password?.[0] || ''
                    }
                }));
            } else {
                setGeneralError(response.error?.message || 'Đăng nhập thất bại. Vui lòng thử lại!');
            }
        }
    };
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setGeneralError('');

        if (!validateRegisterForm()) return;

        const response = await onRegister({
            firstName: registerForm.firstName,
            lastName: registerForm.lastName,
            phoneNumber: registerForm.phoneNumber,
            address: registerForm.address,
            email: registerForm.email,
            password: registerForm.password,
            dateOfBirth: registerForm.dateOfBirth
        });

        if (response.success) {
            localStorage.setItem("pendingEmail", registerForm.email);
            navigate('/verify-otp');
        } else {
            // Xử lý lỗi từ API
            if (response.error && response.error.errors) {
                const apiErrors = response.error.errors;
                setErrors(prev => ({
                    ...prev,
                    register: {
                        ...prev.register,
                        firstName: apiErrors.FirstName?.[0] || '',
                        lastName: apiErrors.LastName?.[0] || '',
                        phoneNumber: apiErrors.PhoneNumber?.[0] || '',
                        address: apiErrors.Address?.[0] || '',
                        email: apiErrors.Email?.[0] || '',
                        password: apiErrors.Password?.[0] || '',
                        confirmPassword: '',
                        dateOfBirth: apiErrors.DateOfBirth?.[0] || ''
                    }
                }));
            } else {
                setGeneralError(response.error?.message || 'Đăng ký thất bại. Vui lòng thử lại!');
            }
        }
    };


    return (
        <div className={styles.pageWrapper}>
            {/* General error message - slides down from top */}
            {generalError && (
                <div className={`${styles.generalError} ${generalError ? styles.show : ''}`}>
                    <div className={styles.errorContent}>
                        {generalError}
                        <button
                            className={styles.closeError}
                            onClick={() => setGeneralError('')}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            <div className={styles.pageCard}>
                <div className={styles.toggleContainer}>
                    <button
                        className={`${styles.toggleButton} ${isLogin ? styles.active : ''}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Đăng nhập
                    </button>
                    <button
                        className={`${styles.toggleButton} ${!isLogin ? styles.active : ''}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Đăng ký
                    </button>
                </div>

                <div className={styles.formContainer}>
                    <form onSubmit={handleLoginSubmit} className={`${styles.form} ${isLogin ? styles.active : ''}`}>
                        <h2 className={styles.formTitle}>Đăng nhập</h2>

                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className={`${styles.inputField} ${errors.login.email ? styles.error : ''}`}
                                value={loginForm.email}
                                onChange={handleLoginChange}
                                required
                            />
                            <MdEmail className={styles.inputIcon} />
                            {errors.login.email && (
                                <div className={styles.fieldError}>{errors.login.email}</div>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                name="password"
                                placeholder="Mật khẩu"
                                className={`${styles.inputField} ${errors.login.password ? styles.error : ''}`}
                                value={loginForm.password}
                                onChange={handleLoginChange}
                                required
                            />
                            <MdLock className={styles.inputIcon} />
                            {errors.login.password && (
                                <div className={styles.fieldError}>{errors.login.password}</div>
                            )}
                        </div>

                        <div className={styles.options}>
                            <label className={styles.rememberMe}>
                                <input type="checkbox" />
                                <span>Ghi nhớ đăng nhập</span>
                            </label>
                            <a href="#" className={styles.forgotPassword}>Quên mật khẩu?</a>
                        </div>

                        <button type="submit" className={styles.submitButton}>Đăng nhập</button>

                        <div className={styles.socialLogin}>
                            <p>Hoặc đăng nhập bằng</p>
                            <div className={styles.socialIcons}>
                                <button type="button" className={`${styles.socialButton} ${styles.facebook}`}>f</button>
                                <button type="button" className={`${styles.socialButton} ${styles.google}`}>G</button>
                                <button type="button" className={`${styles.socialButton} ${styles.twitter}`}>t</button>
                            </div>
                        </div>
                    </form>

                    <form onSubmit={handleRegisterSubmit} className={`${styles.form} ${!isLogin ? styles.active : ''}`}>
                        <h2 className={styles.formTitle}>Đăng ký</h2>

                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Họ"
                                className={`${styles.inputField} ${errors.register.firstName ? styles.error : ''}`}
                                value={registerForm.firstName}
                                onChange={handleRegisterChange}
                                required
                            />
                            <FaUser className={styles.inputIcon}/>
                            {errors.register.firstName && (
                                <div className={styles.fieldError}>{errors.register.firstName}</div>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Tên"
                                className={`${styles.inputField} ${errors.register.lastName ? styles.error : ''}`}
                                value={registerForm.lastName}
                                onChange={handleRegisterChange}
                                required
                            />
                            <FaUser className={styles.inputIcon}/>
                            {errors.register.lastName && (
                                <div className={styles.fieldError}>{errors.register.lastName}</div>
                            )}
                        </div>


                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className={`${styles.inputField} ${errors.register.email ? styles.error : ''}`}
                                value={registerForm.email}
                                onChange={handleRegisterChange}
                                required
                            />
                            <MdEmail className={styles.inputIcon}/>
                            {errors.register.email && (
                                <div className={styles.fieldError}>{errors.register.email}</div>
                            )}
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="Số điện thoại"
                                className={`${styles.inputField} ${errors.register.phoneNumber ? styles.error : ''}`}
                                value={registerForm.phoneNumber}
                                onChange={handleRegisterChange}
                                required
                            />
                            <MdPhone className={styles.inputIcon}/>
                            {errors.register.phoneNumber && (
                                <div className={styles.fieldError}>{errors.register.phoneNumber}</div>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="address"
                                placeholder="Địa chỉ"
                                className={`${styles.inputField} ${errors.register.address ? styles.error : ''}`}
                                value={registerForm.address}
                                onChange={handleRegisterChange}
                                required
                            />
                            <FaMapMarkerAlt className={styles.inputIcon}/>
                            {errors.register.address && (
                                <div className={styles.fieldError}>{errors.register.address}</div>
                            )}
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="date"
                                name="dateOfBirth"
                                placeholder="Ngày sinh"
                                className={`${styles.inputField} ${errors.register.dateOfBirth ? styles.error : ''}`}
                                value={registerForm.dateOfBirth}
                                onChange={handleRegisterChange}
                                required
                            />
                            <FaBirthdayCake className={styles.inputIcon}/>
                            {errors.register.dateOfBirth && (
                                <div className={styles.fieldError}>{errors.register.dateOfBirth}</div>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                name="password"
                                placeholder="Mật khẩu"
                                className={`${styles.inputField} ${errors.register.password ? styles.error : ''}`}
                                value={registerForm.password}
                                onChange={handleRegisterChange}
                                required
                            />
                            <MdLock className={styles.inputIcon}/>
                            {errors.register.password && (
                                <div className={styles.fieldError}>{errors.register.password}</div>
                            )}
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Xác nhận mật khẩu"
                                className={`${styles.inputField} ${errors.register.confirmPassword ? styles.error : ''}`}
                                value={registerForm.confirmPassword}
                                onChange={handleRegisterChange}
                                required
                            />
                            <MdLock className={styles.inputIcon}/>
                            {errors.register.confirmPassword && (
                                <div className={styles.fieldError}>{errors.register.confirmPassword}</div>
                            )}
                        </div>


                        <div className={styles.terms}>
                            <label>
                                <input type="checkbox" required/>
                                <span>Tôi đồng ý với <a href="#">Điều khoản & Chính sách</a></span>
                            </label>
                        </div>

                        <button type="submit" className={styles.submitButton}>Đăng ký</button>

                        <div className={styles.loginLink}>
                            Đã có tài khoản? <a href="#" onClick={(e) => {
                            e.preventDefault();
                            setIsLogin(true);
                        }}>Đăng nhập ngay</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;