import { useState } from 'react';
import { Book } from '../@type/book';

export const usePagination = (books: Book[], booksPerPage: number = 9, apiTotalPages?: number) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Use API pagination if available, otherwise calculate from local data
  const totalPages = apiTotalPages || Math.ceil(books.length / booksPerPage);
  
  // For API pagination, we don't slice the data as it's already paginated
  // For local data, we slice it
  const currentBooks = apiTotalPages ? books : (() => {
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    return books.slice(indexOfFirstBook, indexOfLastBook);
  })();

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    currentBooks,
    paginate,
    resetPagination
  };
};
