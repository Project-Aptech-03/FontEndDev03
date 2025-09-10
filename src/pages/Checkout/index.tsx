import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './CheckoutPage.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface BillingDetails {
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
}

interface CardDetails {
  cardNumber: string;
  nameOnCard: string;
  expirationDate: string;
  securityCode: string;
}

const CheckoutPage = () => {
  // Default store location (example: District 1, Ho Chi Minh City)
  const storeLocation = { latitude: 10.7769, longitude: 106.7009 };

  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: 'John',
    lastName: 'Doe',
    company: '',
    country: 'Vietnam',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: 'john.doe@example.com'
  });

  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    nameOnCard: '',
    expirationDate: '',
    securityCode: ''
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Mock cart data
  const mockCartItems: CartItem[] = [
    {
      id: 1,
      name: "Porcelain Dinner Plate (27cm)",
      price: 59.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Ophelia Matte Natural Vase",
      price: 168.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Luana Bowl",
      price: 49.00,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop"
    }
  ];

  // Geocoding using OpenStreetMap Nominatim API (free)
  const getCoordinatesFromAddress = async (address: string): Promise<{ latitude: number; longitude: number }> => {
    try {
      const searchQuery = `${address}, Ho Chi Minh City, Vietnam`;
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=vn`
      );
      
      const data = await response.json();
      if (data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
    } catch (error) {
      console.warn('Geocoding failed:', error);
    }
    
    // Default to store location if geocoding fails
    return { latitude: 10.7769, longitude: 106.7009 };
  };
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  };

  useEffect(() => {
    // Load cart data from localStorage or use mock data
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart.length > 0 ? savedCart : mockCartItems);
  }, []);

  const handleBillingChange = (field: keyof BillingDetails, value: string) => {
    setBillingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardChange = (field: keyof CardDetails, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceOrder = () => {
    // Validate required fields
    const requiredFields: (keyof BillingDetails)[] = ['firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !billingDetails[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required personal information');
      return;
    }

    if (paymentMethod === 'creditCard') {
      const cardRequiredFields: (keyof CardDetails)[] = ['cardNumber', 'nameOnCard', 'expirationDate', 'securityCode'];
      const missingCardFields = cardRequiredFields.filter(field => !cardDetails[field]);
      
      if (missingCardFields.length > 0) {
        alert('Please fill in all credit card details');
        return;
      }
    }

    // Process order
    alert('Order placed successfully!');
    // Here you would typically send the order to your backend
  };

  // Calculate totals (shipping is calculated in Cart page)
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 0; // Shipping already calculated in Cart
  const total = subtotal + shipping;

  return (
    <div className="checkoutPage">
      {/* Page Header */}
      <div className="pageHeader">
        <Link to="/cart" className="backLink">
          <FaArrowLeft /> Back to Cart
        </Link>
        <h1 className="pageTitle">Checkout</h1>
      </div>

      {/* Checkout Section */}
      <section className="checkoutSection">
        <div className="checkoutContent">
          {/* Left - Checkout Form */}
          <div className="checkoutForm">
            <h2 className="formTitle">BILLING INFORMATION</h2>
            <p className="formDescription">
              Please provide your billing details to complete your order. All fields marked with * are required.
            </p>

            <form className="form">
              {/* Personal Information */}
              <div className="personalSection">
                <h3 className="sectionTitle">PERSONAL INFORMATION</h3>
                
                <div className="formRow">
                  <div className="formField">
                    <label className="fieldLabel">First Name *</label>
                    <input
                      type="text"
                      value={billingDetails.firstName}
                      onChange={(e) => handleBillingChange('firstName', e.target.value)}
                      className="inputField"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="formField">
                    <label className="fieldLabel">Last Name *</label>
                    <input
                      type="text"
                      value={billingDetails.lastName}
                      onChange={(e) => handleBillingChange('lastName', e.target.value)}
                      className="inputField"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="formRow">
                  <div className="formField">
                    <label className="fieldLabel">Email Address *</label>
                    <input
                      type="email"
                      value={billingDetails.email}
                      onChange={(e) => handleBillingChange('email', e.target.value)}
                      className="inputField"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div className="formField">
                    <label className="fieldLabel">Phone Number *</label>
                    <input
                      type="tel"
                      value={billingDetails.phone}
                      onChange={(e) => handleBillingChange('phone', e.target.value)}
                      className="inputField"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="formField">
                <label className="fieldLabel">Order Notes (Optional)</label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="textareaField"
                  placeholder="Notes about your order, e.g. special notes for delivery"
                  rows={4}
                />
              </div>

              {/* Payment Method */}
              <div className="paymentSection">
                <h3 className="paymentTitle">PAYMENT METHOD</h3>
                
                <div className="paymentMethods">
                  <label className="paymentMethod">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="creditCard"
                      checked={paymentMethod === 'creditCard'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="paymentLabel">Credit Card</span>
                  </label>
                  
                  <label className="paymentMethod">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="paymentLabel">PayPal</span>
                  </label>
                  
                  <label className="paymentMethod">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="paymentLabel">Cash on Delivery (COD)</span>
                  </label>
                </div>

                {paymentMethod === 'creditCard' && (
                  <div className="cardDetails">
                    <div className="formField">
                      <label className="fieldLabel">Card Number</label>
                      <input
                        type="text"
                        value={cardDetails.cardNumber}
                        onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                        className="inputField"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    
                    <div className="formField">
                      <label className="fieldLabel">Name on Card</label>
                      <input
                        type="text"
                        value={cardDetails.nameOnCard}
                        onChange={(e) => handleCardChange('nameOnCard', e.target.value)}
                        className="inputField"
                        placeholder="Enter name as it appears on card"
                      />
                    </div>
                    
                    <div className="formRow">
                      <div className="formField">
                        <label className="fieldLabel">Expiration Date (MM/YY)</label>
                        <input
                          type="text"
                          value={cardDetails.expirationDate}
                          onChange={(e) => handleCardChange('expirationDate', e.target.value)}
                          className="inputField"
                          placeholder="MM/YY"
                        />
                      </div>
                      
                      <div className="formField">
                        <label className="fieldLabel">Security Code</label>
                        <input
                          type="text"
                          value={cardDetails.securityCode}
                          onChange={(e) => handleCardChange('securityCode', e.target.value)}
                          className="inputField"
                          placeholder="CVC"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button type="button" className="submitButton" onClick={handlePlaceOrder}>
                  PLACE ORDER
                </button>
              </div>
            </form>
          </div>

          {/* Right - Order Summary */}
          <div className="orderSummary">
            <h3 className="summaryTitle">YOUR ORDER</h3>
            
            <div className="orderItems">
              {cartItems.map(item => (
                <div key={item.id} className="orderItem">
                  <div className="itemImage">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="itemDetails">
                    <h4 className="itemName">{item.name}</h4>
                    <p className="itemQuantity">Qty: {item.quantity}</p>
                  </div>
                  <div className="itemPrice">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="orderTotals">
              <div className="totalRow">
                <span className="totalLabel">Subtotal</span>
                <span className="totalValue">${subtotal.toFixed(2)}</span>
              </div>
              <div className="totalRow">
                <span className="totalLabel">Shipping</span>
                <span className="totalValue">Calculated in Cart</span>
              </div>
              <div className="totalRow final">
                <span className="totalLabel">Total</span>
                <span className="totalValue">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutPage;
