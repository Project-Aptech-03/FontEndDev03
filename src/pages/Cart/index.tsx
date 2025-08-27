  import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import './CartPage.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock cart data
  const mockCartItems: CartItem[] = [
    {
      id: 1,
      name: "PORCELAIN DINNER PLATE (27CM)",
      price: 59,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
      subtotal: 118
    },
    {
      id: 2,
      name: "OPHELIA MATTE NATURAL VASE",
      price: 168,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
      subtotal: 168
    },
    {
      id: 3,
      name: "PORCELAIN DINNER PLATE",
      price: 70,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
      subtotal: 70
    }
  ];

  useEffect(() => {
    // Load cart data from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      // If no saved cart, use mock data
      setCartItems(mockCartItems);
      localStorage.setItem('cart', JSON.stringify(mockCartItems));
    } else {
      setCartItems(savedCart);
    }
    setLoading(false);
  }, []);

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, subtotal: item.price * newQuantity }
        : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (itemId: number) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const applyCoupon = () => {
    if (couponCode.trim()) {
      alert(`Coupon code "${couponCode}" applied!`);
      setCouponCode('');
    }
  };

  const updateCart = () => {
    alert('Cart updated successfully!');
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shipping = subtotal > 0 ? 35 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading cart...</p>
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
                      <div className="itemImage">
                        <img src={item.image} alt={item.name} />
                      </div>
                      
                      <div className="itemDetails">
                        <h3 className="itemName">{item.name}</h3>
                        <p className="itemPrice">${item.price}</p>
                      </div>
                      
                      <div className="itemQuantity">
                        <button 
                          className="quantityBtn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <FaMinus />
                        </button>
                        <span className="quantityValue">{item.quantity}</span>
                        <button 
                          className="quantityBtn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                      
                      <div className="itemSubtotal">
                        <span className="subtotalValue">${item.subtotal.toFixed(2)}</span>
                      </div>
                      
                      <button 
                        className="removeItemBtn"
                        onClick={() => removeItem(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="cartActions">
                  <div className="couponSection">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="couponInput"
                    />
                    <button 
                      className="applyCouponBtn"
                      onClick={applyCoupon}
                    >
                      APPLY COUPON
                    </button>
                  </div>
                  <div className="updateSection">
                    <button 
                      className="updateCartBtn"
                      onClick={updateCart}
                    >
                      UPDATE CART
                    </button>
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
                  <span className="totalValue">${subtotal.toFixed(2)}</span>
                </div>
                <div className="totalRow">
                  <span className="totalLabel">Shipping</span>
                  <span className="totalValue">${shipping.toFixed(2)}</span>
                </div>
                <div className="totalRow final">
                  <span className="totalLabel">Cart totals</span>
                  <span className="totalValue">${total.toFixed(2)}</span>
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
