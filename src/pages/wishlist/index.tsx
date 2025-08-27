import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaStar, FaHeart } from 'react-icons/fa';
import './WishlistPage.css';

interface WishlistItem {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  category: string;
  genre: string;
  image: string;
}

const WishlistPage = () => {
  console.log('WishlistPage component is loading...'); // Debug log
  
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('WishlistPage useEffect running...'); // Debug log
    // Load wishlist data from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    console.log('Loaded wishlist:', savedWishlist); // Debug log
    setWishlistItems(savedWishlist);
    setLoading(false);
  }, []);

  const removeFromWishlist = (itemId: number) => {
    const updatedItems = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updatedItems);
    localStorage.setItem('wishlist', JSON.stringify(updatedItems));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('wishlist');
  };

  const addToCart = (item: WishlistItem) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if item already exists in cart
    const existingItem = existingCart.find((cartItem: any) => cartItem.id === item.id);
    
    if (existingItem) {
      // Update quantity if item already exists
      existingItem.quantity += 1;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
    } else {
      // Add new item to cart
      const cartItem = {
        id: item.id,
        name: item.title,
        price: item.price,
        quantity: 1,
        image: item.image,
        subtotal: item.price
      };
      existingCart.push(cartItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Trigger cart counter update
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success message
    alert(`Added "${item.title}" to cart!`);
  };

  const moveAllToCart = () => {
    if (wishlistItems.length === 0) {
      alert('Your wishlist is empty!');
      return;
    }

    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Add all wishlist items to cart
    wishlistItems.forEach(item => {
      const existingItem = existingCart.find((cartItem: any) => cartItem.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.subtotal = existingItem.price * existingItem.quantity;
      } else {
        const cartItem = {
          id: item.id,
          name: item.title,
          price: item.price,
          quantity: 1,
          image: item.image,
          subtotal: item.price
        };
        existingCart.push(cartItem);
      }
    });
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Trigger cart counter update
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Clear wishlist
    setWishlistItems([]);
    localStorage.removeItem('wishlist');
    
    alert('All items moved to cart!');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlistPage">
      {/* Page Header */}
      <div className="pageHeader">
        <h1 className="pageTitle">My Wishlist</h1>
        <div className="breadcrumb">
          <Link to="/" className="breadcrumbLink">Home</Link>
          <span className="breadcrumbSeparator">/</span>
          <span className="breadcrumbCurrent">Wishlist</span>
        </div>
      </div>

      <main className="wishlistContent">
        <div className="wishlistContainer">
          {/* Left Side - Wishlist Items */}
          <div className="wishlistItems">
            {wishlistItems.length === 0 ? (
              <div className="emptyWishlist">
                <div className="emptyWishlistIcon">💝</div>
                <h2 className="emptyWishlistTitle">Your wishlist is empty</h2>
                <p className="emptyWishlistText">
                  Start adding your favorite books to your wishlist!
                </p>
                <Link to="/shop" className="continueShoppingBtn">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="wishlistHeader">
                  <h2 className="wishlistTitle">Wishlist Items ({wishlistItems.length})</h2>
                  <button 
                    className="clearWishlistBtn"
                    onClick={clearWishlist}
                  >
                    Clear Wishlist
                  </button>
                </div>
                
                <div className="wishlistList">
                  {wishlistItems.map(item => (
                    <div key={item.id} className="wishlistItem">
                      <div className="itemImage">
                        <img src={item.image} alt={item.title} />
                      </div>
                      
                      <div className="itemDetails">
                        <h3 className="itemName">{item.title}</h3>
                        <p className="itemAuthor">by {item.author}</p>
                        <div className="itemRating">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <FaStar 
                                key={i} 
                                className={i < Math.floor(item.rating) ? 'star filled' : 'star'} 
                              />
                            ))}
                          </div>
                          <span className="ratingText">({item.reviewCount} reviews)</span>
                        </div>
                        <p className="itemDescription">{item.description}</p>
                        <div className="itemMeta">
                          <span className="itemCategory">{item.category}</span>
                          <span className="itemGenre">{item.genre}</span>
                        </div>
                      </div>
                      
                      <div className="itemPrice">
                        <span className="currentPrice">${item.price}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="originalPrice">${item.originalPrice}</span>
                        )}
                      </div>
                      
                      <div className="itemActions">
                        <button 
                          className="addToCartBtn"
                          onClick={() => addToCart(item)}
                        >
                          ADD TO CART
                        </button>
                      </div>
                      
                      <button 
                        className="removeItemBtn"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="wishlistActions">
                  <div className="wishlistInfo">
                    <span className="wishlistCount">{wishlistItems.length} items in wishlist</span>
                  </div>
                  <div className="wishlistButtons">
                    <button 
                      className="moveAllToCartBtn"
                      onClick={moveAllToCart}
                    >
                      MOVE ALL TO CART
                    </button>
                    <Link to="/shop" className="continueShoppingBtn">
                      CONTINUE SHOPPING
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Side - Wishlist Summary */}
          {wishlistItems.length > 0 && (
            <div className="wishlistSummary">
              <h2 className="summaryTitle">Wishlist Summary</h2>
              <div className="summaryContent">
                <div className="summaryRow">
                  <span className="summaryLabel">Total Items</span>
                  <span className="summaryValue">{wishlistItems.length}</span>
                </div>
                <div className="summaryRow">
                  <span className="summaryLabel">Total Value</span>
                  <span className="summaryValue">
                    ${wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </span>
                </div>
                <div className="summaryRow">
                  <span className="summaryLabel">Average Rating</span>
                  <span className="summaryValue">
                    {wishlistItems.length > 0 
                      ? (wishlistItems.reduce((sum, item) => sum + item.rating, 0) / wishlistItems.length).toFixed(1)
                      : '0.0'
                    } ⭐
                  </span>
                </div>
                <div className="summaryRow">
                  <span className="summaryLabel">Categories</span>
                  <span className="summaryValue">
                    {[...new Set(wishlistItems.map(item => item.category))].length}
                  </span>
                </div>
              </div>
              
              <div className="summaryActions">
                <button 
                  className="moveAllToCartBtn"
                  onClick={moveAllToCart}
                >
                  MOVE ALL TO CART
                </button>
                <Link to="/shop" className="continueShoppingBtn">
                  CONTINUE SHOPPING
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WishlistPage;
