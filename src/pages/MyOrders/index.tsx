import React, { useState, useEffect } from 'react';
import {
  Package, Eye, Truck, CheckCircle, XCircle, Clock, ShoppingBag,
  ArrowRight, RotateCcw, Calendar, ThumbsUp, ImageOff, CreditCard,
  DollarSign, AlertCircle, Star, Camera, X, Edit, Trash2
} from 'lucide-react';
import {
  ApiOrder,
  CancelOrderRequest,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewResponse
} from '../../@type/Orders';
import { getMyOrders, cancelOrder } from '../../api/orders.api';
import { createReview, updateReview, getOrderReviewInfo, getExistingReview, deleteReview } from '../../api/reviews.api';
import './MyOrder.css';

// SINHND-REVIEW: Thêm interface cho review info response
interface ReviewInfoResponse {
  products: Array<{
    productId: number;
    hasBeenReviewed: boolean;
  }>;
}

const MyOrders = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState<string>('');
  const [cancelReason, setCancelReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [isCanceling, setIsCanceling] = useState(false);

  // SINHND-REVIEW: State mới cho review system
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImages, setReviewImages] = useState<File[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [existingReview, setExistingReview] = useState<ReviewResponse | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Gọi API thật để lấy dữ liệu đơn hàng
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await getMyOrders();
        if (response.success && response.result) {
          console.log('Orders from API:', response.result.data);
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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
    if (product.photos && product.photos.length > 0) {
      return (
        <img
          src={product.photos[0]?.photoUrl || '/api/placeholder/60/80'}
          alt={product.productName}
          className={className}
        />
      );
    } else {
      return (
        <div className={`${className} no-image-placeholder`}>
          <ImageOff size={24} color="#ccc" />
        </div>
      );
    }
  };

  const handleViewDetails = (order: ApiOrder) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleReorder = (order: ApiOrder) => {
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

  // SINHND-REVIEW: Hàm mở modal review
  const handleOpenReview = async (order: ApiOrder, product: any) => {
    setSelectedOrder(order);
    setSelectedProduct(product);

    // Kiểm tra nếu đã có review
    try {
      const response = await getOrderReviewInfo(order.id);
      if (response.success && response.result) {
        // SINHND-REVIEW: Sửa lỗi TypeScript bằng cách ép kiểu
        const reviewInfo = response.result.data as ReviewInfoResponse;
        const productReview = reviewInfo.products.find((p) => p.productId === product.productId);

        if (productReview && productReview.hasBeenReviewed) {
          // Load existing review details
          const reviewResponse = await getExistingReview(product.productId, order.id);
          if (reviewResponse.success && reviewResponse.result) {
            setExistingReview(reviewResponse.result.data);
            setReviewRating(reviewResponse.result.data.rating);
            setReviewComment(reviewResponse.result.data.comment || '');
          }
        } else {
          setExistingReview(null);
          setReviewRating(5);
          setReviewComment('');
        }
      }
    } catch (error) {
      console.error('Error loading review info:', error);
    }

    setReviewImages([]);
    setImagePreviews([]);
    setIsReviewModalOpen(true);
  };

  // SINHND-REVIEW: Hàm submit review
  const handleSubmitReview = async () => {
    if (!selectedOrder || !selectedProduct || reviewComment.trim() === '') {
      alert('Please provide a review comment');
      return;
    }

    setIsSubmittingReview(true);
    try {
      if (existingReview) {
        const reviewData: UpdateReviewRequest = {
          rating: reviewRating,
          comment: reviewComment,
          newReviewImages: reviewImages
        };

        const response = await updateReview(existingReview.id, reviewData);
        if (response.success) {
          alert('Review updated successfully!');
          setIsReviewModalOpen(false);
          refreshOrders();
        } else {
          alert(response.error?.message || 'Failed to update review');
        }
      } else {
        const reviewData: CreateReviewRequest = {
          orderId: selectedOrder.id,
          productId: selectedProduct.productId,
          rating: reviewRating,
          comment: reviewComment,
          reviewImages: reviewImages
        };

        const response = await createReview(reviewData);
        if (response.success) {
          alert('Review submitted successfully!');
          setIsReviewModalOpen(false);
          refreshOrders();
        } else {
          alert(response.error?.message || 'Failed to submit review');
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // SINHND-REVIEW: Hàm xóa review
  const handleDeleteReview = async () => {
    if (!existingReview) return;

    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await deleteReview(existingReview.id);
        if (response.success) {
          alert('Review deleted successfully!');
          setIsReviewModalOpen(false);
          refreshOrders();
        } else {
          alert(response.error?.message || 'Failed to delete review');
        }
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review');
      }
    }
  };

  // SINHND-REVIEW: Refresh orders list
  const refreshOrders = async () => {
    const response = await getMyOrders();
    if (response.success && response.result) {
      setOrders(response.result.data);
    }
  };

  // SINHND-REVIEW: Hàm xử lý upload ảnh
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files);
      setReviewImages(prev => [...prev, ...newImages]);

      // Tạo preview URLs
      const newPreviews = newImages.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // SINHND-REVIEW: Hàm xóa ảnh
  const removeImage = (index: number) => {
    setReviewImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));

    // Revoke object URLs để tránh memory leaks
    URL.revokeObjectURL(imagePreviews[index]);
  };

  // SINHND-REVIEW: Hàm đóng modal review
  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedProduct(null);
    setExistingReview(null);

    // Revoke all object URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setReviewImages([]);
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
                        {renderProductImage(item.product, "item-image-compact")}
                        <div className="item-info">
                          <span className="item-name-compact">{item.product.productName}</span>
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
                  
                  {/* SINHND-REVIEW: Thêm nút review cho orders delivered */}
                  {activeTab === 'completed' &&
                   order.orderStatus.toLowerCase() === 'delivered' &&
                   order.paymentStatus.toLowerCase() === 'paid' && (
                    order.orderItems.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleOpenReview(order, item)}
                        className="action-btn-compact btn-review"
                      >
                        <Star size={14} />
                        {/* SINHND-REVIEW: Sửa lỗi TypeScript bằng cách sử dụng optional chaining */}
                        {order.reviewableProducts?.find(p => p.productId === item.productId)?.hasBeenReviewed
                          ? 'Update Review' : 'Review'}
                      </button>
                    ))
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

        {/* Review Modal - SINHND-REVIEW: Modal mới cho review system */}
        {isReviewModalOpen && selectedOrder && selectedProduct && (
          <div className="modal-overlay" onClick={closeReviewModal}>
            <div className="review-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">
                  {existingReview ? 'Update Review' : 'Write a Review'}
                </h2>
                <button onClick={closeReviewModal} className="close-btn">
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <div className="review-product-info">
                  <img
                    src={selectedProduct.product.photos?.[0]?.photoUrl || '/api/placeholder/60/80'}
                    alt={selectedProduct.product.productName}
                    className="review-product-image"
                  />
                  <div className="review-product-details">
                    <h4>{selectedProduct.product.productName}</h4>
                    <p>Order #{selectedOrder.orderNumber}</p>
                  </div>
                </div>

                <div className="review-rating">
                  <label>Rating</label>
                  <div className="stars-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={32}
                        className={`star ${star <= reviewRating ? 'filled' : ''}`}
                        onClick={() => setReviewRating(star)}
                        fill={star <= reviewRating ? '#ffc107' : 'none'}
                      />
                    ))}
                  </div>
                </div>

                <div className="review-comment">
                  <label>Your Review</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={4}
                  />
                </div>

                <div className="review-images">
                  <label>Add Photos (Optional)</label>
                  <div className="image-upload-container">
                    <label htmlFor="review-images" className="image-upload-label">
                      <Camera size={20} />
                      Select Images
                    </label>
                    <input
                      id="review-images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="image-upload-input"
                    />
                  </div>
                  <div className="image-preview-container">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="image-preview">
                        <img src={preview} alt={`Preview ${index}`} />
                        <button onClick={() => removeImage(index)} className="remove-image-btn">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {/* SINHND-REVIEW: Sửa lỗi TypeScript bằng cách sử dụng optional chaining */}
                    {existingReview?.reviewImages?.map((image) => (
                      <div key={image.id} className="image-preview existing">
                        <img src={image.imageUrl} alt={`Existing review ${image.id}`} />
                        <span className="existing-badge">Existing</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="review-actions">
                  {existingReview && (
                    <button
                      onClick={handleDeleteReview}
                      className="action-btn-compact btn-danger"
                    >
                      <Trash2 size={14} />
                      Delete Review
                    </button>
                  )}
                  <button
                    onClick={closeReviewModal}
                    className="action-btn-compact btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview || reviewComment.trim() === ''}
                    className="action-btn-compact btn-primary"
                  >
                    {isSubmittingReview ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
                  </button>
                </div>
              </div>
            </div>
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
                      <span className="info-value">{selectedOrder.deliveryNotes || 'No notes'}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items-section">
                  <h3 className="section-title">Items ({selectedOrder.orderItems.length})</h3>
                  <div className="items-compact">
                    {selectedOrder.orderItems.map(item => (
                      <div key={item.id} className="item-compact">
                        {renderProductImage(item.product, "item-img")}
                        <div className="item-details-compact">
                          <h4 className="item-title">{item.product.productName}</h4>
                          <p className="item-qty">{formatCurrency(item.unitPrice)} × {item.quantity}</p>
                          {/* SINHND-REVIEW: Thêm nút review trong chi tiết đơn hàng */}
                          {selectedOrder.orderStatus.toLowerCase() === 'delivered' &&
                           selectedOrder.paymentStatus.toLowerCase() === 'paid' && (
                            <button
                              onClick={() => handleOpenReview(selectedOrder, item)}
                              className="review-btn-small"
                            >
                              <Star size={14} />
                              {/* SINHND-REVIEW: Sửa lỗi TypeScript bằng cách sử dụng optional chaining */}
                              {selectedOrder.reviewableProducts?.find(p => p.productId === item.productId)?.hasBeenReviewed
                                ? 'Update Review' : 'Write Review'}
                            </button>
                          )}
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
