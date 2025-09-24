import {Link, useNavigate} from 'react-router-dom';
import { FaTrash, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './WishlistPage.css';
import {useEffect, useState} from "react";
import {cartApi} from "../../api/cart.api";
import {message} from "antd";

interface WishlistItem {
  id: number;
  title: string;
  author?: string | null;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  description?: string;
  category?: string;
  manufacturer?: string;
  photos?: string[];
}

function normalizeProduct(product: any): WishlistItem {
  return {
    id: product.id,
    title: product.title || product.productName || "Untitled",
    author: product.author || null,
    price: product.price,
    originalPrice: product.originalPrice,
    rating: product.rating || 0,
    reviewCount: product.reviewCount || 0,
    description: product.description,
    category: typeof product.category === "string"
        ? product.category
        : product.category?.categoryName,
    manufacturer: typeof product.manufacturer === "string"
        ? product.manufacturer
        : product.manufacturer?.manufacturerName,
    photos: Array.isArray(product.photos)
        ? product.photos.map((p: any) => typeof p === "string" ? p : p.photoUrl)
        : product.image ? [product.image] : []
  };
}

const WishlistPage = () => {
  console.log('WishlistPage component is loading...');

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Số items trên mỗi trang

  console.log(wishlistItems);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("Wishlist") || "[]");
    const normalized = savedWishlist.map((p: any) => normalizeProduct(p));
    setWishlistItems(normalized);
    window.dispatchEvent(new Event("wishlistUpdated"));
    setLoading(false);
  }, []);

  // Tính toán pagination
  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = wishlistItems.slice(startIndex, endIndex);

  // Reset về trang 1 khi số items thay đổi và trang hiện tại vượt quá tổng số trang
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [wishlistItems.length, currentPage, totalPages]);

  const removeFromWishlist = (itemId: number) => {
    const updatedItems = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updatedItems);
    localStorage.setItem('Wishlist', JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('Wishlist');
    setCurrentPage(1);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const navigate = useNavigate();

  const addToCart = async (item: WishlistItem) => {
    try {
      const response = await cartApi.addToCart(item.id, 1);
      if (response.success) {
        const updatedItems = wishlistItems.filter(i => i.id !== item.id);
        setWishlistItems(updatedItems);
        localStorage.setItem('Wishlist', JSON.stringify(updatedItems));
        window.dispatchEvent(new Event("cartUpdated"));
        window.dispatchEvent(new Event("wishlistUpdated"));

        message.success(`Added "${item.title}" to cart!`);
      } else {
        message.error(response.message || "Failed to add item to cart!");
      }
    } catch (error) {
      message.error("Error adding to cart, please try again.");
      console.error(error);
    }
  };

  const moveAllToCart = async () => {
    if (wishlistItems.length === 0) {
      message.success("Your Wishlist is empty!");
      return;
    }

    try {
      for (const item of wishlistItems) {
        await cartApi.addToCart(item.id, 1);
      }

      setWishlistItems([]);
      localStorage.removeItem("Wishlist");
      setCurrentPage(1);

      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("wishlistUpdated"));

      message.success("All items moved to cart!");
      navigate("/cart");
    } catch (error) {
      message.error("Error moving items to cart, please try again.");
      console.error(error);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
        <div className="pagination">
          <button
              className="pageBtn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
          >
            <FaChevronLeft />
          </button>

          {startPage > 1 && (
              <>
                <button
                    className="pageBtn"
                    onClick={() => handlePageChange(1)}
                >
                  1
                </button>
                {startPage > 2 && <span className="pageDots">...</span>}
              </>
          )}

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const page = startPage + i;
            return (
                <button
                    key={page}
                    className={`pageBtn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
            );
          })}

          {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && <span className="pageDots">...</span>}
                <button
                    className="pageBtn"
                    onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
          )}

          <button
              className="pageBtn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
          >
            <FaChevronRight />
          </button>
        </div>
    );
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
                      <h2 className="wishlistTitle">
                        Wishlist Items ({wishlistItems.length})
                        {totalPages > 1 && (
                            <span className="pageInfo">
                        - Page {currentPage} of {totalPages}
                      </span>
                        )}
                      </h2>
                      <button
                          className="clearWishlistBtn"
                          onClick={clearWishlist}
                      >
                        Clear Wishlist
                      </button>
                    </div>

                    <div className="wishlistList">
                      {currentItems.map(item => (
                          <div key={item.id} className="wishlistItem">
                            <div className="itemImage">
                              {item.photos && item.photos.length > 0 ? (
                                  <img src={item.photos[0]} alt={item.title || "No title"}/>
                              ) : item.photos ? (
                                  <img src={item.photos} alt={item.title || "No title"}/>
                              ) : (
                                  <div className="no-image">No Image</div>
                              )}
                            </div>

                            <div className="itemDetails">
                              {item.title && <h3 className="itemName">{item.title}</h3>}
                              {item.author && <p className="itemAuthor">by {item.author}</p>}

                              {item.rating !== undefined && (
                                  <div className="itemRating">
                                    <div className="stars">
                                      {[...Array(5)].map((_, i) => (
                                          <FaStar
                                              key={i}
                                              className={i < Math.floor(item.rating || 0) ? "star filled" : "star"}
                                          />
                                      ))}
                                    </div>
                                    {item.reviewCount !== undefined && (
                                        <span className="ratingText">({item.reviewCount} reviews)</span>
                                    )}
                                  </div>
                              )}

                              {item.description && (
                                  <p className="itemDescription">{item.description}</p>
                              )}

                              <div className="itemMeta">
                                {item.category && <span className="itemCategory">{item.category}</span>}
                                {item.manufacturer && (
                                    <span className="itemManufacturer">{item.manufacturer}</span>
                                )}
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
                              <FaTrash/>
                            </button>
                          </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {renderPagination()}
                  </>
              )}
            </div>
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