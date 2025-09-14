import { useState } from 'react';
import { Book } from '../@type/book';

export const usePagination = (books: Book[], booksPerPage: number = 9, apiTotalPages?: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = apiTotalPages || Math.ceil(books.length / booksPerPage);
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
