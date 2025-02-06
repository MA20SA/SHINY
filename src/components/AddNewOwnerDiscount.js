import React, { useState, useEffect } from 'react';
import axios from "axios";
import moment from "moment";
import SignInAlert from "./SignInAlert";
import discounts from "../images/discount.png";

const AddNewOwnerDiscount = () => {
    const [DataOfAddNewOwnerDiscountInAddDiscount, setDataOfAddNewOwnerDiscountInAddDiscount] = useState({
        hall:'',
        occasions: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        DiscountValue: ''
    });

    //save owner ID Who's LogIn now
    const OwnerIdInAddDiscount = localStorage.getItem("userID");
    //halls of this owner
    const [hallsInAddDiscount, setHallsInAddDiscount] = useState([]);
    const [selectedHallInAddDiscount, setSelectedHallInAddDiscount] = useState('');
    const [occasionsInAddDiscount, setOccasionsInAddDiscount] = useState([]);
    const [ErrorsDataOfAddNewOwnerDiscountInAddDiscount, setErrorsDataOfAddNewOwnerDiscountInAddDiscount] = useState({});

    //to Fetch Hall for this owner ... hallsInAddDiscount
    useEffect(() => {
        const fetchHalls = async () => {
            try {
                // Fetch initial halls
                const response = await axios.get(`https://shinyproject.onrender.com/hall/`);
                const filteredHalls = response?.data?.halls?.filter(
                    (h) => h.createdBy === OwnerIdInAddDiscount && h.isDisabled === false
                );
                setHallsInAddDiscount(filteredHalls); // Update the state with the final filtered halls
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };

        fetchHalls();
    }, []);

    //to Fetch events according to selected hall (hallID) ... occasionsInAddDiscount
    useEffect(() => {
        if(selectedHallInAddDiscount!=="") {
            const fetchHalls = async () => {
                try {
                    const response = await axios.get(`https://shinyproject.onrender.com/hall/${selectedHallInAddDiscount}/event`);
                    if (response.data?.events) {
                        setOccasionsInAddDiscount(response.data.events);
                    }
                } catch (e) {
                    console.error('Error fetching events:', e);
                }
            };
            fetchHalls();
        }else{
            setOccasionsInAddDiscount([]);
        }
    }, [selectedHallInAddDiscount]);

    const handleHallSelect = async (e) => {
        const hallId = e.target.value;
        setSelectedHallInAddDiscount(hallId);
    };

    const handleChangeInAddDiscount = (e, field) => {
        const { value } = e.target;
        setDataOfAddNewOwnerDiscountInAddDiscount(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    const handleOccasionSelect = (occasion) => {
        setDataOfAddNewOwnerDiscountInAddDiscount({
            ...DataOfAddNewOwnerDiscountInAddDiscount,
            occasions: occasion
        })
    };
    const validateDiscountForm = () => {
        const errors = {};
        if (!selectedHallInAddDiscount) errors.hall = "يرجى اختيار صالة";
        if (DataOfAddNewOwnerDiscountInAddDiscount.occasions.length === 0) errors.occasions = "يرجى اختيار مناسبة واحدة";
        if (!DataOfAddNewOwnerDiscountInAddDiscount.startDate) errors.startDate = "تاريخ البداية مطلوب";
        if (!DataOfAddNewOwnerDiscountInAddDiscount.endDate) errors.endDate = "تاريخ النهاية مطلوب";
        if (!DataOfAddNewOwnerDiscountInAddDiscount.DiscountValue) errors.DiscountValue = "قيمة الخصم مطلوبة";
        if ((DataOfAddNewOwnerDiscountInAddDiscount.startDate !== DataOfAddNewOwnerDiscountInAddDiscount.endDate) &&
            (DataOfAddNewOwnerDiscountInAddDiscount.startTime || DataOfAddNewOwnerDiscountInAddDiscount.endTime)
        )
            errors.startTime = "عندما يكون العرض على فترة لا يمكنك إدخال ساعات";

        setErrorsDataOfAddNewOwnerDiscountInAddDiscount(errors);
        return Object.keys(errors).length === 0;
    };

    const formatDateToDDMMYYYY = (date) => {
        if (!date) return '';
        return moment(date).format('DD-MM-YYYY');

    };
    const convertTo12HourFormat = (time) => {
        if (!time) return "";
        return moment(time, "HH:mm").format("hh:mm A");
    };

    const[flageSuccess,setFlageSuccess]=useState(false);
    const handleSubmitDiscount = (e) => {
        e.preventDefault();

        // true so no errors
        if (validateDiscountForm()) {
            const fetchHalls = async () => {
                try {
                    const start = `${formatDateToDDMMYYYY(DataOfAddNewOwnerDiscountInAddDiscount.startDate)} ${convertTo12HourFormat(DataOfAddNewOwnerDiscountInAddDiscount.startTime)}`;
                    const end = `${formatDateToDDMMYYYY(DataOfAddNewOwnerDiscountInAddDiscount.endDate)} ${convertTo12HourFormat(DataOfAddNewOwnerDiscountInAddDiscount.endTime)}`;

                    const response = await axios.post(`https://shinyproject.onrender.com/discount/createDiscount/halls/${selectedHallInAddDiscount}/`,{
                        eventName: DataOfAddNewOwnerDiscountInAddDiscount.occasions,
                        discountPrice: DataOfAddNewOwnerDiscountInAddDiscount.DiscountValue,
                        startDateTime: start,
                        endDateTime:  end
                    },{
                        headers:{
                            Authorization: `shiny__${localStorage.getItem("token")}`
                        }
                    });

                    if(response?.data){
                        window.scrollTo(0,0);
                        setFlageSuccess(true);
                        setTimeout(()=>{
                            window.location.href='/OwnerDiscount';
                        },500)
                    }
                } catch (e) {
                    if(e.response?.data?.message === "Overlapping discounts found"){
                        setErrorsDataOfAddNewOwnerDiscountInAddDiscount({
                                ...ErrorsDataOfAddNewOwnerDiscountInAddDiscount,
                            startDate : "لا يمكنك إضافة عرضين على نفس الفترة."
                            }
                        )
                    }else if(e.response?.data?.message === "Can't add a discount in the past"){
                        setErrorsDataOfAddNewOwnerDiscountInAddDiscount({
                                ...ErrorsDataOfAddNewOwnerDiscountInAddDiscount,
                            startDate : "لا يمكنك إضافة عرض على تاريخ مضى."
                            }
                        )
                    }
                    console.error('Error adding discount:', e);
                }
            };
            fetchHalls();
        } else {
            window.scrollTo(0, 0);
        }
    };

    const [showAlertToLogIn, setShowAlertToLogIn] = useState(true);

    return (
            <div className="FormAddNewOwnerHall" style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderWidth: "10px"
            }}>

                <div className="AddDiscountByOwner">
                    <img src={discounts}/>
                </div>


                <div style={{position: "relative", zIndex: "101", left: "418px",top:"-250px"}}>
                    <SignInAlert flag={flageSuccess} SignInAlertText={"تم إضافة العرض بنجاح"}
                                 AlertHeight="190vh"/>
                </div>

                <div style={{zIndex: "10", position: "absolute", top: "100px", left: "1360px"}}>
                    <SignInAlert
                        SignInAlertText="
                    (يمكن للعرض أن يكون في يوم معين، بهذه الحالة
                    تاريخ البداية يجب أن يكون نفس تاريخ النهاية مع تحديد وقت البداية ووقت النهاية)
                    (يمكن للعرض أن يكون في فترة معينة، بهذه الحالة
                    تاريخ البداية يجب أن لا يكون نفس تاريخ النهاية مع عدم تحديد وقت البداية ووقت النهاية)
                    "
                        flag={showAlertToLogIn}

                        AlertHeight="186vh"
                    />
                </div>

                <form onSubmit={handleSubmitDiscount} style={{marginTop:"-80px"}}>

                    {/*halls*/}
                    <div style={{display: "block"}}>
                        <select style={{
                            marginTop: "-70px",
                            marginRight: "36px"
                        }} className="selectCity" value={selectedHallInAddDiscount} onChange={handleHallSelect}>
                            <option value="">اختر صالة</option>
                            {hallsInAddDiscount.map(hall => (
                                <option key={hall._id} value={hall._id}>{hall.name}</option>
                            ))}
                        </select>
                        {ErrorsDataOfAddNewOwnerDiscountInAddDiscount.hall &&
                            <p className="error"
                               style={{marginTop: "40px"}}>{ErrorsDataOfAddNewOwnerDiscountInAddDiscount.hall}</p>}
                    </div>

                    {/*events*/}
                    {occasionsInAddDiscount?.length > 0 && (
                        <div style={{
                            position: "relative",
                            marginTop: "40px",
                            marginBottom: "-20px"
                        }}>
                            <label>المناسبة:</label>
                            <br/>
                            {occasionsInAddDiscount.map(occasion => (
                                <div style={{
                                    position: "relative",
                                    display: "inline-block",
                                    justifyContent: "center",
                                    paddingLeft: "30px",
                                    top: "5px"
                                }}>
                                    <label htmlFor={`occasion-${occasion._id}`}>
                                        <input
                                            style={{zIndex: "100"}}
                                            id={`occasion-${occasion._id}`}
                                            type="radio"
                                            name="occasion"
                                            value={occasion.name}
                                            checked={DataOfAddNewOwnerDiscountInAddDiscount.occasions.includes(occasion.name)}
                                            onChange={() => handleOccasionSelect(occasion.name)}
                                        />
                                        {occasion.name}
                                    </label>
                                </div>
                            ))
                            }
                            {ErrorsDataOfAddNewOwnerDiscountInAddDiscount.occasions &&
                                <p className="error">{ErrorsDataOfAddNewOwnerDiscountInAddDiscount.occasions}</p>}
                        </div>
                    )
                    }


                    <div style={{marginTop: "40px"}}>
                        <label>تاريخ البداية:</label>
                        <input type="date" value={DataOfAddNewOwnerDiscountInAddDiscount.startDate}
                               onChange={(e) => handleChangeInAddDiscount(e, 'startDate')}/>
                        {ErrorsDataOfAddNewOwnerDiscountInAddDiscount.startDate &&
                            <p className="error">{ErrorsDataOfAddNewOwnerDiscountInAddDiscount.startDate}</p>}
                    </div>
                    <div>
                        <label>وقت البداية:</label>
                        <input
                            type="time"
                            value={DataOfAddNewOwnerDiscountInAddDiscount.startTime}
                            onChange={(e) => handleChangeInAddDiscount(e, "startTime")}
                        />
                        {ErrorsDataOfAddNewOwnerDiscountInAddDiscount.startTime &&
                            <p className="error">{ErrorsDataOfAddNewOwnerDiscountInAddDiscount.startTime}</p>}

                    </div>
                    <div>
                        <label>تاريخ النهاية:</label>
                        <input type="date" value={DataOfAddNewOwnerDiscountInAddDiscount.endDate}
                               onChange={(e) => handleChangeInAddDiscount(e, 'endDate')}/>
                        {ErrorsDataOfAddNewOwnerDiscountInAddDiscount.endDate &&
                            <p className="error">{ErrorsDataOfAddNewOwnerDiscountInAddDiscount.endDate}</p>}
                    </div>
                    <div>
                        <label>وقت النهاية:</label>
                        <input
                            type="time"
                            value={DataOfAddNewOwnerDiscountInAddDiscount.endTime}
                            onChange={(e) => handleChangeInAddDiscount(e, "endTime")}
                        />

                    </div>
                    <div>
                        <label>قيمة الخصم(₪):</label>
                        <input type="number" min="1" value={DataOfAddNewOwnerDiscountInAddDiscount.DiscountValue}
                               onChange={(e) => handleChangeInAddDiscount(e, 'DiscountValue')}/>
                        {ErrorsDataOfAddNewOwnerDiscountInAddDiscount.DiscountValue &&
                            <p className="error">{ErrorsDataOfAddNewOwnerDiscountInAddDiscount.DiscountValue}</p>}
                    </div>

                    <input type="submit" value="إرسال"/>
                </form>
            </div>
    );
};

export default AddNewOwnerDiscount;
