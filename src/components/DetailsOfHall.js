import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";

import HrDetailsHall from"../images/HrDetailsHall.png"
import wardaDetails from"../images/werdaDetailes.png"

import DJ from "../images/music-logo-icon.png";
import camera from "../images/camera.png";
import food from "../images/food.png";
import HallUnderName from "../images/HallUnderName.png";
import bookingDetalisborder from "../images/bookingDetalisborder.png";
import bookingDetalisborder2 from "../images/bookingDetalisborder2.png";
import axios from "axios";
import SignInAlert from "./SignInAlert";

const DetailsOfHall = () => {
    const {id } = useParams();
    // const hallId = parseInt(id, 10);

    const [hallDetailsById, setHallDetailsById] = useState({});
    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(-1, 0);
        }, 0);
    }, []);

    // Filter the hall based on the id
    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/hall/getHallDetails/${id}`);
                if (response.data?.hall) {
                    setHallDetailsById(response.data.hall); // Update state with halls
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
        fetchHalls();
        }, [id]); // Re-run if hallId changes

    if (!hallDetailsById) {
        return <div>Loading...</div>; // If no hall is found yet, display loading
    }

    function showImage(imageSrc) {
        const largeImage = document.getElementById("largeImage");
        largeImage.src = imageSrc;
    }

    const roleInDetailsOfHall = localStorage.getItem('authRole');

    // get value disable or not // yes or no
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const[FlagAlertDisableHall,setFlagAlertDisableHall]=useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const[FlagAlertActiveHall,setFlagAlertActiveHall]=useState(false);


    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();
    function ClickOnDisable(){
        const fetchHalls = async () => {
            try {
                const response = await axios.patch(`https://shinyproject.onrender.com/hall/disable/${id}`,
                    {},
                    {
                        headers:{
                            Authorization: `shiny__${localStorage.getItem('token')}`,
                        }
                    });
                if (response.data) {
                    setFlagAlertDisableHall(true);
                    setTimeout(()=>{
                        navigate('/Halls');
                    },1500)
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
        fetchHalls();
    }
    function ClickOnActive() {
        const fetchHalls = async () => {
            try {
            const response = await axios.patch(`https://shinyproject.onrender.com/hall/enable/${id}`,
                {},
                {
                    headers:{
                        Authorization: `shiny__${localStorage.getItem('token')}`,
                    }
                });
            if (response.data) {
                setFlagAlertActiveHall(true);
                setTimeout(()=>{
                    navigate('/Halls');
                },1500)
            }
        } catch (e) {
            console.error('Error fetching halls:', e);
        }
    };
    fetchHalls();

    }

    return (
        <div>

            {(roleInDetailsOfHall === "owner") && localStorage.getItem("userID")===hallDetailsById.createdBy && (hallDetailsById.isDisabled===false) ?
                <div style={{zIndex:"100"}}>
                <Link to={`/EditHallByOwner/${id}`}>
                    <button className="GoToEditHallByOwner"><i style={{fontSize: "16px"}}
                                                           className="fa-solid fa-gear"></i>
                        <span> </span>
                        تعديل بيانات الصالة
                    </button>
                </Link>
            </div>
                :
                <></>
            }

            {(roleInDetailsOfHall === "admin") ?
                <div style={{zIndex:"100",width:"90%"}}>
                    <Link to={`/ShowOwnerBookingByAdmin/${id}`}>
                        <button className="GoToEditHallByOwner"><i style={{fontSize:"15px"}} className="fa-regular fa-calendar-days"></i>
                        <span> </span>
                            حجوزات القاعة
                    </button>
                </Link>
                </div>
                :
                <></>
            }

            {(roleInDetailsOfHall === "owner" && localStorage.getItem("userID")===hallDetailsById.createdBy)?
                <div id="DisableHallByOwnerDiv">
                    {hallDetailsById.isDisabled===false?
                        <div>
                            <button className="DisableHallByOwner" onClick={()=> {
                                ClickOnDisable();
                            }}>
                                <i style={{fontSize: "16px",color:"red"}} className="fa-solid fa-ban"></i>
                                        <span> </span>
                                إخفاء الصالة
                            </button>
                        </div>
                        :
                        <div>
                            <button className="DisableHallByOwner" style={{color: "green", border: "2px solid green",marginTop:"16px"}}
                                    onClick={() => {
                                        ClickOnActive();

                                    }}>
                                <i style={{fontSize: "16px", color: "green"}} className="fa-solid fa-ban"></i>
                                <span> </span>
                                عرض الصالة
                            </button>

                        </div>
                    }
                </div>
                :
                <></>
            }

            <div style={{position: "relative", zIndex: "3", left: "115px"}}>
                    <SignInAlert flag={FlagAlertDisableHall} SignInAlertText={"تم إخفاء الصالة بنجاح"}
                                 AlertHeight="383vh"/>
            </div>

            <div style={{position: "relative", zIndex: "3", left: "115px",top:"56px"}}>
                    <SignInAlert flag={FlagAlertActiveHall} SignInAlertText={"تم إعادة عرض الصالة بنجاح"}
                                 AlertHeight="383vh"/>
            </div>

            <div id="DetailsOfHallUser" className="DetailsOfHall">
                <div className="selectedDetailsHall">

                    <div className="selectedDetailsHallName">
                        <h1>{hallDetailsById.name}</h1>
                    </div>

                    <div className="HallUnderName">
                        <img src={HallUnderName} alt="noPic"/>
                    </div>


                    <div className="selectedDetailsHallVideo">
                        {hallDetailsById?.video ? (
                            <video controls autoPlay loop muted>
                                <source src={hallDetailsById.video} type="video/mp4" />
                                {/*<source src={masayaInVideo} type="video/mp4" />*/}
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <p>Loading video...</p>
                        )}
                    </div>

                    <div className="HrDetailsHallh1"><h1>اجعله يوم لا يُنسى مع شايني!</h1></div>
                    <div className="HrDetailsHall"><img src={HrDetailsHall}/></div>


                    {/*new For Pictures*/}
                    <div className="galleryDetailsHall">
                        <div id="cornerLeft" style={{position: "absolute", right: "680px", top: "-28px"}}>
                            <img src={bookingDetalisborder} alt="noPic"/>
                        </div>

                        <div id="cornerRight" style={{position: "absolute", left: "650px", top: "383px", zIndex: "2"}}>
                            <img src={bookingDetalisborder2} alt="noPic"/>
                        </div>
                        <div className="large-imageDetailsHall" id="largeImageContainer"
                             onClick={() => {
                                 showImage(hallDetailsById?.subImages?.[0])
                             }
                             }>
                            <img id="largeImage" src={hallDetailsById?.subImages?.[0]} alt="Selected"/>
                        </div>

                        <div className="thumbnailsDetailsHall">
                            <div className="EachThumbnailsDetailsHall" onClick={() => {
                                showImage(hallDetailsById?.subImages?.[0])
                            }
                            }>
                                <img src={hallDetailsById?.subImages?.[0]} alt="Thumbnail 4"/>
                            </div>

                            <div className="EachThumbnailsDetailsHall" onClick={() => {
                                showImage(hallDetailsById?.subImages?.[1])
                            }
                            }>
                                <img src={hallDetailsById?.subImages?.[1]} alt="Thumbnail 1"/>
                            </div>

                            <div className="EachThumbnailsDetailsHall" onClick={() => {
                                showImage(hallDetailsById?.subImages?.[2])
                            }
                            }>
                                <img src={hallDetailsById?.subImages?.[2]} alt="Thumbnail 2"/>
                            </div>

                        </div>
                    </div>

                    <div className="HrUnderServices"><img src={HrDetailsHall}/></div>

                    {hallDetailsById.DJ === true || hallDetailsById.camera === true || hallDetailsById.food === true ?
                        <div className="HallServices">
                            <div>
                                <div className="HallServicesH2">
                                    <h2>خدمات القاعة:</h2>
                                </div>
                                {hallDetailsById.DJ === false ? <></> :
                                    <div className="HallService1">
                                        <img className="img-thumbnail" src={DJ} alt="noPic"/>
                                        <p style={{
                                            width: "200px",
                                            textAlign: "center",
                                            color: "#0048a7",
                                            fontSize: "20px",
                                            fontFamily: "'Amiri', serif",
                                            // backgroundColor: "#FAEEF6",
                                            // marginTop: "5px"
                                        }}>
                                            <span> </span>
                                            دي جي
                                        </p>
                                    </div>
                                }

                                {hallDetailsById.camera === false ? <></> :
                                    <div className="HallService2">
                                        <img className="img-thumbnail" src={camera} alt="noPic"/>
                                        <p style={{
                                            width: "200px",
                                            textAlign: "center",
                                            color: "#0048a7",
                                            fontSize: "20px",
                                            fontFamily: "'Amiri', serif",
                                            // backgroundColor: "#FAEEF6",
                                            // marginTop: "5px"
                                        }}>
                                            <span> </span>
                                            تصوير
                                        </p>
                                    </div>
                                }

                                {hallDetailsById.food === false ? <></> :
                                    <div className="HallService3">
                                        <img className="img-thumbnail" src={food} alt="noPic"/>
                                        <p style={{
                                            width: "200px",
                                            textAlign: "center",
                                            color: "#0048a7",
                                            fontSize: "20px",
                                            fontFamily: "'Amiri', serif",
                                            // backgroundColor: "#FAEEF6",
                                            // marginTop: "5px"
                                        }}>

                                            <span> </span>
                                            ضيافة
                                        </p>
                                    </div>
                                }

                            </div>

                        </div>
                        :
                        <></>
                    }

                    <div className="wardaDetailsDiv">
                        <img src={wardaDetails} alt="noPic"/>
                    </div>
                    <div className="wardaDetailsDiv2">
                        <img src={wardaDetails} alt="noPic"/>
                    </div>


                    {(roleInDetailsOfHall === "admin" || (localStorage.getItem("userID")!==hallDetailsById.createdBy && roleInDetailsOfHall === "owner" ))?
                        <>
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
                            <br/>
                            <br/>
                        </>
                        :
                        <div id="GoToBookingHallPage">

                            <div style={{display: "flex", justifyContent: "center"}}>
                                <Link className="NavGoToBookingHall" to={`/BookingHall/${id}`}>
                                    <button className="GoToBookingHall">للحجز اضغط هنا</button>
                                </Link>
                            </div>

                        </div>
                    }


                </div>

            </div>
        </div>
    );
};

export default DetailsOfHall;