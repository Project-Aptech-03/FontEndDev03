import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUser, FaMapMarkerAlt, FaPhone, FaMoneyBillWave, FaImage, FaUniversity } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { checkoutOrder } from '../../api/orders.api';
import { CartProduct, CheckoutAddress, AppliedCoupon, CheckoutData } from '../../@type/Orders';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const checkoutData = location.state as CheckoutData;

  const [paymentMethod, setPaymentMethod] = useState('bankTransfer');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    // Redirect if no checkout data
    if (!checkoutData || !checkoutData.products || checkoutData.products.length === 0) {
      navigate('/cart');
      return;
    }
  }, [checkoutData, navigate]);

  const validateForm = () => {
    if (!checkoutData?.address) {
      alert('No address information. Please return to the cart.');
      return false;
    }

    // Bank transfer and COD don't need additional validation
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    if (isPlacingOrder) return; // Prevent double clicking

    setIsPlacingOrder(true);

    // Test toast first
    console.log('Starting order process...');
    
    try {
      // Map payment method to API format
      const paymentType = paymentMethod === 'bankTransfer' ? 'BankTransfer' : 
                         paymentMethod === 'cashOnDelivery' ? 'COD' : 'COD';

      // Prepare checkout data
      const checkoutRequest = {
        deliveryAddressId: checkoutData.address.id || checkoutData.address._idx,
        paymentType: paymentType,
        deliveryCharges: checkoutData.shipping,
        deliveryNotes: checkoutData.orderNote || '',
        couponCodes: checkoutData.coupon ? [checkoutData.coupon.code] : [],
        orderItems: checkoutData.products.map(item => ({
          productId: item.productId || item.product?.id || item.id,
          quantity: item.quantity
        }))
      };

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 35000);
      });

      // Race between the actual request and timeout
      const response = await Promise.race([
        checkoutOrder(checkoutRequest),
        timeoutPromise
      ]) as any;

      console.log('Checkout response:', response);

      if (response && response.success) {
        toast.success('Order placed successfully!');
        navigate('/myorders');
      } else {
        // Handle failed response
        const errorMessage = response?.error?.message || response?.message || 'Payment failed. Please check your payment or contact the shop for support.';
        console.log('Order failed:', errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      
      // Always show error message regardless of error type
      const errorMessage = error.message === 'Request timeout' 
        ? 'Request timeout. Please check your payment or contact the shop for support.'
        : 'Payment failed. Please check your payment or contact the shop for support.';
      
      console.log('Showing error toast:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!checkoutData) {
    return (
      <div className="checkout-loading">
        <p>Redirecting...</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        {/* YOUR ORDER - Left Sidebar */}
        <div className="checkout-order-summary">
          <h2>YOUR ORDER: {checkoutData.orderCode}</h2>

          <div className="order-products">
            {checkoutData.products.map(item => (
              <div key={item.id} className="order-product-item">
                <div className="product-info">
                  <div className="item-image">
                    {item.product?.photos && item.product.photos.length > 0 ? (
                      <img
                        src={
                          typeof item.product.photos[0] === 'string'
                            ? item.product.photos[0]
                            : item.product.photos[0].photoUrl
                        }
                        alt={item.product?.productName || 'Product'}
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
                  <div className="product-details">
                    <h4>{item.product?.productName}</h4>
                    <p className="product-quantity">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="product-price">
                  {formatPrice(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary-details">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatPrice(checkoutData.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping fee:</span>
              <span>{formatPrice(checkoutData.shipping)}</span>
            </div>
            {checkoutData.coupon && (
              <div className="summary-row discount">
                <span>Discount ({checkoutData.coupon.code}):</span>
                <span>-{formatPrice(checkoutData.discount)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total:</span>
              <span>{formatPrice(checkoutData.total)}</span>
            </div>
          </div>

          {checkoutData.orderNote && (
            <div className="order-notes">
              <h4>Order notes:</h4>
              <p>{checkoutData.orderNote}</p>
            </div>
          )}
        </div>

        {/* BILLING INFORMATION - Right Section */}
        <div className="checkout-billing-section">
          <h2>BILLING INFORMATION</h2>

          <div className="billing-info-display">
            {checkoutData.address ? (
              <>
                <div className="billing-field">
                  <FaUser className="field-icon" />
                  <div className="field-content">
                    <label>Full name:</label>
                    <span>{checkoutData.address.fullName || 'No information available'}</span>
                  </div>
                </div>

                <div className="billing-field">
                  <FaPhone className="field-icon" />
                  <div className="field-content">
                    <label>Phone number:</label>
                    <span>{checkoutData.address.phoneNumber || 'No information available'}</span>
                  </div>
                </div>

                <div className="billing-field">
                  <FaMapMarkerAlt className="field-icon" />
                  <div className="field-content">
                    <label>Address:</label>
                    <span>
                      {checkoutData.address.fullAddress ||
                        checkoutData.address.displayAddress ||
                        [
                          checkoutData.address.addressLine,
                          checkoutData.address.ward,
                          checkoutData.address.district,
                          checkoutData.address.province
                        ].filter(Boolean).join(', ') ||
                        'No address information'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="no-address">
                <p>No address information. Please return to the cart to select an address.</p>
                <button
                  onClick={() => navigate('/cart')}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    background: '#4299e1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Return to cart
                </button>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="payment-section">
            <h3>Payment method</h3>

            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  id="bankTransfer"
                  name="paymentMethod"
                  value="bankTransfer"
                  checked={paymentMethod === 'bankTransfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="bankTransfer">
                  <FaUniversity className="payment-icon" />
                  Bank transfer
                </label>
              </div>

              <div className="payment-method">
                <input
                  type="radio"
                  id="cashOnDelivery"
                  name="paymentMethod"
                  value="cashOnDelivery"
                  checked={paymentMethod === 'cashOnDelivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="cashOnDelivery">
                  <FaMoneyBillWave className="payment-icon" />
                  Cash on Delivery (COD)
                </label>
              </div>
            </div>

            {/* QR Code for Bank Transfer */}
            {paymentMethod === 'bankTransfer' && (
              <div className="bank-transfer-details">
                <div className="bank-info">
                  <div className="bank-details">
                    <h4>Bank transfer details</h4>
                    <p><strong>Bank:</strong> MB Bank</p>
                    <p><strong>Account number:</strong> 0962887472</p>
                    <p><strong>Account holder:</strong> HOANG NHAT PHUC</p>
                    <p><strong>Amount:</strong> {formatPrice(checkoutData.total)}</p>
                    <p><strong>Content:</strong> Payment for order {checkoutData.orderCode}</p>
                  </div>
                  <div className="qr-code-container">
                    <h4>Scan QR code to transfer</h4>
                    <img
                      src={`https://qr.sepay.vn/img?acc=0962887472&bank=MB&amount=${checkoutData.total}&des=Thanh Order number ${checkoutData.orderCode}`}
                      alt="Bank Transfer QR Code"
                      className="qr-code"
                    />
                    <p className="qr-note">Please transfer the correct amount and content for quick order processing</p>
                  </div>
                </div>
                <div className="transfer-note">
                  <p><strong>Note:</strong> Please transfer the payment before placing your order to ensure the order is processed quickly.</p>
                </div>
              </div>
            )}
          </div>

          <button
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? 'Placing order...' : `Place Order - ${formatPrice(checkoutData.total)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
