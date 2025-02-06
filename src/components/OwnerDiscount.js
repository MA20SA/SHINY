import React, {useEffect, useState} from 'react';
import sales from "../images/salesCorner.png";
import flowerHallRight from "../images/flowerRight.png";
import flowerHallLeft from "../images/flowerLeft.png";
import {Link} from "react-router-dom";
import Rating from "./Rating";
import Pagination from "./Pagination";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import SignInAlert from "./SignInAlert";

//CSS for this component in : discount, AddDiscount, OwnerDiscount
const OwnerDiscount = () => {

    //Fetch specific Discount according to OwnerID
    const [DiscountOfOwner,setDiscountOfOwner] = useState([]);
    const [HallOfOwner,setHallOfOwner] = useState([]);
    const [loading,setLoading]=useState(true)

    const [isAlertVisibleOwner, setIsAlertVisibleOwner] = useState(false); // Control AlertDiscount visibility
    const [filteredHallsDiscountOwner, setfilteredHallsDiscountOwner] = useState([]);

    const [selectCityDiscount, setSelectCityDiscount] = useState("");
    function handleSelectCityDiscount(event){
        setSelectCityDiscount(event.target.value);
    }

    // fetch one obj for each card/hall ... filteredHallsDiscountOwner
    useEffect(() => {
        if(HallOfOwner.length>0){
            setfilteredHallsDiscountOwner(Object.values(
                HallOfOwner.reduce((acc, hall) => {
                    const key = `${hall._id}`;
                    if (!acc[key]) {
                        acc[key] = hall;
                    }
                    return acc;
                }, {})
            ));
        }
    }, [HallOfOwner]);

    useEffect(() => {
        if (filteredHallsDiscountOwner.length>0 ){
            setLoading(false)
        }
    }, [filteredHallsDiscountOwner]);

    function handleCloseAlertOwner() {
        setIsAlertVisibleOwner(false); // Close AlertDiscount when close button is clicked
    }

    const [currentPageDiscountOwner, setCurrentPageDiscountOwner] = useState(1);
    const CardsPerPageDiscountOwner = 3;
    const totalPagesDiscountOwner = Math.ceil(filteredHallsDiscountOwner.length / CardsPerPageDiscountOwner); // 7/3 = 3 pages
    const indexOfLastDiscountOwner = currentPageDiscountOwner * CardsPerPageDiscountOwner;
    const indexOfFirstDiscountOwner = indexOfLastDiscountOwner - CardsPerPageDiscountOwner;
    const currentDiscountOwner = filteredHallsDiscountOwner.slice(indexOfFirstDiscountOwner, indexOfLastDiscountOwner);
    const handlePageHallChangeOwner = (page) => setCurrentPageDiscountOwner(page);
    const [filter,setFilter] = useState([]);

    // Pagination Of Alert
    const [currentAlertPageOwner, setCurrentAlertPageOwner] = useState(1);
    const OffersPerPageAlertOwner = 1;
    const totalAlertPagesOwner = Math.ceil(filter.length / OffersPerPageAlertOwner);
    const indexOfLastAlertOwner = currentAlertPageOwner * OffersPerPageAlertOwner;
    const indexOfFirstAlertOwner = indexOfLastAlertOwner - OffersPerPageAlertOwner;
    const currentAlertOffersOwner = filter.slice(indexOfFirstAlertOwner, indexOfLastAlertOwner);
    function handleKhasemOwner(hallID) {
        setFilter(DiscountOfOwner.filter(hall => hall.hallId === hallID));
        setCurrentAlertPageOwner(1); // Reset to the first page
        setIsAlertVisibleOwner(true);
    }

    //Disable Discount by owner
    const[flageDisable,setFlageDisable]=useState(false);
    function handleCancle(id){

        const fetchHalls = async () => {
            try {
                const response = await axios.patch(`https://shinyproject.onrender.com/discount/deactivateDiscount/${id}`,{

                },{
                    headers:{
                        Authorization: `shiny__${localStorage.getItem('token')}`,
                    }
                });
                if (response.data) {
                    setIsAlertVisibleOwner(false);
                    setFlageDisable(true);
                    setTimeout(()=>{
                        window.location.href='/OwnerDiscount';
                    },1500)
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
        fetchHalls();
    }

    //according to select "" and role ... DiscountOfOwner
    useEffect(() => {
        if (selectCityDiscount === '') {
            setLoading(true)
            const fetchHalls = async () => {
                try {
                    // Fetch All Discount that's not expired
                    const response = await axios.get(`https://shinyproject.onrender.com/discount/getAllhallDiscounts`);
                    if (response.data?.discounts && (localStorage.getItem("authRole") === "owner")) {
                        const OwnerDiscounts = response.data.discounts.filter((d) => {
                            return d.createdBy === localStorage.getItem("userID")
                        });
                        if (OwnerDiscounts.length === 0) {
                            setLoading(false)
                        }
                        setDiscountOfOwner(OwnerDiscounts)
                    } else if (response.data?.discounts && (localStorage.getItem("authRole") === "user" || localStorage.getItem("authRole") === null)) {
                        const OwnerDiscounts = response.data.discounts.map((d) => {
                            return d;
                        });
                        if (OwnerDiscounts.length === 0) {
                            setLoading(false)
                        }
                        setDiscountOfOwner(OwnerDiscounts)
                    }
                } catch (e) {
                    console.error('Error fetching discounts:', e);
                }
            };
            fetchHalls()

        }}, [selectCityDiscount]);

    //Fetch Details of each hall contain discount ... HallOfOwner
    useEffect(() => {
        if (DiscountOfOwner.length>0) {
            const fetchAllHalls = async () => {
                const hallsArray = []; // Temporary array to store fetched halls

                for (const h of DiscountOfOwner) {
                    try {
                        const response = await axios.get(
                            `https://shinyproject.onrender.com/hall/getHallDetails/${h.hallId}`
                        );

                        if (response.data?.hall) {
                            hallsArray.push(response.data.hall); // Add to the temporary array
                        }
                    } catch (e) {
                        console.error("Error fetching discounts:", e);
                    }
                }

                setHallOfOwner(hallsArray); // Update state once with all fetched halls
            };

            fetchAllHalls();
        }

    }, [DiscountOfOwner]);

    //Fetch discount according to city ... DiscountOfOwner
    useEffect(() => {
        if(selectCityDiscount!==""){
            setLoading(true)
            const fetchHalls = async () => {
                try {
                    const response = await axios.get(`https://shinyproject.onrender.com/discount/getDiscountedHallsByCity/${selectCityDiscount}`);
                    if (response.data?.discounts) {
                        setDiscountOfOwner(response.data.discounts)
                    }
                } catch (e) {
                    if(e.response.status===404){
                        setfilteredHallsDiscountOwner([])
                        setLoading(false)
                    }
                    console.error('Error fetching halls:', e);
                }
            };
            fetchHalls()
        }
    }, [selectCityDiscount]);

    const formatDate = (date) => {
        return moment(date, 'DD-MM-YYYY hh:mm A').format('DD-MM-YYYY'); // Only get the date part
    };
    const formatTime = (date) => {
        return moment(date, 'DD-MM-YYYY hh:mm A').format('hh:mm A'); // Only get the time part
    };
    return (
        <div id="DiscountOfUserView">

            {/*CSS in AddDiscount*/}
            <div className="salesPhoto">
                <img src={sales} alt="no pic"/>
            </div>

            <div className="discount">

                <div style={{marginTop: "80px"}} className="flowerHALL">
                    <img src={flowerHallRight} alt="no pic"/>
                </div>
                <div style={{marginTop: "80px"}} className="flowerHALL2">
                    <img src={flowerHallLeft} alt="no pic"/>
                </div>

                <div style={{position: "relative", zIndex: "15", left: "133px", top: "-85px"}}>
                    <SignInAlert flag={flageDisable} SignInAlertText={"تم إيقاف العرض بنجاح"}
                                 AlertHeight="202vh"/>
                </div>


                {localStorage.getItem("authRole") === "owner" ?
                    <div>
                        <Link to={`/AddNewOwnerDiscount`}>
                            <button className="AddNewOwnerDiscount"><i style={{fontSize: "16px"}}
                                                                       className="fa-solid fa-circle-plus"></i>
                                <span> </span>
                                إضافة عرض جديد
                            </button>
                        </Link>
                    </div>
                    :
                    <></>
                }


                {(localStorage.getItem("authRole") === "user" || localStorage.getItem("authRole") === null) ?
                    <>
                        <select value={selectCityDiscount} onChange={handleSelectCityDiscount}>
                            <option value="">المدينة</option>
                            <option value="طولكرم">طولكرم</option>
                            <option value="نابلس">نابلس</option>
                            <option value="رام الله">رام الله</option>
                            <option value="بيت لحم">بيت لحم</option>
                            <option value="الخليل">الخليل</option>
                            <option value="قلقيلية">قلقيلية</option>
                            <option value="جنين">جنين</option>
                            <option value="أريحا">أريحا</option>
                        </select>
                        <br/>
                    </>
                    :
                    <></>
                }


                <br/>

                {/*Cards of Hall*/}
                <div className="AddDiscountContainer">
                    {loading ?
                        <div style={{marginTop: "20px"}}>
                            <CircularProgress/>
                        </div>
                        :
                        (
                            currentDiscountOwner?.length > 0 ? (
                                currentDiscountOwner.map(hall => (
                                    <div key={hall._id}>
                                        <div className="AddDiscount">
                                            <Link to={`/DetailsOfHall/${hall._id}`}>
                                                <img src={hall.hallImage} alt="hall"/>
                                            </Link>
                                            <p style={{
                                                fontSize: "18px",
                                                color: "#0A499C",
                                                fontWeight: "bold",
                                                marginTop: "5px"
                                            }}>{hall.name}</p>

                                            <p>{hall.address}</p>

                                            <span className="HallDiscountRating">
                                 <Rating rating={hall.rating}/>
                            </span>
                                            <button onClick={() => {
                                                handleKhasemOwner(hall._id)
                                            }} className="khasem">للتفاصيل
                                            </button>
                                        </div>

                                    </div>
                                ))
                            ) : (
                                <p style={{color: "#0A499C", fontSize: "20px", marginTop: "40px"}}>لا توجد تخفيضات
                                </p>
                            ))}
                </div>


                {isAlertVisibleOwner && (
                    <div className="AlertDiscount">
                        <button className="AlertDiscountClose" onClick={handleCloseAlertOwner}><i
                            className="fa-solid fa-xmark"></i></button>
                        {/* Add your alert content here */}
                        <i id="infoUserDiscount" style={{
                            fontSize: "25px",
                            color: "red",
                            position: "relative",
                            right: "190px",
                            top: "15px"
                        }}
                           className="fa-solid fa-circle-info"></i>
                        <div style={{
                            width: "80%",
                            color: "#0A499C",
                            margin: "auto",
                            position: 'relative',
                            top: "50px",
                            fontSize: "20px"
                        }}>
                            {currentAlertOffersOwner.map((offer, index) => (
                                <div key={offer._id}>
                                    <p key={index}>
                                        خصم بقيمة
                                        <span> </span>
                                        <span style={{color: "red"}}>₪{offer.discountPrice}</span>
                                        <span> </span>
                                        <span>على المناسبات من نوع</span>
                                        <span> </span>
                                        "{offer.eventName}"
                                        <br/>
                                        {formatDate(offer.startDateTime) === formatDate(offer.endDateTime)
                                            ?
                                            <>
                                                في تاريخ
                                                <span> </span>
                                                {formatDate(offer.startDateTime)}
                                                <br/>
                                                من
                                                <span> </span>
                                                {formatTime(offer.startDateTime)}
                                                <span> </span>
                                                إلى
                                                <span> </span>
                                                {formatTime(offer.endDateTime)}
                                            </>
                                            : <>
                                                من بداية تاريخ
                                                <span> </span>
                                                {formatDate(offer.startDateTime)}
                                                <br/>
                                                إلى نهاية تاريخ
                                                <span> </span>
                                                {formatDate(offer.endDateTime)}
                                                <br/>
                                            </>
                                        }
                                    </p>
                                    {localStorage.getItem("authRole") === "owner"
                                        ? (
                                            <>
                                                <button style={{
                                                    border: "1px solid red",
                                                    position: "relative",
                                                    zIndex: "5",
                                                    right: "162px",
                                                    top: "-10px",
                                                    fontSize: "16px",
                                                    borderRadius: "5px",
                                                    fontWeight: "bold"
                                                }}
                                                        onClick={() => handleCancle(offer._id)}>إيقاف
                                                </button>
                                            </>
                                        )
                                        :
                                        <></>
                                    }
                                </div>
                            ))}
                        </div>

                        {localStorage.getItem("authRole") === "owner" ?
                            <></>
                            :
                            <span id="Asre3InUserDiscount" style={{
                                color: "red",
                                right: "140px",
                                textDecoration: "underline",
                                position: "relative",
                                top: "60px"
                            }}>
                                سارع بالحجز قبل إنتهاء الخصم!
                        </span>
                        }

                        <div className="AlertPagination">
                            <button
                                onClick={() => setCurrentAlertPageOwner(prev => Math.max(prev - 1, 1))}
                                disabled={currentAlertPageOwner === 1}
                            >
                                &lt;
                            </button>
                            <span>{currentAlertPageOwner} / {totalAlertPagesOwner}</span>
                            <button
                                onClick={() => setCurrentAlertPageOwner(prev => Math.min(prev + 1, totalAlertPagesOwner))}
                                disabled={currentAlertPageOwner === totalAlertPagesOwner}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div style={{position: "relative", bottom: "760px"}}>
                <Pagination
                    currentPage={currentPageDiscountOwner}
                    totalPages={totalPagesDiscountOwner}
                    onPageChange={handlePageHallChangeOwner}
                />
            </div>
        </div>
    );
};

export default OwnerDiscount;