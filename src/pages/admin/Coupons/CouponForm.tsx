import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTimes, FaSyncAlt } from 'react-icons/fa';
import { couponApi } from '../../../api/coupon.api';
import { Coupon, CreateCouponRequest } from '../../../@type/coupon';

interface CouponFormProps {
  coupon?: Coupon | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CouponForm: React.FC<CouponFormProps> = ({ coupon, onClose, onSuccess }) => {
  // Helper function to get current datetime in local timezone
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Helper function to get datetime one week from now
  const getOneWeekLater = () => {
    const oneWeek = new Date();
    oneWeek.setDate(oneWeek.getDate() + 7);
    oneWeek.setMinutes(oneWeek.getMinutes() - oneWeek.getTimezoneOffset());
    return oneWeek.toISOString().slice(0, 16);
  };

  // Helper function to generate random coupon code
  const generateRandomCouponCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Helper function to check if coupon code exists in active coupons
  const isCouponCodeUnique = async (code: string): Promise<boolean> => {
    try {
      const response = await couponApi.getCoupons();
      if (response.success && response.data) {
        const activeCoupons = response.data.filter((c: Coupon) => c.isActive);
        return !activeCoupons.some((c: Coupon) => c.couponCode === code);
      }
      return true;
    } catch (error) {
      console.error('Error checking coupon code uniqueness:', error);
      return true;
    }
  };

  // Helper function to generate unique coupon code
  const generateUniqueCouponCode = async (): Promise<string> => {
    let code = generateRandomCouponCode();
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      const isUnique = await isCouponCodeUnique(code);
      if (isUnique) {
        return code;
      }
      code = generateRandomCouponCode();
      attempts++;
    }
    
    // If we can't generate unique code after 10 attempts, add timestamp
    return generateRandomCouponCode() + Date.now().toString().slice(-2);
  };

  const [formData, setFormData] = useState<CreateCouponRequest>({
    couponCode: '',
    couponName: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    quantity: 1,
    startDate: getCurrentDateTime(),
    endDate: getOneWeekLater(),
    isAutoApply: false,
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [generatingCode, setGeneratingCode] = useState(false);

  // Generate coupon code for new coupons
  useEffect(() => {
    if (!coupon) {
      generateNewCouponCode();
    }
  }, []);

  // Generate new coupon code
  const generateNewCouponCode = async () => {
    setGeneratingCode(true);
    try {
      const newCode = await generateUniqueCouponCode();
      setFormData(prev => ({ ...prev, couponCode: newCode }));
    } catch (error) {
      console.error('Error generating coupon code:', error);
      toast.error('Failed to generate coupon code');
    } finally {
      setGeneratingCode(false);
    }
  };

  useEffect(() => {
    if (coupon) {
      setFormData({
        couponCode: coupon.couponCode,
        couponName: coupon.couponName,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        maxDiscountAmount: coupon.maxDiscountAmount,
        quantity: coupon.quantity,
        startDate: coupon.startDate.slice(0, 16), // Convert to datetime-local format
        endDate: coupon.endDate.slice(0, 16), // Convert to datetime-local format
        isAutoApply: coupon.isAutoApply,
        isActive: coupon.isActive
      });
    }
  }, [coupon]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.couponCode.trim()) {
      newErrors.couponCode = 'Coupon code is required';
    } else if (formData.couponCode.length < 3) {
      newErrors.couponCode = 'Coupon code must be at least 3 characters';
    }

    if (!formData.couponName.trim()) {
      newErrors.couponName = 'Coupon name is required';
    }

    if (formData.discountValue <= 0) {
      newErrors.discountValue = 'Discount value must be greater than 0';
    }

    if (formData.discountType === 'percentage' && formData.discountValue > 100) {
      newErrors.discountValue = 'Percentage value cannot exceed 100%';
    }

    if (formData.minOrderAmount < 0) {
      newErrors.minOrderAmount = 'Minimum order amount cannot be negative';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date and time is required';
    } else {
      const startDate = new Date(formData.startDate);
      const now = new Date();
      if (startDate < now) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date and time is required';
    } else if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Format dates to ISO string for API
      const submissionData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      let response;
      if (coupon) {
        response = await couponApi.updateCoupon(coupon.id, submissionData);
      } else {
        response = await couponApi.createCoupon(submissionData);
      }

      if (response.success) {
        toast.success(response.message || `${coupon ? 'Updated' : 'Created'} coupon successfully!`);
        onSuccess();
      } else {
        toast.error(response.message || `Failed to ${coupon ? 'update' : 'create'} coupon`);
      }
    } catch (error: any) {
      console.error('Error submitting coupon:', error);
      toast.error(`Failed to ${coupon ? 'update' : 'create'} coupon. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content coupon-form-modal">
        <div className="modal-header">
          <h2>{coupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="coupon-form">
          <div className="form-container">
            {/* Basic Information Section */}
            <div className="form-section">
              <div className="section-header">
                <h3>📝 Basic Information</h3>
                <p className="section-description">Enter basic coupon information</p>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="couponCode">
                    <span className="required">*</span>
                    Coupon Code
                    <span className="field-hint">Unique code for customers to enter</span>
                  </label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      id="couponCode"
                      name="couponCode"
                      value={formData.couponCode}
                      onChange={handleChange}
                      placeholder="e.g., SAVE20, NEWUSER50"
                      className={errors.couponCode ? 'error' : ''}
                      readOnly={!coupon} // Make readonly for new coupons to prevent manual editing
                    />
                    {!coupon && (
                      <button
                        type="button"
                        onClick={generateNewCouponCode}
                        disabled={generatingCode}
                        className="refresh-code-btn"
                        title="Generate new code"
                      >
                        <FaSyncAlt className={generatingCode ? 'spinning' : ''} />
                      </button>
                    )}
                  </div>
                  {errors.couponCode && <span className="error-message">{errors.couponCode}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="couponName">
                    <span className="required">*</span>
                    Coupon Name
                    <span className="field-hint">Detailed description of the offer</span>
                  </label>
                  <input
                    type="text"
                    id="couponName"
                    name="couponName"
                    value={formData.couponName}
                    onChange={handleChange}
                    placeholder="e.g., 20% off orders over $100"
                    className={errors.couponName ? 'error' : ''}
                  />
                  {errors.couponName && <span className="error-message">{errors.couponName}</span>}
                </div>
              </div>
            </div>

            {/* Discount Settings Section */}
            <div className="form-section">
              <div className="section-header">
                <h3>💰 Discount Settings</h3>
                <p className="section-description">Configure discount type and amount</p>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="discountType">
                    Discount Type
                    <span className="field-hint">Choose how the discount is calculated</span>
                  </label>
                  <select
                    id="discountType"
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="select-field"
                  >
                    <option value="percentage">📊 Percentage (%)</option>
                    <option value="fixed">💵 Fixed Amount (VND)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="discountValue">
                    <span className="required">*</span>
                    Discount Value
                    <span className="field-hint">
                      {formData.discountType === 'percentage' 
                        ? 'Enter percentage (1-100)' 
                        : 'Enter fixed amount (VND)'
                      }
                    </span>
                  </label>
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      id="discountValue"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      min="0"
                      max={formData.discountType === 'percentage' ? 100 : undefined}
                      placeholder={formData.discountType === 'percentage' ? '20' : '50000'}
                      className={errors.discountValue ? 'error' : ''}
                    />
                    <span className="input-suffix">
                      {formData.discountType === 'percentage' ? '%' : 'VND'}
                    </span>
                  </div>
                  {errors.discountValue && <span className="error-message">{errors.discountValue}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="minOrderAmount">
                    Minimum Order Amount
                    <span className="field-hint">Order must reach this value to apply</span>
                  </label>
                  <div className="input-with-suffix">
                    <input
                      type="number"
                      id="minOrderAmount"
                      name="minOrderAmount"
                      value={formData.minOrderAmount}
                      onChange={handleChange}
                      min="0"
                      placeholder="100000"
                      className={errors.minOrderAmount ? 'error' : ''}
                    />
                    <span className="input-suffix">VND</span>
                  </div>
                  {errors.minOrderAmount && <span className="error-message">{errors.minOrderAmount}</span>}
                </div>

                {formData.discountType === 'percentage' && (
                  <div className="form-group">
                    <label htmlFor="maxDiscountAmount">
                      Maximum Discount
                      <span className="field-hint">Maximum discount amount for percentage type</span>
                    </label>
                    <div className="input-with-suffix">
                      <input
                        type="number"
                        id="maxDiscountAmount"
                        name="maxDiscountAmount"
                        value={formData.maxDiscountAmount}
                        onChange={handleChange}
                        min="0"
                        placeholder="50000"
                      />
                      <span className="input-suffix">VND</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity and Time Section */}
            <div className="form-section">
              <div className="section-header">
                <h3>📅 Quantity and Duration</h3>
                <p className="section-description">Set usage quantity and validity period</p>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">
                    <span className="required">*</span>
                    Quantity
                    <span className="field-hint">Number of times the coupon can be used</span>
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    placeholder="100"
                    className={errors.quantity ? 'error' : ''}
                  />
                  {errors.quantity && <span className="error-message">{errors.quantity}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate">
                    <span className="required">*</span>
                    Start Date & Time
                    <span className="field-hint">Coupon is valid from this date and time</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={getCurrentDateTime()} // Prevent past dates
                    className={errors.startDate ? 'error' : ''}
                  />
                  {errors.startDate && <span className="error-message">{errors.startDate}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">
                    <span className="required">*</span>
                    End Date & Time
                    <span className="field-hint">Coupon expires after this date and time</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || getCurrentDateTime()} // End date must be after start date
                    className={errors.endDate ? 'error' : ''}
                  />
                  {errors.endDate && <span className="error-message">{errors.endDate}</span>}
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="form-section">
              <div className="section-header">
                <h3>⚙️ Advanced Settings</h3>
                <p className="section-description">Configure additional options</p>
              </div>
              
              <div className="form-row">
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isAutoApply"
                      checked={formData.isAutoApply}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">
                      <strong>Auto Apply</strong>
                      <span className="checkbox-hint">Coupon will be applied automatically when conditions are met</span>
                    </span>
                  </label>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">
                      <strong>Active</strong>
                      <span className="checkbox-hint">Coupon can be used immediately</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processing...' : (coupon ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm;
