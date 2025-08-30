import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHeart, FaStar, FaFilter } from 'react-icons/fa';
import './BookStore.css';

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

const BookStore = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const booksPerPage = 9;

  // Mock books data
  const mockBooks: Book[] = [
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
      price: 22.99,
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
      price: 19.99,
      originalPrice: 24.99,
      rating: 4.6,
      reviewCount: 189,
      category: "Fiction",
      genre: "Dystopian",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      description: "A chilling vision of a totalitarian society and the power of surveillance.",
      inStock: true
    },
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
    },
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

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
      setLoading(false);
    }, 1000);
    
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

  const handleCategoryFilter = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceFilter = (range: string) => {
    setSelectedPriceRange(range);
  };

  const handleGenreFilter = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
  };

  const applyFilters = () => {
    let filtered = [...books];

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(book => selectedCategories.includes(book.category));
    }

    // Apply price filter
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(book => book.price >= min && book.price <= max);
    }

    // Apply genre filter
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(book => selectedGenres.includes(book.genre));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredBooks(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, selectedPriceRange, selectedGenres, sortBy]);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loadingSpinner"></div>
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <div className="bookstore">
      {/* Hero Section */}
      <section className="hero">
        <div className="heroContent">
          <h1 className="heroTitle">Discover Your Next Great Read</h1>
          <p className="heroSubtitle">
            Explore our curated collection of books across all genres and categories
          </p>
          <div className="searchBar">
            <input 
              type="text" 
              placeholder="Search for books, authors, or genres..."
              className="searchInput"
            />
            <button className="searchBtn">
              <FaSearch />
            </button>
          </div>
        </div>
      </section>

      <div className="mainContent">
        {/* Filters Sidebar */}
        <aside className="filters">
          <div className="filterSection">
            <h3 className="filterTitle">
              <FaFilter /> Filters
            </h3>
            
            {/* Categories */}
            <div className="filterGroup">
              <h4 className="filterGroupTitle">Categories</h4>
              {['Fiction', 'Non-Fiction', 'Science', 'History'].map(category => (
                <label key={category} className="filterOption">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryFilter(category)}
                  />
                  {category}
                </label>
              ))}
            </div>

            {/* Price Range */}
            <div className="filterGroup">
              <h4 className="filterGroupTitle">Price Range</h4>
              {[
                { label: 'Under $20', value: '0-20' },
                { label: '$20 - $30', value: '20-30' },
                { label: '$30 - $50', value: '30-50' },
                { label: 'Over $50', value: '50-1000' }
              ].map(range => (
                <label key={range.value} className="filterOption">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.value}
                    checked={selectedPriceRange === range.value}
                    onChange={() => handlePriceFilter(range.value)}
                  />
                  {range.label}
                </label>
              ))}
            </div>

            {/* Genres */}
            <div className="filterGroup">
              <h4 className="filterGroupTitle">Genres</h4>
              {['Classic Literature', 'Dystopian', 'Romance', 'Fantasy', 'Coming of Age', 'Allegory', 'Political Satire'].map(genre => (
                <label key={genre} className="filterOption">
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(genre)}
                    onChange={() => handleGenreFilter(genre)}
                  />
                  {genre}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Books Grid */}
        <main className="booksSection">
          {/* Sort and Results */}
          <div className="booksHeader">
            <div className="resultsInfo">
              <p>Showing {filteredBooks.length} of {books.length} books</p>
            </div>
            <div className="sortOptions">
              <span>Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => handleSort(e.target.value)}
                className="sortSelect"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Books Grid */}
          <div className="booksGrid">
            {currentBooks.map(book => (
              <div key={book.id} className="bookCard">
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
                    className={`wishlistBtn ${isInWishlist(book.id) ? 'active' : ''}`}
                    onClick={() => handleWishlistToggle(book)}
                    title={isInWishlist(book.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
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
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="paginationBtn"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    className={`paginationBtn ${currentPage === pageNumber ? 'active' : ''}`}
                    onClick={() => paginate(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button 
                className="paginationBtn"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BookStore;
