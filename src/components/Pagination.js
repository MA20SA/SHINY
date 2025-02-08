// Pagination.js
//CSS of it in UserBooking.CSS

import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const maxButtons = 7; // max of Btn Numbers

    // Calculate the start and end page numbers // Floor of 3.5 is 3
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    // Adjust the start page if there aren't enough pages before it
    if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Ensure startPage is at least 1
    startPage = Math.max(startPage, 1);

    // Ensure endPage is at most totalPages
    endPage = Math.min(endPage, totalPages);

    return (
        // css in UserBooking.css
        <div className="pagination">
            <button
                className="arrow"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                &lt;
            </button>

            {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
                <button
                    key={startPage + index}
                    className={`pageButton ${currentPage === startPage + index ? 'active' : ''}`}
                    onClick={() => onPageChange(startPage + index)}
                >
                    {startPage + index}
                </button>
            ))}

            <button
                className="arrow"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                &gt;
            </button>
        </div>
    );
};

export default Pagination;
