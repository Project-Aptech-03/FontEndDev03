import { useState, useMemo } from 'react';
import { Book } from '../@type/book';

interface UsePaginationProps {
  books: Book[];
  booksPerPage?: number;
  apiTotalCount?: number; // tổng số sách từ API, nếu có
}

export const usePagination = ({ books, booksPerPage = 6, apiTotalCount }: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Tính tổng số trang
  const totalPages = useMemo(() => {
    if (apiTotalCount !== undefined) {
      return Math.ceil(apiTotalCount / booksPerPage);
    }
    return Math.ceil(books.length / booksPerPage);
  }, [books.length, booksPerPage, apiTotalCount]);

  // Lấy danh sách sách của trang hiện tại
  const currentBooks = useMemo(() => {
    if (apiTotalCount !== undefined) {
      // Nếu dùng API, assume API trả đúng dữ liệu cho trang hiện tại
      return books;
    }
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    return books.slice(indexOfFirstBook, indexOfLastBook);
  }, [books, currentPage, booksPerPage, apiTotalCount]);

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
