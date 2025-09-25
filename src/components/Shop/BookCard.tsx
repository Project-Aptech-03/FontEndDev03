import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import { Book } from '../../@type/book';
import { handleAddToCart, formatPrice } from '../../utils/bookUtils';

interface BookCardProps {
  book: Book;
  isInWishlist: boolean;
  onWishlistToggle: (book: Book) => void;
    reviews: { rating: number; reviewCount: number };
}

const BookCard: React.FC<BookCardProps> = ({ book, isInWishlist, onWishlistToggle, reviews }) => {
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
      <div className="bookCard" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '500px',
        maxHeight: '500px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'white',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        position: 'relative'
      }}>
        <div className="bookImage" style={{
          position: 'relative',
          height: '200px',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <Link to={`/detail-product/${book.id}`} className="bookImageLink" style={{
            display: 'block',
            height: '100%'
          }}>
            <img
                src={book.image}
                alt={book.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
            />
          </Link>
          <div className="bookOverlay">
            <button
                className="addToCartBtn"
                onClick={() => handleAddToCart(book)}
            >
              ADD TO CART
            </button>
          </div>
          <button
              className={`wishlistBtn ${isInWishlist ? 'active' : ''}`}
              onClick={() => onWishlistToggle(book)}
              title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <FaHeart />
          </button>
        </div>

          <div className="bookInfo" style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0
          }}>
              <Link to={`/detail-product/${book.id}`} className="bookTitleLink" style={{
                  textDecoration: 'none',
                  color: 'inherit'
              }}>
                  <h3 className="bookTitle" style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      lineHeight: '1.3',
                      height: '40px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                  }}>
                      {truncateText(book.title, 50)}
                  </h3>
              </Link>

              <p className="bookAuthor" style={{
                  fontSize: '14px',
                  color: '#666',
                  margin: '0 0 8px 0',
                  height: '20px',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis'
              }}>
                  by {truncateText(book.manufacturer, 25)}
              </p>

              <div className="bookRating"
                   style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', height: '20px'}}>
                  <div className="stars" style={{display: 'flex', gap: '2px'}}>
                      {[...Array(5)].map((_, i) => (
                          <FaStar
                              key={i}
                              className={i < Math.floor(reviews.rating) ? 'star filled' : 'star'}
                              style={{fontSize: '12px', color: i < Math.floor(reviews.rating) ? '#f1c40f' : '#ccc'}}
                          />
                      ))}
                  </div>
                  <span className="ratingText" style={{fontSize: '12px', color: '#666'}}>
      ({reviews.reviewCount} reviews)
    </span>
              </div>
              <div className="bookPrice" style={{
                  marginBottom: '12px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
              }}>
          <span className="currentPrice" style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#e74c3c'
          }}>{formatPrice(book.price)}</span>
                  {book.originalPrice && book.originalPrice > book.price && (
                      <span className="originalPrice" style={{
                          fontSize: '14px',
                          color: '#999',
                          textDecoration: 'line-through'
                      }}>{formatPrice(book.originalPrice)}</span>
                  )}
              </div>

              <p className="bookDescription" style={{
                  fontSize: '13px',
                  color: '#666',
                  lineHeight: '1.4',
                  margin: '0 0 12px 0',
                  height: '56px',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical'
              }}>
                  {truncateText(book.description || 'No description available.', 100)}
              </p>

              <div className="bookMeta" style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: 'auto',
                  height: '20px'
              }}>
          <span className="bookCategory" style={{
              fontSize: '12px',
              backgroundColor: '#f8f9fa',
              color: '#6c757d',
              padding: '2px 8px',
              borderRadius: '12px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '50%'
          }}>
            {truncateText(book.category, 15)}
          </span>
                  {book.manufacturer && (
                      <span className="bookManufacturer" style={{
                          fontSize: '12px',
                          backgroundColor: '#e9ecef',
                          color: '#495057',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '50%'
                      }}>
              {truncateText(book.manufacturer, 15)}
            </span>
                  )}
              </div>
          </div>
      </div>
  );
};

export default BookCard;