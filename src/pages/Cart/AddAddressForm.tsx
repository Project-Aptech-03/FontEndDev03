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
      newErrors.addressName = 'Vui lòng nhập tên địa chỉ';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s+/g, ''))) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = 'Vui lòng nhập địa chỉ đầy đủ';
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
            ? 'Đã cập nhật địa chỉ thành công' 
            : 'Đã thêm địa chỉ mới thành công'
        );
        onSuccess();
      } else {
        toast.error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      console.error('Error saving address:', error);
      toast.error('Không thể lưu địa chỉ. Vui lòng thử lại.');
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
            {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-group">
            <label htmlFor="addressName">
              <FaHome />
              Tên địa chỉ *
            </label>
            <input
              type="text"
              id="addressName"
              name="addressName"
              value={formData.addressName}
              onChange={handleInputChange}
              placeholder="VD: Nhà riêng, Văn phòng, Nhà bạn..."
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
                Họ và tên *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nhập họ và tên người nhận"
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">
                <FaPhone />
                Số điện thoại *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Nhập số điện thoại"
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
              Địa chỉ đầy đủ *
            </label>
            <textarea
              id="fullAddress"
              name="fullAddress"
              value={formData.fullAddress}
              onChange={handleInputChange}
              placeholder="Nhập địa chỉ đầy đủ (số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố)"
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
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <FaSave />
                  {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
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
