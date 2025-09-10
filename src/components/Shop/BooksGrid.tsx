import React from 'react';
import { Book } from '../../@type/book';
import { SORT_OPTIONS } from '../../constants/filterOptions';
import BookCard from './BookCard';

interface BooksGridProps {
  books: Book[];
  filteredBooks: Book[];
  currentBooks: Book[];
  sortBy: string;
  onSort: (sortType: string) => void;
  isInWishlist: (bookId: number) => boolean;
  onWishlistToggle: (book: Book) => void;
  totalCount?: number;
}

const BooksGrid: React.FC<BooksGridProps> = ({
  books,
  filteredBooks,
  currentBooks,
  sortBy,
  onSort,
  isInWishlist,
  onWishlistToggle,
  totalCount
}) => {
  return (
    <main className="booksSection">
      {/* Sort and Results */}
      <div className="booksHeader">
        <div className="resultsInfo">
          <p>Showing {filteredBooks.length} of {totalCount || books.length} books</p>
        </div>
        <div className="sortOptions">
          <span>Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => onSort(e.target.value)}
            className="sortSelect"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="booksGrid">
        {currentBooks.map(book => (
          <BookCard
            key={book.id}
            book={book}
            isInWishlist={isInWishlist(book.id)}
            onWishlistToggle={onWishlistToggle}
          />
        ))}
      </div>
    </main>
  );
};

export default BooksGrid;
