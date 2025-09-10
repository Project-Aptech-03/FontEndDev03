import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import { Book } from '../../@type/book';
import { handleAddToCart, formatPrice } from '../../utils/bookUtils';

interface BookCardProps {
  book: Book;
  isInWishlist: boolean;
  onWishlistToggle: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, isInWishlist, onWishlistToggle }) => {
  return (
    <div className="bookCard">
      <div className="bookImage">
        <Link to={`/detail-product/${book.id}`} className="bookImageLink">
          <img src={book.image} alt={book.title} />
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
      <div className="bookInfo">
        <Link to={`/detail-product/${book.id}`} className="bookTitleLink">
          <h3 className="bookTitle">{book.title}</h3>
        </Link>
        <p className="bookAuthor">by {book.author}</p>
        <div className="bookRating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={i < Math.floor(book.rating || 0) ? 'star filled' : 'star'} 
              />
            ))}
          </div>
          <span className="ratingText">({book.reviewCount || 0} reviews)</span>
        </div>
        <div className="bookPrice">
          <span className="currentPrice">{formatPrice(book.price)}</span>
          {book.originalPrice && book.originalPrice > book.price && (
            <span className="originalPrice">{formatPrice(book.originalPrice)}</span>
          )}
        </div>
        <p className="bookDescription">{book.description}</p>
        <div className="bookMeta">
          <span className="bookCategory">{book.category}</span>
          {book.manufacturer && <span className="bookManufacturer">{book.manufacturer}</span>}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
