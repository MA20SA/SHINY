import React, {useEffect, useState} from 'react';
import flowerHallRight from "../images/flowerRight.png";
import flowerHallLeft from "../images/flowerLeft.png";
import AddHall from "./AddHall";
import {Link} from "react-router-dom";
import Pagination from "./Pagination";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

const OwnerHall = () => {

    const ownerID = localStorage.getItem("userID");
    // const OwnersHalls = [
    //     {id:1,ownerId:"672b76e1c3f6c3afccf4879c",src:reem,name:"ريم البوادي",address:"طولكرم، شارع فرعون",range:"5000-9000",rating:"4.5",capacity:"400", city:"طولكرم"},
    //     {id:2,ownerId:"672b76e1c3f6c3afccf4879c",src:MasayaOut,name:"مسايا الخارجية",address:"طولكرم، شارع سرايا شيرين",range:"7000-1200",rating:"5",capacity:"400", city:"طولكرم"},
    //     {id:3,ownerId:"omarijreen@example.com",src:laylit,name:"ليلة عمر",address:"طولكرم، دير الغصون",range:"2000-4200",rating:"4.5",capacity:"400", city:"طولكرم"},
    //     {id:4,ownerId:"672b76e1c3f6c3afccf4879c",src:san,name:"سان موريس",address:"طولكرم، شارع السكة",range:"5000-8000",rating:"5",capacity:"400", city:"طولكرم"},
    //     {id:5,ownerId:"672b76e1c3f6c3afccf4879c",src:masayaIn,name:"مسايا الداخلية",address:"طولكرم، شارع سرايا شيرين",range:"4000-4600",rating:"4.5",capacity:"400", city:"طولكرم"},
    //     {id:6,ownerId:"Ahmadthiab@example.com",src:laylatii,name:"قصر ليلتي",address:"طولكرم",range:"3500-5200",rating:"4",capacity:"400", city:"طولكرم"},
    //     {id:7,ownerId:"672b76e1c3f6c3afccf4879c",src:janatlolo,name:"جنة لولو",address:"طولكرم، شارع فرعون",range:"2500-4200",rating:"4",capacity:"400", city:"طولكرم"},
    //     {id:8,ownerId:"Ahmadthiab@example.com",src:rotana,name:"روتانا",address:"طولكرم، شارع نابلس",range:"2500-4000",rating:"4",capacity:"400", city:"طولكرم"},
    //     {id:9,ownerId:"Ahmadthiab@example.com",src:Rose,name:"روز",address:"نابلس، شارع بيت ايبا",range:"10000-12000",rating:"5",capacity:"400", city:"نابلس"},
    //     {id:10,ownerId:"Ahmadthiab@example.com",src:hayatNablus,name:"حياة نابلس",address:"نابلس، رفيديا",range:"6000-11000",rating:"5",capacity:"400", city:"نابلس"},
    //     {id:11,ownerId:"Ahmadthiab@example.com",src:Qusur,name:"قاعات القصور",address:"رام الله، شارع العرب",range:"5000-7000",rating:"4",capacity:"400", city:"رام الله"},
    //     {id:12,ownerId:"Ahmadthiab@example.com",src:orkeda,name:"أوركيدا",address:"رام الله، البيرة",range:"5000-7000",rating:"4.5",capacity:"400", city:"رام الله"},
    //     {id:13,ownerId:"Ahmadthiab@example.com",src:Gloria,name:"جلوريا",address:"رام الله، شارع الإرسال",range:"5500-8400",rating:"4.5",capacity:"400", city:"رام الله"},
    //     {id:14,ownerId:"Ahmadthiab@example.com",src:dreams,name:"دريمز",address:"بيت لحم، عمارة علقم",range:"5500-8400",rating:"4.5",capacity:"400", city:"بيت لحم"},
    //     {id:15,ownerId:"Ahmadthiab@example.com",src:laverda,name:"لافيردا",address:"الخليل، بئر المحجر",range:"5500-9400",rating:"5",capacity:"400", city:"الخليل"},
    //     {id:16,ownerId:"Ahmadthiab@example.com",src:rovan,name:"روفان",address:"الخليل، أبو كتيلة",range:"5500-9400",rating:"4.5",capacity:"400", city:"الخليل"},
    //     {id:17,ownerId:"Ahmadthiab@example.com",src:nakheel,name:"قاعة النخيل",address:"قلقيلية، دوار الطبال",range:"4000-5000",rating:"4",capacity:"400", city:"قلقيلية"},
    //     {id:18,ownerId:"Ahmadthiab@example.com",src:alflayla,name:"ألف ليلة وليلة",address:"قلقيلية، الشارع الغربي",range:"4500-5000",rating:"4",capacity:"400", city:"قلقيلية"},
    //     {id:19,ownerId:"Ahmadthiab@example.com",src:vienna,name:"فينا",address:"جنين، شارع الناصرة",range:"4800-5200",rating:"4",capacity:"400", city:"جنين"},
    // ]

    const [OwnersHalls,setOwnersHalls]= useState([]);

    const filteredOwnerHalls = OwnersHalls.filter(hall => hall.createdBy === ownerID);
    // const filteredOwnerHalls = OwnersHalls.filter(hall => hall.createdBy === '6713f5d715b271c2941d46fa');

    const [currentPageOwnersHall, setCurrentPageOwnersHall] = useState(1);
    const CardsPerPageOwnersHall = 6; // Number of hall per page

    const totalPagesOwnersHall = Math.ceil(filteredOwnerHalls.length / CardsPerPageOwnersHall);

    const indexOfLastOwnersHall = currentPageOwnersHall * CardsPerPageOwnersHall;
    const indexOfFirstOwnersHall = indexOfLastOwnersHall - CardsPerPageOwnersHall;
    const currentHall = filteredOwnerHalls.slice(indexOfFirstOwnersHall, indexOfLastOwnersHall);
    const[loading,setLoading]=useState(true);

    const handlePageHallChangeOwnersHall = (page) => {
        setCurrentPageOwnersHall(page);
    };

    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const response = await axios.get('https://shinyproject.onrender.com/hall/');
                if (response.data?.halls) {
                    setOwnersHalls(response.data.halls); // Update state with halls
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };

        const intervalId = setInterval(() => {
            fetchHalls().finally(() => setLoading(false));
        },1000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div style={{position: "relative", top: "-20px"}}>

            <div id="HallsOfOwner" className="halls">

                <div className="MakingShine">
                    <h1>
                        Making Every Occasion Shine
                    </h1>
                </div>

                <div style={{marginTop: "-20px"}} className="flowerHALL">
                    <img src={flowerHallRight} alt="no pic"/>
                </div>
                <div style={{marginTop: "-20px"}} className="flowerHALL2">
                    <img src={flowerHallLeft} alt="no pic"/>
                </div>

                <div>
                    <Link to={'/AddNewOwnerHall'}>
                        <button className="AddNewOwnerHall"><i style={{fontSize: "16px"}}
                                                               className="fa-solid fa-circle-plus"></i>
                            <span> </span>
                            إضافة صالة جديدة
                        </button>
                    </Link>
                </div>

                <div style={{position: "relative", top: "-35px"}} className="AddHallContainer">
                    {loading
                        ?
                        (
                            <CircularProgress />
                        )
                        :(
                            currentHall.length > 0 ? (
                                currentHall.map((hall) => {
                                    return (
                                        <AddHall
                                            key={hall._id}
                                            id={hall._id}
                                            src={hall.hallImage}
                                            name={hall.name}
                                            address={hall.address}
                                            capacity={hall.capacity}
                                            range={hall.priceRange}
                                            rating={hall.rating}
                                            city={hall.city}
                                            isDisabled={hall.isDisabled}
                                        />
                                    );
                                })
                            ) : (
                                <p style={{ color: "#0A499C", fontSize: "20px" }}>
                                    لا توجد قاعات متاحة
                                </p>
                            )
                        )
                    }
                </div>
            </div>

            <div className="HallPagination">
                <Pagination
                    currentPage={currentPageOwnersHall}
                    totalPages={totalPagesOwnersHall}
                    onPageChange={handlePageHallChangeOwnersHall}
                />
            </div>
            <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

        </div>
    );
};

export default OwnerHall;