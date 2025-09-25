import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaLock, FaUnlock, FaSearch, FaFilter } from 'react-icons/fa';
import { couponApi } from '../../../api/coupon.api';
import { Coupon } from '../../../@type/coupon';
import CouponForm from './CouponForm';
import './Coupons.css';

const CouponsAdmin: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
    const [showForm, setShowForm] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    // Fetch coupons data
    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const response = await couponApi.getCoupons();
            if (response.success) {
                setCoupons(response.data);
            } else {
                toast.error(response.message || 'Failed to fetch coupons');
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
            toast.error('Failed to load coupons. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    // Filter coupons based on search and status
    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.couponCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.couponName.toLowerCase().includes(searchTerm.toLowerCase());

        let matchesFilter = true;
        switch (filterStatus) {
            case 'active':
                matchesFilter = coupon.isActive && !coupon.isExpired;
                break;
            case 'inactive':
                matchesFilter = !coupon.isActive;
                break;
            case 'expired':
                matchesFilter = coupon.isExpired;
                break;
            default:
                matchesFilter = true;
        }

        return matchesSearch && matchesFilter;
    });

    // Handle toggle coupon status (lock/unlock)
    const handleToggleStatus = async (coupon: Coupon) => {
        const action = coupon.isActive ? 'lock' : 'unlock';
        const confirmMessage = coupon.isActive
            ? 'Are you sure you want to lock this coupon? It will become inactive.'
            : 'Are you sure you want to unlock this coupon? It will become active.';

        if (!window.confirm(confirmMessage)) {
            return;
        }

        try {
            const updatedCouponData = {
                couponCode: coupon.couponCode,
                couponName: coupon.couponName,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minOrderAmount: coupon.minOrderAmount,
                maxDiscountAmount: coupon.maxDiscountAmount,
                quantity: coupon.quantity,
                startDate: coupon.startDate,
                endDate: coupon.endDate,
                isAutoApply: coupon.isAutoApply,
                isActive: !coupon.isActive
            };

            const response = await couponApi.updateCoupon(coupon.id, updatedCouponData);
            if (response.success) {
                toast.success(`Coupon ${action}ed successfully!`);
                fetchCoupons();
            } else {
                toast.error(response.message || `Failed to ${action} coupon`);
            }
        } catch (error) {
            console.error(`Error ${action}ing coupon:`, error);
            toast.error(`Failed to ${action} coupon. Please try again.`);
        }
    };

    // Handle edit coupon
    const handleEdit = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setShowForm(true);
    };

    // Handle form close
    const handleFormClose = () => {
        setShowForm(false);
        setEditingCoupon(null);
    };

    // Handle form success
    const handleFormSuccess = () => {
        fetchCoupons();
        handleFormClose();
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    // Get status badge class
    const getStatusBadgeClass = (coupon: Coupon) => {
        if (coupon.isExpired) return 'status-expired';
        if (!coupon.isActive) return 'status-inactive';
        return 'status-active';
    };

    // Get status text in English
    const getStatusText = (coupon: Coupon) => {
        if (coupon.isExpired) return 'Expired';
        if (!coupon.isActive) return 'Inactive';
        return 'Active';
    };

    // Format discount display
    const formatDiscountDisplay = (coupon: Coupon) => {
        if (coupon.discountType === 'percentage') {
            return `${coupon.discountValue}%`;
        } else {
            return `$ ${coupon.discountValue.toLocaleString('en-US')}`;
        }
    };

// Format min order amount
    const formatMinOrderAmount = (amount: number) => {
        if (amount === 0) return 'No minimum';
        return `$ ${amount.toLocaleString('en-US')}`;
    };


    // Format max discount amount
    const formatMaxDiscountAmount = (coupon: Coupon) => {
        if (coupon.discountType === 'fixed' || coupon.maxDiscountAmount === 0) {
            return 'No limit';
        }
        return `$ ${coupon.maxDiscountAmount.toLocaleString('en-US')}`;
    };


    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading coupons...</p>
            </div>
        );
    }

    return (
        <div className="coupons-admin">
            <div className="page-header">
                <h1>Coupon Management</h1>
                <button
                    className="btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    <FaPlus /> Add New Coupon
                </button>
            </div>

            {/* Statistics */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>📋 Total Coupons</h3>
                    <span className="stat-number">{coupons.length}</span>
                </div>
                <div className="stat-card">
                    <h3>✅ Active</h3>
                    <span className="stat-number">
                        {coupons.filter(c => c.isActive && !c.isExpired).length}
                    </span>
                </div>
                <div className="stat-card">
                    <h3>⏰ Expired</h3>
                    <span className="stat-number">
                        {coupons.filter(c => c.isExpired).length}
                    </span>
                </div>
                <div className="stat-card">
                    <h3>❌ Inactive</h3>
                    <span className="stat-number">
                        {coupons.filter(c => !c.isActive).length}
                    </span>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="🔍 Search by coupon code or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-dropdown">
                    <FaFilter className="filter-icon" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                    >
                        <option value="all">📊 All</option>
                        <option value="active">✅ Active</option>
                        <option value="inactive">❌ Inactive</option>
                        <option value="expired">⏰ Expired</option>
                    </select>
                </div>
            </div>

            {/* Coupons Table */}
            <div className="table-container">
                <table className="coupons-table">
                    <thead>
                        <tr>
                            <th>🎫 Coupon Code</th>
                            <th>📝 Coupon Name</th>
                            <th>📊 Discount Type</th>
                            <th>💰 Discount Value</th>
                            <th>💳 Min Order</th>
                            <th>🎯 Max Discount</th>
                            <th>📦 Quantity</th>
                            <th>📅 Duration</th>
                            <th>🔄 Status</th>
                            <th>⚙️ Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCoupons.map(coupon => (
                            <tr key={coupon.id}>
                                <td>
                                    <code className="coupon-code">{coupon.couponCode}</code>
                                </td>
                                <td className="coupon-name">{coupon.couponName}</td>
                                <td>
                                    <span className={`discount-type ${coupon.discountType}`}>
                                        {coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed'}
                                    </span>
                                </td>
                                <td className="discount-value">
                                    {formatDiscountDisplay(coupon)}
                                </td>
                                <td>{formatMinOrderAmount(coupon.minOrderAmount)}</td>
                                <td>{formatMaxDiscountAmount(coupon)}</td>
                                <td>{coupon.quantity}</td>
                                <td>
                                    <div className="date-range">
                                        <div>{formatDate(coupon.startDate)}</div>
                                        <div>{formatDate(coupon.endDate)}</div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${getStatusBadgeClass(coupon)}`}>
                                        {getStatusText(coupon)}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEdit(coupon)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className={coupon.isActive ? "btn-lock" : "btn-unlock"}
                                            onClick={() => handleToggleStatus(coupon)}
                                            title={coupon.isActive ? "Lock Coupon" : "Unlock Coupon"}
                                        >
                                            {coupon.isActive ? <FaLock /> : <FaUnlock />}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredCoupons.length === 0 && (
                    <div className="no-data">
                        <p>No coupons found matching the current filters.</p>
                    </div>
                )}
            </div>

            {/* Coupon Form Modal */}
            {showForm && (
                <CouponForm
                    coupon={editingCoupon}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
};

export default CouponsAdmin;
