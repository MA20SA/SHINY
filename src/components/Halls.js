import React, { useEffect, useState } from 'react';
import AddHall from "./AddHall";

import CircularProgress from '@mui/material/CircularProgress';
import CategoriesHalls from "./CategoriesHalls";
import flowerHallRight from "../images/flowerRight.png";
import flowerHallLeft from "../images/flowerLeft.png";
import Pagination from "./Pagination";
import OwnerHall from "./OwnerHall";
import axios from "axios";

const Halls = () => {

    const [halls, setHalls] = useState([]);

    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/hall/`);
                if (response.data?.halls) {
                    setHalls(response.data.halls.filter((h)=>h.isDisabled===false)); // Update state with halls
                    console.log(response.data.halls);
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
    
    const [currentPageHall, setCurrentPageHall] = useState(1);
    const CardsPerPageHall = 6; // Number of hall per page

    // const [selectValue, setSelectValue] = useState("طولكرم");
    const [selectValue, setSelectValue] = useState("");

    const handleSelect = (event) => {
        setSelectValue(event.target.value);
        setCurrentPageHall(1); // Reset page to 1 when city changes
    };

    const filteredHalls = halls.filter(hall => (hall.city === selectValue) || (selectValue===""));
    const totalPagesHall = Math.ceil(filteredHalls.length / CardsPerPageHall);

    const indexOfLastHall = currentPageHall * CardsPerPageHall;
    const indexOfFirstHall = indexOfLastHall - CardsPerPageHall;
    const currentHall = filteredHalls.slice(indexOfFirstHall, indexOfLastHall);

    const[loading,setLoading]=useState(true);
    const handlePageHallChange = (page) => {
        setCurrentPageHall(page);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const role = localStorage.getItem('authRole'); // "Guest", "Registered User", "Owner", "Admin"

    // Render different header based on the role
    if (role === "owner") return <OwnerHall/>;

    return (
        <div>
            <h1 className="SaveTheDate">
                Save The Date With Shiny
            </h1>

            <div className="categoriesHallBage">
                <CategoriesHalls/>
            </div>

            <div id="HallsUser" className="halls">
                <select value={selectValue} onChange={handleSelect}>
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

                <div className="MakingShine">
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

                <div className="AddHallContainer">
                    {loading?(
                        <CircularProgress />
                    ):(
                      currentHall.length > 0 ? (
                        currentHall.map(hall => (
                            <AddHall
                                key={hall._id}
                                id={hall._id}
                                src={hall.hallImage}
                                name={hall.name}
                                address={hall.address}
                                range={hall.priceRange}
                                rating={hall.rating}
                                city={hall.city}
                                capacity={hall.capacity}
                                isDisabled={hall.isDisabled}
                            />
                        ))
                    ) : (
                        <p style={{color: "#0A499C", fontSize: "20px",marginTop:"40px"}}>
                            لا توجد قاعات متاحة في هذه المدينة
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

export default Halls;
