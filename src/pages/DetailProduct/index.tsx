
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaHeart, FaShoppingCart, FaShare, FaArrowLeft, FaTruck, FaShieldAlt, FaUndo, FaEye, FaEyeSlash } from 'react-icons/fa';
import './ProductDetailPage.css';
import {useEffect, useState} from "react";

interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

interface RelatedProduct {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
}

interface Product {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  category: string;
  manufacturer: string;
  description: string;
  longDescription: string;
  inStock: boolean;
  stockCount: number;
  pages: number;
  language: string;
  publisher: string;
  publicationDate: string;
  isbn: string;
  format: string;
  dimensions: string;
  weight: string;
  images: string[];
  reviews: Review[];
  relatedProducts: RelatedProduct[];
}

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Mock product data - in real app, this would come from API
  const mockProduct: Product = {
    id: parseInt(id || '1'),
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.5,
    reviewCount: 128,
    category: "Fiction",
    manufacturer: "Classic Literature",
    description: "A literary classic exploring themes of decadence, idealism, and the American Dream. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    longDescription: `The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.

A literary classic exploring themes of decadence, idealism, resistance to change, social upheaval, and excess, The Great Gatsby creates a portrait of the Jazz Age or the Roaring Twenties that has been described as a cautionary tale regarding the American Dream.

The novel was inspired by a youthful romance Fitzgerald had with socialite Ginevra King, and the riotous parties he attended on Long Island's North Shore in 1922. Following a move to the French Riviera, Fitzgerald completed a rough draft of the novel in 1924. He submitted it to editor Maxwell Perkins, who persuaded Fitzgerald to revise the work over the following winter. After making revisions, Fitzgerald was satisfied with the text, but remained ambivalent about the book's title and considered several alternatives. Painter Francis Cugat's cover art greatly impressed Fitzgerald, and he incorporated its imagery into the novel.

After its publication by Scribner's in April 1925, The Great Gatsby received generally favorable reviews, though some literary critics believed it did not equal Fitzgerald's previous efforts. Compared to his earlier novels, Gatsby was a commercial disappointment. It sold fewer than 20,000 copies by October, and Fitzgerald's hopes of a monetary windfall from the novel were unrealized. When the author died in 1940, he believed himself to be a failure and his work forgotten.

During World War II, the novel experienced an abrupt surge in popularity when the Council on Books in Wartime distributed free copies to American soldiers serving overseas. This new-found popularity launched a critical and scholarly re-examination, and the work soon became a core part of most American high school curricula and a focus of American popular culture. Numerous stage and film adaptations followed in the subsequent decades.`,
    inStock: true,
    stockCount: 45,
    pages: 180,
    language: "English",
    publisher: "Scribner",
    publicationDate: "April 10, 1925",
    isbn: "978-0743273565",
    format: "Hardcover",
    dimensions: "5.5 x 8.25 inches",
    weight: "12 ounces",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop"
    ],
    reviews: [
      {
        id: 1,
        user: "Sarah Johnson",
        rating: 5,
        date: "2024-01-15",
        title: "A Timeless Masterpiece",
        comment: "This book completely changed my perspective on the American Dream. Fitzgerald's prose is absolutely beautiful and the story is both heartbreaking and enlightening."
      },
      {
        id: 2,
        user: "Michael Chen",
        rating: 4,
        date: "2024-01-10",
        title: "Classic for a Reason",
        comment: "The Great Gatsby is a beautifully written novel that captures the essence of the Jazz Age. The characters are complex and the themes are still relevant today."
      },
      {
        id: 3,
        user: "Emily Rodriguez",
        rating: 5,
        date: "2024-01-05",
        title: "Absolutely Stunning",
        comment: "I've read this book multiple times and each time I discover something new. The symbolism and themes are masterfully woven throughout the narrative."
      }
    ],
    relatedProducts: [
      {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 22.99,
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"
      },
      {
        id: 3,
        title: "1984",
        author: "George Orwell",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"
      },
      {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        price: 21.99,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"
      }
    ]
  };

  useEffect(() => {

    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 1000);

    const wishlist = JSON.parse(localStorage.getItem('Wishlist') || '[]');
    setIsInWishlist(wishlist.some((item: Product) => item.id === parseInt(id || '1')));
  }, [id]);

  const handleAddToCart = () => {

    console.log('Added to cart:', { ...product, quantity });
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    const wishlist = JSON.parse(localStorage.getItem('Wishlist') || '[]');
    let updatedWishlist;
    
    if (isInWishlist) {
      updatedWishlist = wishlist.filter((item: Product) => item.id !== product.id);
    } else {
      updatedWishlist = [...wishlist, product];
    }
    
    localStorage.setItem('Wishlist', JSON.stringify(updatedWishlist));
    setIsInWishlist(!isInWishlist);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: `Check out ${product?.title} by ${product?.author}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loadingSpinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error">
        <h2>Product not found</h2>
        <Link to="/shop" className="backBtn">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="productDetail">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <button className="backBtn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <span> / </span>
        <Link to="/shop">Shop</Link>
        <span> / </span>
        <span>{product.category}</span>
        <span> / </span>
        <span>{product.title}</span>
      </div>

      <div className="productContainer">
        {/* Product Images */}
        <div className="productImages">
          <div className="mainImage">
            <img src={product.images[selectedImage]} alt={product.title} />
          </div>
          <div className="thumbnailImages">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.title} ${index + 1}`}
                className={selectedImage === index ? 'active' : ''}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="productInfo">
          <div className="productHeader">
            <h1 className="productTitle">{product.title}</h1>
            <p className="productAuthor">by {product.author}</p>
            
            <div className="productRating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < Math.floor(product.rating) ? 'star filled' : 'star'} 
                  />
                ))}
              </div>
              <span className="ratingText">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="productPrice">
            <span className="currentPrice">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="originalPrice">${product.originalPrice}</span>
            )}
            {product.originalPrice > product.price && (
              <span className="discount">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          <div className="productAvailability">
            <span className={`stockStatus ${product.inStock ? 'inStock' : 'outOfStock'}`}>
              {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
            </span>
          </div>

          <div className="productActions">
            <div className="quantitySelector">
              <label>Quantity:</label>
              <div className="quantityControls">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stockCount}
                >
                  +
                </button>
              </div>
            </div>

            <div className="actionButtons">
              <button 
                className="addToCartBtn"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button 
                className={`wishlistBtn ${isInWishlist ? 'active' : ''}`}
                onClick={handleWishlistToggle}
              >
                <FaHeart />
              </button>
              <button className="shareBtn" onClick={handleShare}>
                <FaShare />
              </button>
            </div>
          </div>

          <div className="productFeatures">
            <div className="feature">
              <FaTruck />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="feature">
              <FaShieldAlt />
              <span>Secure payment</span>
            </div>
            <div className="feature">
              <FaUndo />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="productTabs">
        <div className="tabHeaders">
          <button 
            className={`tabHeader ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`tabHeader ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Product Details
          </button>
          <button 
            className={`tabHeader ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.reviews.length})
          </button>
        </div>

        <div className="tabContent">
          {activeTab === 'description' && (
            <div className="descriptionTab">
              <p className={showFullDescription ? 'fullDescription' : 'shortDescription'}>
                {showFullDescription ? product.longDescription : product.description}
              </p>
              <button 
                className="toggleDescriptionBtn"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? <FaEyeSlash /> : <FaEye />}
                {showFullDescription ? ' Show Less' : ' Read More'}
              </button>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="detailsTab">
              <div className="detailsGrid">
                <div className="detailItem">
                  <span className="detailLabel">Pages:</span>
                  <span className="detailValue">{product.pages}</span>
                </div>
                <div className="detailItem">
                  <span className="detailLabel">Language:</span>
                  <span className="detailValue">{product.language}</span>
                </div>
                <div className="detailItem">
                  <span className="detailLabel">Publisher:</span>
                  <span className="detailValue">{product.publisher}</span>
                </div>
                <div className="detailItem">
                  <span className="detailLabel">Publication Date:</span>
                  <span className="detailValue">{product.publicationDate}</span>
                </div>
                <div className="detailItem">
                  <span className="detailLabel">ISBN:</span>
                  <span className="detailValue">{product.isbn}</span>
                </div>
                <div className="detailItem">
                  <span className="detailLabel">Format:</span>
                  <span className="detailValue">{product.format}</span>
                </div>
                <div className="detailItem">
                  <span className="detailLabel">Dimensions:</span>
                  <span className="detailValue">{product.dimensions}</span>
                </div>
                <div className="detailItem">
                  <span className="detailLabel">Weight:</span>
                  <span className="detailValue">{product.weight}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviewsTab">
              <div className="reviewsSummary">
                <div className="averageRating">
                  <h3>{product.rating}</h3>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={i < Math.floor(product.rating) ? 'star filled' : 'star'} 
                      />
                    ))}
                  </div>
                  <p>Based on {product.reviewCount} reviews</p>
                </div>
              </div>
              
              <div className="reviewsList">
                {product.reviews.map(review => (
                  <div key={review.id} className="reviewItem">
                    <div className="reviewHeader">
                      <div className="reviewerInfo">
                        <h4>{review.user}</h4>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < review.rating ? 'star filled' : 'star'} 
                            />
                          ))}
                        </div>
                      </div>
                      <span className="reviewDate">{review.date}</span>
                    </div>
                    <h5 className="reviewTitle">{review.title}</h5>
                    <p className="reviewComment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="relatedProducts">
        <h2>You might also like</h2>
        <div className="relatedProductsGrid">
          {product.relatedProducts.map(relatedProduct => (
            <Link 
              key={relatedProduct.id} 
              to={`/detail-product/${relatedProduct.id}`}
              className="relatedProductCard"
            >
              <img src={relatedProduct.image} alt={relatedProduct.title} />
              <div className="relatedProductInfo">
                <h3>{relatedProduct.title}</h3>
                <p>by {relatedProduct.author}</p>
                <span className="price">${relatedProduct.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
