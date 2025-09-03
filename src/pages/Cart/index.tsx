  import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { cartApi } from '../../api/cart.api';
import { couponApi } from '../../api/coupon.api';
import { CartItem as ApiCartItem } from '../../@type/cart';
import './CartPage.css';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<ApiCartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    discountType: 'percentage' | 'fixed';
  } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Fetch cart data from API
  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartApi.getCart();
      
      if (response.success && response.data) {
        setCartItems(response.data);
      } else {
        setError(response.message || 'Failed to fetch cart data');
        toast.error(response.message || 'Failed to fetch cart data');
      }
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart. Please try again.');
      toast.error('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const response = await cartApi.updateCartItem(itemId, newQuantity);
      if (response.success) {
        setCartItems(response.data);
        toast.success('Cart updated successfully');
      } else {
        toast.error(response.message || 'Failed to update cart');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update cart. Please try again.');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const response = await cartApi.removeFromCart(itemId);
      if (response.success) {
        setCartItems(response.data);
        toast.success('Item removed from cart');
      } else {
        toast.error(response.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  const clearCart = async () => {
    try {
      // Since there's no clear cart endpoint, remove items one by one
      for (const item of cartItems) {
        await cartApi.removeFromCart(item.id);
      }
      setCartItems([]);
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart. Please try again.');
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (subtotal <= 0) {
      toast.error('Your cart is empty');
      return;
    }

    setApplyingCoupon(true);
    try {
      const response = await couponApi.applyCoupon({
        couponCode: couponCode.trim(),
        orderAmount: subtotal
      });

      if (response.success) {
        setAppliedCoupon({
          code: response.data.couponCode,
          discountAmount: response.data.discountAmount,
          discountType: response.data.discountType
        });
        setCouponCode('');
        toast.success(`Coupon "${response.data.couponCode}" applied successfully!`);
      } else {
        toast.error(response.message || 'Failed to apply coupon');
      }
    } catch (error: any) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon. Please try again.');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = subtotal > 0 ? 35 : 0;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = subtotal + shipping - discount;

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cartPage">
        <div className="pageHeader">
          <h1 className="pageTitle">Shopping Cart</h1>
          <div className="breadcrumb">
            <Link to="/" className="breadcrumbLink">Home</Link>
            <span className="breadcrumbSeparator">/</span>
            <span className="breadcrumbCurrent">Cart</span>
          </div>
        </div>
        <main className="cartContent">
          <div className="error-container">
            <div className="error-message">
              <h2>Error Loading Cart</h2>
              <p>{error}</p>
              <button 
                className="retry-btn"
                onClick={fetchCartData}
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="cartPage">
      {/* Page Header */}
      <div className="pageHeader">
        <h1 className="pageTitle">Shopping Cart</h1>
        <div className="breadcrumb">
          <Link to="/" className="breadcrumbLink">Home</Link>
          <span className="breadcrumbSeparator">/</span>
          <span className="breadcrumbCurrent">Cart</span>
        </div>
      </div>

      <main className="cartContent">
        <div className="cartContainer">
          {/* Left Side - Cart Items */}
          <div className="cartItems">
            {cartItems.length === 0 ? (
              <div className="emptyCart">
                <div className="emptyCartIcon">🛒</div>
                <h2 className="emptyCartTitle">Your cart is empty</h2>
                <p className="emptyCartText">
                  Looks like you haven't added any items to your cart yet.
                </p>
                <Link to="/shop" className="continueShoppingBtn">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="cartHeader">
                  <h2 className="cartTitle">Cart Items</h2>
                  <button 
                    className="clearCartBtn"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
                
                <div className="cartList">
                  {cartItems.map(item => (
                    <div key={item.id} className="cartItem">
                      {/* Product Image */}
                      <div className="itemImage">
                        {item.product.photos && item.product.photos.length > 0 ? (
                          <img 
                            src={item.product.photos[0]} 
                            alt={item.product.productName}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const nextEl = e.currentTarget.nextElementSibling as HTMLElement;
                              if (nextEl) nextEl.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <div className="noImagePlaceholder">
                            <FaImage />
                            <span>No Image</span>
                          </div>
                        )}
                        {item.product.photos && item.product.photos.length > 0 && (
                          <div className="noImagePlaceholder" style={{ display: 'none' }}>
                            <FaImage />
                            <span>No Image</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Product Details */}
                      <div className="itemDetails">
                        <h3 className="itemName">{item.product.productName}</h3>
                        <div className="itemMeta">
                          <p className="itemAuthor">
                            <span className="label">Author:</span> {item.product.author || 'Unknown'}
                          </p>
                          <p className="itemCategory">
                            <span className="label">Category:</span> {item.product.category?.categoryName || 'General'}
                          </p>
                        </div>
                        <div className="itemPrice">
                          <span className="priceLabel">Unit Price:</span>
                          <span className="priceValue">{item.unitPrice.toLocaleString('vi-VN')} VND</span>
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="itemQuantity">
                        <div className="quantityLabel">Quantity</div>
                        <div className="quantityControls">
                          <button 
                            className="quantityBtn decrease"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus />
                          </button>
                          <span className="quantityValue">{item.quantity}</span>
                          <button 
                            className="quantityBtn increase"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                      
                      {/* Subtotal */}
                      <div className="itemSubtotal">
                        <div className="subtotalLabel">Subtotal</div>
                        <div className="subtotalValue">{item.totalPrice.toLocaleString('vi-VN')} VND</div>
                      </div>
                      
                      {/* Remove Button */}
                      <div className="itemActions">
                        <button 
                          className="removeItemBtn"
                          onClick={() => removeItem(item.id)}
                          title="Remove from cart"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="cartActions">
                  <div className="couponSection">
                    {appliedCoupon ? (
                      <div className="appliedCoupon">
                        <div className="couponInfo">
                          <span className="couponCode">🎫 {appliedCoupon.code}</span>
                          <span className="couponDiscount">
                            -{appliedCoupon.discountAmount.toLocaleString('vi-VN')} VND
                          </span>
                        </div>
                        <button 
                          className="removeCouponBtn"
                          onClick={removeCoupon}
                          title="Remove coupon"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="couponInput"
                          disabled={applyingCoupon}
                        />
                        <button 
                          className="applyCouponBtn"
                          onClick={applyCoupon}
                          disabled={applyingCoupon}
                        >
                          {applyingCoupon ? 'APPLYING...' : 'APPLY COUPON'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Side - Cart Totals */}
          {cartItems.length > 0 && (
            <div className="cartTotals">
              <h2 className="totalsTitle">Cart totals</h2>
              <div className="totalsContent">
                <div className="totalRow">
                  <span className="totalLabel">Subtotal</span>
                  <span className="totalValue">{subtotal.toLocaleString('vi-VN')} VND</span>
                </div>
                <div className="totalRow">
                  <span className="totalLabel">Shipping</span>
                  <span className="totalValue">{shipping.toLocaleString('vi-VN')} VND</span>
                </div>
                {appliedCoupon && (
                  <div className="totalRow discount">
                    <span className="totalLabel">Discount ({appliedCoupon.code})</span>
                    <span className="totalValue discount">-{discount.toLocaleString('vi-VN')} VND</span>
                  </div>
                )}
                <div className="totalRow final">
                  <span className="totalLabel">Cart totals</span>
                  <span className="totalValue">{total.toLocaleString('vi-VN')} VND</span>
                </div>
              </div>
              <button 
                className="checkoutBtn"
                onClick={proceedToCheckout}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CartPage;
