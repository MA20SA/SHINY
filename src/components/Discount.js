import React from 'react';
import OwnerDiscount from "./OwnerDiscount";


const Discount = () => {
    // const [Discount,setDiscount] = useState([]);
    // const [selectCityDiscount, setSelectCityDiscount] = useState("");
    // function handleSelectCityDiscount(event){
    //     setSelectCityDiscount(event.target.value);
    // }
    // const [isAlertVisible, setIsAlertVisible] = useState(false); // Control AlertDiscount visibility
    //
    //
    // // Check if an offer is still active
    // const isOfferActive = (hall) => {
    //     const currentDateTime = new Date();
    //     const endDateTime = new Date(`${hall.endDate}T${hall.startTime || '23:59'}`);
    //     return currentDateTime <= endDateTime;
    // };
    //
    //
    //
    // const filteredHallsDiscount= Object.values(
    //     Discount.reduce((acc, hall) => {
    //         const key = `${hall.city}_${hall.id}`;
    //         if (!acc[key] && (hall.city === selectCityDiscount || hall.city === "")) {
    //             acc[key] = hall;
    //         }
    //         return acc;
    //     }, {})
    // );
    //
    //
    // const [filteredHallsAlertDiscount, setFilteredHallsAlertDiscount] = useState([]);
    //
    // function handleCloseAlert() {
    //     setIsAlertVisible(false); // Close AlertDiscount when close button is clicked
    // }
    //
    // // Pagination Of Page Discount
    // const [currentPageDiscount, setCurrentPageDiscount] = useState(1);
    // const CardsPerPageDiscount = 3;
    // const totalPagesDiscount = Math.ceil(filteredHallsDiscount.length / CardsPerPageDiscount);
    // const indexOfLastDiscount = currentPageDiscount * CardsPerPageDiscount;
    // const indexOfFirstDiscount = indexOfLastDiscount - CardsPerPageDiscount;
    // const currentDiscount = filteredHallsDiscount.slice(indexOfFirstDiscount, indexOfLastDiscount);
    // const handlePageHallChange = (page) => setCurrentPageDiscount(page);
    //
    // // Pagination Of Alert
    // const [currentAlertPage, setCurrentAlertPage] = useState(1);
    // const OffersPerPageAlert = 1;
    // const totalAlertPages = Math.ceil(filteredHallsAlertDiscount.length / OffersPerPageAlert);
    // const indexOfLastAlert = currentAlertPage * OffersPerPageAlert;
    // const indexOfFirstAlert = indexOfLastAlert - OffersPerPageAlert;
    // const currentAlertOffers = filteredHallsAlertDiscount.slice(indexOfFirstAlert, indexOfLastAlert);
    //
    // function handleKhasem(hallID) {
    //     const filtered = Discount.filter(hall => hall.id === hallID && isOfferActive(hall));
    //     setFilteredHallsAlertDiscount(filtered);
    //     setCurrentAlertPage(1); // Reset to the first page
    //     setIsAlertVisible(true);
    // }

    return (
        <OwnerDiscount></OwnerDiscount>
        // <div>
        //
        //     <div className="salesPhoto">
        //         <img src={sales} alt="no pic"/>
        //     </div>
        //
        //     <div className="discount">
        //
        //         <div style={{marginTop: "80px"}} className="flowerHALL">
        //             <img src={flowerHallRight} alt="no pic"/>
        //         </div>
        //         <div style={{marginTop: "80px"}} className="flowerHALL2">
        //             <img src={flowerHallLeft} alt="no pic"/>
        //         </div>
        //
        //         <select value={selectCityDiscount} onChange={handleSelectCityDiscount}>
        //             <option value="">المدينة</option>
        //             <option value="طولكرم">طولكرم</option>
        //             <option value="نابلس">نابلس</option>
        //             <option value="رام الله">رام الله</option>
        //             <option value="بيت لحم">بيت لحم</option>
        //             <option value="الخليل">الخليل</option>
        //             <option value="قلقيلية">قلقيلية</option>
        //             <option value="جنين">جنين</option>
        //             <option value="أريحا">أريحا</option>
        //         </select>
        //         <br/>
        //
        //         <div className="AddDiscountContainer">
        //             {currentDiscount.length > 0 ? (
        //                 currentDiscount.map(hall => (
        //
        //                     <div className="AddDiscount">
        //                         <Link to={`/DetailsOfHall/${hall.id}`}>
        //                             <img src={hall.src} alt="hall"/>
        //                         </Link>
        //                         <p style={{
        //                             fontSize: "18px",
        //                             color: "#0A499C",
        //                             fontWeight: "bold",
        //                             marginTop: "5px"
        //                         }}>{hall.name}</p>
        //
        //                         <p>{hall.address}</p>
        //
        //                         <span className="HallDiscountRating">
        //                          <Rating rating={hall.rating}/>
        //                     </span>
        //                         <button onClick={() => {
        //                             handleKhasem(hall.id)
        //                         }} className="khasem">للتفاصيل
        //                         </button>
        //                     </div>
        //
        //
        //                 ))
        //             ) : (
        //                 <p style={{color: "#0A499C", fontSize: "20px"}}>لا توجد تخفيضات في قاعات هذه المدينة
        //                 </p>
        //             )}
        //         </div>
        //
        //
        //         {isAlertVisible && (
        //             <div className="AlertDiscount">
        //                 <button className="AlertDiscountClose" onClick={handleCloseAlert}><i
        //                     className="fa-solid fa-xmark"></i></button>
        //                 {/* Add your alert content here */}
        //                 <i style={{
        //                     fontSize: "25px",
        //                     color: "red",
        //                     position: "relative",
        //                     right: "190px",
        //                     top: "15px"
        //                 }}
        //                    className="fa-solid fa-circle-info"></i>
        //                 <div style={{
        //                     width: "80%",
        //                     color: "#0A499C",
        //                     margin: "auto",
        //                     position: 'relative',
        //                     top: "50px",
        //                     fontSize: "20px"
        //                 }}>
        //                     {currentAlertOffers.map((offer, index) => (
        //                         <p key={index}>
        //                             خصم بقيمة
        //                             <span> </span>
        //                             <span style={{color: "red"}}>₪{offer.DiscountValue}</span>
        //                             <span> </span>
        //                             {offer.idType === ""
        //                                 ? "على جميع المناسبات"
        //                                 : <>على حفلات ال{offer.nameType}</>
        //                             }
        //                             <span> </span>
        //                             <br/>
        //                             {offer.startDate === offer.endDate
        //                                 ? <>
        //                                     في
        //                                     <span> </span>
        //                                     {offer.startDate}
        //                                     <span> </span>
        //                                     من
        //                                     <span> </span>
        //                                     {new Date(`1970-01-01T${offer.startTime}`).toLocaleTimeString('en-US', {
        //                                         hour: '2-digit',
        //                                         minute: '2-digit',
        //                                         hour12: true
        //                                     })}
        //                                     <span> </span>
        //                                     إلى
        //                                     <span> </span>
        //                                     {new Date(`1970-01-01T${offer.endTime}`).toLocaleTimeString('en-US', {
        //                                         hour: '2-digit',
        //                                         minute: '2-digit',
        //                                         hour12: true
        //                                     })}
        //                                 </>
        //                                 : <>من
        //                                     <span> </span>
        //                                     {offer.startDate}
        //                                     <span> </span>
        //                                     إلى
        //                                     <span> </span>
        //                                     {offer.endDate}</>
        //                             }
        //                         </p>
        //                     ))}
        //                 </div>
        //                 <span style={{
        //                     color: "red",
        //                     right: "140px",
        //                     textDecoration: "underline",
        //                     position: "relative",
        //                     top: "70px"
        //                 }}>
        //                         سارع بالحجز قبل إنتهاء الخصم!
        //                 </span>
        //                 <div className="AlertPagination">
        //                     <button
        //                         onClick={() => setCurrentAlertPage(prev => Math.max(prev - 1, 1))}
        //                         disabled={currentAlertPage === 1}
        //                     >
        //                         &lt;
        //                     </button>
        //                     <span>{currentAlertPage} / {totalAlertPages}</span>
        //                     <button
        //                         onClick={() => setCurrentAlertPage(prev => Math.min(prev + 1, totalAlertPages))}
        //                         disabled={currentAlertPage === totalAlertPages}
        //                     >
        //                         &gt;
        //                     </button>
        //                 </div>
        //             </div>
        //         )}
        //     </div>
        //
        //     <div style={{position: "relative", bottom: "760px"}}>
        //         <Pagination
        //             currentPage={currentPageDiscount}
        //             totalPages={totalPagesDiscount}
        //             onPageChange={handlePageHallChange}
        //         />
        //     </div>
        // </div>
    );
};

export default Discount;


