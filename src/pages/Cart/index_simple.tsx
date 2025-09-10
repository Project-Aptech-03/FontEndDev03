import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaImage, FaMinus, FaPlus, FaTrash, FaMapMarkerAlt, FaEdit, FaTrashAlt, FaPlusAddress } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { cartApi } from '../../api/cart.api';
import { couponApi } from '../../api/coupon.api';
import { customerAddressApi } from '../../api/customerAddress.api';
import { ApiCartItem } from '../../@type/cart';
import { CustomerAddress, CreateCustomerAddressDto } from '../../@type/Users';
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
  
  // Address states
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<CreateCustomerAddressDto>({
    addressName: '',
    fullAddress: '',
    district: '',
    city: '',
    postalCode: '',
    distanceKm: 0,
    isDefault: false
  });
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  // Fixed base address (store location)
  const BASE_ADDRESS = {
    lat: 10.8231, // Ho Chi Minh City center coordinates
    lng: 106.6297,
    name: "ShradBook Store - District 1, Ho Chi Minh City"
  };

  // OpenRouteService API Configuration
  const API_CONFIG = {
    openRouteService: {
      token: 'abc', // Replace with your actual OpenRouteService API key
      url: 'https://api.openrouteservice.org/v2'
    }
  };

  // Haversine formula for distance calculation
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10;
  };

  // Get coordinates from address using Nominatim (free)
  const getCoordinatesFromAddress = async (address: string): Promise<{lat: number, lng: number} | null> => {
    const cleanAddress = address.trim() + ', Vietnam';
    
    try {
      console.log('🔍 Getting coordinates for:', cleanAddress);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddress)}&limit=1&countrycodes=vn`,
        {
          headers: {
            'User-Agent': 'ShradBook-App/1.0'
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const coords = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon)
          };
          console.log('✅ Coordinates found:', coords);
          return coords;
        }
      }
    } catch (error) {
      console.warn('❌ Geocoding failed:', error);
    }
    return null;
  };

  // Simple distance calculation with address validation
  const calculateDistanceFromAddress = async (address: string): Promise<number | null> => {
    try {
      console.log('🚀 Validating address and calculating distance...');
      
      // Get coordinates for both addresses - REQUIRED for validation
      const fromCoords = { lat: BASE_ADDRESS.lat, lng: BASE_ADDRESS.lng };
      const toCoords = await getCoordinatesFromAddress(address);
      
      // If we can't get coordinates, the address is invalid - BLOCK the operation
      if (!toCoords) {
        console.log('❌ Invalid address - cannot find coordinates');
        return null;
      }

      console.log('✅ Address validation passed');

      // Try OpenRouteService Distance Matrix first
      try {
        const orsResponse = await fetch(`${API_CONFIG.openRouteService.url}/matrix/driving-car`, {
          method: 'POST',
          headers: {
            'Authorization': API_CONFIG.openRouteService.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            locations: [
              [fromCoords.lng, fromCoords.lat],
              [toCoords.lng, toCoords.lat]
            ],
            sources: [0],
            destinations: [1]
          })
        });
        
        if (orsResponse.ok) {
          const orsData = await orsResponse.json();
          if (orsData && orsData.distances && orsData.distances[0] && orsData.distances[0][0]) {
            const distanceMeters = orsData.distances[0][0];
            const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10;
            console.log('✅ OpenRouteService distance:', distanceKm, 'km');
            return distanceKm;
          }
        }
      } catch (error) {
        console.warn('OpenRouteService failed, using fallback calculation');
      }

      // Fallback: Use coordinate-based calculation
      const distance = calculateDistance(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng);
      console.log('✅ Fallback distance calculation:', distance, 'km');
      return distance;

    } catch (error) {
      console.error('❌ Distance calculation failed:', error);
      return null;
    }
  };

  // Address operations with validation
  const handleAddAddress = async () => {
    if (!newAddress.fullAddress.trim()) {
      toast.error('Please enter a full address');
      return;
    }

    try {
      const loadingToast = toast.loading('🌍 Validating address and calculating distance...');
      
      const calculatedDistance = await calculateDistanceFromAddress(newAddress.fullAddress);
      
      toast.dismiss(loadingToast);
      
      if (calculatedDistance === null) {
        toast.error('❌ Invalid address! Cannot find this location. Please enter a more specific address.', { autoClose: 5000 });
        return;
      }
      
      const savingToast = toast.loading('💾 Saving valid address...');
      
      const addressWithDistance = {
        ...newAddress,
        distanceKm: calculatedDistance
      };

      const response = await customerAddressApi.createAddress(addressWithDistance);
      
      toast.dismiss(savingToast);
      
      if (response.success) {
        toast.success(`✅ Address added successfully!\n📏 Distance: ${calculatedDistance} km`, { autoClose: 4000 });
        
        setNewAddress({
          addressName: '',
          fullAddress: '',
          district: '',
          city: '',
          postalCode: '',
          distanceKm: 0,
          isDefault: false
        });
        setShowAddressForm(false);
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address. Please try again.');
    }
  };

  const handleEditAddress = async () => {
    if (!editingAddress || !editingAddress.fullAddress.trim()) {
      toast.error('Please enter a full address');
      return;
    }

    try {
      const loadingToast = toast.loading('🌍 Validating address and recalculating distance...');
      
      const calculatedDistance = await calculateDistanceFromAddress(editingAddress.fullAddress);
      
      toast.dismiss(loadingToast);
      
      if (calculatedDistance === null) {
        toast.error('❌ Invalid address! Cannot find this location. Please enter a more specific address.', { autoClose: 5000 });
        return;
      }
      
      const savingToast = toast.loading('💾 Updating address...');
      
      const addressWithDistance = {
        ...editingAddress,
        distanceKm: calculatedDistance
      };

      const response = await customerAddressApi.updateAddress(editingAddress.id, addressWithDistance);
      
      toast.dismiss(savingToast);
      
      if (response.success) {
        toast.success(`✅ Address updated successfully!\n📏 New distance: ${calculatedDistance} km`, { autoClose: 4000 });
        setEditingAddress(null);
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address. Please try again.');
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await customerAddressApi.deleteAddress(addressId);
        if (response.code === 200) {
          toast.success('Address deleted successfully');
          fetchAddresses();
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Failed to delete address');
      }
    }
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      setAddressLoading(true);
      const response = await customerAddressApi.getAddresses();
      if (response.success && response.data) {
        const activeAddresses = response.data.filter((addr: CustomerAddress) => addr.isActive);
        setAddresses(activeAddresses);
        
        const defaultAddress = activeAddresses.find((addr: CustomerAddress) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (activeAddresses.length > 0) {
          setSelectedAddressId(activeAddresses[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setAddressLoading(false);
    }
  };

  // Fetch cart data
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
    fetchAddresses();
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
              <button className="retry-btn" onClick={fetchCartData}>Try Again</button>
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
                <p className="emptyCartText">Looks like you haven't added any items to your cart yet.</p>
                <Link to="/shop" className="continueShoppingBtn">Continue Shopping</Link>
              </div>
            ) : (
              <>
                <div className="cartHeader">
                  <h2 className="cartTitle">Cart Items</h2>
                  <button className="clearCartBtn" onClick={clearCart}>Clear Cart</button>
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
                  {/* Delivery Address Section */}
                  <div className="deliveryAddressSection">
                    <div className="addressSectionHeader">
                      <FaMapMarkerAlt className="addressIcon" />
                      <span className="addressLabel">Delivery Address:</span>
                      <button 
                        className="selectAddressBtn"
                        onClick={() => setShowAddressModal(true)}
                        disabled={addressLoading}
                      >
                        {addressLoading ? 'Loading...' : 'Select Address'}
                      </button>
                    </div>

                    {/* Selected Address Preview */}
                    {selectedAddressId > 0 && (
                      <div className="selectedAddressPreview">
                        {addresses.find(addr => addr.id === selectedAddressId) && (
                          <div className="addressPreview">
                            <div className="previewInfo">
                              <span className="previewName">
                                {addresses.find(addr => addr.id === selectedAddressId)?.addressName || 
                                 `Address #${addresses.find(addr => addr.id === selectedAddressId)?.id}`}
                                {addresses.find(addr => addr.id === selectedAddressId)?.isDefault && 
                                  <span className="defaultBadge"> (Default)</span>
                                }
                              </span>
                            </div>
                            <div className="previewAddress">
                              {addresses.find(addr => addr.id === selectedAddressId)?.fullAddress}
                              {addresses.find(addr => addr.id === selectedAddressId)?.distanceKm && (
                                <div className="previewDistance">
                                  📏 {addresses.find(addr => addr.id === selectedAddressId)?.distanceKm} km from {BASE_ADDRESS.name}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Coupon Section */}
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
              <button className="checkoutBtn" onClick={proceedToCheckout}>
                PROCEED TO CHECKOUT
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div className="addressModal">
          <div className="modalOverlay" onClick={() => setShowAddressModal(false)}></div>
          <div className="modalContent">
            <div className="modalHeader">
              <h3>Select Delivery Address</h3>
              <button className="closeModalBtn" onClick={() => setShowAddressModal(false)}>✕</button>
            </div>
            
            <div className="modalBody">
              {addressLoading ? (
                <div className="loadingState">Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="emptyState">
                  <p>No addresses found</p>
                  <button 
                    className="addFirstAddressBtn"
                    onClick={() => {
                      setShowAddressForm(true);
                      setShowAddressModal(false);
                    }}
                  >
                    <FaPlusAddress /> Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="addressList">
                  {addresses.map(address => (
                    <div 
                      key={address.id} 
                      className={`addressItem ${selectedAddressId === address.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedAddressId(address.id);
                        setShowAddressModal(false);
                      }}
                    >
                      <div className="addressItemHeader">
                        <div className="addressItemName">
                          <span className="addressName">
                            {address.addressName || `Address #${address.id}`}
                          </span>
                          {address.isDefault && <span className="defaultBadge">Default</span>}
                        </div>
                        <div className="addressItemActions">
                          <button 
                            className="editAddressBtn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingAddress(address);
                              setShowAddressModal(false);
                            }}
                            title="Edit address"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="deleteAddressBtn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(address.id);
                            }}
                            title="Delete address"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </div>
                      <div className="addressItemDetails">
                        <div className="addressFullText">{address.fullAddress}</div>
                        {address.district && <div className="addressSubText">District: {address.district}</div>}
                        {address.city && <div className="addressSubText">City: {address.city}</div>}
                        {address.distanceKm && (
                          <div className="addressSubText">
                            📏 Distance: <strong>{address.distanceKm} km</strong> from {BASE_ADDRESS.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="modalFooter">
              <button 
                className="addNewAddressBtn"
                onClick={() => {
                  setShowAddressForm(true);
                  setShowAddressModal(false);
                }}
              >
                <FaPlusAddress /> Add New Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Form Modal */}
      {showAddressForm && (
        <div className="addressModal">
          <div className="modalOverlay" onClick={() => setShowAddressForm(false)}></div>
          <div className="modalContent">
            <div className="modalHeader">
              <h3>Add New Address</h3>
              <button className="closeModalBtn" onClick={() => setShowAddressForm(false)}>✕</button>
            </div>
            
            <div className="modalBody">
              <div className="addressForm">
                <div className="formGroup">
                  <label>Address Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Home, Work, etc."
                    value={newAddress.addressName || ''}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, addressName: e.target.value }))}
                    className="formInput"
                  />
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>District</label>
                    <input
                      type="text"
                      placeholder="District"
                      value={newAddress.district || ''}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, district: e.target.value }))}
                      className="formInput"
                    />
                  </div>
                  <div className="formGroup">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city || ''}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="formInput"
                    />
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={newAddress.postalCode || ''}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="formInput"
                    />
                  </div>
                  <div className="formGroup">
                    <label>Distance Calculation</label>
                    <div className="distanceInfo">
                      <div className="baseAddressInfo">
                        <small>📍 Distance will be calculated from: <strong>{BASE_ADDRESS.name}</strong></small>
                      </div>
                      <div className="calculatedDistance">
                        <small>🧮 Auto-calculated when address is saved</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="formGroup">
                  <label>Full Address *</label>
                  <textarea
                    placeholder="Enter complete address (be specific for accurate distance calculation)"
                    value={newAddress.fullAddress}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, fullAddress: e.target.value }))}
                    className="formTextarea"
                    rows={3}
                  />
                  <small style={{color: '#666', fontSize: '12px'}}>
                    ⚠️ Address must be valid and findable on the map. Invalid addresses will be rejected.
                  </small>
                </div>

                <div className="formGroup">
                  <label className="checkboxLabel">
                    <input
                      type="checkbox"
                      checked={newAddress.isDefault || false}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                    />
                    Set as default address
                  </label>
                </div>
              </div>
            </div>
            
            <div className="modalFooter">
              <button className="cancelBtn" onClick={() => setShowAddressForm(false)}>Cancel</button>
              <button className="saveBtn" onClick={handleAddAddress}>Save Address</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Address Form Modal */}
      {editingAddress && (
        <div className="addressModal">
          <div className="modalOverlay" onClick={() => setEditingAddress(null)}></div>
          <div className="modalContent">
            <div className="modalHeader">
              <h3>Edit Address</h3>
              <button className="closeModalBtn" onClick={() => setEditingAddress(null)}>✕</button>
            </div>
            
            <div className="modalBody">
              <div className="addressForm">
                <div className="formGroup">
                  <label>Address Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Home, Work, etc."
                    value={editingAddress.addressName || ''}
                    onChange={(e) => setEditingAddress(prev => prev ? ({ ...prev, addressName: e.target.value }) : null)}
                    className="formInput"
                  />
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>District</label>
                    <input
                      type="text"
                      placeholder="District"
                      value={editingAddress.district || ''}
                      onChange={(e) => setEditingAddress(prev => prev ? ({ ...prev, district: e.target.value }) : null)}
                      className="formInput"
                    />
                  </div>
                  <div className="formGroup">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={editingAddress.city || ''}
                      onChange={(e) => setEditingAddress(prev => prev ? ({ ...prev, city: e.target.value }) : null)}
                      className="formInput"
                    />
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={editingAddress.postalCode || ''}
                      onChange={(e) => setEditingAddress(prev => prev ? ({ ...prev, postalCode: e.target.value }) : null)}
                      className="formInput"
                    />
                  </div>
                  <div className="formGroup">
                    <label>Distance Calculation</label>
                    <div className="distanceInfo">
                      <div className="baseAddressInfo">
                        <small>📍 Distance from: <strong>{BASE_ADDRESS.name}</strong></small>
                      </div>
                      <div className="currentDistance">
                        <small>📏 Current: <strong>{editingAddress.distanceKm || 0} km</strong></small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="formGroup">
                  <label>Full Address *</label>
                  <textarea
                    placeholder="Enter complete address (be specific for accurate distance calculation)"
                    value={editingAddress.fullAddress || ''}
                    onChange={(e) => setEditingAddress(prev => prev ? ({ ...prev, fullAddress: e.target.value }) : null)}
                    className="formTextarea"
                    rows={3}
                  />
                  <small style={{color: '#666', fontSize: '12px'}}>
                    ⚠️ Address must be valid and findable on the map. Invalid addresses will be rejected.
                  </small>
                </div>

                <div className="formGroup">
                  <label className="checkboxLabel">
                    <input
                      type="checkbox"
                      checked={editingAddress.isDefault || false}
                      onChange={(e) => setEditingAddress(prev => prev ? ({ ...prev, isDefault: e.target.checked }) : null)}
                    />
                    Set as default address
                  </label>
                </div>
              </div>
            </div>
            
            <div className="modalFooter">
              <button className="cancelBtn" onClick={() => setEditingAddress(null)}>Cancel</button>
              <button className="saveBtn" onClick={handleEditAddress}>Update Address</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
