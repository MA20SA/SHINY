import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Pagination from "./Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import SignInAlert from "./SignInAlert";

const Offers = () => {
    const [offer,setOffer] = useState([]);

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/discount/getWebsiteDiscounts`);
                if (response.data?.discounts) {
                    setOffer(response.data.discounts);
                }
            } catch (e) {
                console.error('Error fetching offer:', e);
            }
        };

        const intervalId = setInterval(() => {
            fetchOffer().finally(() => setLoading(false));
        },1000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const role = localStorage.getItem("authRole");

    const [currentPageHall, setCurrentPageHall] = useState(1);
    const CardsPerPageHall = 1; // Number of offer per page
    const totalPagesHall = Math.ceil(offer.length / CardsPerPageHall);

    const indexOfLastHall = currentPageHall * CardsPerPageHall;
    const indexOfFirstHall = indexOfLastHall - CardsPerPageHall;
    const currentOffer = offer.slice(indexOfFirstHall, indexOfLastHall);

    const[flageDisable,setFlageDisable]=useState(false);
    const[loading,setLoading]=useState(true);
    const handlePageHallChange = (page) => {
        setCurrentPageHall(page);
    };

    function handleDisableAdminDiscount(id){
        const disableAdminDiscount = async () => {
            try {
                const response = await axios.patch(`https://shinyproject.onrender.com/discount/deactivateDiscount/${id}`,
                    {},
                    {
                        headers:{
                            Authorization: `shiny__${localStorage.getItem('token')}`,
                        }
                    });
                if (response.data) {
                    setFlageDisable(true);
                    setTimeout(()=>{
                        window.location.href='/offers';
                    },500)
                }
            } catch (e) {
                console.error('Error disable Admin Discount:', e);
            }
        };
        disableAdminDiscount();
    }

    return (
        <div id="AdminOffers">
            <div className="offers">

                <div style={{position: "relative", zIndex: "15", left: "133px"}}>
                    <SignInAlert flag={flageDisable} SignInAlertText={"تم إيقاف الخصم بنجاح"}
                                 AlertHeight="201vh"/>
                </div>

                {role === "admin" ?
                    <div style={{position: "relative", bottom: "-200px", right: "465px"}}>
                        <Link to={`/CreateAdminDiscount`}>
                            <button style={{fontSize: "14px", width: "120px", height: "30px", borderColor: "firebrick"}}
                                    className="GoToEditHallByOwner">
                                <i style={{fontSize: "14px", color: "firebrick"}}
                                   className="fa-solid fa-gear"></i>
                                <span> </span>
                                إضافة خصم جديد
                            </button>
                        </Link>
                    </div>
                    :
                    <>
                        <br/>
                        <br/>
                    </>
                }

                {loading ?
                    (
                        <div style={{position: "absolute", top: "470px", left: "655px"}}>
                            <CircularProgress/>
                        </div>
                    )
                    :
                    (
                        currentOffer?.length > 0 ?
                            currentOffer?.map((offer) => {
                                return (
                                    <div className="offersCard" style={{lineHeight: '30px'}}>
                                        {(offer.isActive === true) && (role === "admin") ?
                                            <button style={{
                                                border: "1px solid red",
                                                position: "absolute",
                                                zIndex: "5",
                                                right: "10px",
                                                top: "10px",
                                                fontSize: "14px",
                                                borderRadius: "5px",
                                                fontWeight: "bold",
                                            }}
                                                    onClick={() => handleDisableAdminDiscount(offer._id)}>
                                                <i style={{fontSize: "12px", color: "red"}}
                                                   className="fa-solid fa-ban"></i>
                                                <span> </span>
                                                إيقاف
                                            </button>
                                            :
                                            <></>
                                        }

                                        <i style={{color: "firebrick"}} className="pb-1 fa-solid fa-circle-info"></i>
                                        <span>
                                        <br/>
                                        أيّ حجز تقوم به من خلال الموقع
                                        <br/>
                                        من بداية تاريخ
                                    </span>
                                        <span> </span>
                                        <span>{offer.startDateTime}</span>
                                        <br/>
                                        <span>حتى نهاية تاريخ</span>
                                        <span> </span>
                                        <span>{offer.endDateTime}</span>
                                        <p>
                                            ستحصل على خصم
                                            <span> </span>
                                            {offer.discountPercentage * 100}%
                                            <span> </span>
                                            من السعر الأصلي.
                                        </p>
                                        <span></span>
                                    </div>
                                )
                            })
                            :
                            <div style={{border: "none", boxShadow: "none", marginTop: "15px", fontSize: "30px"}}
                                 className="offersCard">لا يوجد خصومات حالياً
                            </div>
                    )
                }
            </div>

            <div className="HallPagination" style={{marginTop:"-110px"}}>
                <Pagination
                    currentPage={currentPageHall}
                    totalPages={totalPagesHall}
                    onPageChange={handlePageHallChange}
                />
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    </div>
)
    ;
};

export default Offers;

