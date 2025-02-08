import React, {useEffect, useState} from 'react';
import Pagination from "./Pagination";
import axios from "axios";
import moment from "moment/moment";
import CircularProgress from "@mui/material/CircularProgress";
import {Link} from "react-router-dom";
import ShowUserInfoByOwner from "./ShowUserInfoByOwner";

const OwnerShowBooking = () => {
    const id = localStorage.getItem("userID");
    const [bookings, setBookings] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const bookingsPerPage = 3; // Number of bookings per page
    const [loading,setLoading]=useState(true);

    const [HallsOfOwner,setHallsOfOwner] = useState([]);
    const [SelectHall , setSelectHall]=useState(""); //save id of hall
    const handleSelectHall = (event) => {
        setSelectHall(event.target.value);
        setCurrentPage(1); // Reset page to 1 when city changes
    }; //saveIdHall

    //getHalls
    useEffect(() => {
        const fetchHallsOwner = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/hall/getHallsByOwner/${id}`);
                if (response.data.message==="Success") {
                    setHallsOfOwner(response.data.halls);
                    setSelectHall(response.data.halls[0]._id);
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
        fetchHallsOwner();
    }, []);

    const [SelectHallStatus , setSelectHallStatus]=useState("");
    const handleSelectHallStatus = (event) => {
        setSelectHallStatus(event.target.value);
        setCurrentPage(1); // Reset page to 1 when status changes
    };

    //getBookingOfThisHall  by hall id
    useEffect(()=>{
        if(SelectHall!==""){
            setLoading(true);
            const fetchHallsBooking = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/HallSchedule/${SelectHall}/Bookings`,{
                    headers:{
                        Authorization:`shiny__${localStorage.getItem("token")}`
                    }
                });
                if (response.data?.bookings) {
                    console.log(response.data)
                    setBookings(response.data.bookings.filter((b)=>{
                        return b.Status === SelectHallStatus || SelectHallStatus=== "";
                    }));
                }
            } catch (e) {
                console.error('Error fetching bookings:', e);
            }
        };
        fetchHallsBooking().finally(()=>{setLoading(false)});
        }
    },[SelectHall,SelectHallStatus])

    //confirm Booking
    const [confirmCancelId, setConfirmCancelId] = useState(null);
    const handelConfirmBooking = (id) => {
        setConfirmCancelId(id);
    };
    const cancelConfirm = () => {
        setConfirmCancelId(null);
    };
    function confirmBooking (hallId, id) {
        const ConfirmBooking = async () => {
            try {
                const response = await axios.put(`https://shinyproject.onrender.com/HallSchedule/updateBookingStatus/${hallId}/${id}`,
                    {
                        status : "مؤكد"
                    },{
                headers:{
                    Authorization:`shiny__${localStorage.getItem("token")}`
                }
                });
                if (response.data.message === "success") {
                    setConfirmCancelId(null);
                    setSuccessMessage('تم تأكيد الحجز بنجاح');
                    setTimeout(() => window.location.href= "/OwnerShowBooking", 1000);
                }
            } catch (e) {
                console.error('Error confirm booking:', e);
            }
        };
        ConfirmBooking();
    };

    //cancel booking
    const [confirmCancelBookingId, setConfirmCancelBookingId] = useState(null);
    const handelCancelBooking = (id) => {
        setConfirmCancelBookingId(id);
    };
    const cancelCancelBooking = () => {
        setConfirmCancelBookingId(null);
    };
    function confirmCancelation (hallId, id) {
        const CancelBooking = async () => {
            try {
                const response = await axios.put(`https://shinyproject.onrender.com/HallSchedule/cancelBookingWithRefundCheck/${hallId}/${id}`,
                    {
                        cancellationStatus : "NO_REFUND"
                    },{
                        headers:{
                            Authorization:`shiny__${localStorage.getItem("token")}`
                        }
                    });
                if (response.data.message === "Booking cancelled without refund") {
                    setConfirmCancelBookingId(null);
                    setSuccessMessage('تم إلغاء الحجز بنجاح');
                    setTimeout(() => window.location.href= "/OwnerShowBooking", 1000);
                }
            } catch (e) {
                console.error('Error cancel booking:', e);
            }
        };
        CancelBooking();
    };


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

    const [userId,setUserId]=useState(null);
    function onShowUserChange (userId){
        setUserId(userId);
    }
    useEffect(()=>{
        if(userId!==null) {
            window.location.href = `/ShowUserInfoByOwner/${userId}`;
        }
    },[userId])

    return (
        <div id="OwnerBookings" className="userBookings">
            {successMessage && (
                <div style={{height:"60px"}} className="successMessage">
                    {successMessage}
                </div>
            )}

            {HallsOfOwner?.length > 0 &&
                <div className="OwnerShowBookingSelect1">
                    <select value={SelectHall} onChange={handleSelectHall}>
                        {HallsOfOwner.map((h) => {
                            return <option key={h._id} value={h._id}>{h.name}</option>;
                        })}
                    </select>
                </div>
            }

            <div className="OwnerShowBookingSelect2">
                <select value={SelectHallStatus} onChange={handleSelectHallStatus}>
                    <option value="">حالة الحجز</option>
                    <option value="تم">تم</option>
                    <option value="ملغى">ملغى</option>
                    <option value="قيد المعالجة">قيد المعالجة</option>
                    <option value="مؤكد">مؤكد</option>
                    <option value="جاري التأكيد">جاري التأكيد</option>
                </select>
            </div>

            {loading?(
                <div style={{marginTop:"100px",marginRight:"520px"}}>
                    <CircularProgress />
                </div>
            ):(
            currentBookings.length > 0 ? (
                <table className="bookingsTable">
                    <thead>
                    <tr>
                        <th>وقت الحجز</th>
                        <th>الزبون</th>
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
                            className={booking.Status === 'مؤكد' ? 'confirmed' : booking.Status === 'قيد المعالجة' ? 'pending' : booking.Status === 'ملغى' ? 'canceled' : booking.Status === 'تم' ? 'disabled' : ''}
                        >
                            <td>
                                {formatDate(booking.createdAt)}
                                <br/>
                                {formatTime(booking.createdAt)}
                            </td>
                            <td>
                                {booking.bookedByUsername === "نظام الحجز"
                                // ? <Link to={`/ShowUserInfoByOwner/${showUser}`}>{showUser}{booking.username}</Link>
                                ? <span style={{cursor:"zoom-in"}} onClick={()=> onShowUserChange(booking.userId)}>{booking.username}</span>
                                : booking.bookedByUsername
                            }</td>
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
                                {
                                    // Cancel
                                    (confirmCancelBookingId === booking._id) && (booking.Status === "قيد المعالجة") ? (
                                        <>
                                            <div>
                                                <p>هل أنت متأكد أنك تريد إلغاء هذا الحجز؟</p>
                                                <button className="confirmButton"
                                                        onClick={() => confirmCancelation(booking.hallId,booking._id) }>
                                                    نعم
                                                </button>
                                                <button className="cancelButton"
                                                        onClick={cancelCancelBooking}>
                                                    لا
                                                </button>
                                            </div>
                                            <br/>
                                        </>
                                    ) : (
                                        <button className="cancelButton" onClick={() => handelCancelBooking(booking._id)}
                                                disabled={booking.Status === 'مؤكد' || booking.Status === 'ملغى' || booking.Status === 'تم'|| booking.Status === 'جاري التأكيد'}>
                                            إلغاء
                                        </button>
                                    )
                                }

                                <span> </span>

                                {/*To confirm*/}
                                {(confirmCancelId === booking._id) && (booking.Status === "جاري التأكيد") ? (
                                    <>
                                        <div>
                                            <p>هل أنت متأكد أنك تريد تأكيد هذا الحجز؟</p>
                                            <button className="confirmButton"
                                                    onClick={() => confirmBooking(booking.hallId,booking._id)}>
                                                نعم
                                            </button>
                                            <button className="cancelButton" onClick={cancelConfirm}>
                                                لا
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <button className={booking.Status === "جاري التأكيد" ? "confirmButton" : ""}
                                            onClick={() => handelConfirmBooking(booking._id)}
                                            disabled={booking.Status === 'مؤكد' || booking.Status === 'ملغى' || booking.Status === 'تم'|| booking.Status === 'قيد المعالجة'}>
                                        تأكيد
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p style={{color: "#0A499C", textAlign: "center", fontSize: "24px", marginTop: "130px"}}><b>لا توجد
                    حجوزات حالياً</b></p>
            ))}


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

export default OwnerShowBooking;