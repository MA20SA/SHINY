import React from 'react';

const Rating = ({ rating }) => {
    const fullStars = Math.floor(rating);  // Number of full stars
    const halfStar = rating % 1 >= 0.5;    // Check if there’s a half star
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);  // Remaining empty stars

    return (
        <div className="star-rating">
            {/* Full stars */}
            {[...Array(fullStars)].map((_, index) => (
                <span key={index} className="star full">&#9733;</span>
            ))}

            {/* Half star */}
            {halfStar && <span className="star half">&#9733;</span>}

            {/* Empty stars */}
            {[...Array(emptyStars)].map((_, index) => (
                <span key={index + fullStars} className="star empty">&#9734;</span>
            ))}
        </div>
    );
};

export default Rating;
