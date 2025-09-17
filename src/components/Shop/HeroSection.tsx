import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface HeroSectionProps {
  onSearch: (keyword: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    onSearch(keyword);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
      <section className="hero">
        <div className="heroContent">
          <h1 className="heroTitle">Accompanying you on every path</h1>
          <p className="heroSubtitle">
              Explore our curated collection of books across all genres and categories
          </p>
          <div className="searchBar">
            <input
                type="text"
                placeholder="Search for books, authors, or genres..."
                className="searchInput"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyPress}
            />
            <button className="searchBtn" onClick={handleSearch}>
              <FaSearch />
            </button>
          </div>
        </div>
      </section>
  );
};

export default HeroSection;
