import React, { useEffect, useState } from 'react';
import counterItem from "../images/counterItem.png"

const CounterTimeBooking = ({ targetDateTime }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const updateTimer = () => {
            const targetDate = new Date(targetDateTime);
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        updateTimer();
        const timerId = setInterval(updateTimer, 1000);

        return () => clearInterval(timerId);
    }, [targetDateTime]);

    return (
        <div className=" countdown-timer">
            {/*<div className="ComingSoonUserBookingFlower">*/}
            {/*    <img src={ComingSoonUserBookingFlower} alt="noPic"/>*/}
            {/*</div>*/}

            {/*<div className="ComingSoonUserBookingFlower2">*/}
            {/*    <img src={ComingSoonUserBookingFlower} alt="noPic"/>*/}
            {/*</div>*/}
            <div style={{position:"absolute",right:"140px",top:"67px",zIndex:"1"}}>
                <img style={{width:"250px",height:"190px",opacity:"0.8"}} src={counterItem} alt="noPic"/>
            </div>

            <div style={{position:"absolute",right:"325px",top:"67px",zIndex:"1"}}>
                <img style={{width:"250px",height:"190px",opacity:"0.8"}} src={counterItem} alt="noPic"/>
            </div>
            <div style={{position:"absolute",right:"510px",top:"67px",zIndex:"1"}}>
                <img style={{width:"250px",height:"190px",opacity:"0.8"}} src={counterItem} alt="noPic"/>
            </div>
            <div style={{position:"absolute",right:"695px",top:"67px",zIndex:"1"}}>
                <img style={{width:"250px",height:"190px",opacity:"0.8"}} src={counterItem} alt="noPic"/>
            </div>
            <h4>الوقت المتبقي للحجز</h4>
            <div className="countdown-timer-numbers">
                {(
                    <div className="countdown-item">
                        <span>{timeLeft.days}</span>
                        <div className="countdown-item-label">يوم</div>
                    </div>
                )}
                <div className="countdown-item">
                    <span>{timeLeft.hours}</span>
                    <div className="countdown-item-label">ساعة</div>
                </div>
                <div className="countdown-item">
                    <span>{timeLeft.minutes}</span>
                    <div className="countdown-item-label">دقيقة</div>
                </div>
                <div className="countdown-item">
                    <span>{timeLeft.seconds}</span>
                    <div className="countdown-item-label">ثانية</div>
                </div>
            </div>
        </div>
    );
};

export default CounterTimeBooking;