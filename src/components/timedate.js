import React, { useState, useEffect } from 'react';

const Timedate = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        // Cleanup the interval on component unmount
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="timedate">
            <p>{currentTime.toLocaleDateString()}</p>
            <p>{currentTime.toLocaleTimeString()}</p>
        </div>
    );
};

export default Timedate;
