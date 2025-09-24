import {Link, useNavigate} from 'react-router-dom';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import './Home.css';
import { useWishlist } from "../../hooks/useWishlist";
import { getTopProducts } from "../../api/orders.api";
import { getProducts } from "../../api/products.api";
import imageHome from '../../../assets/image/imageHome.jpg';
import imageHome2 from '../../../assets/image/imageHome2.jpg';
import imageHome3 from '../../../assets/image/imageHome3.jpg';
import book from '../../../assets/image/book.jpg';
import stationery from '../../../assets/image/stationery.jpg';
import Magazines from '../../../assets/image/Magazines.jpg';
import CDsDVDs from '../../../assets/image/CDsDVDs.jpg';
import {message} from "antd";
import {cartApi} from "../../api/cart.api";
import {getTop} from "../../utils/bookUtils";
import {getProductReviews} from "../../api/reviews.api";

const HomePage = () => {
  const { handleWishlistToggle, isInWishlist } = useWishlist();

  const [newBooks, setNewBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [hotBooks, setHotBooks] = useState<Book[]>([]);
  const [saleBooks, setSaleBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const transformProduct = (product: any, totalQuantity: number = 0): Book => ({
    ...product,
    rating: 0,
    reviewCount: 0,
    originalPrice: product.price * 1.2,
    totalQuantity
  });


  const categories = [
    { name: "BOOKS", image: book },
    { name: "STATIONERY", image: stationery },
    { name: "MAGAZINE", image: Magazines },
    { name: "DVD", image: CDsDVDs },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName)}`);
  };

  const fetchBooksData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productOrderStats, productsResponse] = await Promise.all([
        getTopProducts(),
        getProducts(1, 100),
      ]);

      if (!productsResponse.success || !productsResponse.data?.items) {
        throw new Error("Failed to fetch products");
      }

      let allProducts = productsResponse.data.items.map(product =>
          transformProduct(product, productOrderStats[product.id] || 0)
      );

      allProducts = await Promise.all(
          allProducts.map(async (book) => {
            try {
              const reviewRes = await getProductReviews(book.id);
              if (reviewRes.success && reviewRes.result?.data) {
                const reviews = reviewRes.result.data;
                const total = reviews.reduce((sum, r) => sum + r.rating, 0);
                return {
                  ...book,
                  rating: reviews.length ? total / reviews.length : 0,
                  reviewCount: reviews.length
                };
              }
            } catch (e) {
              console.warn(`Failed to fetch reviews for book ${book.id}`, e);
            }
            return { ...book, rating: 0, reviewCount: 0 };
          })
      );

      const newBooksData = getTop(
          allProducts,
          (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );

      const saleBooksData = getTop(
          allProducts,
          (a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      );

      const hotBooksData = getTop(
          allProducts,
          (a, b) => (b.totalQuantity ?? 0) - (a.totalQuantity ?? 0)
      );

      const featuredBooksData = getTop(
          allProducts,
          () => Math.random() - 0.5
      );

      // ✅ Set state
      setNewBooks(newBooksData);
      setSaleBooks(saleBooksData);
      setHotBooks(hotBooksData);
      setFeaturedBooks(featuredBooksData);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching data");
      console.error("Error fetching products data:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchBooksData();
  }, []);

  const handleAddToCart = async (book: Book) => {
    try {
      const response = await cartApi.addToCart(book.id, 1);
      if (response.success) {
        message.success(`Added "${book.productName}" to cart!`);
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else {
        message.error(response.message || "Failed to add to cart!");
      }
    } catch (error) {
      message.error("Error adding to cart, please try again.");
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return 'No description available.';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const renderBookCard = (book: Book) => (
      <div key={book.id} className="bookCard" style={{
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
          <Link to={`/product/${book.id}`} className="bookImageLink" style={{
            display: 'block',
            height: '100%'
          }}>
            <img
                src={book.photos?.[0]?.photoUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop'}
                alt={book.productName}
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop';
                }}
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
                disabled={book.stockQuantity <= 0}
            >
              {book.stockQuantity > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
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
              {truncateText(book.productName, 50)}
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
            by {truncateText(book.author || book.publisher?.publisherName || book.manufacturer?.manufacturerName || 'Unknown Author', 25)}
          </p>

          <div className="bookRating" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            height: '20px'
          }}>
            <div className="stars" style={{ display: 'flex', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                  <FaStar
                      key={i}
                      className={i < Math.floor(book.rating || 0) ? 'star filled' : 'star'}
                      style={{ fontSize: '12px' }}
                  />
              ))}
            </div>
            <span className="ratingText" style={{
              fontSize: '12px',
              color: '#666'
            }}>({book.reviewCount || 0})</span>
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
          }}>${book.price}</span>
            {book.originalPrice && book.originalPrice > book.price && (
                <span className="originalPrice" style={{
                  fontSize: '14px',
                  color: '#999',
                  textDecoration: 'line-through'
                }}>${book.originalPrice}</span>
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
            marginBottom: '8px',
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
            {truncateText(book.category?.categoryName || 'Unknown', 15)}
          </span>
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
            {truncateText(book.manufacturer?.manufacturerName || 'Unknown', 15)}
          </span>
          </div>

          {book.totalQuantity !== undefined && book.totalQuantity > 0 && (
              <div className="orderCount" style={{
                marginTop: 'auto',
                height: '16px'
              }}>
                <small style={{
                  fontSize: '11px',
                  color: '#28a745',
                  fontWeight: '500'
                }}>Total Sales: {book.totalQuantity}</small>
              </div>
          )}
        </div>
      </div>
  );

  if (loading) {
    return (
        <div className="loading-container" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '18px'
        }}>
          Loading books...
        </div>
    );
  }

  if (error) {
    return (
        <div className="error-container" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          color: 'red'
        }}>
          <h3>Error loading books</h3>
          <p>{error}</p>
          <button
              onClick={fetchBooksData}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
          >
            Try Again
          </button>
        </div>
    );
  }

  return (
      <>
        {/* Hero Section */}
        <section className="heroSectionHome">
          <div className="heroLeftHome">
            <div className="heroIcon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                      transform="rotate(45 12 12)"/>
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                      transform="rotate(90 12 12)"/>
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                      transform="rotate(135 12 12)"/>
              </svg>
            </div>
            <p className="heroSubtitleHome">"Knowledge is power." - Francis Bacon</p>
            <h1 className="heroTitleHome">Shradha BookStore</h1>
            <Link to="/shop" className="shopNowButton">
              SHOP NOW
            </Link>
          </div>
          <div className="heroRight">
            <div className="heroImageWrapper">
              <img src={imageHome} alt="Featured Book" className="heroImage"/>
            </div>
            <div className="heroImageWrapper">
              <img src={imageHome2} alt="Featured Book" className="heroImage"/>
            </div>
            <div className="heroImageWrapper">
              <img src={imageHome3} alt="Featured Book" className="heroImage"/>
            </div>
          </div>
        </section>

        {/* Category Section */}
        <section className="categorySection">
          <div className="categoryGrid">
            {categories.map((cat) => (
                <div
                    key={cat.name}
                    className="categoryCard"
                    onClick={() => handleCategoryClick(cat.name)}
                >
                  <div className="categoryImage">
                    <img src={cat.image} alt={cat.name} className="productImage"/>
                  </div>
                  <h3 className="categoryTitle">{cat.name}</h3>
                </div>
            ))}
          </div>
        </section>

        {/* New Products Section */}
        <section className="featuredSection" style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '40px', marginBottom: '40px' }}>
          <div className="sectionHeader" style={{ marginBottom: '20px' }}>
            <h2 className="sectionTitle">New Products</h2>
            <p className="sectionSubtitle">
              Latest additions to our collection - recently published books
            </p>
          </div>
          <div className="booksGrid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            padding: '0 20px'
          }}>
            {newBooks.length > 0 ? newBooks.map(renderBookCard) : (
                <p>No new products available at the moment.</p>
            )}
          </div>
        </section>

        {/* Featured Books Section */}
        <section className="featuredSection" style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '40px', marginBottom: '40px' }}>
          <div className="sectionHeader" style={{ marginBottom: '20px' }}>
            <h2 className="sectionTitle">Featured Books</h2>
            <p className="sectionSubtitle">
              Discover our handpicked collection of recommended products
            </p>
          </div>
          <div className="booksGrid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            padding: '0 20px'
          }}>
            {featuredBooks.length > 0 ? featuredBooks.map(renderBookCard) : (
                <p>No featured products available at the moment.</p>
            )}
          </div>
        </section>

        {/* Hot Products Section */}
        <section className="featuredSection" style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '40px', marginBottom: '40px' }}>
          <div className="sectionHeader" style={{ marginBottom: '20px' }}>
            <h2 className="sectionTitle">Hot Products</h2>
            <p className="sectionSubtitle">
              Most popular products - bestsellers based on customer orders
            </p>
          </div>
          <div className="booksGrid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            padding: '0 20px'
          }}>
            {hotBooks.length > 0 ? hotBooks.map(renderBookCard) : (
                <p>No hot products available at the moment.</p>
            )}
          </div>
        </section>

        {/* Sale Products Section */}
        <section className="featuredSection">
          <div className="sectionHeader" style={{ marginBottom: '20px' }}>
            <h2 className="sectionTitle">Sale Products</h2>
            <p className="sectionSubtitle">
              Timeless classics - products that have stood the test of time
            </p>
          </div>
          <div className="booksGrid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            padding: '0 20px'
          }}>
            {saleBooks.length > 0 ? saleBooks.map(renderBookCard) : (
                <p>No classic books available at the moment.</p>
            )}
          </div>
        </section>
      </>
  );
};

export default HomePage;