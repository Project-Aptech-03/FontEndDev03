import React, { useState } from 'react';
import './BookStore.css';
import { useBooks } from '../../hooks/useBooks';
import { useWishlist } from '../../hooks/useWishlist';
import { useFilters } from '../../hooks/useFilters';
import { usePagination } from '../../hooks/usePagination';
import HeroSection from '../../components/Shop/HeroSection';
import FiltersSidebar from '../../components/Shop/FiltersSidebar';
import BooksGrid from '../../components/Shop/BooksGrid';
import Pagination from '../../components/Shop/Pagination';
import LoadingSpinner from '../../components/Shop/LoadingSpinner';

const BookStore = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  
  const { books, loading, error, totalCount, totalPages } = useBooks(currentPage, pageSize);
  const { handleWishlistToggle, isInWishlist } = useWishlist();
  
  const {
    filteredBooks,
    selectedCategories,
    selectedPriceRange,
    selectedManufacturers,
    sortBy,
    handleCategoryFilter,
    handlePriceFilter,
    handleManufacturerFilter,
    handleSort
  } = useFilters(books);

  const { currentBooks } = usePagination(filteredBooks, 9, totalPages);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bookstore">
      <HeroSection />

      <div className="mainContent">
        <FiltersSidebar
          selectedCategories={selectedCategories}
          selectedPriceRange={selectedPriceRange}
          selectedManufacturers={selectedManufacturers}
          onCategoryFilter={handleCategoryFilter}
          onPriceFilter={handlePriceFilter}
          onManufacturerFilter={handleManufacturerFilter}
        />

        <BooksGrid
          books={books}
          filteredBooks={filteredBooks}
          currentBooks={currentBooks}
          sortBy={sortBy}
          onSort={handleSort}
          isInWishlist={isInWishlist}
          onWishlistToggle={handleWishlistToggle}
          totalCount={totalCount}
        />
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPaginate={handlePageChange}
        />
      </div>
    </div>
  );
};

export default BookStore;
