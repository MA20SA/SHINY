import React, {useEffect, useRef, useState} from 'react';
import {useParams,useNavigate} from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import HallUnderName from "../images/HallUnderName.png";
import BookingHallCouple from "../images/BookingHallCouple.png";
import AlertToLogIn from "./AlertToLogIn";
import SignInAlert from "./SignInAlert";
import axios from "axios";
import moment from "moment/moment";

const BookingHall = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const {id } = useParams();

    const [showAlertToLogIn, setShowAlertToLogIn] = useState(false);
    const [selectedDate, setSelectedDate] = useState();
    const [bookedAppointments, setBookedAppointments] = useState([]); // Already booked
    const [flagAlertPrivacy,setFlagAlertPrivacy] = useState(false);
    const [ShowSuccessMessageBookingHall, setShowSuccessMessageBookingHall] = useState(false);
    const [selectHallType, setSelectHallType] = useState("");
    const [FinalSalary,setFinalSalary] = useState(0);

    // API for each Hall according to HallID
    const [EveryHallTypes,setEveryHallTypes]=useState([]);
    const [EachHallPrivacy,setEachHallPrivacy] = useState();
    const [currentDiscount,setCurrentDiscount]=useState();
    const [currentWebsiteDiscount,setCurrentWebsiteDiscount]=useState([]);

    //Events
    useEffect(() => {
            const FetchEvents = async () => {
                try {
                    const response = await axios.get(`https://shinyproject.onrender.com/hall/${id}/event`);
                    if (response.data?.events) {
                        console.log("events", response.data.events)

                        setEveryHallTypes(response.data.events);
                        // setFinalSalary(response.data.events.filter((i)=>{
                        //     return i.name === selectHallType;
                        // })[0]?.price)
                    }
                } catch (e) {
                    console.error('Error fetching events:', e);
                }
            };
        FetchEvents();
    }, [id]);

    //DetailsOfHall
    useEffect(() => {
        window.scroll(0,0)
        const fetchInfo = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/hall/getHallDetails/${id}`);
                if (response.data?.hall) {
                    console.log(response.data.hall)
                    setEachHallPrivacy(response.data.hall); // Update state with halls
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
        fetchInfo();
    }, [id]);

    function handleSelectHallType(event){
        setSelectHallType(event.target.value);
    }

    // Create time slots in 12-hour format
    const timeSlots12Hour = [
        { start: '08:00 AM', end: '09:00 AM' },
        { start: '09:00 AM', end: '10:00 AM' },
        { start: '10:00 AM', end: '11:00 AM' },
        { start: '11:00 AM', end: '12:00 PM' },
        { start: '12:00 PM', end: '01:00 PM' },
        { start: '01:00 PM', end: '02:00 PM' },
        { start: '02:00 PM', end: '03:00 PM' },
        { start: '03:00 PM', end: '04:00 PM' },
        { start: '04:00 PM', end: '05:00 PM' },
        { start: '05:00 PM', end: '06:00 PM' },
        { start: '06:00 PM', end: '07:00 PM' },
        { start: '07:00 PM', end: '08:00 PM' },
        { start: '08:00 PM', end: '09:00 PM' },
        { start: '09:00 PM', end: '10:00 PM' },
        { start: '10:00 PM', end: '11:00 PM' },
    ];

    const onDateChange = (date) => {
        setSelectedDate(date);
        setSelectedIntervals([]); // Reset selected intervals when the date changes
    };

    const [selectedIntervals, setSelectedIntervals] = useState([]);
    const [finalStartTime, setFinalStartTime] = useState("");
    const [finalEndTime, setFinalEndTime] = useState("");

    useEffect(() => {
        if (selectedIntervals.length > 0) {
            const startTime = timeSlots12Hour[selectedIntervals[0]].start;
            const endTime = timeSlots12Hour[selectedIntervals[selectedIntervals.length - 1]].end;
            setFinalStartTime(startTime);
            setFinalEndTime(endTime);
        } else {
            setFinalStartTime("");
            setFinalEndTime("");
        }
    }, [selectedIntervals]);

    // Fetch booked appointments (mock) currently make
    useEffect(() => {
        if(selectedDate){
            // setResult(0);
            const fetchBooked = async () => {
                try {
                    const response = await axios.get(`https://shinyproject.onrender.com/HallSchedule/getUncorfimedAndConfirmedBookings/${id}`);
                    if (response?.data?.bookings) {
                        console.log(response.data)
                        setBookedAppointments(response.data.bookings);
                    }
                } catch (e) {
                    console.error('Error fetching halls:', e);
                    if(e.response.data.message=== "No Uncorfimed or confirmed bookings found")
                    {
                        setBookedAppointments([]);
                    }
                }
            };
            fetchBooked();}
    }, [selectedDate]);

    const DiscountOwnerValue = useRef(0);
    function DiscountOwner () {
        if(selectedDate && selectHallType){
            if(currentDiscount.length>0){
                // console.log("there's Discount")
                const result = currentDiscount.filter((d)=>{
                    //between Hour in the same Date
                     if(selectedIntervals && finalStartTime!=="" && finalEndTime!=="" && (compareDates(formatDate(d.startDateTime),formatDate(d.endDateTime)) === "equal")) {
                            return (
                                finalStartTime === formatTime(d.startDateTime) && finalEndTime === formatTime(d.endDateTime)
                            )
                     }
                    // console.log("Discount in different Days")
                    //in different Days
                    return(
                        formatTime(d.startDateTime) === "12:00 AM"&&
                        formatTime(d.endDateTime) === "11:59 PM" &&
                        (compareDates(formatDate(d.startDateTime) , formatDate(selectedDate)) === "smaller" || compareDates(formatDate(d.startDateTime) , formatDate(selectedDate)) === "equal") &&
                        (compareDates(formatDate(d.endDateTime) , formatDate(selectedDate))=== "bigger" || compareDates(formatDate(d.endDateTime) , formatDate(selectedDate))=== "equal")
                    )
                })

                //there's Discount
                if(result.length>0){
                    // console.log("if1",result[0].finalPrice)
                    DiscountOwnerValue.current = (result[0].finalPrice);
                //No Discount
                }else{
                    DiscountOwnerValue.current = (EveryHallTypes.filter((i)=>{
                        return i.name === selectHallType;
                    })[0]?.price);
                    // console.log("else1",DiscountOwnerValue.current)
                }

            }else{
                DiscountOwnerValue.current = (EveryHallTypes.filter((i)=>{
                    return i.name === selectHallType;
                })[0]?.price)
                console.log("else2",DiscountOwnerValue.current)
            }
        }
    }

    function WithAddOneHour() {
        if(selectedIntervals.length > 2 && finalStartTime!=="" && finalEndTime!== "") {
            const addOneHour = EveryHallTypes.filter((e) => {
                return e.name === selectHallType;
            })[0].priceOneHour;

            const remaining = selectedIntervals.length - 2;
            const result0 = remaining * addOneHour;
            DiscountOwnerValue.current = (DiscountOwnerValue.current + result0);
        }
    }

    function AdminDiscount(){
         if(selectedDate){
             if(currentWebsiteDiscount.length > 0){
                 // console.log("in AdminDiscount")
                 const filterResult = currentWebsiteDiscount.filter((d)=>{
                     return(
                         (compareDates(formatDate(selectedDate) , formatDate(d.endDateTime)) === "smaller" || compareDates(formatDate(selectedDate) , formatDate(d.endDateTime)) === "equal") &&
                         (compareDates(formatDate(selectedDate) , formatDate(d.startDateTime))=== "bigger" || compareDates(formatDate(selectedDate) , formatDate(d.startDateTime))=== "equal")
                     )
                 })
                 if(filterResult.length>0){
                     const perc = filterResult[0]?.discountPercentage;
                 const final =  (perc * DiscountOwnerValue.current);
                 const final2 = DiscountOwnerValue.current - final;
                 DiscountOwnerValue.current = (final2)
                 setFinalSalary(DiscountOwnerValue.current);
                     // console.log("in Result of AdminDiscount",DiscountOwnerValue.current)
                 }else{
                     setFinalSalary(DiscountOwnerValue.current);
                     // console.log("in Result of AdminDiscount else1",DiscountOwnerValue.current)
                 }
             }
             else{
             setFinalSalary(DiscountOwnerValue.current);
                 // console.log("in Result of AdminDiscount else2",DiscountOwnerValue.current)
             }
         }
    }

    const formatDate = (date) => {
        return moment(date, 'YYYY-MM-DD hh:mm A').format('DD-MM-YYYY'); // Only get the date part
    };
    const formatTime = (date) => {
        return moment(date, 'DD-MM-YYYY hh:mm A').format('hh:mm A'); // Only get the time part
    };

    const isAvailableTimeSlot = (interval) => {
        const formatTimeTo24Hour = (timeString) => {
            const [hour, minuteWithPeriod] = timeString.split(/[:]/);
            const [minute, period] = minuteWithPeriod.split(" ");
            let hour24 = parseInt(hour);
            if (period === 'PM' && hour !== '12') hour24 += 12;
            return { hour: hour24, minute: parseInt(minute) };
        };

        return bookedAppointments.some((b) => {
            const startBooking = formatTimeTo24Hour(formatTime(b.startDateTime));
            const endBooking = formatTimeTo24Hour(formatTime(b.endDateTime));
            const bookingDate = formatDate(b.startDateTime);
            const startInterval = formatTimeTo24Hour(interval.start);
            const endInterval = formatTimeTo24Hour(interval.end);

            return (
                (compareDates(bookingDate , formatDate(selectedDate)) === "equal") &&
                startInterval.hour >= startBooking.hour &&
                startInterval.minute >= startBooking.minute &&
                endInterval.hour <= endBooking.hour &&
                endInterval.minute <= endBooking.minute
            );
        });
    };

    // Disable past dates on the calendar
    const disableDates = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Remove the time component for comparison
        date.setHours(0, 0, 0, 0); // Ensure the incoming date has no time component
        return date <= today; // Disable if the date is in the past
    };

    //Fetch OwnerDiscount and AdminDiscount
    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/HallSchedule/${id}`);
                if (response.data?.hall) {
                    setCurrentDiscount(response.data.hall.discounts.filter((d)=>{
                        return d.eventName === selectHallType;
                    }));
                    console.log("discount" ,response.data.hall.discounts)
                    console.log("websiteDiscounts", response.data.hall.websiteDiscounts)
                    setCurrentWebsiteDiscount(response.data.hall.websiteDiscounts);
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
        fetchHalls();
    }, [selectHallType]);

    //here
    const handleTimeSlotChange = (index) => {
        // Check if the checkbox is already selected
        if (selectedIntervals.includes(index) && !selectedIntervals.includes(index+1)) {
            // Remove the index from the selected intervals
            setSelectedIntervals((prevSelectedIntervals) =>
                prevSelectedIntervals.filter((selectedIndex) => selectedIndex !== index)
            );
        } else if (selectedIntervals.length === 0 || selectedIntervals[selectedIntervals.length - 1] === index - 1) {
            // Add to selected intervals if it is adjacent to the last selected index (Sequence)
            setSelectedIntervals((prevSelectedIntervals) => [...prevSelectedIntervals, index]);
        } else {
            alert("يرجى اختيار مواعيد متتالية فقط."); // Alert for non-sequential selection
        }

    };

    const handleRedirectToLogIN = () => {
        setShowAlertToLogIn(false); // Close modal
        window.location.href = "/LogIn"; // Redirect to the login page
    };

    useEffect(()=>{
        setSelectedIntervals([]);
    },[selectHallType])

    const handleClosePrivacy = () => {
        setFlagAlertPrivacy(false); // Hide privacy section
        // setUserAppointments([])
    };

    const formatDateToDDMMYYYY = (date) => {
        if (!date) return '';
        return moment(date).format('DD-MM-YYYY');

    };

    const [UserName,setUserName]=useState("");

    const HandleAlertSuccessBooking = () => {
        if(localStorage.getItem("authRole") === "user"){
        const sendBooking = async () => {
            try {
                const response = await axios.post(`https://shinyproject.onrender.com/HallSchedule/createInitialBooking/${id}`,
                    {
                    eventName: selectHallType,
                    // startDateTime: "22-12-2024 8:00 PM",
                    // endDateTime: "22-12-2024 10:00 PM",
                    // startDateTime : `${formatDateToDDMMYYYY(selectedDate)} ${convertTo12HourFormat(finalStartTime)}`,
                    startDateTime : `${formatDateToDDMMYYYY(selectedDate)} ${(finalStartTime)}`,
                    // endDateTime : `${formatDateToDDMMYYYY(selectedDate)} ${convertTo12HourFormat(finalEndTime)}`,
                    endDateTime : `${formatDateToDDMMYYYY(selectedDate)} ${(finalEndTime)}`,
                    finalBookingPrice: Number(FinalSalary)
                    },{
                    headers:{
                        Authorization : `shiny__${localStorage.getItem("token")}`
                    }
                });
                if (response.data.message==="success") {
                    setShowSuccessMessageBookingHall(true); // Show success message
                    setTimeout(() => navigate("/UserBooking"), 1000);
                    setFlagAlertPrivacy(false); // Hide privacy section
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
        sendBooking();}

        else if(localStorage.getItem("authRole") === "owner"){
        const sendBookingByOwner = async () => {
            try {
                const response = await axios.post(`https://shinyproject.onrender.com/HallSchedule/createBookingByOwner/${id}`,
                    {
                    eventName: selectHallType,
                    // startDateTime: "22-12-2024 8:00 PM",
                    // endDateTime: "22-12-2024 10:00 PM",
                    // startDateTime : `${formatDateToDDMMYYYY(selectedDate)} ${convertTo12HourFormat(finalStartTime)}`,
                    startDateTime : `${formatDateToDDMMYYYY(selectedDate)} ${(finalStartTime)}`,
                    // endDateTime : `${formatDateToDDMMYYYY(selectedDate)} ${convertTo12HourFormat(finalEndTime)}`,
                    endDateTime : `${formatDateToDDMMYYYY(selectedDate)} ${(finalEndTime)}`,
                    finalBookingPrice: Number(FinalSalary),
                    bookedByUsername : UserName
                    },{
                    headers:{
                        Authorization : `shiny__${localStorage.getItem("token")}`
                    }
                });
                if (response.data.message==="success") {
                    setShowSuccessMessageBookingHall(true); // Show success message
                    setTimeout(() => navigate("/OwnerShowBooking"), 1000);
                    setFlagAlertPrivacy(false); // Hide privacy section
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
            sendBookingByOwner();}

    };

    const handleClickBookingBtn = () => {
        if (handleBooking()) {
            DiscountOwner();
            WithAddOneHour();
            AdminDiscount();
            setFlagAlertPrivacy(true);
            window.scroll(0,0);
            // Show privacy alert before finalizing booking
        }
    };

    useEffect(()=>{
        window.scroll(0,0);
    },[])

    // Booking handler
    const handleBooking = () => {
        const userRole = localStorage.getItem("authRole");
        if (userRole !== "user" && userRole !== "owner") {
            setShowAlertToLogIn(true);
            return false;
        }
        return selectedIntervals.length >= 2;
    };


    function parseDate(dateString) {
        // Split the date string into day, month, and year
        const [day, month, year] = dateString.split('-').map(Number);
        // Create a Date object (months are 0-based in JavaScript)
        return new Date(year, month - 1, day);
    }

    function compareDates(date1String, date2String) {
        const date1 = parseDate(date1String);
        const date2 = parseDate(date2String);

        if (date1 > date2) {
            return "bigger";
        } else if (date1 < date2) {
            return "smaller";
        } else {
            return "equal";
        }
    }

        return (
        <div id="BigContainerInBookingHall">
            {localStorage.getItem("authRole") === "owner" &&
                <div style={{position:"absolute",top:"170px",right:"170px",zIndex:"12"}}>
                    <input onChange={(e)=>{
                        setUserName(e.target.value)
                    }} value={UserName} style={{border:"3px solid #0A499C",borderRadius:"8px",textAlign:"center"}} type="text" placeholder="أدخل اسم الزبون ..."/>
                </div>
            }
            {showAlertToLogIn && (
                <AlertToLogIn
                    message="لا يمكنك إجراء حجز كزائر، يجب تسجيل الدخول."
                    onClose={handleRedirectToLogIN}
                />
            )}

            <div className="BookingHall-Name" style={{marginTop:"7px"}}>
                <h1>{EachHallPrivacy?.name}</h1>
            </div>

            <div className="BookingHall-UnderName" style={{marginTop:"4px"}}>
                <img src={HallUnderName} alt="noPic"/>
            </div>


            <div id="BookingHall-Types" className="BookingHall-Types">

                {/*Types*/}
                <div className="BookingHall-TypesSelect">
                    <div>
                        <h2 style={{position: "relative", top: "-45px"}}>اختر المناسبة</h2>
                    </div>

                    <select style={{marginTop: "-10px"}} value={selectHallType} onChange={handleSelectHallType}>
                        <option value="">المناسبة</option>
                        {EachHallPrivacy?.events?.map(e => {
                            return (
                                <option key={e.eventId} value={e.name}>
                                    {e.name}
                                </option>)
                        })}
                    </select>

                    <div className="BookingHall-SelectText">
                        {/*<div style={{position: "absolute", width: "300px", height: "400px", left: "-425px"}}>*/}
                        <div style={{position: "absolute", width: "300px", height: "400px", left: "-465px"}}>
                            <img style={{width: "100%", height: "100%"}} src={BookingHallCouple} alt="noPic"/>
                        </div>
                        {EveryHallTypes.filter((t) => t.name === selectHallType).map((event) => (
                            <div key={event.eventId} style={{position: "relative"}}>
                                {/* Right */}
                                <div style={{position: "relative", right: "-215px", top: "10px"}}>
                                    <p className="border bg-white">
                                        {event.price}
                                        <span style={{fontSize: "16px"}}>₪</span>
                                        <span style={{fontSize: "16px"}}>/ساعتين</span>
                                    </p>
                                    <p className="border bg-white mb-4">
                                        قيمة العربون:
                                        <span style={{fontSize: "16px"}}>₪</span>
                                        {event.Arbon}
                                    </p>
                                    {/*<p className="border bg-white text-success">*/}
                                    {/*    إجمالي المبلغ:*/}
                                    {/*    <span> </span>*/}
                                    {/*    <span style={{fontSize: "16px"}}>₪</span>*/}
                                    {/*     {event.price}*/}
                                    {/*</p>*/}
                                    <p style={{fontSize: "17px", marginTop: "-5px"}}>
                                        <i style={{fontSize: "13px"}} className="p-1 fa-solid fa-circle-info"></i>
                                        في حال تم حجز أكثر من ساعتين، مع كل ساعة إضافية يزداد إجمالي المبلغ
                                        <span style={{fontSize: "12px"}}> ₪</span>
                                        {event.priceOneHour}
                                    </p>
                                </div>

                                <div id="OwnerDiscuntUserBooking">
                                {selectedDate &&
                                    currentDiscount
                                        .filter((i) => {
                                            const startDate = formatDate((i.startDateTime));
                                            const endDate = formatDate((i.endDateTime));
                                            const selectedDateNormalized = formatDate((selectedDate));

                                            return (
                                                (compareDates(selectedDateNormalized , startDate) === "bigger" ||  compareDates(selectedDateNormalized , startDate) === "equal")&&
                                                (compareDates(selectedDateNormalized , endDate) === "smaller" || compareDates(selectedDateNormalized , endDate) === "equal") &&
                                                (selectHallType === i.eventName || "" === selectHallType)
                                            )
                                        })
                                        .map((d) => (
                                            <div key={d.id}>
                                                <div>
                                                    {formatTime((d.startDateTime)) === "12:00 AM" &&
                                                    formatTime((d.endDateTime)) === "11:59 PM"
                                                        ? (
                                                            <div
                                                                className="border"
                                                                style={{
                                                                    // borderRadius: "10px",
                                                                    // boxShadow: "2px 2px 2px gray",
                                                                    backgroundColor: "white",
                                                                    position: "absolute",
                                                                    left: "-170px",
                                                                    top: "10px",
                                                                    padding: "14px 4px 2px 4px",
                                                                    paddingTop: "20px",
                                                                    fontSize:"25px"
                                                                }}
                                                            >
                                                                <p style={{color: "red"}}>
                                                                    {/*<i*/}
                                                                    {/*    style={{*/}
                                                                    {/*        fontSize: "25px",*/}
                                                                    {/*        position: "absolute",*/}
                                                                    {/*        top: "-25px",*/}
                                                                    {/*        right: "-7px",*/}
                                                                    {/*        rotate: "20deg",*/}
                                                                    {/*    }}*/}
                                                                    {/*    className="p-2 fa-solid fa-map-pin"*/}
                                                                    {/*></i>*/}
                                                                    أي حجز تقوم به خلال هذا اليوم
                                                                    <br/>
                                                                    تحصل على خصم
                                                                    <span> </span>
                                                                    <span style={{fontSize: "16px"}}>₪</span>
                                                                    {d.discountPrice}
                                                                    <br/>
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {(finalStartTime) === formatTime((d.startDateTime)) &&
                                                                formatTime((d.endDateTime)) === (finalEndTime) ? (
                                                                    <div
                                                                        className="border"
                                                                        style={{
                                                                            // borderRadius: "10px",
                                                                            // boxShadow: "2px 2px 2px gray",
                                                                            backgroundColor: "white",
                                                                            position: "absolute",
                                                                            left: "-170px",
                                                                            top: "10px",
                                                                            padding: "14px 4px 2px 4px",
                                                                            paddingTop: "20px",
                                                                        }}
                                                                    >
                                                                        {/*<i*/}
                                                                        {/*    style={{*/}
                                                                        {/*        color: "red",*/}
                                                                        {/*        fontSize: "25px",*/}
                                                                        {/*        position: "absolute",*/}
                                                                        {/*        top: "-25px",*/}
                                                                        {/*        right: "-7px",*/}
                                                                        {/*        rotate: "20deg",*/}
                                                                        {/*    }}*/}
                                                                        {/*    className="p-2 fa-solid fa-map-pin"*/}
                                                                        {/*></i>*/}
                                                                        <p style={{color: "red"}}>
                                                                            يوجد عرض على هذا الموعد
                                                                            <br/>
                                                                            خصم
                                                                            <span> </span>
                                                                            <span style={{fontSize: "16px"}}>₪</span>
                                                                            {d.discountPrice}
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        ))
                                }
                                </div>

                                <div>
                                    {selectedDate && (currentWebsiteDiscount.length !== 0 ) ?
                                        (currentWebsiteDiscount.map((d)=> (
                                            (compareDates(formatDate(selectedDate) , formatDate(d.startDateTime)) === "bigger" ||  compareDates(formatDate(selectedDate) , formatDate(d.startDateTime)) === "equal")&&
                                            (compareDates(formatDate(selectedDate) , formatDate(d.endDateTime)) === "smaller" || compareDates(formatDate(selectedDate) , formatDate(d.endDateTime)) === "equal") &&

                                            <div id="AdminDiscountUserBooking" style={{
                                                position: "relative",
                                                left: "218px",
                                            }}>
                                                <p style={{color: "red", fontSize: "15px", fontWeight: "normal"}}>
                                                    <i className="fa-solid fa-bolt"></i>
                                                    <span> </span>
                                                    يقدّم شايني خصم
                                                    <span> </span>
                                                    %
                                                    {Number(d.discountPercentage) * 100}
                                                    <span> </span>
                                                    لمستخدميه

                                                    {/*{*/}
                                                    {/*    () => {*/}
                                                    {/*        setFinalSalary(filteredHall.SalaryOriginal - (filteredHall.SalaryOriginal * offer.offerAmount) / 100)*/}
                                                    {/*    }*/}
                                                    {/*}*/}

                                                    <div style={{color: "red", fontSize: "15px", fontWeight: "bold"}}>
                                                        <i className="fa-regular fa-clock"></i>
                                                        <span> </span>
                                                        الخصم
                                                        لغاية:
                                                        <span> </span>
                                                        {formatDate(d.endDateTime)}
                                                    </div>
                                                </p>

                                            </div>
                                        )))
                                        :
                                        <>
                                        </>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>


                </div>

                {/*Calendar And Times*/}
                <div className="BookingHallContainer">
                    <h2 className="BookingHallHeader">اختر التاريخ والوقت</h2>
                    <Calendar
                        onChange={onDateChange}
                        tileDisabled={({date}) => disableDates(date)}
                        value={selectedDate}
                        className="calendar"
                    />

                    { (
                        <div className="BookingHallTimeSlot">
                            <p
                                style={{
                                    textAlign: "center",
                                    position: "relative",
                                    top: "5px",
                                    textDecoration: "underline",
                                    fontSize: "25px",
                                    color: "#0A499C",
                                }}
                            >
                                <i className="fa-solid fa-clock"></i>
                            </p>
                            {timeSlots12Hour.map((slot, index) => {
                                const isBooked = isAvailableTimeSlot(slot); // Check if the slot is booked

                                return (
                                    <div key={index} style={{marginBottom: "10px"}}>
                                        <label
                                            style={{
                                                direction: "ltr",
                                                opacity: isBooked ? 0.5 : 1, // Dim opacity for booked slots
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                value={index}
                                                checked={selectedIntervals.includes(index)}
                                                onChange={() => handleTimeSlotChange(index)}
                                                disabled={isBooked} // Disable if booked unless it's the special slot
                                            />
                                            {slot.start} To {slot.end}
                                            {isBooked && " (محجوز)"} {/* Append "(محجوز)" if booked */}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>

                    )}
                </div>

            </div>

            {flagAlertPrivacy &&
                <div className="EachHallPrivacyOut" style={{zIndex:"46"}}>
                    <div className="EachHallPrivacy">
                        <button
                            onClick={handleClosePrivacy}
                            style={{
                                width: "170px", height: "40px",
                                fontFamily: "Amiri, sans-serif", border: "none", color: "red",
                                backgroundColor: "transparent", marginTop: "10px",
                                fontSize: "23px", position: "absolute", top: "3px", right: "-50px"
                            }}
                            className="ClosePrivacyButton">
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        <h2 style={{color: 'red'}}>سياسة الحجز:</h2>
                        <div className="border" style={{
                            position:"relative",bottom:"10px",top:"-3px",width:"190px",fontSize:"20px",
                            boxShadow:"1px 1px 1px gray",margin:"auto",color:"green"
                        }}>
                            إجمالي المبلغ للدفع
                            <span> </span>
                            ₪{FinalSalary}
                        </div>
                        <li>
                            يمكنك إلغاء الحجز -من خانة حجوزاتي- واسترداد العربون المدفوع وذلك في غضون
                            <span> </span>
                            {EachHallPrivacy?.refundTime}
                            <span> </span>
                            ساعة فقط من لحظة الحجز.
                        </li>
                        <li>
                            إذا أردت التراجع عن الإلغاء ولم يوافق المالك على طلب الإلغاء،
                            يمكنك التراجع عن الطلب من خلال التواصل مع مالك القاعة.
                        </li>

                        <li>
                            لتأكيد الحجز لديك
                            <span> </span>
                            {EachHallPrivacy?.bookingConfirmationTime}
                            <span> </span>
                            ساعات من لحظة الحجز وذلك لدفع العربون، تواصل مع مالك القاعة على الرقم الآتي
                            <span> </span>
                            {EachHallPrivacy?.contactPhone}
                            <span> </span>
                            لتحديد آلية الدفع.
                        </li>
                        <li>
                            إذا تجاوزت الوقت المحدّد أعلاه لدفع العربون يتم إزالة حجزك من الموقع تلقائياً.
                        </li>
                        <h4 style={{color: "red", marginTop: "20px", textDecoration: "underline"}}>
                            إذا أتممت قراءة النقاط السابقة وترغب في الحجز اضغط على الزر في الأسفل
                        </h4>

                        <button onClick={HandleAlertSuccessBooking} style={{
                            width: "170px", height: "40px",
                            fontFamily: "Amiri, sans-serif", border: "none", color: "#0A499C",
                            backgroundColor: "#FAEEF6", boxShadow: "2px 2px 2px gray", borderRadius: "5px",
                            fontSize: "23px",
                        }} className="BookingHallButton2"> تأكيد الحجز
                        </button>
                    </div>
                </div>
            }

            {ShowSuccessMessageBookingHall &&
                <div className="successMessage2" style={{marginTop:"-910px",zIndex:"15"}}>
                    <SignInAlert flag={ShowSuccessMessageBookingHall} SignInAlertText={
                        <>
                            ✔ تم إرسال حجزك بنجاح
                            <br/>
                            من
                            <span> </span>
                            {finalStartTime}
                            <span> </span>
                            إلى
                            <span> </span>
                            {finalEndTime}
                        </>
                    } AlertHeight="240vh"/>
                </div>
            }

            <div style={{textAlign: 'center'}}>
                <button
                    style={{
                        width: "170px", height: "40px",
                        fontFamily: "Amiri, sans-serif", border: "none", color: "#0A499C",
                        backgroundColor: "#FAEEF6", boxShadow: "2px 2px 2px gray", borderRadius: "5px",
                        fontSize: "23px",
                    }}
                    onClick={handleClickBookingBtn}
                    disabled={!selectedDate || selectedIntervals.length < 2}
                    className="BookingHallButton"
                >
                    احجز
                </button>
            </div>

        </div>
    );
};

export default BookingHall;
