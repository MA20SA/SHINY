import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import flowerHallRight from "../images/flowerRight.png";
import flowerHallLeft from "../images/flowerLeft.png";
import ownerPic from "../images/owner.png";
import ownerPic2 from "../images/owner2.png";
import ownerPic3 from "../images/owner3.png";
import Pagination from "./Pagination";
import axios from "axios";
import AddOwner from "./AddOwner";
import {Link} from "react-router-dom";
import SignInAlert from "./SignInAlert";

const ShowOwners = () => {

    const [Owners, setOwners] = useState([]);

    //Fetch Owners
    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/user/getOwners`,{
                    headers:{
                        Authorization: `shiny__${localStorage.getItem("token")}`,
                    }
                });
                if (response.data?.owners) {
                    setOwners(response.data.owners);
                }
            } catch (e) {
                console.error('Error fetching owners:', e);
            }
        };

        const intervalId = setInterval(() => {
            fetchHalls().finally(() => setLoading(false));
        },1000);

        return () => {
            clearInterval(intervalId);
        };

    }, []);

    const [currentPageHall, setCurrentPageHall] = useState(1);
    const CardsPerPageHall = 6; // Number of hall per page

    const totalPagesHall = Math.ceil(Owners.length / CardsPerPageHall);

    const indexOfLastHall = currentPageHall * CardsPerPageHall;
    const indexOfFirstHall = indexOfLastHall - CardsPerPageHall;
    const currentHall = Owners.slice(indexOfFirstHall, indexOfLastHall);

    const[loading,setLoading]=useState(true);
    const handlePageHallChange = (page) => {
        setCurrentPageHall(page);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const ownerImages = [ownerPic, ownerPic2, ownerPic3]; // Array of owner images

    const getOwnerImage = (index) => {
        // Return an image based on the index, cycling through the array
        return ownerImages[index % ownerImages.length];
    };

    const[flageDisable,setFlageDisable]=useState(false);
    const[flageActive,setFlageActive]=useState(false);

    function handleDisableOwner(_id){
        const disableOwner = async () => {
            try {
                const response = await axios.put(`https://shinyproject.onrender.com/user/deactivateOwnerAndDisableHalls/${_id}`,
                    {},
                    {
                        headers:{
                            Authorization: `shiny__${localStorage.getItem('token')}`,
                        }
                    });
                if (response.data) {
                    setFlageDisable(true);
                    setTimeout(()=>{
                        window.location.href='/ShowOwners';
                    },1500)
                }
            } catch (e) {
                console.error('Error disable Owner:', e);
            }
        };
        disableOwner();
    }
    function handleActiveOwner(_id){
        const activeOwner = async () => {
            try {
                const response = await axios.put(`https://shinyproject.onrender.com/user/ActivateOwner/${_id}`,
                    {},
                    {
                        headers:{
                            Authorization: `shiny__${localStorage.getItem('token')}`,
                        }
                    });
                if (response.data) {
                    setFlageActive(true);
                    setTimeout(()=>{
                        window.location.href='/ShowOwners';
                    },1500)
                }
            } catch (e) {
                console.error('Error active Owner:', e);
            }
        };
        activeOwner();
    }

    return (
        <div id="ShowOwners" style={{marginTop:"-90px"}}>
            <div className="halls">
                <br/>

                <div className="MakingShine" style={{marginTop:"-45px"}}>
                    <h1>
                        Making Every Occasion Shine
                    </h1>
                </div>

                <div className="flowerHALL">
                    <img src={flowerHallRight} alt="no pic"/>
                </div>
                <div className="flowerHALL2">
                    <img src={flowerHallLeft} alt="no pic"/>
                </div>

                <div style={{position: "relative", zIndex: "15", left: "133px",top:"-85px"}}>
                    <SignInAlert flag={flageDisable} SignInAlertText={"تم إيقاف المالك بنجاح"}
                                 AlertHeight="188vh"/>
                </div>

                <div style={{position: "relative", zIndex: "15", left: "133px",top:"-85px"}}>
                    <SignInAlert flag={flageActive} SignInAlertText={"تم إعادة تفعيل المالك بنجاح"}
                                 AlertHeight="188vh"/>
                </div>

                <div style={{position:"relative",top:"-80px",right:"100px"}}>
                    <Link to={`/AddNewOwnerByAdmin`}>
                        <button style={{fontSize:"14px",width:"120px",height:"30px"}} className="GoToEditHallByOwner"><i style={{fontSize: "14px"}}
                                                                   className="fa-solid fa-gear"></i>
                            <span> </span>
                            إضافة مالك جديد
                        </button>
                    </Link>
                </div>

                <div className="AddHallContainer" style={{position:"relative",top:"-32px"}}>
                    {loading?(
                        <CircularProgress />
                    ):(
                        currentHall.length > 0 ? (
                            currentHall?.map((owner, index) => (
                                <div style={{position:"relative"}}>
                                    {owner.isActive === true ?
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
                                                onClick={() => handleDisableOwner(owner._id)}>
                                            <i style={{fontSize: "12px", color: "red"}} className="fa-solid fa-ban"></i>
                                            <span> </span>
                                            إيقاف
                                        </button>
                                        :
                                        <button style={{
                                            border: "1px solid green",
                                            position: "absolute",
                                            zIndex: "5",
                                            right: "10px",
                                            top: "10px",
                                            fontSize: "14px",
                                            borderRadius: "5px",
                                            fontWeight: "bold",
                                        }}
                                                onClick={() => handleActiveOwner(owner._id)}>
                                            <i style={{fontSize: "12px", color: "green"}} className="fa-solid fa-ban"></i>
                                            <span> </span>
                                            تفعيل
                                        </button>
                                    }


                                    <AddOwner
                                        key={owner._id}
                                        id={owner._id}
                                        src={getOwnerImage(index)}
                                        name={owner.username}
                                        address={owner.position}
                                        phone={owner.Primaryphone}
                                    />
                                </div>
                            ))
                        ) : (
                            <p style={{color: "#0A499C", fontSize: "20px", marginTop: "40px"}}>
                                لا يوجد أصحاب قاعات
                            </p>
                        ))
                    }
                </div>

            </div>


            <div className="HallPagination">
                <Pagination
                    currentPage={currentPageHall}
                    totalPages={totalPagesHall}
                    onPageChange={handlePageHallChange}
                />
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        </div>
    );
};

export default ShowOwners;
