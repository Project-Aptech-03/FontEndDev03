import React, { useState, useEffect } from 'react';
import { customerAddressApi } from '../../api/customerAddress.api';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaImage, FaShoppingBag, FaMapMarkerAlt, FaTag, FaCheck, FaPhone, FaEdit, FaStickyNote, FaHome, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { cartApi } from '../../api/cart.api';
import { couponApi } from '../../api/coupon.api';
import { getNextOrderCode } from '../../api/orders.api';
import { CartItem as ApiCartItem } from '../../@type/cart';
import { AppliedCoupon } from '../../@type/Orders';
import { CustomerAddress } from '../../@type/customerAddress';
import AddAddressForm from './AddAddressForm';
import './CartPage.css';
import './CartPage.css';
import {message} from "antd";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<ApiCartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [orderNote, setOrderNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  // Fetch cart data from API
  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.getCart();

      if (response.success && response.data) {
        setCartItems(response.data);
        // Auto-select all items when cart loads
        setSelectedItems(response.data.map(item => item.id));
      } else {
        setError(response.message || 'Failed to fetch cart data');
        toast.error(response.message || 'Failed to fetch cart data');
      }
    } catch (error: any) {
      setError('Failed to load cart. Please try again.');
      toast.error('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await customerAddressApi.getAddresses();
      if (res.success && res.data) {
        // Filter only active addresses
        const activeAddresses = res.data.filter((addr: CustomerAddress) => addr.isActive);
        const addressesWithIndex = activeAddresses.map((addr: CustomerAddress, idx: number) => ({ ...addr, _idx: idx }));
        setAddresses(addressesWithIndex);
        if (addressesWithIndex.length > 0) {
          const defaultAddr = addressesWithIndex.find((a: CustomerAddress) => a.isDefault);
          setSelectedAddressId(defaultAddr ? defaultAddr._idx! : addressesWithIndex[0]._idx!);
        }
      }
    } catch (err) {
      toast.error('Không lấy được địa chỉ');
    }
  };

  const deleteAddress = async (addressId: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
      return;
    }

    try {
      const address = addresses.find(addr => addr._idx === addressId);
      if (!address) return;

      // Use the actual ID from the address object
      const res = await customerAddressApi.deleteAddress(address.id);
      if (res.success) {
        toast.success('Đã xóa địa chỉ thành công');
        // If deleted address was selected, reset selection
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
        // Refresh addresses list
        fetchAddresses();
      } else {
        toast.error(res.message || 'Không thể xóa địa chỉ');
      }
    } catch (error) {
      toast.error('Không thể xóa địa chỉ. Vui lòng thử lại.');
    }
  };

  const editAddress = (addressId: number) => {
    const address = addresses.find(addr => addr._idx === addressId);
    if (address) {
      setEditingAddress(address);
      setShowAddAddress(true);
    }
  };

  const setDefaultAddress = async (addressId: number) => {
    try {
      const address = addresses.find(addr => addr._idx === addressId);
      if (!address) return;

      const res = await customerAddressApi.setDefaultAddress(address.id);
      if (res.success) {
        toast.success('Đã đặt làm địa chỉ mặc định');
        fetchAddresses();
      } else {
        toast.error(res.message || 'Không thể đặt làm địa chỉ mặc định');
      }
    } catch (error) {
      toast.error('Không thể đặt làm địa chỉ mặc định. Vui lòng thử lại.');
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    // Find the cart item to check stock
    const cartItem = cartItems.find(item => item.id === itemId);
    if (!cartItem) return;

    // Check stock quantity
    const stockQuantity = cartItem.product?.stockQuantity || 0;

    // If trying to increase quantity beyond stock
    if (newQuantity > stockQuantity) {
      toast.error(`Vượt quá số lượng trong kho (còn lại: ${stockQuantity})`);
      return;
    }

    // If stock is 0, ask if user wants to remove item
    if (stockQuantity === 0) {
      const confirmRemove = window.confirm(
        'Sản phẩm này đã hết hàng. Bạn có muốn xóa khỏi giỏ hàng không?'
      );
      if (confirmRemove) {
        await removeItem(itemId);
      }
      return;
    }

    // Store original values for rollback
    const originalQuantity = cartItem.quantity;
    const originalTotalPrice = cartItem.totalPrice;

    // Calculate new total price
    const newTotalPrice = newQuantity * cartItem.unitPrice;

    // OPTIMISTIC UPDATE: Update UI immediately
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, totalPrice: newTotalPrice }
          : item
      )
    );

    setUpdatingItems(prev => new Set(prev).add(itemId));

    try {
      const response = await cartApi.updateCartItem(itemId, newQuantity);

      if (response.success) {
        // Success: UI already updated, just show success message
        toast.success('Đã cập nhật số lượng');

        // Optionally sync with server data if needed
        const serverItem = response.data;
        if (serverItem.quantity !== newQuantity || serverItem.totalPrice !== newTotalPrice) {
          // Server returned different values, update with server data
          setCartItems(prevItems =>
            prevItems.map(item =>
              item.id === itemId
                ? { ...item, quantity: serverItem.quantity, totalPrice: serverItem.totalPrice }
                : item
            )
          );
        }
      } else {
        // ROLLBACK: Revert to original values
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId
              ? { ...item, quantity: originalQuantity, totalPrice: originalTotalPrice }
              : item
          )
        );
        toast.error(response.message || 'Không thể cập nhật giỏ hàng');
      }
    } catch (error) {
      // ROLLBACK: Revert to original values
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: originalQuantity, totalPrice: originalTotalPrice }
            : item
        )
      );
      toast.error('Không thể cập nhật giỏ hàng. Vui lòng thử lại.');
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const removeItem = async (itemId: number) => {
    if (!message.error('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      return;
    }

    // Store original data for rollback
    const originalItem = cartItems.find(item => item.id === itemId);
    const wasSelected = selectedItems.includes(itemId);

    if (!originalItem) return;

    // OPTIMISTIC UPDATE: Remove immediately from UI
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));

    try {
      const response = await cartApi.removeFromCart(itemId);
      if (response.success) {
        // Success: Item already removed from UI, just show success message
        message.success('Đã xóa sản phẩm khỏi giỏ hàng');
      } else {
        // ROLLBACK: Add item back to original position
        setCartItems(prevItems => {
          const newItems = [...prevItems];
          // Try to maintain original order by finding the right index
          const originalIndex = cartItems.findIndex(item => item.id === itemId);
          newItems.splice(originalIndex, 0, originalItem);
          return newItems;
        });
        if (wasSelected) {
          setSelectedItems(prev => [...prev, itemId]);
        }
        message.error(response.message || 'Không thể xóa sản phẩm');
      }
    } catch (error) {
      // ROLLBACK: Add item back to original position
      setCartItems(prevItems => {
        const newItems = [...prevItems];
        const originalIndex = cartItems.findIndex(item => item.id === itemId);
        newItems.splice(originalIndex, 0, originalItem);
        return newItems;
      });
      if (wasSelected) {
        setSelectedItems(prev => [...prev, itemId]);
      }
      message.error('Không thể xóa sản phẩm. Vui lòng thử lại.');
    }
  };

  const clearCart = async () => {
    if (!message.error('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      return;
    }

    const originalCartItems = [...cartItems];
    const originalSelectedItems = [...selectedItems];
    setCartItems([]);
    setSelectedItems([]);

    try {
      const response = await cartApi.clearCart();
      if (response.success) {
        // Success: Cart already cleared from UI, just show success message
        message.success('Đã xóa toàn bộ giỏ hàng');
      } else {
        // ROLLBACK: Restore original cart data
        setCartItems(originalCartItems);
        setSelectedItems(originalSelectedItems);
        message.error(response.message || 'Không thể xóa giỏ hàng');
      }
    } catch (error) {
      // ROLLBACK: Restore original cart data
      setCartItems(originalCartItems);
      setSelectedItems(originalSelectedItems);
      message.error('Không thể xóa giỏ hàng. Vui lòng thử lại.');
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Vui lòng nhập mã giảm giá');
      toast.error('Vui lòng nhập mã giảm giá');
      return;
    }

    if (selectedSubtotal <= 0) {
      setCouponError('Vui lòng chọn sản phẩm trước khi áp dụng mã');
      toast.error('Giỏ hàng của bạn đang trống');
      return;
    }

    setApplyingCoupon(true);
    setCouponError(null); // Clear previous errors
    
    try {
      const response = await couponApi.applyCoupon({
        couponCode: couponCode.trim(),
        orderAmount: selectedSubtotal
      });

      if (response.success) {
        setAppliedCoupon({
          code: response.data.couponCode,
          discountAmount: response.data.discountAmount,
          discountType: response.data.discountType
        });
        setCouponCode('');
        setCouponError(null);
        toast.success(`Đã áp dụng mã "${response.data.couponCode}" thành công! Tiết kiệm ${response.data.discountAmount.toLocaleString('vi-VN')} ₫`);
      } else {
        // Handle specific error messages
        const errorMessage = getSpecificErrorMessage(response.message, couponCode.trim());
        setCouponError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      let errorMessage = '';
      
      // Handle network/server errors
      if (error.response?.status === 404) {
        errorMessage = `❌ Mã "${couponCode.trim()}" không tồn tại hoặc đã bị xóa`;
      } else if (error.response?.status === 400) {
        errorMessage = getSpecificErrorMessage(error.response?.data?.message, couponCode.trim());
      } else if (error.response?.status >= 500) {
        errorMessage = '⚠️ Lỗi server. Vui lòng thử lại sau';
      } else {
        errorMessage = '❌ Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng';
      }
      
      setCouponError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Function to get specific error message based on server response
  const getSpecificErrorMessage = (serverMessage: string | undefined, code: string) => {
    if (!serverMessage) return `❌ Mã "${code}" không hợp lệ`;

    const message = serverMessage.toLowerCase();
    
    // Check for specific error patterns
    if (message.includes('expired') || message.includes('hết hạn')) {
      return `⏰ Mã "${code}" đã hết hạn sử dụng`;
    }
    
    if (message.includes('used up') || message.includes('hết lượt') || message.includes('quantity')) {
      return `📊 Mã "${code}" đã hết lượt sử dụng`;
    }
    
    if (message.includes('not found') || message.includes('không tìm thấy')) {
      return `❌ Mã "${code}" không tồn tại`;
    }
    
    if (message.includes('inactive') || message.includes('disabled') || message.includes('không hoạt động')) {
      return `🚫 Mã "${code}" đã bị vô hiệu hóa`;
    }
    
    if (message.includes('minimum') || message.includes('tối thiểu')) {
      return `💰 Đơn hàng chưa đạt giá trị tối thiểu để sử dụng mã "${code}"`;
    }
    
    if (message.includes('already used') || message.includes('đã sử dụng')) {
      return `🔄 Bạn đã sử dụng mã "${code}" rồi`;
    }
    
    // Default error message with server message
    return `❌ ${serverMessage}`;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Đã xóa mã giảm giá');
  };

  const proceedToCheckout = async () => {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn sản phẩm để mua');
      return;
    }
    
    if (!selectedAddressId && selectedAddressId !== 0 && addresses.length > 0) {
      toast.error('Vui lòng chọn địa chỉ nhận hàng');
      return;
    }
    const selectedProducts = cartItems.filter(item => selectedItems.includes(item.id));

    const outOfStockItems = selectedProducts.filter(item =>
      (item.product?.stockQuantity || 0) === 0
    );

    const insufficientStockItems = selectedProducts.filter(item =>
      item.quantity > (item.product?.stockQuantity || 0)
    );

    if (outOfStockItems.length > 0) {
      const itemNames = outOfStockItems.map(item => item.product?.productName).join(', ');
      toast.error(`Các sản phẩm sau đã hết hàng: ${itemNames}`);
      return;
    }

    if (insufficientStockItems.length > 0) {
      const itemNames = insufficientStockItems.map(item =>
        `${item.product?.productName} (còn ${item.product?.stockQuantity})`
      ).join(', ');
      toast.error(`Số lượng vượt quá tồn kho: ${itemNames}`);
      return;
    }

    try {
      // Get next order code from API
      const orderCodeResponse = await getNextOrderCode();
      
      if (!orderCodeResponse.success || !orderCodeResponse.result?.data) {
        toast.error('Không thể tạo mã đơn hàng. Vui lòng thử lại.');
        return;
      }

      const orderCode = orderCodeResponse.result.data;
      const address = addresses.find(a => a._idx === selectedAddressId);

      // Tính toán lại thông tin cho những sản phẩm đã chọn
      const checkoutData = {
        orderCode: orderCode,                         // Mã đơn hàng từ API
        products: selectedProducts,                    // Chỉ sản phẩm đã tích chọn
        address: address,                             // Địa chỉ đã chọn
        coupon: appliedCoupon,                        // Mã giảm giá (nếu có)
        orderNote: orderNote.trim(),                  // Ghi chú đơn hàng
        subtotal: selectedSubtotal,                   // Tổng tiền sản phẩm đã chọn
        shipping: getShippingFee(),                   // Phí vận chuyển
        discount: appliedCoupon ? appliedCoupon.discountAmount : 0,  // Số tiền giảm
        total: selectedSubtotal + getShippingFee() - (appliedCoupon ? appliedCoupon.discountAmount : 0)  // Tổng cuối
      };

      navigate('/checkout', {
        state: checkoutData
      });
      
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      toast.error('Không thể chuyển đến trang thanh toán. Vui lòng thử lại.');
    }
  };

  // Calculate totals for selected items only
  const selectedSubtotal = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.totalPrice, 0);

  const totalSubtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  // Get shipping fee from selected address
  const getShippingFee = () => {
    if (selectedSubtotal <= 0) return 0;
    if (selectedAddressId === null || addresses.length === 0) return 35000; // Default shipping fee

    const selectedAddress = addresses.find(addr => addr._idx === selectedAddressId);
    return selectedAddress?.shippingFee ?? 35000; // Use nullish coalescing for safer fallback
  };

  const shipping = getShippingFee();
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = selectedSubtotal + shipping - discount;

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h3>Đang tải giỏ hàng...</h3>
          <p>Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cartPage">
        <div className="error-page">
          <div className="error-content">
            <div className="error-icon">
              <FaShoppingBag />
            </div>
            <h2>Không thể tải giỏ hàng</h2>
            <p>{error}</p>
            <button className="retry-button" onClick={fetchCartData}>
              <FaShoppingBag />
              Thử lại
            </button>
            <Link to="/shop" className="back-to-shop">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cartPage">
      {/* Header */}
      <div className="cart-header">
        <div className="container">
          <div className="header-content">
            <div className="title-section">
              <h1 className="page-title">
                <FaShoppingBag className="title-icon" />
                Giỏ hàng của bạn
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-content">
                <div className="empty-icon">
                  <FaShoppingBag />
                </div>
                <h2>Giỏ hàng trống</h2>
                <p>Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
                <div className="empty-actions">
                  <Link to="/shop" className="shop-now-btn">
                    <FaShoppingBag />
                    Mua sắm ngay
                  </Link>
                  <Link to="/categories" className="browse-categories-btn">
                    Xem danh mục
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Main Content */}
              <div className="cart-main">
                {/* Left Column - Cart Items & Address */}
                <div className="cart-left-column">
                  {/* Cart Items */}
                  <div className="cart-items-section">
                    <div className="section-header">
                      <h3>Sản phẩm ({cartItems.length})</h3>
                      <div className="header-actions">
                        <button
                          className={`select-all-btn ${selectedItems.length === cartItems.length ? 'active' : ''}`}
                          onClick={() => {
                            if (selectedItems.length === cartItems.length) {
                              setSelectedItems([]);
                            } else {
                              setSelectedItems(cartItems.map(item => item.id));
                            }
                          }}
                        >
                          <FaCheck />
                          {selectedItems.length === cartItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </button>
                        <button className="clear-cart-btn" onClick={clearCart}>
                          <FaTrash />
                          Xóa tất cả
                        </button>
                      </div>
                    </div>

                    <div className="cart-items-list">
                      {cartItems.map(item => {
                        const stockQuantity = item.product?.stockQuantity || 0;
                        const isOutOfStock = stockQuantity === 0;
                        const isLowStock = stockQuantity > 0 && stockQuantity <= 10;

                        return (
                          <div key={item.id} className={`cart-item ${selectedItems.includes(item.id) ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''} ${isLowStock ? 'low-stock' : ''}`}>
                            <div className="item-checkbox">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setSelectedItems([...selectedItems, item.id]);
                                  } else {
                                    setSelectedItems(selectedItems.filter(id => id !== item.id));
                                  }
                                }}
                              />
                            </div>

                            <div className="item-image">
                              {item.product?.photos && item.product.photos.length > 0 ? (
                                <img
                                  src={item.product.photos[0].photoUrl || item.product.photos[0]}
                                  alt={item.product.productName}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.nextElementSibling!.setAttribute('style', 'display: flex');
                                  }}
                                />
                              ) : null}
                              <div className="no-image" style={{ display: item.product?.photos && item.product.photos.length > 0 ? 'none' : 'flex' }}>
                                <FaImage />
                              </div>
                            </div>

                            <div className="item-info">
                              <h4 className="item-name">{item.product?.productName || 'Sản phẩm không xác định'}</h4>
                              <div className="item-meta">
                                {item.product?.author && (
                                  <span className="meta-item">
                                    <strong>Tác giả:</strong> {item.product.author}
                                  </span>
                                )}
                                {item.product?.category?.categoryName && (
                                  <span className="meta-item">
                                    <strong>Thể loại:</strong> {item.product.category.categoryName}
                                  </span>
                                )}
                              </div>
                              <div className="item-price">
                                <span className="price-label">Đơn giá:</span>
                                <span className="price-value">
                                  {item.product?.price?.toLocaleString('vi-VN')} ₫
                                </span>
                              </div>
                            </div>

                            <div className="item-controls">
                              <div className="quantity-controls">
                                <button
                                  className="qty-btn decrease"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                                >
                                  <FaMinus />
                                </button>
                                <span className="quantity">
                                  {updatingItems.has(item.id) ? '...' : item.quantity}
                                </span>
                                <button
                                  className="qty-btn increase"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  disabled={
                                    updatingItems.has(item.id) ||
                                    item.quantity >= (item.product?.stockQuantity || 0) ||
                                    (item.product?.stockQuantity || 0) === 0
                                  }
                                  title={
                                    item.quantity >= (item.product?.stockQuantity || 0)
                                      ? `Đã đạt giới hạn tồn kho (${item.product?.stockQuantity})`
                                      : 'Tăng số lượng'
                                  }
                                >
                                  <FaPlus />
                                </button>
                              </div>

                              {/* Stock Info */}
                              <div className="stock-info">
                                <span className={`stock-status ${(item.product?.stockQuantity || 0) <= 10 ? 'low-stock' : 'in-stock'}`}>
                                  {(item.product?.stockQuantity || 0) === 0
                                    ? 'Hết hàng'
                                    : `Còn ${item.product?.stockQuantity} sản phẩm`
                                  }
                                </span>
                              </div>

                              <div className="item-total">
                                <span className="total-label">Tổng:</span>
                                <span className="total-value">
                                  {item.totalPrice?.toLocaleString('vi-VN')} ₫
                                </span>
                              </div>

                              <button
                                className="remove-btn"
                                onClick={() => removeItem(item.id)}
                                title="Xóa sản phẩm"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Address Selection */}
                  <div className="address-section">
                    <div className="section-header">
                      <h3>
                        <FaMapMarkerAlt />
                        Địa chỉ giao hàng
                      </h3>
                      <button
                        className="add-address-btn primary"
                        onClick={() => setShowAddAddress(true)}
                      >
                        <FaMapMarkerAlt />
                        Thêm địa chỉ mới
                      </button>
                    </div>
                    <div className="address-content">
                      {addresses.length === 0 ? (
                        <div className="no-address">
                          <div className="no-address-content">
                            <FaMapMarkerAlt className="no-address-icon" />
                            <h4>Chưa có địa chỉ giao hàng</h4>
                            <p>Thêm địa chỉ để tiếp tục đặt hàng</p>
                            <button
                              className="add-address-btn primary"
                              onClick={() => setShowAddAddress(true)}
                            >
                              <FaMapMarkerAlt />
                              Thêm địa chỉ mới
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="address-selector">
                          <div className="address-dropdown-container">
                            <div className="address-dropdown">
                              <select
                                value={selectedAddressId ?? ''}
                                onChange={e => setSelectedAddressId(Number(e.target.value))}
                                className="address-select"
                              >
                                <option value="">-- Chọn địa chỉ giao hàng --</option>
                                {addresses.map(addr => (
                                  <option key={addr._idx} value={addr._idx}>
                                    {addr.addressName} - {addr.fullAddress}
                                    {addr.isDefault ? ' (Mặc định)' : ''}
                                    {addr.displayShippingFee ? ` - ${addr.displayShippingFee}` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {selectedAddressId !== null && addresses.find(addr => addr._idx === selectedAddressId) && (
                              <div className="selected-address-preview">
                                <div className="address-card selected">
                                  <div className="address-info">
                                    <div className="address-header">
                                      <h4>
                                        {addresses.find(addr => addr._idx === selectedAddressId)?.addressName}
                                        {addresses.find(addr => addr._idx === selectedAddressId)?.isDefault && (
                                          <span className="default-badge">Mặc định</span>
                                        )}
                                      </h4>
                                    </div>
                                    <p>{addresses.find(addr => addr._idx === selectedAddressId)?.fullAddress}</p>
                                    <div className="address-details">
                                      <span className="user-info">
                                        <FaUser className="user-icon" />
                                        {addresses.find(addr => addr._idx === selectedAddressId)?.fullName}
                                      </span>
                                      <span className="phone">
                                        <FaPhone className="phone-icon" />
                                        {addresses.find(addr => addr._idx === selectedAddressId)?.phoneNumber}
                                      </span>
                                    </div>
                                    <div className="address-extra-info">
                                      {addresses.find(addr => addr._idx === selectedAddressId)?.displayDistance && (
                                        <div className="distance-info">
                                          <FaMapMarkerAlt className="distance-icon" />
                                          <span>{addresses.find(addr => addr._idx === selectedAddressId)?.displayDistance}</span>
                                        </div>
                                      )}
                                      {addresses.find(addr => addr._idx === selectedAddressId)?.displayShippingFee && (
                                        <div className="shipping-info">
                                          <FaShoppingBag className="shipping-icon" />
                                          <span>Phí vận chuyển: {addresses.find(addr => addr._idx === selectedAddressId)?.displayShippingFee}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="address-actions-buttons">
                                    {!addresses.find(addr => addr._idx === selectedAddressId)?.isDefault && (
                                      <button
                                        className="address-action-btn default-btn"
                                        onClick={() => setDefaultAddress(selectedAddressId)}
                                        title="Đặt làm địa chỉ mặc định"
                                      >
                                        <FaHome />
                                      </button>
                                    )}
                                    <button
                                      className="address-action-btn edit-btn"
                                      onClick={() => editAddress(selectedAddressId)}
                                      title="Chỉnh sửa địa chỉ"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button
                                      className="address-action-btn delete-btn"
                                      onClick={() => deleteAddress(selectedAddressId)}
                                      title="Xóa địa chỉ"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Cart Summary */}
                <div className="cart-summary-section">
                  <div className="summary-card">
                    <h3 className="summary-title">Tổng kết đơn hàng</h3>

                    {/* Selected Items Info */}
                    {selectedItems.length > 0 && (
                      <div className="selected-info">
                        <span className="selected-count">
                          Đã chọn {selectedItems.length}/{cartItems.length} sản phẩm
                        </span>
                      </div>
                    )}

                    {/* Coupon Section */}
                    <div className="coupon-section">
                      <h4>
                        <FaTag />
                        Mã giảm giá
                        {selectedSubtotal > 0 && (
                          <span className="coupon-hint">Áp dụng để tiết kiệm thêm!</span>
                        )}
                      </h4>

                      {!appliedCoupon ? (
                        <div className="coupon-input-container">
                          <div className="coupon-input-group">
                            <input
                              type="text"
                              placeholder="Nhập mã giảm giá (VD: SAVE20, WELCOME10)"
                              value={couponCode}
                              onChange={(e) => {
                                setCouponCode(e.target.value.toUpperCase());
                                // Clear error when user starts typing
                                if (couponError) {
                                  setCouponError(null);
                                }
                              }}
                              className={`coupon-input ${couponError ? 'error' : ''}`}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && couponCode.trim() && selectedSubtotal > 0 && !applyingCoupon) {
                                  applyCoupon();
                                }
                              }}
                            />
                            <button
                              className="apply-coupon-btn"
                              onClick={applyCoupon}
                              disabled={applyingCoupon || !couponCode.trim() || selectedSubtotal <= 0}
                            >
                              {applyingCoupon ? (
                                <>
                                  <div className="spinner-mini"></div>
                                  Đang kiểm tra...
                                </>
                              ) : (
                                <>
                                  <FaTag />
                                  Áp dụng mã
                                </>
                              )}
                            </button>
                          </div>
                          
                          {/* Error message */}
                          {couponError && (
                            <div className="coupon-error">
                              <span>{couponError}</span>
                            </div>
                          )}
                          
                          {selectedSubtotal <= 0 && !couponError && (
                            <div className="coupon-warning">
                              <span>⚠️ Vui lòng chọn sản phẩm trước khi áp dụng mã giảm giá</span>
                            </div>
                          )}

                          {selectedSubtotal > 0 && !couponError && (
                            <div className="coupon-suggestions">
                              <span className="suggestions-label">💡 Gợi ý mã giảm giá:</span>
                              <div className="suggestion-tags">
                                <span 
                                  className="suggestion-tag" 
                                  onClick={() => {
                                    setCouponCode('SAVE20');
                                    setCouponError(null);
                                  }}
                                >
                                  SAVE20 (-20%)
                                </span>
                                <span 
                                  className="suggestion-tag" 
                                  onClick={() => {
                                    setCouponCode('WELCOME10');
                                    setCouponError(null);
                                  }}
                                >
                                  WELCOME10 (-10%)
                                </span>
                                <span 
                                  className="suggestion-tag" 
                                  onClick={() => {
                                    setCouponCode('FREESHIP');
                                    setCouponError(null);
                                  }}
                                >
                                  FREESHIP (Miễn phí ship)
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="applied-coupon">
                          <div className="coupon-success-card">
                            <div className="coupon-info">
                              <FaCheck className="coupon-check" />
                              <div className="coupon-details">
                                <span className="coupon-code">Mã "{appliedCoupon.code}" đã được áp dụng</span>
                                <span className="coupon-savings">
                                  Bạn tiết kiệm được {appliedCoupon.discountAmount.toLocaleString('vi-VN')} ₫
                                </span>
                              </div>
                            </div>
                            <button 
                              className="remove-coupon-btn" 
                              onClick={removeCoupon}
                              title="Xóa mã giảm giá"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Order Note Section */}
                    <div className="order-note-section">
                      <h4>
                        <FaStickyNote />
                        Ghi chú đơn hàng
                      </h4>
                      <textarea
                        className="order-note-input"
                        placeholder="Nhập ghi chú cho đơn hàng (tuỳ chọn)..."
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        rows={3}
                        maxLength={500}
                      />
                      <div className="note-char-count">
                        {orderNote.length}/500 ký tự
                      </div>
                    </div>

                    {/* Summary Details */}
                    <div className="summary-details">
                      <div className="summary-row">
                        <span>Tạm tính ({selectedItems.length} sản phẩm):</span>
                        <span>{selectedSubtotal.toLocaleString('vi-VN')} ₫</span>
                      </div>
                      <div className="summary-row">
                        <span>Phí vận chuyển:</span>
                        <span>{shipping.toLocaleString('vi-VN')} ₫</span>
                      </div>
                      {appliedCoupon && (
                        <div className="summary-row discount">
                          <span>Giảm giá {appliedCoupon.code}:</span>
                          <span>-{discount.toLocaleString('vi-VN')} ₫</span>
                        </div>
                      )}
                      <div className="summary-row total">
                        <span>Tổng thanh toán:</span>
                        <span>{total.toLocaleString('vi-VN')} ₫</span>
                      </div>
                    </div>

                    <button
                      className="checkout-btn"
                      onClick={proceedToCheckout}
                      disabled={
                        selectedItems.length === 0 ||
                        (addresses.length > 0 && selectedAddressId === null)
                      }
                      title={
                        selectedItems.length === 0 
                          ? 'Vui lòng chọn sản phẩm để thanh toán'
                          : `Thanh toán ${selectedItems.length} sản phẩm đã chọn`
                      }
                    >
                      <FaShoppingBag />
                      {selectedItems.length > 0 
                        ? `Thanh toán (${selectedItems.length} sản phẩm)`
                        : 'Tiến hành thanh toán'
                      }
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      {showAddAddress && (
        <AddAddressForm
          editingAddress={editingAddress}
          onSuccess={() => {
            setShowAddAddress(false);
            setEditingAddress(null);
            fetchAddresses();
          }}
          onClose={() => {
            setShowAddAddress(false);
            setEditingAddress(null);
          }}
        />
      )}
    </div>
  );
};

export default CartPage;