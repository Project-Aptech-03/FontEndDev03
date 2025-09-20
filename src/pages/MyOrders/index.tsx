import React, { useState, useEffect } from 'react';
import {   Package, Eye, Truck, CheckCircle, XCircle, Clock,ShoppingBag,  RotateCcw, Calendar, ThumbsUp, ImageOff, CreditCard, DollarSign, AlertCircle} from 'lucide-react';
import { ApiOrder as Order, getProductImageUrl } from '../../@type/Orders';
import { getMyOrders, cancelOrder } from '../../api/orders.api';
import './MyOrder.css';

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string>('');
  const [cancelReason, setCancelReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [isCanceling, setIsCanceling] = useState(false);

  // Gọi API thật để lấy dữ liệu đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getMyOrders();
        if (response.success && response.result) {
          console.log('Orders from API:', response.result.data);
          console.log('Order statuses:', response.result.data.map(order => order.orderStatus));
          setOrders(response.result.data);
        } else {
          console.error('Failed to fetch orders:', response.error);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getActiveOrders = () => {
    return orders.filter(order => {
      const status = order.orderStatus.toLowerCase();
      return !['delivered', 'cancelled', 'returned'].includes(status);
    });
  };

  const getCompletedOrders = () => {
    return orders.filter(order => {
      const status = order.orderStatus.toLowerCase();
      return ['delivered', 'cancelled', 'returned'].includes(status);
    });
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'pending':
        return <Clock size={16} />;
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'processing':
        return <Package size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      case 'returned':
        return <RotateCcw size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'Awaiting Confirmation',
      confirmed: 'Order Confirmed',
      processing: 'Preparing Order',
      shipped: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      returned: 'Returned'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'Payment Pending',
      paid: 'Payment Complete',
      unpaid: 'Payment Required',
      refunded: 'Refunded',
      failed: 'Payment Failed'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  const getPaymentStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'paid':
        return <CheckCircle size={12} />;
      case 'pending':
        return <Clock size={12} />;
      case 'unpaid':
        return <AlertCircle size={12} />;
      case 'refunded':
        return <RotateCcw size={12} />;
      case 'failed':
        return <XCircle size={12} />;
      default:
        return <CreditCard size={12} />;
    }
  };

  const getPaymentStatusClass = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'paid':
        return 'payment-paid';
      case 'pending':
        return 'payment-pending';
      case 'unpaid':
        return 'payment-unpaid';
      case 'refunded':
        return 'payment-refunded';
      case 'failed':
        return 'payment-failed';
      default:
        return 'payment-unknown';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCancelOrder = (orderStatus: string) => {
    return ['pending', 'confirmed', 'processing'].includes(orderStatus.toLowerCase());
  };

  const renderProductImage = (product: any, className: string) => {
    return (
      <img
        src={getProductImageUrl(product?.photos)}
        alt={product?.productName || 'Product'}
        className={className}
        onError={(e) => {
          // Hide broken image and show placeholder
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const placeholder = target.nextElementSibling as HTMLElement;
          if (placeholder) {
            placeholder.style.display = 'flex';
          }
        }}
      />
    );
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleReorder = (order: Order) => {
    alert(`Added ${order.orderItems.length} items to cart!`);
  };

  const handleCancelOrder = (orderId: number) => {
    setCancelOrderId(orderId.toString());
    setCancelReason('');
    setCustomReason('');
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setIsCancelModalOpen(false);
    setCancelOrderId('');
    setCancelReason('');
    setCustomReason('');
  };

  const confirmCancelOrder = async () => {
    const reasonToSend = cancelReason === "Other" ? customReason : cancelReason;
    
    if (reasonToSend.trim() === '') {
      alert('Please provide a reason for cancellation');
      return;
    }

    const orderIdNumber = parseInt(cancelOrderId);
    if (isNaN(orderIdNumber) || orderIdNumber <= 0) {
      alert('Invalid order ID');
      return;
    }

    // Find the order to double-check if it can be cancelled
    const orderToCancel = orders.find(order => order.id === orderIdNumber);
    if (!orderToCancel) {
      alert('Order not found');
      return;
    }

    if (!canCancelOrder(orderToCancel.orderStatus)) {
      alert('This order cannot be cancelled in its current status');
      return;
    }

    setIsCanceling(true);
    try {
      console.log('Canceling order:', cancelOrderId, 'with reason:', reasonToSend);
      const response = await cancelOrder(orderIdNumber, { cancellationReason: reasonToSend });
      
      console.log('Cancel order response:', response);
      
      if (response.success && response.result && response.result.success) {
        // Update the local state to reflect the cancelled order
        setOrders(prev => prev.map(order => 
          order.id.toString() === cancelOrderId ? { ...order, orderStatus: 'Cancelled' } : order
        ));
        
        alert('Order has been cancelled successfully!');
        closeCancelModal();
      } else {
        const errorMessage = response.error?.message || response.error?.errors || 'Failed to cancel order. Please try again.';
        console.error('Cancel order failed:', response.error);
        alert(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert(`Failed to cancel order: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCanceling(false);
    }
  };

  const handleConfirmReceived = (orderId: number) => {
    if (window.confirm('Do you confirm that you have received the goods?')) {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, orderStatus: 'Delivered' } : order
      ));
      alert('Thank you! The order has been confirmed as delivered successfully.');
    }
  };

  const currentOrders = activeTab === 'active' ? getActiveOrders() : getCompletedOrders();

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">
        {/* Header */}
        <div className="my-orders-header-compact">
          <h1 className="my-orders-title-compact">My Orders</h1>
        </div>

        {/* Tabs */}
        <div className="order-tabs-compact">
          <button 
            className={`tab-button-compact ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            <Package size={16} />
            Current ({getActiveOrders().length})
          </button>
          <button 
            className={`tab-button-compact ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <Calendar size={16} />
            History ({getCompletedOrders().length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
          </div>
        ) : currentOrders.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag className="empty-icon" />
            <h3 className="empty-title">
              {activeTab === 'active' ? 'No orders found' : 'No purchase history'}
            </h3>
            <p className="empty-subtitle">
              {activeTab === 'active' 
                ? 'You have no orders being processed' 
                : 'You have not completed any orders'
              }
            </p>
            {activeTab === 'active' && (
              <a href="/shop" className="shop-now-btn">
                <ShoppingBag size={18} />
                Shop Now
              </a>
            )}
          </div>
        ) : (
          <div className="orders-list">
            {currentOrders.map(order => (
              <div key={order.id} className="order-card-compact">
                <div className="order-header-compact">
                  <div className="order-info">
                    <span className="order-number">#{order.orderNumber}</span>
                    <span className="order-date">{formatDate(order.orderDate)}</span>
                  </div>
                  <div className="order-status-row">
                    <div className={`order-status-compact status-${order.orderStatus.toLowerCase()}`}>
                      {getStatusIcon(order.orderStatus)}
                      <span>{getStatusText(order.orderStatus)}</span>
                    </div>
                    <div className={`payment-status-compact ${getPaymentStatusClass(order.paymentStatus)}`}>
                      {getPaymentStatusIcon(order.paymentStatus)}
                      <span>{getPaymentStatusText(order.paymentStatus)}</span>
                    </div>
                  </div>
                </div>

                <div className="order-content-compact">
                  <div className="order-items-compact">
                    {order.orderItems.slice(0, 1).map(item => (
                      <div key={item.id} className="order-item-compact">
                        <div className="item-image-wrapper">
                          {renderProductImage(item.product, "item-image-compact")}
                          <div className="no-image-placeholder item-image-compact" style={{ display: 'none' }}>
                            <ImageOff size={20} color="#ccc" />
                          </div>
                        </div>
                        <div className="item-info">
                          <span className="item-name-compact">{item.product?.productName}</span>
                          <span className="item-details-compact">x{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                    {order.orderItems.length > 1 && (
                      <span className="more-items">+{order.orderItems.length - 1} more items</span>
                    )}
                  </div>
                  
                  <div className="order-amount">
                    <span className="amount-label">Total:</span>
                    <span className="amount-value">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>

                <div className="order-actions-compact">
                  <button 
                    onClick={() => handleViewDetails(order)}
                    className="action-btn-compact btn-view"
                  >
                    <Eye size={14} />
                    Details
                  </button>
                  
                  {activeTab === 'completed' && (
                    <button 
                      onClick={() => handleReorder(order)}
                      className="action-btn-compact btn-reorder"
                    >
                      <RotateCcw size={14} />
                      Reorder
                    </button>
                  )}
                  
                  {activeTab === 'active' && canCancelOrder(order.orderStatus) && (
                    <button 
                      onClick={() => handleCancelOrder(order.id)}
                      className="action-btn-compact btn-cancel"
                    >
                      <XCircle size={14} />
                      Cancel
                    </button>
                  )}
                  
                  {order.orderStatus.toLowerCase() === 'shipped' && (
                    <button 
                      onClick={() => handleConfirmReceived(order.id)}
                      className="action-btn-compact btn-confirm"
                    >
                      <ThumbsUp size={14} />
                      Received
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Order Modal */}
        {isCancelModalOpen && (
          <div className="modal-overlay" onClick={closeCancelModal}>
            <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Cancel Order</h2>
                <button 
                  onClick={closeCancelModal}
                  className="close-btn"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="modal-body">
                <p className="cancel-description">
                  Please provide a reason for cancelling this order:
                </p>
                
                <div className="reason-options">
                  <label className="reason-option">
                    <input 
                      type="radio" 
                      value="Changed my mind" 
                      checked={cancelReason === "Changed my mind"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <span>Changed my mind</span>
                  </label>
                  
                  <label className="reason-option">
                    <input 
                      type="radio" 
                      value="Found better price elsewhere" 
                      checked={cancelReason === "Found better price elsewhere"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <span>Found better price elsewhere</span>
                  </label>
                  
                  <label className="reason-option">
                    <input 
                      type="radio" 
                      value="Delivery too slow" 
                      checked={cancelReason === "Delivery too slow"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <span>Delivery too slow</span>
                  </label>
                  
                  <label className="reason-option">
                    <input 
                      type="radio" 
                      value="No longer needed" 
                      checked={cancelReason === "No longer needed"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <span>No longer needed</span>
                  </label>
                  
                  <label className="reason-option">
                    <input 
                      type="radio" 
                      value="Other" 
                      checked={cancelReason === "Other"}
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <span>Other</span>
                  </label>
                </div>
                
                {cancelReason === "Other" && (
                  <textarea 
                    className="custom-reason"
                    placeholder="Please specify your reason..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                )}
                
                <div className="cancel-actions">
                  <button 
                    onClick={closeCancelModal}
                    className="action-btn-compact btn-secondary"
                    disabled={isCanceling}
                  >
                    Keep Order
                  </button>
                  <button 
                    onClick={confirmCancelOrder}
                    className="action-btn-compact btn-cancel"
                    disabled={isCanceling}
                  >
                    {isCanceling ? 'Canceling...' : 'Confirm Cancel'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Detail Modal */}
        {isDetailModalOpen && selectedOrder && (
          <div className="modal-overlay" onClick={() => setIsDetailModalOpen(false)}>
            <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Order Details #{selectedOrder.orderNumber}</h2>
                <div className="modal-header-actions">
                  <button 
                    onClick={() => setIsDetailModalOpen(false)}
                    className="close-btn"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>
              
              <div className="modal-body">
                {/* Order Info */}
                <div className="order-info-section">
                  <h3 className="section-title">Order Information</h3>
                  <div className="info-compact">
                    <div className="info-row">
                      <div className="info-pair">
                        <span className="info-label">Order Date:</span>
                        <span className="info-value">{formatDate(selectedOrder.orderDate)}</span>
                      </div>
                      <div className="info-pair">
                        <span className="info-label">Status:</span>
                        <span className={`order-status-compact status-${selectedOrder.orderStatus.toLowerCase()}`}>
                          {getStatusIcon(selectedOrder.orderStatus)}
                          <span>{getStatusText(selectedOrder.orderStatus)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="info-row">
                      <div className="info-pair">
                        <span className="info-label">Payment:</span>
                        <span className="info-value">{selectedOrder.paymentType}</span>
                      </div>
                      <div className="info-pair">
                        <span className="info-label">Payment Status:</span>
                        <span className="info-value">{selectedOrder.paymentStatus}</span>
                      </div>
                    </div>
                    <div className="info-full">
                      <span className="info-label">Address:</span>
                      <span className="info-value">{selectedOrder.deliveryAddress.fullAddress}</span>
                    </div>
                    <div className="info-full">
                      <span className="info-label">Note:</span>
                      <span className="info-value">{selectedOrder.deliveryNotes}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items-section">
                  <h3 className="section-title">Items ({selectedOrder.orderItems.length})</h3>
                  <div className="items-compact">
                    {selectedOrder.orderItems.map(item => (
                      <div key={item.id} className="item-compact">
                        <div className="item-image-wrapper">
                          {renderProductImage(item.product, "item-img")}
                          <div className="no-image-placeholder item-img" style={{ display: 'none' }}>
                            <ImageOff size={20} color="#ccc" />
                          </div>
                        </div>
                        <div className="item-details-compact">
                          <h4 className="item-title">{item.product?.productName}</h4>
                          <p className="item-qty">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                        </div>
                        <div className="item-total">
                          {formatCurrency(item.totalPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="order-summary-section">
                  <h3 className="section-title">Summary</h3>
                  <div className="summary-compact">
                    <div className="summary-line">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="summary-line">
                      <span>Shipping:</span>
                      <span>{selectedOrder.deliveryCharges === 0 ? 'Free' : formatCurrency(selectedOrder.deliveryCharges)}</span>
                    </div>
                    {selectedOrder.couponDiscountAmount > 0 && (
                      <div className="summary-line discount-line">
                        <span>Discount ({selectedOrder.appliedCoupons}):</span>
                        <span>-{formatCurrency(selectedOrder.couponDiscountAmount)}</span>
                      </div>
                    )}
                    <div className="summary-line total-line">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
