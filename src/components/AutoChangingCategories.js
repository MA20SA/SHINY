import React, { useEffect, useState } from 'react';
import Rating from './Rating';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AutoChangingCategories = () => {
    const [halls, setHalls] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const response = await axios.get('https://shinyproject.onrender.com/hall/');
                if (response.data?.halls) {
                    setHalls(response.data.halls.filter((h) => h.isDisabled === false));
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };

        fetchHalls();
        const fetchInterval = setInterval(fetchHalls, 60000); // Fetch every 60 seconds

        return () => clearInterval(fetchInterval);
    }, []);

    useEffect(() => {
        if (halls.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 3) % halls.length);
            }, 3000); // Change every 3 seconds

            return () => clearInterval(interval);
        }
    }, [halls]);

    const displayedHalls =
        halls.length > 0
            ? Array.from({ length: Math.min(3, halls.length) }, (_, i) => halls[(currentIndex + i) % halls.length])
            : [];

    return (
        <div className="auto-changing-categories">
            <div className="hall-row">
                {displayedHalls.map((hall) => (
                    <Link
                        key={hall._id}
                        className="hall-item"
                        style={{ textDecoration: 'none' }}
                        to={`/DetailsOfHall/${hall._id}`}
                    >
                        <div>
                            <div className="hall-image" style={{ backgroundImage: `url(${hall.hallImage})` }} />
                            <div className="hall-details">
                                <h4 className="pt-1">
                                    <b>{hall.name}</b>
                                </h4>
                                <p style={{ paddingTop: '5px' }}>{hall.address}</p>
                                <p>
                                    الأسعار:
                                    <span> </span>
                                    ₪{hall.priceRange.max}-{hall.priceRange.min}
                                </p>
                                <div style={{ position: 'relative', top: '-80px', right: '220px' }}>
                                    <Rating rating={hall.rating} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AutoChangingCategories;
