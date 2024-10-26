import React, {useEffect, useState} from 'react';
import flowerHallRight from "../images/flowerRight.png";
import flowerHallLeft from "../images/flowerLeft.png";
import AddHall from "./AddHall";
import {useParams} from "react-router-dom";
import Pagination from "./Pagination";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

const DetailsOfOwner = () => {
    const {id } = useParams();
    const [OwnersHalls,setOwnersHalls]= useState([]);

    const filteredOwnerHalls = OwnersHalls.filter(hall => hall.createdBy === id);
    // const filteredOwnerHalls = OwnersHalls.filter(hall => hall.createdBy === '6713f5d715b271c2941d46fa');

    const [currentPageOwnersHall, setCurrentPageOwnersHall] = useState(1);
    const CardsPerPageOwnersHall = 6; // Number of hall per page

    const totalPagesOwnersHall = Math.ceil(filteredOwnerHalls.length / CardsPerPageOwnersHall);

    const indexOfLastOwnersHall = currentPageOwnersHall * CardsPerPageOwnersHall;
    const indexOfFirstOwnersHall = indexOfLastOwnersHall - CardsPerPageOwnersHall;
    const currentHall = filteredOwnerHalls.slice(indexOfFirstOwnersHall, indexOfLastOwnersHall);
    const [loading,setLoading]=useState(true);

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

        fetchHalls().finally(()=> setLoading(false));
    }, []);

    return (
        <div id="DetailsOfOwners" style={{position: "relative", top: "-20px"}}>

            <div className="halls">

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
                                    لا توجد قاعات لهذا المالك
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

export default DetailsOfOwner;