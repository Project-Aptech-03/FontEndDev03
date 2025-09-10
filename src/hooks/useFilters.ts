import { useState, useEffect } from 'react';
import { Book, FilterState } from '../@type/book';

export const useFilters = (books: Book[]) => {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('name');

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

    const handleManufacturerFilter = (manufacturer: string) => {
    setSelectedManufacturers(prev => 
        prev.includes(manufacturer) 
        ? prev.filter(g => g !== manufacturer)
        : [...prev, manufacturer]
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

    // Apply manufacturer filter
    if (selectedManufacturers.length > 0) {
      filtered = filtered.filter(book => selectedManufacturers.includes(book.manufacturer as string));
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
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
    setFilteredBooks(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCategories, selectedPriceRange, selectedManufacturers, sortBy, books]);

  return {
    filteredBooks,
    selectedCategories,
    selectedPriceRange,
    selectedManufacturers,
    sortBy,
    handleCategoryFilter,
    handlePriceFilter,
    handleManufacturerFilter,
    handleSort
  };
};
