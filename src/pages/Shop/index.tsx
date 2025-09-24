import React, {useState, useMemo, useEffect, useRef} from 'react';
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
import useQuery from "../../hooks/useShop";
import {getProductReviews} from "../../api/reviews.api";
const BookStore: React.FC = () => {
  const query = useQuery();
  const initialCategory = query.get("category") || "Books";
  const [filters, setFilters] = useState({
    keyword: '',
    selectedCategories: [initialCategory],
    selectedPriceRange: '',
    selectedManufacturers: [] as string[]
  });
  const [sortBy, setSortBy] = useState('title');
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const pageSize = 6;

  const { handleWishlistToggle, isInWishlist } = useWishlist();

  const { books, loading, fetchBooks, setBooks } = useBooks(filters.keyword);
  const handleSearch = (keyword: string) => {
    setFilters(prev => ({ ...prev, keyword }));
    fetchBooks(keyword);
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
  useEffect(() => {
    const controller = new AbortController();

    const fetchBookReviews = async () => {
      const updatedBooks = await Promise.all(
          books.map(async (book) => {
            try {
              const reviewRes = await getProductReviews(book.id, { signal: controller.signal });
              if (reviewRes.success && reviewRes.result?.data) {
                const reviews = reviewRes.result.data;
                const total = reviews.reduce((sum, r) => sum + r.rating, 0);
                return {
                  ...book,
                  rating: reviews.length ? total / reviews.length : 0,
                  reviewCount: reviews.length,
                };
              }
              return { ...book, rating: 0, reviewCount: 0 };
            } catch (err: any) {
              if (err.name === "AbortError") return book;
              throw err;
            }
          })
      );
      setBooks(updatedBooks); // ✅ giờ dùng được
    };

    if (books.length > 0) fetchBookReviews();

    return () => controller.abort();
  }, [books, setBooks]);


  const initialSetDone = useRef(false);
  useEffect(() => {
    if (initialSetDone.current) return;
    if (categories.length > 0) {
      const categoryFromQuery = query.get("category") || "Books";
      const matchedCategory = categories.find(
          cat => cat.categoryName.toLowerCase() === categoryFromQuery.toLowerCase()
      );
      if (matchedCategory) {
        setFilters(prev => ({
          ...prev,
          selectedCategories: [matchedCategory.categoryName]
        }));
      }
      initialSetDone.current = true;
    }

  }, [query]);
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

  const { currentPage, currentBooks, paginate, resetPagination } = usePagination({
    books: filteredBooks,
    booksPerPage: pageSize
  });

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
                  books={currentBooks}
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
