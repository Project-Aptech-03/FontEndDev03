import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { couponApi } from '../../../api/coupon.api';
import { Coupon, CreateCouponRequest } from '../../../@type/coupon';

interface CouponFormProps {
  coupon?: Coupon | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CouponForm: React.FC<CouponFormProps> = ({ coupon, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<CreateCouponRequest>({
    couponCode: '',
    couponName: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    quantity: 1,
    startDate: '',
    endDate: '',
    isAutoApply: false,
    isActive: true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

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
        startDate: coupon.startDate.split('T')[0],
        endDate: coupon.endDate.split('T')[0],
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
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
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
      // Format dates to include time
      const submissionData = {
        ...formData,
        startDate: `${formData.startDate}T00:00:00`,
        endDate: `${formData.endDate}T23:59:59`
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
                  <input
                    type="text"
                    id="couponCode"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleChange}
                    placeholder="e.g., SAVE20, NEWUSER50"
                    className={errors.couponCode ? 'error' : ''}
                  />
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
                    Start Date
                    <span className="field-hint">Coupon is valid from this date</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={errors.startDate ? 'error' : ''}
                  />
                  {errors.startDate && <span className="error-message">{errors.startDate}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">
                    <span className="required">*</span>
                    End Date
                    <span className="field-hint">Coupon expires after this date</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
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
