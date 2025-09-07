import { Book } from '../@type/book';

export const handleAddToCart = (book: Book) => {
  // Add to cart logic here
  console.log('Added to cart:', book);
};

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const calculateDiscount = (originalPrice: number, currentPrice: number): number => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

export const getUniqueCategories = (books: Book[]): string[] => {
  return [...new Set(books.map(book => book.category))];
};

export const getUniqueManufacturers = (books: Book[]): string[] => {
  return [...new Set(books.map(book => book.manufacturer).filter((manufacturer): manufacturer is string => manufacturer !== undefined))];
};
