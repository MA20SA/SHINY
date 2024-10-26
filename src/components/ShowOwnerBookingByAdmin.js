import React, { useEffect, useState } from 'react';
import Pagination from "./Pagination";
import axios from "axios";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import {useParams} from "react-router-dom";


const ShowOwnerBookingByAdmin = () => {
    const {id}=useParams();
    const [bookings, setBookings] = useState([]);

    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const bookingsPerPage = 3; // Number of bookings per page
    const [loading,setLoading] = useState(true);
    const [hallName,setHallName]=useState("");

    useEffect(() => {
        const FetchBooking = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/user/getConfirmedBookingsByHall/${id}`,
                    {
                        headers:{
                            Authorization:`shiny__${localStorage.getItem("token")}`
                        }
                    });
                if (response.data?.message==="success") {
                    console.log(response.data)
                    setBookings(response.data.bookings);
                    setHallName(response.data.hall.name)
                    setCurrentPage(1);
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
        // const intervalId = setInterval(() => {
        FetchBooking().finally(()=>{setLoading(false)});
        // },1000);

        // // Clean up the interval when the component unmounts
        // return () => {
        //     clearInterval(intervalId);
        // };
    }, []);


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
        <div id="ShowOwnerBookingByAdmin" className="userBookings">

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
                            <th>حالة الحجز</th>
                        </tr>
                        </thead>
                        <tbody>
                        {currentBookings.map(booking => (
                            <tr key={booking._id}>
                                <td>{hallName}</td>
                                <td>{booking.eventName}</td>
                                <td>{formatDate(booking.startDateTime)}</td>
                                <td>
                                    {formatTime(booking.startDateTime)}
                                    <br/>
                                    {formatTime(booking.endDateTime)}
                                </td>
                                <td>{booking.finalBookingPrice}</td>
                                <td>{booking.Status}</td>
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

export default ShowOwnerBookingByAdmin;

