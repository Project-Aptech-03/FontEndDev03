import React, { useState, useEffect } from 'react';
import { FaTimes, FaMapMarkerAlt, FaUser, FaPhone, FaHome, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { customerAddressApi } from '../../api/customerAddress.api';
import { CustomerAddress } from '../../@type/customerAddress';
import './AddAddressForm.css';

interface AddAddressFormProps {
  editingAddress: CustomerAddress | null;
  onSuccess: () => void;
  onClose: () => void;
}

const AddAddressForm: React.FC<AddAddressFormProps> = ({
  editingAddress,
  onSuccess,
  onClose
}) => {
  const [formData, setFormData] = useState({
    addressName: '',
    fullName: '',
    phoneNumber: '',
    fullAddress: '',
    isDefault: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        addressName: editingAddress.addressName || '',
        fullName: editingAddress.fullName || '',
        phoneNumber: editingAddress.phoneNumber || '',
        fullAddress: editingAddress.fullAddress || '',
        isDefault: editingAddress.isDefault || false
      });
    }
  }, [editingAddress]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.addressName.trim()) {
      newErrors.addressName = 'Please enter address name';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter full name';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter phone number';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s+/g, ''))) {
      newErrors.phoneNumber = 'Invalid phone number';
    }

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = 'Please enter full address';
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
      const payload = {
        addressName: formData.addressName.trim(),
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        fullAddress: formData.fullAddress.trim(),
        isDefault: formData.isDefault
      };

      let response;
      if (editingAddress) {
        response = await customerAddressApi.updateAddress(editingAddress.id, payload);
      } else {
        response = await customerAddressApi.createAddress(payload);
      }

      if (response.success) {
        toast.success(
          editingAddress 
            ? 'Address updated successfully' 
            : 'New address added successfully'
        );
        onSuccess();
      } else {
        toast.error(response.message || 'An error occurred');
      }
    } catch (error: any) {
      console.error('Error saving address:', error);
      toast.error('Unable to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="address-form-modal">
      <div className="address-form-overlay" onClick={onClose}></div>
      <div className="address-form-container">
        <div className="address-form-header">
          <h3>
            <FaMapMarkerAlt />
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-group">
            <label htmlFor="addressName">
              <FaHome />
              Address Name *
            </label>
            <input
              type="text"
              id="addressName"
              name="addressName"
              value={formData.addressName}
              onChange={handleInputChange}
              placeholder="E.g: Home, Office, Friend's house..."
              className={errors.addressName ? 'error' : ''}
            />
            {errors.addressName && (
              <span className="error-message">{errors.addressName}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">
                <FaUser />
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter recipient's full name"
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">
                <FaPhone />
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className={errors.phoneNumber ? 'error' : ''}
              />
              {errors.phoneNumber && (
                <span className="error-message">{errors.phoneNumber}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="fullAddress">
              <FaMapMarkerAlt />
              Full Address *
            </label>
            <textarea
              id="fullAddress"
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleInputChange}
              placeholder="Enter full address (house number, street name, ward/commune, district, province/city)"
              rows={3}
              className={errors.fullAddress ? 'error' : ''}
            />
            {errors.fullAddress && (
              <span className="error-message">{errors.fullAddress}</span>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Set as default address
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave />
                  {editingAddress ? 'Update' : 'Add Address'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressForm;
