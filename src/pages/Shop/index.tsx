import React, { useState, useMemo, useEffect } from 'react';
import './BookStore.css';
import { useBooks } from '../../hooks/useBooks';
import { useWishlist } from '../../hooks/useWishlist';
import HeroSection from '../../components/Shop/HeroSection';
import FiltersSidebar from '../../components/Shop/FiltersSidebar';
import BooksGrid from '../../components/Shop/BooksGrid';
import LoadingSpinner from '../../components/Shop/LoadingSpinner';
import { usePagination } from '../../hooks/usePagination';
import { Category, Manufacturer } from "../../@type/products";
import { getCategory } from "../../api/category.api";
import { getManufacturers } from "../../api/manufacturer.api";

const BookStore: React.FC = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    selectedCategories: ['Books'] as string[],
    selectedPriceRange: '',
    selectedManufacturers: [] as string[]
  });
  const [sortBy, setSortBy] = useState('title');
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const pageSize = 6;

  const { handleWishlistToggle, isInWishlist } = useWishlist();
  const { books, loading, fetchBooks } = useBooks(1, pageSize, filters.keyword);

  // Khi HeroSection search
  const handleSearch = (keyword: string) => {
    setFilters(prev => ({ ...prev, keyword }));
    fetchBooks(1, pageSize, keyword); // gọi API với keyword mới
  };

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const categoryRes = await getCategory(1, 100);
        setCategories(categoryRes.data.items);

        const manufacturerRes = await getManufacturers(1, 100);
        setManufacturers(manufacturerRes.data.items);
      } catch (error) {
        console.error('Error fetching filter options', error);
      }
    };
    fetchFilters();
  }, []);

  // Filter + sort client-side
  const filteredBooks = useMemo(() => {
    let filtered = [...books];

    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(book =>
          filters.selectedCategories.includes(book.category || '')
      );
    }

    if (filters.selectedManufacturers.length > 0) {
      filtered = filtered.filter(book =>
          filters.selectedManufacturers.includes(book.manufacturer || '')
      );
    }

    if (filters.selectedPriceRange) {
      const [min, max] = filters.selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(book => {
        const price = book.price;
        if (max) return price >= min && price <= max;
        return price >= min;
      });
    }

    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
    }

    return filtered;
  }, [books, filters, sortBy]);

  // Pagination
  const { currentPage, currentBooks, paginate, resetPagination } = usePagination({
    books: filteredBooks,
    booksPerPage: pageSize
  });

  // Filters handlers
  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
          ? prev.selectedCategories.filter(c => c !== category)
          : [...prev.selectedCategories, category]
    }));
    resetPagination();
  };

  const handlePriceFilter = (range: string) => {
    setFilters(prev => ({
      ...prev,
      selectedPriceRange: prev.selectedPriceRange === range ? '' : range
    }));
    resetPagination();
  };

  const handleManufacturerFilter = (manufacturer: string) => {
    setFilters(prev => ({
      ...prev,
      selectedManufacturers: prev.selectedManufacturers.includes(manufacturer)
          ? prev.selectedManufacturers.filter(m => m !== manufacturer)
          : [...prev.selectedManufacturers, manufacturer]
    }));
    resetPagination();
  };

  const handleSort = (sortType: string) => {
    setSortBy(sortType);
    resetPagination();
  };

  if (loading) return <LoadingSpinner />;

  return (
      <div>
        <HeroSection onSearch={handleSearch} />
        <div className="mainContent">
          <FiltersSidebar
              selectedCategories={filters.selectedCategories}
              selectedPriceRange={filters.selectedPriceRange}
              selectedManufacturers={filters.selectedManufacturers}
              onCategoryFilter={handleCategoryFilter}
              onPriceFilter={handlePriceFilter}
              onManufacturerFilter={handleManufacturerFilter}
              categories={categories}
              manufacturers={manufacturers}
          />

          <div className="booksSectionWrapper">
            <div className="booksGridContainer">
              <BooksGrid
                  books={books}
                  filteredBooks={filteredBooks}
                  currentBooks={currentBooks}
                  sortBy={sortBy}
                  onSort={handleSort}
                  isInWishlist={isInWishlist}
                  onWishlistToggle={handleWishlistToggle}
                  totalCount={filteredBooks.length}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={paginate}
              />
            </div>
          </div>
        </div>
      </div>
  );
};

export default BookStore;
