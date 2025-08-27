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
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    firstName: 'Samatha',
    lastName: 'Clarken',
    company: 'Moon',
    country: 'United States',
    address: 'Address',
    city: 'City',
    state: 'State',
    zipCode: 'Zip code',
    phone: '(123) 456-7890',
    email: 'example@youremail.com'
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
    const requiredFields: (keyof BillingDetails)[] = ['firstName', 'lastName', 'country', 'address', 'city', 'state', 'zipCode', 'phone'];
    const missingFields = requiredFields.filter(field => !billingDetails[field]);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields');
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

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 35.00;
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
                  <label className="fieldLabel">Phone *</label>
                  <input
                    type="tel"
                    value={billingDetails.phone}
                    onChange={(e) => handleBillingChange('phone', e.target.value)}
                    className="inputField"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="formField">
                <label className="fieldLabel">Company Name (Optional)</label>
                <input
                  type="text"
                  value={billingDetails.company}
                  onChange={(e) => handleBillingChange('company', e.target.value)}
                  className="inputField"
                  placeholder="Enter company name (optional)"
                />
              </div>

              <div className="formField">
                <label className="fieldLabel">Country/Region *</label>
                <select
                  value={billingDetails.country}
                  onChange={(e) => handleBillingChange('country', e.target.value)}
                  className="inputField"
                >
                  <option value="">Select your country</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Vietnam">Vietnam</option>
                </select>
              </div>

              <div className="formField">
                <label className="fieldLabel">Street Address/City *</label>
                <input
                  type="text"
                  value={billingDetails.address}
                  onChange={(e) => handleBillingChange('address', e.target.value)}
                  className="inputField"
                  placeholder="Enter your street address and city"
                />
              </div>

              <div className="formRow">
                <div className="formField">
                  <label className="fieldLabel">Town *</label>
                  <input
                    type="text"
                    value={billingDetails.city}
                    onChange={(e) => handleBillingChange('city', e.target.value)}
                    className="inputField"
                    placeholder="Enter your town"
                  />
                </div>
                <div className="formField">
                  <label className="fieldLabel">State *</label>
                  <input
                    type="text"
                    value={billingDetails.state}
                    onChange={(e) => handleBillingChange('state', e.target.value)}
                    className="inputField"
                    placeholder="Enter your state"
                  />
                </div>
              </div>

              <div className="formField">
                <label className="fieldLabel">ZIP Code *</label>
                <input
                  type="text"
                  value={billingDetails.zipCode}
                  onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                  className="inputField"
                  placeholder="Enter your ZIP code"
                />
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
                <span className="totalValue">${shipping.toFixed(2)}</span>
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
