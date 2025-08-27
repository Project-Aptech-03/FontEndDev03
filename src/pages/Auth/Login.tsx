import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaTwitter, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import './LoginPage.css';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', formData.email);
      
      // Redirect to home page
      navigate('/');
      
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Handle social login logic here
    console.log(`Logging in with ${provider}`);
    alert(`${provider} login functionality would be implemented here`);
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    alert('Forgot password functionality would be implemented here');
  };

  return (
    <div className="loginContainer">
      {/* Background Pattern */}
      <div className="backgroundPattern">
        <div className="patternCircle circle1"></div>
        <div className="patternCircle circle2"></div>
        <div className="patternCircle circle3"></div>
      </div>

      {/* Main Content */}
      <div className="loginContent">
        {/* Left Side - Image/Branding */}
        <div className="loginLeft">
          <div className="brandSection">
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
            
            <h1 className="welcomeTitle">Welcome Back</h1>
            <p className="welcomeSubtitle">
              Sign in to your account to continue your journey with us
            </p>
            
            <div className="featureList">
              <div className="featureItem">
                <div className="featureIcon">📚</div>
                <div className="featureText">
                  <h3>Access Your Library</h3>
                  <p>Browse through thousands of books</p>
                </div>
              </div>
              
              <div className="featureItem">
                <div className="featureIcon">🎯</div>
                <div className="featureText">
                  <h3>Personalized Experience</h3>
                  <p>Get recommendations based on your interests</p>
                </div>
              </div>
              
              <div className="featureItem">
                <div className="featureIcon">💎</div>
                <div className="featureText">
                  <h3>Premium Content</h3>
                  <p>Exclusive access to premium features</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="loginRight">
          <div className="loginFormContainer">
            <div className="formHeader">
              <h2 className="formTitle">Sign In</h2>
              <p className="formSubtitle">
                Don't have an account?{' '}
                <Link to="/register" className="signupLink">
                  Sign up here
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="loginForm">
              {errors.general && (
                <div className="errorMessage">
                  {errors.general}
                </div>
              )}

              {/* Email Field */}
              <div className="formGroup">
                <label htmlFor="email" className="formLabel">
                  <FaEnvelope className="inputIcon" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`formInput ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <span className="fieldError">{errors.email}</span>
                )}
              </div>

              {/* Password Field */}
              <div className="formGroup">
                <label htmlFor="password" className="formLabel">
                  <FaLock className="inputIcon" />
                  Password
                </label>
                <div className="passwordInputContainer">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`formInput ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="passwordToggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="fieldError">{errors.password}</span>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="formOptions">
                <label className="checkboxLabel">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="checkbox"
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                
                <Link
                  to="/forgot-password"
                  className="forgotPassword"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`submitButton ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Divider */}
              <div className="divider">
                <span className="dividerText">or continue with</span>
              </div>

              {/* Social Login Buttons */}
              <div className="socialButtons">
                <button
                  type="button"
                  className="socialButton google"
                  onClick={() => handleSocialLogin('Google')}
                >
                  <FaGoogle />
                  <span>Google</span>
                </button>
                
                <button
                  type="button"
                  className="socialButton facebook"
                  onClick={() => handleSocialLogin('Facebook')}
                >
                  <FaFacebook />
                  <span>Facebook</span>
                </button>
                
                <button
                  type="button"
                  className="socialButton twitter"
                  onClick={() => handleSocialLogin('Twitter')}
                >
                  <FaTwitter />
                  <span>Twitter</span>
                </button>
              </div>
            </form>

            {/* Register Link */}
            <div className="registerLink">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="registerLinkText">
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="backToHome">
              <Link to="/" className="backLink">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
