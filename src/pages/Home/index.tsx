
import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
import './Home.css';
import {useEffect, useState} from "react";


interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  category: string;
  genre: string;
  image: string;
  description: string;
  inStock: boolean;
}

const HomePage = () => {
  const [wishlist, setWishlist] = useState<Book[]>([]);

  // Mock books data for different sections
  const newBooks = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 24.99,
      originalPrice: 29.99,
      rating: 4.5,
      reviewCount: 128,
      category: "Fiction",
      genre: "Classic Literature",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      description: "A literary classic exploring themes of decadence, idealism, and the American Dream.",
      inStock: true
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 21.99,
      originalPrice: 27.99,
      rating: 4.8,
      reviewCount: 256,
      category: "Fiction",
      genre: "Classic Literature",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
      description: "A powerful story of racial injustice and the loss of innocence in the American South.",
      inStock: true
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: 22.99,
      originalPrice: 24.99,
      rating: 4.6,
      reviewCount: 189,
      category: "Fiction",
      genre: "Dystopian",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      description: "A chilling vision of a totalitarian society and the power of surveillance.",
      inStock: true
    }
  ];

  const featuredBooks = [
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 21.99,
      originalPrice: 26.99,
      rating: 4.7,
      reviewCount: 203,
      category: "Fiction",
      genre: "Romance",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      description: "A timeless romance exploring love, marriage, and social class in Georgian England.",
      inStock: true
    },
    {
      id: 5,
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      price: 28.99,
      originalPrice: 33.99,
      rating: 4.9,
      reviewCount: 312,
      category: "Fiction",
      genre: "Fantasy",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      description: "An epic fantasy adventure following Bilbo Baggins on his journey with thirteen dwarves.",
      inStock: true
    },
    {
      id: 6,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      price: 20.99,
      originalPrice: 25.99,
      rating: 4.3,
      reviewCount: 167,
      category: "Fiction",
      genre: "Coming of Age",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
      description: "A classic coming-of-age story about teenage alienation and loss of innocence.",
      inStock: true
    }
  ];

  const hotBooks = [
    {
      id: 7,
      title: "Lord of the Flies",
      author: "William Golding",
      price: 18.99,
      originalPrice: 23.99,
      rating: 4.4,
      reviewCount: 145,
      category: "Fiction",
      genre: "Allegory",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      description: "A powerful allegory about the dark side of human nature and civilization.",
      inStock: true
    },
    {
      id: 8,
      title: "Animal Farm",
      author: "George Orwell",
      price: 16.99,
      originalPrice: 21.99,
      rating: 4.5,
      reviewCount: 178,
      category: "Fiction",
      genre: "Political Satire",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      description: "A satirical allegory about the Russian Revolution and the rise of Stalinism.",
      inStock: true
    },
    {
      id: 9,
      title: "Brave New World",
      author: "Aldous Huxley",
      price: 23.99,
      originalPrice: 28.99,
      rating: 4.6,
      reviewCount: 201,
      category: "Fiction",
      genre: "Dystopian",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      description: "A dystopian novel about a future society controlled by technology and conditioning.",
      inStock: true
    }
  ];

  const saleBooks = [
    {
      id: 10,
      title: "The Alchemist",
      author: "Paulo Coelho",
      price: 15.99,
      originalPrice: 24.99,
      rating: 4.2,
      reviewCount: 89,
      category: "Fiction",
      genre: "Philosophical",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
      description: "A magical story about following your dreams and listening to your heart.",
      inStock: true
    },
    {
      id: 11,
      title: "The Little Prince",
      author: "Antoine de Saint-Exupéry",
      price: 12.99,
      originalPrice: 19.99,
      rating: 4.8,
      reviewCount: 234,
      category: "Fiction",
      genre: "Children's Literature",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      description: "A poetic tale about a young prince who visits various planets in space.",
      inStock: true
    },
    {
      id: 12,
      title: "The Old Man and the Sea",
      author: "Ernest Hemingway",
      price: 14.99,
      originalPrice: 22.99,
      rating: 4.4,
      reviewCount: 156,
      category: "Fiction",
      genre: "Literary Fiction",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      description: "A story about an aging fisherman's struggle with a giant marlin.",
      inStock: true
    }
  ];

  useEffect(() => {
    // Load Wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem('Wishlist') || '[]');
    setWishlist(savedWishlist);
  }, []);

  const handleAddToCart = (book: Book) => {
    // Add to cart logic here
    console.log('Added to cart:', book);
  };

  const handleWishlistToggle = (book: Book) => {
    setWishlist(prev => {
      const isInWishlist = prev.some(item => item.id === book.id);
      let updatedWishlist;
      
      if (isInWishlist) {
        updatedWishlist = prev.filter(item => item.id !== book.id);
      } else {
        updatedWishlist = [...prev, book];
      }
      
      // Save to localStorage
      localStorage.setItem('Wishlist', JSON.stringify(updatedWishlist));
      
      return updatedWishlist;
    });
  };

  const isInWishlist = (bookId: number) => {
    return wishlist.some(item => item.id === bookId);
  };

  const renderBookCard = (book: Book) => (
    <div key={book.id} className="bookCard">
      <div className="bookImage">
        <Link to={`/product/${book.id}`} className="bookImageLink">
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
          className={`wishlistBtn ${isInWishlist(book.id) ? 'active' : ''}`}
          onClick={() => handleWishlistToggle(book)}
          title={isInWishlist(book.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <FaHeart />
        </button>
      </div>
      <div className="bookInfo">
        <Link to={`/product/${book.id}`} className="bookTitleLink">
          <h3 className="bookTitle">{book.title}</h3>
        </Link>
        <p className="bookAuthor">by {book.author}</p>
        <div className="bookRating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FaStar 
                key={i} 
                className={i < Math.floor(book.rating) ? 'star filled' : 'star'} 
              />
            ))}
          </div>
          <span className="ratingText">({book.reviewCount} reviews)</span>
        </div>
        <div className="bookPrice">
          <span className="currentPrice">${book.price}</span>
          {book.originalPrice > book.price && (
            <span className="originalPrice">${book.originalPrice}</span>
          )}
        </div>
        <p className="bookDescription">{book.description}</p>
        <div className="bookMeta">
          <span className="bookCategory">{book.category}</span>
          <span className="bookGenre">{book.genre}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Hero Section */}
      <section className="heroSection">
        <div className="heroLeft">
          <div className="heroIcon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" transform="rotate(45 12 12)" />
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" transform="rotate(90 12 12)" />
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" transform="rotate(135 12 12)" />
            </svg>
          </div>
          <p className="heroSubtitle">Discover amazing stories since 1990</p>
          <h1 className="heroTitle">BESTSELLING BOOKS</h1>
          <Link to="/bookstore" className="shopNowButton">
            SHOP NOW
          </Link>
        </div>
        <div className="heroRight">
          <div className="heroImage">
            <img src={'./src/assets/img/Lang_On_Ao.webp'} alt="The Great Gatsby" className="heroImage" />
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="categorySection">
        <div className="categoryGrid">
          <div className="categoryCard">
            <div className="categoryImage">
              <img src={'./src/assets/img/cay-cam-ngot-cua-toi.jpg'} alt="The Great Gatsby" className="productImage" />
            </div>
            <h3 className="categoryTitle">FICTION</h3>
          </div>
          <div className="categoryCard">
            <div className="categoryImage">
              <img src={'./src/assets/img/cay-cam-ngot-cua-toi.jpg'} alt="The Great Gatsby" className="productImage" />
            </div>
            <h3 className="categoryTitle">NON-FICTION</h3>
          </div>
          <div className="categoryCard">
            <div className="categoryImage">
              <img src={'./src/assets/img/cay-cam-ngot-cua-toi.jpg'} alt="The Great Gatsby" className="productImage" />
            </div>
            <h3 className="categoryTitle">SCIENCE</h3>
          </div>
          <div className="categoryCard">
            <div className="categoryImage">
              <img src={'./src/assets/img/cay-cam-ngot-cua-toi.jpg'} alt="The Great Gatsby" className="productImage" />
            </div>
            <h3 className="categoryTitle">HISTORY</h3>
          </div>
        </div>
      </section>

      {/* New Books Section */}
      <section className="featuredSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">New Books</h2>
          <p className="sectionSubtitle">
            Discover our handpicked collection of bestselling books
          </p>
        </div>
        <div className="booksGrid">
          {newBooks.map(renderBookCard)}
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featuredSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">FEATURED BOOKS</h2>
          <p className="sectionSubtitle">
            Discover our handpicked collection of bestselling books
          </p>
        </div>
        <div className="booksGrid">
          {featuredBooks.map(renderBookCard)}
        </div>
      </section>

      {/* Hot Books Section */}
      <section className="featuredSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Hot Books</h2>
          <p className="sectionSubtitle">
            Discover our handpicked collection of bestselling books
          </p>
        </div>
        <div className="booksGrid">
          {hotBooks.map(renderBookCard)}
        </div>
      </section>

      {/* Sale Books Section */}
      <section className="featuredSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Sale Books</h2>
          <p className="sectionSubtitle">
            Discover our handpicked collection of bestselling books
          </p>
        </div>
        <div className="booksGrid">
          {saleBooks.map(renderBookCard)}
        </div>
      </section>
    </>
  );
};

export default HomePage;
