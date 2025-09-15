// src/components/Shop/BooksGrid.tsx
import React from 'react';
import { Book } from '../../@type/book';
import { SORT_OPTIONS } from '../../constants/filterOptions';
import BookCard from './BookCard';
import { Pagination } from 'antd';

interface BooksGridProps {
    books: Book[];
    filteredBooks: Book[];
    currentBooks: Book[];
    sortBy: string;
    onSort: (sortType: string) => void;
    isInWishlist: (bookId: number) => boolean;
    onWishlistToggle: (book: Book) => void;
    totalCount?: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number, pageSize?: number) => void;
}

const BooksGrid: React.FC<BooksGridProps> = ({
                                                 books,
                                                 filteredBooks,
                                                 currentBooks,
                                                 sortBy,
                                                 onSort,
                                                 isInWishlist,
                                                 onWishlistToggle,
                                                 totalCount,
                                                 pageSize,
                                                 currentPage,
                                                 onPageChange
                                             }) => {
    return (
        <main className="booksSection">
            {/* Sort and Results */}
            <div className="booksHeader">
                <div className="resultsInfo">
                    <p>
                        Showing {currentBooks.length} of {totalCount || filteredBooks.length} books
                    </p>
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
                {currentBooks.length > 0 ? (
                    currentBooks.map(book => (
                        <BookCard
                            key={book.id}
                            book={book}
                            isInWishlist={isInWishlist(book.id)}
                            onWishlistToggle={onWishlistToggle}
                        />
                    ))
                ) : (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        padding: '40px',
                        color: '#666'
                    }}>
                        <p>No books found matching your criteria.</p>
                    </div>
                )}
            </div>

            {currentBooks.length > 0 && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalCount || filteredBooks.length}
                        onChange={onPageChange}
                        showSizeChanger={false}
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} of ${total} books`
                        }
                    />
                </div>
            )}
        </main>
    );
};

export default BooksGrid;