import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser as FaUserIcon } from 'react-icons/fa';
import './RegisterPage.css';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Store user data (in real app, this would be sent to backend)
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        registeredAt: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      
      alert('Registration successful! Welcome to MOON.');
      navigate('/');
    } catch (error) {
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider: string) => {
    alert(`${provider} registration coming soon!`);
  };

  return (
    <div className="container">
      {/* Header/Navbar */}
      <header className="header">
        <div className="navbar">
          {/* Logo */}
          <div className="logo">
            <div className="logoIcon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" transform="rotate(45 12 12)" />
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" transform="rotate(90 12 12)" />
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" transform="rotate(135 12 12)" />
              </svg>
            </div>
            <span className="logoText">MOON.</span>
          </div>

          {/* Navigation Links */}
          <nav className="nav">
            <Link to="/" className="navLink">Home</Link>
            <Link to="/shop" className="navLink">Shop</Link>
            <Link to="/about" className="navLink">About</Link>
            <Link to="/contact" className="navLink">Contact</Link>
          </nav>

          {/* Utility Icons */}
          <div className="utilities">
            <button className="iconButton">
              <FaSearch />
            </button>
            <Link to="/login" className="iconButton">
              <FaUser />
            </Link>
            <Link to="/wishlist" className="iconButton">
              <FaHeart />
            </Link>
            <Link to="/cart" className="iconButton" style={{ position: 'relative' }}>
              <FaShoppingCart />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="registerContainer">
          {/* Left Side - Branding */}
          <div className="brandingSection">
            <div className="brandingContent">
              <div className="logoLarge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" transform="rotate(45 12 12)" />
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" transform="rotate(90 12 12)" />
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" transform="rotate(135 12 12)" />
                </svg>
              </div>
              <h1 className="brandingTitle">Welcome to MOON</h1>
              <p className="brandingSubtitle">Join our community of book lovers</p>
              
              <div className="featuresList">
                <div className="feature">
                  <div className="featureIcon">📚</div>
                  <div className="featureText">
                    <h3>Discover Amazing Books</h3>
                    <p>Access to thousands of carefully curated books</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="featureIcon">🎯</div>
                  <div className="featureText">
                    <h3>Personalized Recommendations</h3>
                    <p>Get book suggestions based on your interests</p>
                  </div>
                </div>
                <div className="feature">
                  <div className="featureIcon">💝</div>
                  <div className="featureText">
                    <h3>Wishlist & Favorites</h3>
                    <p>Save and organize your favorite books</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="formSection">
            <div className="formContainer">
              <div className="formHeader">
                <h2 className="formTitle">Create Account</h2>
                <p className="formSubtitle">Join MOON today and start your reading journey</p>
              </div>

              <form onSubmit={handleSubmit} className="registerForm">
                {/* Name Fields */}
                <div className="nameFields">
                  <div className="formGroup">
                    <label htmlFor="firstName" className="formLabel">First Name</label>
                    <div className="inputWrapper">
                      <FaUserIcon className="inputIcon" />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`formInput ${errors.firstName ? 'error' : ''}`}
                        placeholder="Enter your first name"
                      />
                    </div>
                    {errors.firstName && <span className="errorMessage">{errors.firstName}</span>}
                  </div>

                  <div className="formGroup">
                    <label htmlFor="lastName" className="formLabel">Last Name</label>
                    <div className="inputWrapper">
                      <FaUserIcon className="inputIcon" />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`formInput ${errors.lastName ? 'error' : ''}`}
                        placeholder="Enter your last name"
                      />
                    </div>
                    {errors.lastName && <span className="errorMessage">{errors.lastName}</span>}
                  </div>
                </div>

                {/* Email Field */}
                <div className="formGroup">
                  <label htmlFor="email" className="formLabel">Email Address</label>
                  <div className="inputWrapper">
                    <FaEnvelope className="inputIcon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`formInput ${errors.email ? 'error' : ''}`}
                      placeholder="Enter your email address"
                    />
                  </div>
                  {errors.email && <span className="errorMessage">{errors.email}</span>}
                </div>

                {/* Password Field */}
                <div className="formGroup">
                  <label htmlFor="password" className="formLabel">Password</label>
                  <div className="inputWrapper">
                    <FaLock className="inputIcon" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`formInput ${errors.password ? 'error' : ''}`}
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      className="passwordToggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <span className="errorMessage">{errors.password}</span>}
                </div>

                {/* Confirm Password Field */}
                <div className="formGroup">
                  <label htmlFor="confirmPassword" className="formLabel">Confirm Password</label>
                  <div className="inputWrapper">
                    <FaLock className="inputIcon" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`formInput ${errors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      className="passwordToggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="errorMessage">{errors.confirmPassword}</span>}
                </div>

                {/* Terms Agreement */}
                <div className="formGroup">
                  <div className="checkboxWrapper">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="checkbox"
                    />
                    <label htmlFor="agreeToTerms" className="checkboxLabel">
                      I agree to the{' '}
                      <a href="#" className="termsLink">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="termsLink">Privacy Policy</a>
                    </label>
                  </div>
                  {errors.agreeToTerms && <span className="errorMessage">{errors.agreeToTerms}</span>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`submitButton ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              {/* Divider */}
              <div className="divider">
                <span className="dividerText">or continue with</span>
              </div>

              {/* Social Registration */}
              <div className="socialButtons">
                <button
                  type="button"
                  className="socialButton google"
                  onClick={() => handleSocialRegister('Google')}
                >
                  <svg className="socialIcon" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="socialButton facebook"
                  onClick={() => handleSocialRegister('Facebook')}
                >
                  <svg className="socialIcon" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>

              {/* Login Link */}
              <div className="loginLink">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="loginLinkText">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
