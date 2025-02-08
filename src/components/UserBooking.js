import React, { useEffect, useState } from 'react';
import CounterTimeBooking from "./CounterTimeBooking";
import Pagination from "./Pagination";
import axios from "axios";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";


const UserBooking = () => {

    const [bookings, setBookings] = useState([]);
    const [confirmCancelId, setConfirmCancelId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    // const userEmail = localStorage.getItem("userEmail");

    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const bookingsPerPage = 3; // Number of bookings per page
    const [loading,setLoading] = useState(true);

    //Fetch Booking for this user
    useEffect(() => {
            const FetchBooking = async () => {
                try {
                    const response = await axios.get(`https://shinyproject.onrender.com/HallSchedule/`,
                        {
                            headers:{
                                Authorization:`shiny__${localStorage.getItem("token")}`
                            }
                        });
                    if (response.data?.bookings) {
                        setBookings(response.data.bookings);
                        setCurrentPage(1);
                    }
                } catch (e) {
                    console.error('Error fetching bookings:', e);
                }
            };
            FetchBooking().finally(()=>{setLoading(false)});
    }, []);

    //Click in Cancel
    const handleCancelBooking = (id) => {
        setConfirmCancelId(id);
    };

    //click in confirm cancel by booking id
    function confirmCancellation (id) {
        const CancelBookingUser = async () => {
            try {
                const response = await axios.put(`https://shinyproject.onrender.com/HallSchedule/requestCancellBookingByUser/${id}`,{

                },
                    {
                        headers:{
                            Authorization:`shiny__${localStorage.getItem("token")}`
                        }
                    });
                if (response.data) {
                    setConfirmCancelId(null);
                    setSuccessMessage('تم إرسال طلب الإلغاء بنجاح');
                    setTimeout(() => {window.location.href = "/UserBooking"}, 1000);
                }
            } catch (e) {
                console.error('Error cancel booking:', e);
            }
        };
        CancelBookingUser();
    };

    //click in cancel of cancel
    const cancelCancelation = () => {
        setConfirmCancelId(null);
    };

    //Just Make One Confirmed Booking

    //If a.startDateTime is earlier than b.startDateTime,
    // the difference will be negative → a comes before b
    const mostRecentBooking = bookings
        .filter(booking => booking.Status === 'مؤكد')
        .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))[0] || null;

    // Calculate bookings for the current page
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = bookings.slice(indexOfFirstBooking, indexOfLastBooking);

    // Pagination logic
    const totalPages = Math.ceil(bookings.length / bookingsPerPage);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const formatDate = (date) => {
        return moment(date, 'YYYY-MM-DD hh:mm A').format('DD-MM-YYYY'); // Only get the date part
    };
    const formatTime = (date) => {
        return moment(date, 'DD-MM-YYYY hh:mm A').format('hh:mm A'); // Only get the time part
    };
    return (
        <div className="userBookings">
            {successMessage && (
                <div className="successMessage">
                    {successMessage}
                </div>
            )}
            {mostRecentBooking && (
                <div className="recentBooking">
                    <CounterTimeBooking targetDateTime={mostRecentBooking.startDateTime} />
                </div>
            )}
            {loading?(
                <div style={{marginTop:"100px",marginRight:"520px"}}>
                <CircularProgress />
                </div>
            ):(
            currentBookings?.length > 0 ? (
                <table className="bookingsTable">
                    <thead>
                    <tr>
                        <th>الصالة</th>
                        <th>المناسبة</th>
                        <th>التاريخ</th>
                        <th>الوقت</th>
                        <th>المبلغ</th>
                        <th>العربون</th>
                        <th>حالة الحجز</th>
                        <th>إلغاء</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentBookings.map(booking => (
                        <tr key={booking._id}
                            className={booking.Status === 'مؤكد' ? 'confirmed' : booking.Status === 'قيد المعالجة' ? 'pending' : booking.Status === 'ملغى' ? 'canceled' : ''}>
                            <td>{booking.hallName}</td>
                            <td>{booking.eventName}</td>
                            <td>{formatDate(booking.startDateTime)}</td>
                            <td>
                                {formatTime(booking.startDateTime)}
                                <br/>
                                {formatTime(booking.endDateTime)}
                            </td>
                            <td>{booking.finalBookingPrice}</td>
                            <td>{booking.Arbon}</td>
                            <td>{booking.Status}</td>
                            <td>
                                {confirmCancelId === booking._id ? (
                                    <div>
                                        <p>هل أنت متأكد أنك تريد إلغاء هذا الحجز؟</p>
                                        <button className="confirmButton"
                                                onClick={() => confirmCancellation(booking._id)}>
                                            نعم
                                        </button>
                                        <button className="cancelButton" onClick={cancelCancelation}>
                                            لا
                                        </button>
                                    </div>
                                ) : (
                                    <button className="cancelButton" onClick={() => handleCancelBooking(booking._id)}
                                            disabled={booking.Status === 'قيد المعالجة' || booking.Status === 'ملغى' || booking.Status === 'تم' }>
                                        إلغاء
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p style={{color: "#0A499C", textAlign: "center", fontSize: "24px", marginTop: "50px"}}><b>لا توجد
                    حجوزات حالياً</b></p>
            ))
            }

            <div style={{position:"relative",top:"-600px"}}>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    );

};

export default UserBooking;

