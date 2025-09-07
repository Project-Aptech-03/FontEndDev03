import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPaginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPaginate }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        className="paginationBtn"
        onClick={() => onPaginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      
      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            className={`paginationBtn ${currentPage === pageNumber ? 'active' : ''}`}
            onClick={() => onPaginate(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}
      
      <button 
        className="paginationBtn"
        onClick={() => onPaginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
