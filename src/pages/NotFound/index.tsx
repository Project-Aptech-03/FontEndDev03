
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import './NotFoundPage.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="notFoundPage">
      {/* Background Pattern */}
      <div className="backgroundPattern">
        <div className="patternCircle circle1"></div>
        <div className="patternCircle circle2"></div>
        <div className="patternCircle circle3"></div>
        <div className="patternCircle circle4"></div>
      </div>

      {/* Main Content */}
      <div className="notFoundContent">
        {/* Error Code */}
        <div className="errorCode">
          <span className="errorNumber">4</span>
          <div className="errorIcon">
            <FaExclamationTriangle />
          </div>
          <span className="errorNumber">4</span>
        </div>

        {/* Error Message */}
        <div className="errorMessage">
          <h1 className="errorTitle">Oops! Page Not Found</h1>
          <p className="errorDescription">
            The page you're looking for doesn't exist or has been moved. 
            Don't worry, we'll help you get back on track!
          </p>
        </div>

        {/* Search Section */}
        <div className="searchSection">
          <h2 className="searchTitle">Looking for something specific?</h2>
          <div className="searchBox">
            <FaSearch className="searchIcon" />
            <input 
              type="text" 
              placeholder="Search our website..." 
              className="searchInput"
            />
            <button className="searchButton">Search</button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="quickLinks">
          <h3 className="quickLinksTitle">Quick Navigation</h3>
          <div className="linksGrid">
            <Link to="/" className="quickLink">
              <FaHome className="linkIcon" />
              <span>Home</span>
            </Link>
            <Link to="/shop" className="quickLink">
              <FaSearch className="linkIcon" />
              <span>Shop</span>
            </Link>
            <Link to="/about" className="quickLink">
              <FaSearch className="linkIcon" />
              <span>About</span>
            </Link>
            <Link to="/contact" className="quickLink">
              <FaSearch className="linkIcon" />
              <span>Contact</span>
            </Link>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="actionButtons">
          <button className="actionBtn secondary" onClick={handleGoBack}>
            <FaArrowLeft className="btnIcon" />
            Go Back
          </button>
          <button className="actionBtn primary" onClick={handleGoHome}>
            <FaHome className="btnIcon" />
            Go Home
          </button>
        </div>

        {/* Help Section */}
        <div className="helpSection">
          <h3 className="helpTitle">Need Help?</h3>
          <p className="helpText">
            If you're still having trouble finding what you're looking for, 
            our support team is here to help!
          </p>
          <div className="helpLinks">
            <Link to="/contact" className="helpLink">Contact Support</Link>
            <Link to="/about" className="helpLink">About Us</Link>
            <Link to="/shop" className="helpLink">Browse Products</Link>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="decorativeElements">
        <div className="floatingElement element1">📚</div>
        <div className="floatingElement element2">🎯</div>
        <div className="floatingElement element3">✨</div>
        <div className="floatingElement element4">🌟</div>
      </div>
    </div>
  );
};

export default NotFound;
