import React, { useState, useEffect } from 'react';
import {  Search,  Eye,  Edit,  Package,  CheckCircle,  XCircle,  User,  MapPin,  Phone,  Mail,  DollarSign,  ShoppingBag} from 'lucide-react';
import './Orders.css';
import { getAllOrders, updateOrder, Order as ApiOrder, UpdateOrderRequest } from '../../../api/orders.api';

const Orders = () => {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ApiOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
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
      filtered = filtered.filter(order => order.orderStatus === statusFilter);
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
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
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter]);

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const result = await updateOrder(orderId, { orderStatus: newStatus });
      if (result.success) {
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, orderStatus: newStatus } : order
        ));
        loadOrders(); // Reload to get updated data
      } else {
        console.error('Error updating order status:', result.error);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handlePaymentStatusUpdate = async (orderId: number, newPaymentStatus: string) => {
    try {
      const result = await updateOrder(orderId, { paymentStatus: newPaymentStatus });
      if (result.success) {
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
        ));
        loadOrders(); // Reload to get updated data
      } else {
        console.error('Error updating payment status:', result.error);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
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
          <h1 className="orders-title">Order Management</h1>
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
              <option value="returned">Returned</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending Payment</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
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
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex justify-between w-full sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex w-full items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(endIndex, filteredOrders.length)}</span> of{' '}
                    <span className="font-medium">{filteredOrders.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="flex gap-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 border text-sm font-medium rounded-md ${currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
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
                          src={item.product?.photos?.[0] || '/api/placeholder/60/80'}
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
        {isEditModalOpen && selectedOrder && (
          <div className="modal-overlay">
            <div className="edit-modal">
              <div className="edit-modal-header">
                <h2 className="edit-modal-title">Edit Order {selectedOrder.orderNumber}</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="close-button"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="edit-modal-body">
                {/* Delivery Information Category */}
                <h4 className="category-header">Delivery Information</h4>
                <div className="form-group">
                  <label className="form-label">
                    Order Status
                  </label>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => {
                      const updatedOrder = { ...selectedOrder, orderStatus: e.target.value };
                      setSelectedOrder(updatedOrder);
                      handleStatusUpdate(selectedOrder.id, e.target.value);
                    }}
                    className="form-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                  </select>
                </div>

                {/* Payment Information Category */}
                <h4 className="category-header">Payment Information</h4>
                <div className="form-group">
                  <label className="form-label">
                    Payment Status
                  </label>
                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) => {
                      const updatedOrder = { ...selectedOrder, paymentStatus: e.target.value };
                      setSelectedOrder(updatedOrder);
                      handlePaymentStatusUpdate(selectedOrder.id, e.target.value);
                    }}
                    className="form-select"
                  >
                    <option value="pending">Pending Payment</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="modal-actions">
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const result = await updateOrder(selectedOrder.id, {
                          orderStatus: selectedOrder.orderStatus,
                          paymentStatus: selectedOrder.paymentStatus
                        });

                        if (result.success) {
                          setOrders(prev => prev.map(order =>
                            order.id === selectedOrder.id ? selectedOrder : order
                          ));
                          setIsEditModalOpen(false);
                          alert('Order updated successfully!');
                          loadOrders(); // Reload data
                        } else {
                          alert('Error updating order: ' + (result.error?.message || 'Unknown error'));
                        }
                      } catch (error) {
                        console.error('Error updating order:', error);
                        alert('Error updating order');
                      }
                    }}
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