import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Package, CheckCircle, XCircle, User, MapPin, Phone, Mail, DollarSign, ShoppingBag, Clock, FileCheck, Truck, Home, RotateCcw, Ban } from 'lucide-react';
import './Orders.css';
import { ApiOrder, getProductImageUrl } from '../../../@type/Orders';
import { getAllOrders, updateOrder } from '../../../api/orders.api';

const Orders = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ApiOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ApiOrder | null>(null); // Separate state for editing
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  // Load orders from API
  const loadOrders = async () => {
    setLoading(true);
    try {
      const result = await getAllOrders();
      if (result.success && result.result) {
        setOrders(result.result.data);
        setFilteredOrders(result.result.data);
      } else {
        console.error('Error loading orders:', result.error);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer?.phoneNumber?.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order =>
          order.orderStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(order =>
              new Date(order.orderDate) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(order =>
              new Date(order.orderDate) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(order =>
              new Date(order.orderDate) >= filterDate
          );
          break;
      }
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Order status hierarchy for progression logic
  const statusHierarchy = {
    Pending: 0,
    Confirmed: 1,
    Processing: 2,
    Shipped: 3,
    Delivered: 4,
    Cancelled: -1 // Can be set from any status except delivered
  };

  // Status progression component
  const StatusProgressBar = ({ currentStatus, onStatusChange }: { currentStatus: string, onStatusChange: (status: string) => void }) => {
    const statusFlow = [
      { key: 'Pending', label: 'Pending', icon: Clock, color: 'orange' },
      { key: 'Confirmed', label: 'Confirmed', icon: FileCheck, color: 'blue' },
      { key: 'Processing', label: 'Processing', icon: Package, color: 'purple' },
      { key: 'Shipped', label: 'Shipped', icon: Truck, color: 'indigo' },
      { key: 'Delivered', label: 'Delivered', icon: Home, color: 'green' }
    ];

    const specialStatuses = [
      { key: 'Cancelled', label: 'Cancelled', icon: Ban, color: 'red' }
    ];

    const getCurrentStatusIndex = () => {
      const index = statusFlow.findIndex(s => s.key === currentStatus);
      return index;
    };

    const getStatusState = (statusKey: string, index: number) => {
      const currentIndex = getCurrentStatusIndex();

      // Handle special statuses first
      if (currentStatus === 'Cancelled') {
        if (statusKey === currentStatus) return 'current';
        return 'disabled';
      }

      if (statusKey === currentStatus) return 'current';
      if (currentIndex >= 0 && index < currentIndex) return 'completed';
      if (currentIndex >= 0 && index === currentIndex + 1) return 'next';
      if (currentIndex >= 0 && index > currentIndex) return 'future';

      return 'disabled';
    };

    const isClickable = (statusKey: string, index: number) => {
      // If current status is Cancelled, no progression allowed
      if (currentStatus === 'Cancelled') {
        return false;
      }

      // Special status rules
      if (statusKey === 'Cancelled') {
        return currentStatus !== 'Delivered'; // Can cancel unless delivered
      }

      const currentIndex = getCurrentStatusIndex();

      // Can stay in current status or move forward
      if (currentIndex >= 0) {
        return index >= currentIndex;
      }

      return false;
    };

    const getStatusClasses = (statusKey: string, index: number) => {
      const state = getStatusState(statusKey, index);
      const clickable = isClickable(statusKey, index);

      let classes = "status-item ";

      if (!clickable) {
        classes += "disabled ";
      }

      classes += state;
      return classes;
    };

    const getIconClasses = (statusKey: string, index: number) => {
      const state = getStatusState(statusKey, index);
      const clickable = isClickable(statusKey, index);

      let classes = "status-icon ";

      if (!clickable) {
        classes += "disabled";
      } else {
        classes += state;
      }

      return classes;
    };

    const getLabelClasses = (statusKey: string, index: number) => {
      const state = getStatusState(statusKey, index);
      const clickable = isClickable(statusKey, index);

      let classes = "status-label ";

      if (!clickable) {
        classes += "disabled";
      } else {
        classes += state;
      }

      return classes;
    };

    return (
        <div className="status-progress-container">
          <div className="status-progress-wrapper">
            {/* Progress Line */}
            <div className="status-progress-line">
              <div
                  className="status-progress-fill"
                  style={{
                    width: `${getCurrentStatusIndex() >= 0 ?
                        (getCurrentStatusIndex() / (statusFlow.length - 1)) * 100 : 0}%`
                  }}
              ></div>
            </div>

            {/* Main Status Flow */}
            <div className="status-flow-container">
              {statusFlow.map((status, index) => {
                const IconComponent = status.icon;
                const clickable = isClickable(status.key, index);

                return (
                    <div
                        key={status.key}
                        className={getStatusClasses(status.key, index)}
                        onClick={() => {
                          if (clickable) {
                            onStatusChange(status.key);
                          }
                        }}
                    >
                      <div className="status-icon-wrapper">
                        <IconComponent size={20} className={getIconClasses(status.key, index)} />
                      </div>
                      <span className={getLabelClasses(status.key, index)}>
                    {status.label}
                  </span>
                    </div>
                );
              })}
            </div>

            {/* Special Statuses */}
            <div className="special-statuses-container">
              {specialStatuses.map((status) => {
                const IconComponent = status.icon;
                const clickable = isClickable(status.key, -1);

                let specialClasses = "special-status-item ";
                if (currentStatus === status.key) {
                  specialClasses += "current ";
                } else if (!clickable) {
                  specialClasses += "disabled ";
                }

                return (
                    <div
                        key={status.key}
                        className={specialClasses}
                        onClick={() => {
                          if (clickable) {
                            onStatusChange(status.key);
                          }
                        }}
                    >
                      <IconComponent size={16} className="special-status-icon" />
                      <span>{status.label}</span>
                    </div>
                );
              })}
            </div>
          </div>
        </div>
    );
  };

  const handleOrderSave = async () => {
    if (!selectedOrder || !editingOrder) return;

    try {
      const finalPaymentStatus = editingOrder.orderStatus === 'Delivered' &&
      selectedOrder.paymentType?.toLowerCase() === 'cod'
          ? 'Paid'
          : editingOrder.paymentStatus;

      const result = await updateOrder(selectedOrder.id, {
        orderStatus: editingOrder.orderStatus,
        paymentStatus: finalPaymentStatus
      });

      if (result.success) {
        setOrders(prev => prev.map(order =>
            order.id === selectedOrder.id ? { ...order, ...editingOrder, paymentStatus: finalPaymentStatus } : order
        ));
        setFilteredOrders(prev => prev.map(order =>
            order.id === selectedOrder.id ? { ...order, ...editingOrder, paymentStatus: finalPaymentStatus } : order
        ));

        setSelectedOrder({ ...selectedOrder, ...editingOrder, paymentStatus: finalPaymentStatus });
        setEditingOrder(null);
        setIsEditModalOpen(false);
        loadOrders();
      } else {
        alert('Error updating order: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order');
    }
  };

  const handleRefund = async (orderId: number) => {
    const order = selectedOrder || orders.find(o => o.id === orderId);
    const isAlreadyCancelled = order?.orderStatus === 'Cancelled';
    const isBankTransfer = order?.paymentType?.toLowerCase() === 'banktransfer';

    let confirmMessage = '';
    if (isAlreadyCancelled) {
      confirmMessage = isBankTransfer
          ? 'Are you sure you want to refund this cancelled bank transfer order?'
          : 'Are you sure you want to refund this cancelled order?';
    } else {
      confirmMessage = isBankTransfer
          ? 'Are you sure you want to cancel this order and process bank transfer refund?'
          : 'Are you sure you want to cancel this order and process refund?';
    }

    if (!confirm(confirmMessage)) return;

    try {
      const result = await updateOrder(orderId, {
        orderStatus: 'Cancelled',
        paymentStatus: 'Refunded'
      });

      if (result.success) {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, orderStatus: 'Cancelled', paymentStatus: 'Refunded' } : order
        ));
        setFilteredOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, orderStatus: 'Cancelled', paymentStatus: 'Refunded' } : order
        ));

        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: 'Cancelled', paymentStatus: 'Refunded' });
        }
        if (editingOrder && editingOrder.id === orderId) {
          setEditingOrder({ ...editingOrder, orderStatus: 'Cancelled', paymentStatus: 'Refunded' });
        }

        const successMessage = isAlreadyCancelled
            ? (isBankTransfer ? 'Bank transfer refund processed successfully!' : 'Refund processed successfully!')
            : (isBankTransfer ? 'Order cancelled and bank transfer refund processed successfully!' : 'Order cancelled and refund processed successfully!');
        alert(successMessage);
        loadOrders();
      } else {
        alert('Refund failed: ' + (result.error?.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Refund failed. Please try again!');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const StatusBadge = ({ status }: { status: string }) => (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  const PaymentBadge = ({ status }: { status: string }) => (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );

  return (
      <div className="orders-page">
        <div className="orders-container">
          {/* Header */}
          <div className="page-header">
            <h1 className="orders-title">
              <Package className="w-6 h-6" />
              Order Management
            </h1>
          </div>

          {/* Stats */}
          <div className="orders-stats">
            <div className="stat-card blue">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
              </div>
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
            <div className="stat-card green">
              <div>
                <p className="text-green-600 text-sm font-medium">Delivered</p>
                <p className="text-2xl font-bold text-green-900">
                  {orders.filter(o => o.orderStatus === 'delivered').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div className="stat-card yellow">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Processing</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.orderStatus)).length}
                </p>
              </div>
              <Package className="text-yellow-600" size={24} />
            </div>
            <div className="stat-card purple">
              <div>
                <p className="text-purple-600 text-sm font-medium">Revenue</p>
                <p className="text-lg font-bold text-purple-900">
                  {formatCurrency(orders.reduce((sum, order) => sum + order.totalAmount, 0))}
                </p>
              </div>
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>

          {/* Filters */}
          <div className="orders-filters">
            <div className="search-container">
              <input
                  type="text"
                  placeholder="Search orders, customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
              />
              <Search className="search-icon" size={20} />
            </div>

            <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
            </select>
          </div>

          {/* Orders Table */}
          <div className="orders-table-container">
            <div className="overflow-x-auto">
              <table className="orders-table">
                <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <div className="flex justify-center">
                          <div className="text-blue-600">Loading...</div>
                        </div>
                      </td>
                    </tr>
                ) : currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500">
                        No orders found
                      </td>
                    </tr>
                ) : (
                    currentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">{order.orderItems.length} products</div>
                          </td>
                          <td>
                            <div className="customer-info">
                              <div className="customer-avatar">
                                <User size={20} className="text-gray-600" />
                              </div>
                              <div className="customer-details">
                                <div className="customer-name">{order.customer?.fullName || 'Unknown Customer'}</div>
                                <div className="customer-email">{order.customer?.email || 'N/A'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-sm text-gray-900">
                            {formatDate(order.orderDate)}
                          </td>
                          <td>
                            <StatusBadge status={order.orderStatus} />
                          </td>
                          <td>
                            <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-600 capitalize font-medium">
                            {order.paymentType.toUpperCase()}: {order.paymentStatus}
                          </span>
                            </div>
                          </td>
                          <td className="text-sm font-medium text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setIsDetailModalOpen(true);
                                  }}
                                  className="action-button view"
                                  title="View Details"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setEditingOrder({ ...order }); // Create a copy for editing
                                    setIsEditModalOpen(true);
                                  }}
                                  className="action-button edit"
                                  title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination-container">
                  {/* Mobile Pagination */}
                  <div className="pagination-mobile">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="pagination-btn prev-next"
                    >
                      ← Previous
                    </button>
                    <span className="pagination-info-mobile">
                  Page {currentPage} of {totalPages}
                </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="pagination-btn prev-next"
                    >
                      Next →
                    </button>
                  </div>

                  {/* Desktop Pagination */}
                  <div className="pagination-desktop">
                    <div className="pagination-info-container">
                      <p className="pagination-info">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(endIndex, filteredOrders.length)}</span> of{' '}
                        <span className="font-medium">{filteredOrders.length}</span> results
                      </p>
                    </div>
                    <div className="pagination-controls">
                      <nav className="pagination-nav">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="pagination-btn prev-next"
                        >
                          ← Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`pagination-btn page-number ${currentPage === page ? 'active' : ''}`}
                            >
                              {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="pagination-btn prev-next"
                        >
                          Next →
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
            )}
          </div>

          {/* Order Detail Modal */}
          {isDetailModalOpen && selectedOrder && (
              <div className="modal-overlay">
                <div className="orders-modal">
                  <div className="orders-modal-header">
                    <h2 className="orders-modal-title">Order Details {selectedOrder.orderNumber}</h2>
                    <button
                        onClick={() => setIsDetailModalOpen(false)}
                        className="close-button"
                    >
                      <XCircle size={24} />
                    </button>
                  </div>

                  <div className="orders-modal-body">
                    {/* Customer & Order Info Grid */}
                    <div className="info-grid">
                      {/* Customer Info */}
                      <div className="info-section">
                        <h3 className="info-section-title">
                          <User size={20} />
                          Customer Information
                        </h3>
                        <div className="space-y-3">
                          <div className="customer-info-item">
                            <div className="customer-info-icon">
                              <User size={16} />
                            </div>
                            <div className="customer-info-text">
                              <div className="customer-info-label">Full Name</div>
                              <div className="customer-info-value">{selectedOrder.customer?.fullName || 'Unknown Customer'}</div>
                            </div>
                          </div>
                          <div className="customer-info-item">
                            <div className="customer-info-icon">
                              <Mail size={16} />
                            </div>
                            <div className="customer-info-text">
                              <div className="customer-info-label">Email</div>
                              <div className="customer-info-value">{selectedOrder.customer?.email || 'N/A'}</div>
                            </div>
                          </div>
                          <div className="customer-info-item">
                            <div className="customer-info-icon">
                              <Phone size={16} />
                            </div>
                            <div className="customer-info-text">
                              <div className="customer-info-label">Phone</div>
                              <div className="customer-info-value">{selectedOrder.customer?.phoneNumber || 'N/A'}</div>
                            </div>
                          </div>
                          <div className="customer-info-item">
                            <div className="customer-info-icon">
                              <MapPin size={16} />
                            </div>
                            <div className="customer-info-text">
                              <div className="customer-info-label">Delivery Address</div>
                              <div className="customer-info-value">{selectedOrder.deliveryAddress?.fullAddress || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Information */}
                      <div className="info-section">
                        <h3 className="info-section-title">
                          <Package size={20} />
                          Order Information
                        </h3>
                        <div className="space-y-3">
                          <div className="customer-info-item">
                            <div className="customer-info-icon">
                              <Package size={16} />
                            </div>
                            <div className="customer-info-text">
                              <div className="customer-info-label">Order Date</div>
                              <div className="customer-info-value">{formatDate(selectedOrder.orderDate)}</div>
                            </div>
                          </div>
                          <div className="customer-info-item">
                            <div className="customer-info-icon">
                              <CheckCircle size={16} />
                            </div>
                            <div className="customer-info-text">
                              <div className="customer-info-label">Status</div>
                              <div className="customer-info-value">
                                <StatusBadge status={selectedOrder.orderStatus} />
                              </div>
                            </div>
                          </div>
                          <div className="customer-info-item">
                            <div className="customer-info-icon">
                              <DollarSign size={16} />
                            </div>
                            <div className="customer-info-text">
                              <div className="customer-info-label">Payment</div>
                              <div className="customer-info-value">
                                {selectedOrder.paymentType}: <PaymentBadge status={selectedOrder.paymentStatus} />
                              </div>
                            </div>
                          </div>
                          <div className="customer-info-item">
                            <div className="customer-info-icon">
                              <Package size={16} />
                            </div>
                            <div className="customer-info-text">
                              <div className="customer-info-label">Delivery Notes</div>
                              <div className="customer-info-value">{selectedOrder.deliveryNotes || 'No notes'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="order-items-list">
                      <h3 className="order-items-title">Ordered Products ({selectedOrder.orderItems.length} items)</h3>
                      <div className="order-items-container">
                        {selectedOrder.orderItems.map((item) => (
                            <div key={item.id} className="order-item-card">
                              <img
                                  src={getProductImageUrl(item.product?.photos)}
                                  alt={item.product?.productName || 'Product'}
                                  className="order-item-img"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="order-item-name">{item.product?.productName || 'Product'}</div>
                                <div className="order-item-qty">
                                  {formatCurrency(item.unitPrice)} x <span>{item.quantity}</span>
                                </div>
                              </div>
                              <div className="order-item-price">{formatCurrency(item.totalPrice)}</div>
                            </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                      <div className="order-summary-row">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>{formatCurrency(selectedOrder.subtotal)}</span>
                      </div>
                      <div className="order-summary-row">
                        <span className="text-gray-600">Delivery Charges:</span>
                        <span>{formatCurrency(selectedOrder.deliveryCharges)}</span>
                      </div>
                      <div className="order-summary-row">
                        <span className="text-gray-600">Discount:</span>
                        <span className="text-red-600">-{formatCurrency(selectedOrder.couponDiscountAmount)}</span>
                      </div>
                      <div className="order-summary-total">
                        <span>Total:</span>
                        <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}

          {/* Edit Order Modal */}
          {isEditModalOpen && selectedOrder && editingOrder && (
              <div className="modal-overlay">
                <div className="edit-modal">
                  <div className="edit-modal-header">
                    <h2 className="edit-modal-title">Edit Order {selectedOrder.orderNumber}</h2>
                    <button
                        onClick={() => {
                          setIsEditModalOpen(false);
                          setEditingOrder(null);
                        }}
                        className="close-button"
                    >
                      <XCircle size={24} />
                    </button>
                  </div>

                  <div className="edit-modal-body">
                    {/* Current Order Information */}
                    <div className="info-section mb-6">
                      <h3 className="info-section-title">
                        <Package size={20} />
                        Current Order Status
                      </h3>
                      <div className="space-y-3">
                        <div className="customer-info-item">
                          <div className="customer-info-icon">
                            <CheckCircle size={16} />
                          </div>
                          <div className="customer-info-text">
                            <div className="customer-info-label">Original Status</div>
                            <div className="customer-info-value">
                              <StatusBadge status={selectedOrder.orderStatus} />
                            </div>
                          </div>
                        </div>
                        <div className="customer-info-item">
                          <div className="customer-info-icon">
                            <DollarSign size={16} />
                          </div>
                          <div className="customer-info-text">
                            <div className="customer-info-label">Payment Status</div>
                            <div className="customer-info-value">
                              <PaymentBadge status={selectedOrder.paymentStatus} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery Information Category */}
                    <div className="mb-6">
                      <h4 className="category-header flex items-center gap-2 mb-4">
                        <Package size={20} className="text-blue-600" />
                        Delivery Information
                      </h4>
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-blue-700 mb-2">
                          <strong>Note:</strong> Click on the status icons below to select new status. Changes will be saved when you click "Save Changes".
                        </p>
                        <div className="text-xs text-blue-600">
                          Order flows forward through the stages. Special statuses (Cancelled/Returned) are available based on current state.
                        </div>
                      </div>

                      <StatusProgressBar
                          currentStatus={editingOrder.orderStatus}
                          onStatusChange={(newStatus) => {
                            setEditingOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
                          }}
                      />
                    </div>



                    {/* Action Buttons */}
                    <div className="modal-actions">
                      <button
                          onClick={() => {
                            setIsEditModalOpen(false);
                            setEditingOrder(null);
                          }}
                          className="btn-secondary"
                      >
                        Cancel
                      </button>

                      {selectedOrder &&
                          (selectedOrder.paymentStatus?.toLowerCase() === 'paid' ||
                              (selectedOrder.paymentType?.toLowerCase() === 'banktransfer' &&
                                  ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].includes(selectedOrder.orderStatus?.toLowerCase() || ''))) &&
                          selectedOrder.paymentStatus?.toLowerCase() !== 'refunded' &&
                          (selectedOrder.orderStatus === 'Cancelled' ||
                              (selectedOrder.orderStatus !== 'Delivered' && selectedOrder.orderStatus !== 'Refunded')) && (
                              <button
                                  onClick={() => handleRefund(selectedOrder.id)}
                                  className="btn-refund"
                                  style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                  }}
                              >
                                <DollarSign className="w-4 h-4" />
                                {selectedOrder.orderStatus === 'Cancelled'
                                    ? (selectedOrder.paymentType?.toLowerCase() === 'banktransfer' ? 'Process Refund' : 'Process Refund')
                                    : (selectedOrder.paymentType?.toLowerCase() === 'banktransfer' ? 'Cancel & Refund' : 'Cancel & Refund')}
                              </button>
                          )}

                      <button
                          onClick={handleOrderSave}
                          className="btn-save"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default Orders;