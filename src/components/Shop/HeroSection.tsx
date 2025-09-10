import React from 'react';
import { FaSearch } from 'react-icons/fa';

const HeroSection: React.FC = () => {
  return (
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
  );
};

export default HeroSection;
