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
import {message, Modal} from "antd";

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

  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.getCart();

      if (response.success && response.data) {
        setCartItems(response.data);
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
        const activeAddresses = res.data.filter((addr: CustomerAddress) => addr.isActive);
        const addressesWithIndex = activeAddresses.map((addr: CustomerAddress, idx: number) => ({ ...addr, _idx: idx }));
        setAddresses(addressesWithIndex);
        if (addressesWithIndex.length > 0) {
          const defaultAddr = addressesWithIndex.find((a: CustomerAddress) => a.isDefault);
          setSelectedAddressId(defaultAddr ? defaultAddr._idx! : addressesWithIndex[0]._idx!);
        }
      }
    } catch (err) {
      toast.error('Failed to fetch addresses');
    }
  };
  const deleteAddress = async (addressId: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const address = addresses.find(addr => addr._idx === addressId);
      if (!address) return;

      // Use the actual ID from the address object
      const res = await customerAddressApi.deleteAddress(address.id);
      if (res.success) {
        toast.success('Address deleted successfully');
        // If deleted address was selected, reset selection
        if (selectedAddressId === addressId) {
          setSelectedAddressId(null);
        }
        // Refresh addresses list
        fetchAddresses();
      } else {
        toast.error(res.message || 'Unable to delete address');
      }
    } catch (error) {
      toast.error('Unable to delete address. Please try again.');
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
        toast.success('Set as default address successfully');
        fetchAddresses();
      } else {
        toast.error(res.message || 'Unable to set as default address');
      }
    } catch (error) {
      toast.error('Unable to set as default address. Please try again.');
    }
  };


  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const cartItem = cartItems.find(item => item.id === itemId);
    if (!cartItem) return;
    const stockQuantity = cartItem.product?.stockQuantity || 0;

    if (newQuantity > stockQuantity) {
      toast.error(`Exceeds available stock (remaining: ${stockQuantity})`);
      return;
    }
    if (stockQuantity === 0) {
      const confirmRemove = window.confirm(
          'This product is out of stock. Do you want to remove it from the cart?'
      );
      if (confirmRemove) {
        await removeItem(cartItem.productId); // Changed to use productId
      }
      return;
    }
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
        toast.success('Quantity updated successfully');

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
        toast.error(response.message || 'Failed to update cart');
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
      toast.error('Unable to update cart. Please try again.');
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };
  const removeItem = async (productId: number) => {
    if (!message.error('Are you sure you want to remove this item from the cart?')) {
      return;
    }

    // Find the cart item by productId
    const originalItem = cartItems.find(item => item.productId === productId);
    if (!originalItem) {
      message.error('Item not found in the cart');
      return;
    }

    const itemId = originalItem.id;
    const wasSelected = selectedItems.includes(itemId);
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));

    try {
      const response = await cartApi.removeFromCart(productId);
      if (response.success) {
        message.success('Item removed from cart');
      } else {
        setCartItems(prevItems => {
          const newItems = [...prevItems];
          const originalIndex = cartItems.findIndex(item => item.productId === productId);
          newItems.splice(originalIndex >= 0 ? originalIndex : prevItems.length, 0, originalItem);
          return newItems;
        });
        if (wasSelected) {
          setSelectedItems(prev => [...prev, itemId]);
        }
        message.error(response.message || 'Failed to remove item');
      }
    } catch (error) {
      setCartItems(prevItems => {
        const newItems = [...prevItems];
        const originalIndex = cartItems.findIndex(item => item.productId === productId);
        newItems.splice(originalIndex >= 0 ? originalIndex : prevItems.length, 0, originalItem);
        return newItems;
      });
      if (wasSelected) {
        setSelectedItems(prev => [...prev, itemId]);
      }
      message.error('Unable to remove item. Please try again.');
    }
  };


  const clearCart = async () => {
    Modal.confirm({
      title: "Clear Cart",
      content: "Are you sure you want to clear the cart?",
      okText: "Yes",
      cancelText: "No",
      async onOk() {
        const originalCartItems = [...cartItems];
        const originalSelectedItems = [...selectedItems];
        setCartItems([]);
        setSelectedItems([]);

        try {
          const response = await cartApi.clearCart();
          if (response.success) {
            message.success("Cart has been cleared");
            window.dispatchEvent(new Event("cartUpdated"));
          } else {
            setCartItems(originalCartItems);
            setSelectedItems(originalSelectedItems);
            message.error(response.message || "Failed to clear the cart");
          }
        } catch (error) {
          setCartItems(originalCartItems);
          setSelectedItems(originalSelectedItems);
          message.error("Unable to clear the cart. Please try again.");
        }
      },
    });
  };


  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      toast.error('Please enter a coupon code');
      return;
    }

    if (selectedSubtotal <= 0) {
      setCouponError('Please select a product before applying the coupon');
      toast.error('Your cart is empty');
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
        toast.success(
            `Coupon "${response.data.couponCode}" applied successfully! You saved ${response.data.discountAmount.toLocaleString('en-US')} $`
        );
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
        errorMessage = `❌ Coupon "${couponCode.trim()}" does not exist or has been deleted`;
      } else if (error.response?.status === 400) {
        errorMessage = getSpecificErrorMessage(error.response?.data?.message, couponCode.trim());
      } else if (error.response?.status >= 500) {
        errorMessage = '⚠️ Server error. Please try again later';
      } else {
        errorMessage = '❌ Unable to connect to the server. Please check your network connection';
      }

      setCouponError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setApplyingCoupon(false);
    }
  };

  const getSpecificErrorMessage = (serverMessage: string | undefined, code: string) => {
    if (!serverMessage) return `❌ Coupon "${code}" is invalid`;

    const message = serverMessage.toLowerCase();

    // Check for specific error patterns
    if (message.includes('expired') || message.includes('hết hạn')) {
      return `⏰ Coupon "${code}" has expired`;
    }

    if (message.includes('used up') || message.includes('hết lượt') || message.includes('quantity')) {
      return `📊 Coupon "${code}" has been used up`;
    }

    if (message.includes('not found') || message.includes('không tìm thấy')) {
      return `❌ Coupon "${code}" does not exist`;
    }

    if (message.includes('inactive') || message.includes('disabled') || message.includes('không hoạt động')) {
      return `🚫 Coupon "${code}" has been disabled`;
    }

    if (message.includes('minimum') || message.includes('tối thiểu')) {
      return `💰 Order does not meet the minimum value to use coupon "${code}"`;
    }

    if (message.includes('already used') || message.includes('đã sử dụng')) {
      return `🔄 You have already used coupon "${code}"`;
    }

    // Default error message with server message
    return `❌ ${serverMessage}`;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon has been removed');
  };

  const proceedToCheckout = async () => {
    if (selectedItems.length === 0) {
      message.error('Please select products to purchase');
      return;
    }

    if (!selectedAddressId && selectedAddressId !== 0 && addresses.length > 0) {
      message.error('Please select a shipping address');
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
      toast.error(`The following products are out of stock: ${itemNames}`);
      return;
    }

    if (insufficientStockItems.length > 0) {
      const itemNames = insufficientStockItems.map(item =>
          `${item.product?.productName} (only ${item.product?.stockQuantity} left)`
      ).join(', ');
      toast.error(`Quantity exceeds available stock: ${itemNames}`);
      return;
    }

    try {
      // Get next order code from API
      const orderCodeResponse = await getNextOrderCode();

      if (!orderCodeResponse.success || !orderCodeResponse.result?.data) {
        message.error('Unable to generate order code. Please try again.');
        return;
      }

      const orderCode = orderCodeResponse.result.data;
      const address = addresses.find(a => a._idx === selectedAddressId);

      // Recalculate info for selected products
      const checkoutData = {
        orderCode: orderCode,
        products: selectedProducts,
        address: address,
        coupon: appliedCoupon,
        orderNote: orderNote.trim(),
        subtotal: selectedSubtotal,
        shipping: getShippingFee(),
        discount: appliedCoupon ? appliedCoupon.discountAmount : 0,
        total: selectedSubtotal + getShippingFee() - (appliedCoupon ? appliedCoupon.discountAmount : 0)
      };

      navigate('/checkout', {
        state: checkoutData
      });

    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      toast.error('Unable to proceed to checkout. Please try again.');
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
            <h3>Loading cart...</h3>
            <p>Please wait a moment</p>
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
              <h2>Unable to load cart</h2>
              <p>{error}</p>
              <button className="retry-button" onClick={fetchCartData}>
                <FaShoppingBag />
                Retry
              </button>
              <Link to="/shop" className="back-to-shop">
                Continue Shopping
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
                Your Cart
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
                    <FaShoppingBag/>
                  </div>
                  <h2>Empty Cart</h2>
                  <p>You don’t have any products in your cart yet. Explore our amazing products!</p>
                  <div className="empty-actions">
                    <Link to="/shop" className="shop-now-btn">
                      <FaShoppingBag/>
                      Shop Now
                    </Link>
                    <Link to="/categories" className="browse-categories-btn">
                      Browse Categories
                    </Link>
                  </div>
                </div>
              </div>
          ) : (
              <>
              <div className="cart-main">
                <div className="cart-left-column">
                  <div className="cart-items-section">
                    <div className="section-header">
                      <h3>Products ({cartItems.length})</h3>
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
                          <FaCheck/>
                          {selectedItems.length === cartItems.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <button className="clear-cart-btn" onClick={clearCart}>
                          <FaTrash/>
                          Clear All
                        </button>
                      </div>
                    </div>

                    <div className="cart-items-list">
                      {cartItems.map(item => {
                        const stockQuantity = item.product?.stockQuantity || 0;
                        const isOutOfStock = stockQuantity === 0;
                        const isLowStock = stockQuantity > 0 && stockQuantity <= 10;

                        return (
                            <div key={item.id}
                                 className={`cart-item ${selectedItems.includes(item.id) ? 'selected' : ''} ${isOutOfStock ? 'out-of-stock' : ''} ${isLowStock ? 'low-stock' : ''}`}>
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
                                <div className="no-image"
                                     style={{display: item.product?.photos && item.product.photos.length > 0 ? 'none' : 'flex'}}>
                                  <FaImage/>
                                </div>
                              </div>

                              <div className="item-info">
                                <h4 className="item-name">{item.product?.productName || 'Unknown Product'}</h4>
                                <div className="item-meta">
                                  {item.product?.author && (
                                      <span className="meta-item">
                                          <strong>Author:</strong> {item.product.author}
                                        </span>
                                  )}
                                  {item.product?.category?.categoryName && (
                                      <span className="meta-item">
                                          <strong>Category:</strong> {item.product.category.categoryName}
                                        </span>
                                  )}
                                </div>
                                <div className="item-price">
                                  <span className="price-label">Unit Price:</span>
                                  <span className="price-value">
                                      {item.product?.price?.toLocaleString('vi-VN')} $
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
                                    <FaMinus/>
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
                                            ? `Reached stock limit (${item.product?.stockQuantity})`
                                            : 'Increase quantity'
                                      }
                                  >
                                    <FaPlus/>
                                  </button>
                                </div>

                                {/* Stock Info */}
                                <div className="stock-info">
                                  <span
                                      className={`stock-status ${(item.product?.stockQuantity || 0) <= 10 ? 'low-stock' : 'in-stock'}`}>
                                    {(item.product?.stockQuantity || 0) === 0
                                        ? 'Out of Stock'
                                        : `Only ${item.product?.stockQuantity} left`
                                    }
                                  </span>
                                </div>
                                <div className="item-total">
                                  <span className="total-label">Total:</span>
                                  <span className="total-value">
                                    {item.totalPrice?.toLocaleString('vi-VN')}$
                                  </span>
                                </div>

                                <button
                                    className="remove-btn"
                                    onClick={() => removeItem(item.product?.id || item.productId)}
                                    title="Remove product"
                                >
                                  <FaTrash/>
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
                        <FaMapMarkerAlt/>
                        Shipping Address
                      </h3>
                      <button
                          className="add-address-btn primary"
                          onClick={() => setShowAddAddress(true)}
                      >
                        <FaMapMarkerAlt/>
                        Add New Address
                      </button>
                    </div>
                    <div className="address-content">
                      {addresses.length === 0 ? (
                          <div className="no-address">
                            <div className="no-address-content">
                              <FaMapMarkerAlt className="no-address-icon"/>
                              <h4>No Shipping Address</h4>
                              <p>Add an address to continue with your order</p>
                              <button
                                  className="add-address-btn primary"
                                  onClick={() => setShowAddAddress(true)}
                              >
                                <FaMapMarkerAlt/>
                                Add New Address
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
                                  <option value="">-- Select Shipping Address --</option>
                                  {addresses.map(addr => (
                                      <option key={addr._idx} value={addr._idx}>
                                        {addr.addressName} - {addr.fullAddress}
                                        {addr.isDefault ? ' (Default)' : ''}
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
                                                <span className="default-badge">Default</span>
                                            )}
                                          </h4>
                                        </div>
                                        <p>{addresses.find(addr => addr._idx === selectedAddressId)?.fullAddress}</p>
                                        <div className="address-details">
              <span className="user-info">
                <FaUser className="user-icon"/>
                {addresses.find(addr => addr._idx === selectedAddressId)?.fullName}
              </span>
                                          <span className="phone">
                <FaPhone className="phone-icon"/>
                                            {addresses.find(addr => addr._idx === selectedAddressId)?.phoneNumber}
              </span>
                                        </div>
                                        <div className="address-extra-info">
                                          {addresses.find(addr => addr._idx === selectedAddressId)?.displayDistance && (
                                              <div className="distance-info">
                                                <FaMapMarkerAlt className="distance-icon"/>
                                                <span>{addresses.find(addr => addr._idx === selectedAddressId)?.displayDistance}</span>
                                              </div>
                                          )}
                                          {addresses.find(addr => addr._idx === selectedAddressId)?.displayShippingFee && (
                                              <div className="shipping-info">
                                                <FaShoppingBag className="shipping-icon"/>
                                                <span>Shipping Fee: {addresses.find(addr => addr._idx === selectedAddressId)?.displayShippingFee}</span>
                                              </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="address-actions-buttons">
                                        {!addresses.find(addr => addr._idx === selectedAddressId)?.isDefault && (
                                            <button
                                                className="address-action-btn default-btn"
                                                onClick={() => setDefaultAddress(selectedAddressId)}
                                                title="Set as default address"
                                            >
                                              <FaHome/>
                                            </button>
                                        )}
                                        <button
                                            className="address-action-btn edit-btn"
                                            onClick={() => editAddress(selectedAddressId)}
                                            title="Edit address"
                                        >
                                          <FaEdit/>
                                        </button>
                                        <button
                                            className="address-action-btn delete-btn"
                                            onClick={() => deleteAddress(selectedAddressId)}
                                            title="Delete address"
                                        >
                                          <FaTrash/>
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
                    <h3 className="summary-title">Order Summary</h3>

                    {/* Selected Items Info */}
                    {selectedItems.length > 0 && (
                        <div className="selected-info">
        <span className="selected-count">
          Selected {selectedItems.length}/{cartItems.length} items
        </span>
                        </div>
                    )}

                    {/* Coupon Section */}
                    <div className="coupon-section">

                      {!appliedCoupon ? (
                          <div className="coupon-input-container">
                            <div className="coupon-input-group">
                              <input
                                  type="text"
                                  placeholder="Enter coupon code (e.g., SAVE20, WELCOME10)"
                                  value={couponCode}
                                  onChange={(e) => {
                                    setCouponCode(e.target.value.toUpperCase());
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
                                      Checking...
                                    </>
                                ) : (
                                    <>
                                      <FaTag/>
                                      Apply Coupon
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
                                  <span>⚠️ Please select products before applying a coupon</span>
                                </div>
                            )}


                          </div>
                      ) : (
                          <div className="applied-coupon">
                            <div className="coupon-success-card">
                              <div className="coupon-info">
                                <FaCheck className="coupon-check"/>
                                <div className="coupon-details">
                                  <span className="coupon-code">Coupon "{appliedCoupon.code}" applied</span>
                                  <span className="coupon-savings">
                  You saved {appliedCoupon.discountAmount.toLocaleString('vi-VN')}
                </span>
                                </div>
                              </div>
                              <button
                                  className="remove-coupon-btn"
                                  onClick={removeCoupon}
                                  title="Remove coupon"
                              >
                                <FaTrash/>
                              </button>
                            </div>
                          </div>
                      )}
                    </div>

                    {/* Order Note Section */}
                    <div className="order-note-section">
                      <h4>
                        <FaStickyNote/>
                        Order Note
                      </h4>
                      <textarea
                          className="order-note-input"
                          placeholder="Enter a note for your order (optional)..."
                          value={orderNote}
                          onChange={(e) => setOrderNote(e.target.value)}
                          rows={3}
                          maxLength={500}
                      />
                      <div className="note-char-count">
                        {orderNote.length}/500 characters
                      </div>
                    </div>

                    {/* Summary Details */}
                    <div className="summary-details">
                      <div className="summary-row">
                        <span>Subtotal ({selectedItems.length} items):</span>
                        <span>{selectedSubtotal.toLocaleString('vi-VN')} $</span>
                      </div>
                      <div className="summary-row">
                        <span>Shipping Fee:</span>
                        <span>{shipping.toLocaleString('vi-VN')} $</span>
                      </div>
                      {appliedCoupon && (
                          <div className="summary-row discount">
                            <span>Discount {appliedCoupon.code}:</span>
                            <span>-{discount.toLocaleString('vi-VN')} $</span>
                          </div>
                      )}
                      <div className="summary-row total">
                        <span>Total Payment:</span>
                        <span>{total.toLocaleString('vi-VN')} $</span>
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
                              ? 'Please select products to checkout'
                              : `Checkout ${selectedItems.length} selected items`
                        }
                    >
                      <FaShoppingBag/>
                      {selectedItems.length > 0
                          ? `Checkout (${selectedItems.length} items)`
                          : 'Proceed to Checkout'
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