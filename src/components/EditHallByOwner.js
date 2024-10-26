import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import SignInAlert from "./SignInAlert";

const EditHallByOwner = () => {
    const {id } = useParams();
    const [FlageChange,setFlageGhange]=useState(false);
    //Firstly, must Fetch Hall Information By use effect where the hallId Changes
    const [DataOfEditOwnerHall, setDataOfEditOwnerHall] = useState({
    });
    const [VideoChange,setVideoChange]=useState(false);
    const [MainImageChange,setMainImageChange]=useState(false);

    const [ErrorsDataOfEditOwnerHall, setErrorsDataOfEditOwnerHall] = useState({});
    const [DeleteEvent,setDeleteEvent]=useState(false);

    const [ActualEvents,setActualEvents] = useState(0);
    const [Loading,setLoading]=useState(true);

    const [FlagSubmit,setFlagSubmit] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchHalls = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/hall/getHallDetailsAndEventStateById/${id}`,{
                    headers:{
                        Authorization:`shiny__${localStorage.getItem("token")}`
                    }
                });
                // if (response.data?.hall) {
                if (response?.data?.hall) {
                    setOldImages(response.data.hall.subImages.map((i)=>{
                        return i.public_id;
                    }));
                    setActualEvents(response.data.hall.events.length);
                    console.log(response.data)
                    setDataOfEditOwnerHall(response.data.hall); // Update state with halls
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
        fetchHalls().finally(()=>{setLoading(false)});
    }, [DeleteEvent]);

    // MainInfo
    const handleChangeInEditOwnerHall = (e, index, field, type) => {
        setFlageGhange(true);
        const { value } = e.target;
        console.log(e,index,field,type)
        if (type === 'occasions') {
            const newOccasions = [...DataOfEditOwnerHall.events];
            newOccasions[index][field] = value || ''; // Ensure value is an empty string if undefined
            setDataOfEditOwnerHall({ ...DataOfEditOwnerHall, events: newOccasions });
        } else {
            console.log(value)
            setDataOfEditOwnerHall({ ...DataOfEditOwnerHall, [field]: value || '' }); // Ensure value is an empty string if undefined
        }
    };
    const [SubImageChange,setSubImageChange]=useState([false,false,false]);
    const [OldImages,setOldImages]= useState([]);

    // SubImage
    const handleImageChangeOfEditOwnerHall = (e, index) => {
        setFlageGhange(true);
        const newImages = [...DataOfEditOwnerHall.subImages];
        newImages[index] = e.target.files[0] || '';
        setDataOfEditOwnerHall({ ...DataOfEditOwnerHall, subImages: newImages });
        setSubImageChange((prevIndex) => {
            const updatedIndex = [...prevIndex];
            updatedIndex[index] = true;
            return updatedIndex;
        });
    };

    const handleServiceChangeOfEditOwnerHall = (field,value) => {
        setFlageGhange(true);
        setDataOfEditOwnerHall({
            ...DataOfEditOwnerHall,
            [field]: !value,
        });
    };

    const validationDataOfEditOwnerHall = () => {
        const errors = {};

        if (!DataOfEditOwnerHall.name)
            errors.hallName = "اسم الصالة مطلوب";
        else if(!DataOfEditOwnerHall.name.match(/^[\u0600-\u06FF\s]+$/)){
            errors.hallName = "يجب أن لا يحتوي اسم الصالة على حروف إنجليزية أو أرقام.";
        }

        if (DataOfEditOwnerHall.city==="") errors.city = "المدينة مطلوبة";


        if (!DataOfEditOwnerHall.address) errors.address = "العنوان مطلوب";
        else if(!DataOfEditOwnerHall.address.match(/^[\u0600-\u06FF\s]+$/)){
            errors.address = "يجب أن لا يحتوي العنوان على حروف إنجليزية أو أرقام.";
        }

        // Validate occasions (check price and deposit for each occasion)
        DataOfEditOwnerHall.events.forEach((occasion, index) => {
            if (!occasion.price) errors[`occasionPrice${index}`] = "السعر مطلوب";
            if (!occasion.Arbon) errors[`occasionDeposit${index}`] = "العربون مطلوب";
            if (!occasion.priceOneHour) errors[`occasionAddOneHour${index}`] = "الحقل مطلوب";
            if (index > 0 &&
                (occasion.name !=="أخرى" ||
                    occasion.name !=="زفاف" || occasion.name !=="خطوبة"
                    || occasion.name !=="تخرج" ||
                    occasion.name !=="ولائم" || occasion.name !=="حناء" || occasion.name !=="أعياد ميلاد" ||
                    occasion.name !=="وداع عزوبية" )
                && !occasion.name && occasion.name.match(/^[\u0600-\u06FF\s]+$/)) errors[`occasionName${index}`] = "اسم المناسبة مطلوب";
        });


        if (!DataOfEditOwnerHall.contactPhone) errors.contactNumber = "رقم للتواصل مطلوب";
        else if ((!/^(059|056)\d{7}$/.test(DataOfEditOwnerHall.contactPhone))) {
            errors.contactNumber = "رقم الهاتف غير صالح.";
        }

        if (!DataOfEditOwnerHall.refundTime) errors.returnArabon = "زمن استرداد العربون مطلوب";

        if (!DataOfEditOwnerHall.capacity) errors.hallCapacity = "حقل سعة القاعة مطلوب";

        // if (!DataOfEditOwnerHall.video) errors.video = "الفيديو مطلوب";

        if (!DataOfEditOwnerHall.bookingConfirmationTime) errors.payTime = "الوقت المتاح لتأكيد الحجز مطلوب";

        // Check if 3 images are uploaded
        // DataOfEditOwnerHall.subImages.forEach((image, index) => {
        //     if (!image) errors[`image${index}`] = `الصورة ${index + 1} مطلوبة`;
        //
        // });
        //
        // if(!DataOfEditOwnerHall.hallImage) errors.hallImage = "الصورة مطلوبة";


        setErrorsDataOfEditOwnerHall(errors);

        // Return true if no errors
        return Object.keys(errors).length === 0;
    };

    const [SuccessDeleteEvents,setSuccessDeleteEvents]=useState(false);
    const [SuccessActiveEvents,setSuccessActiveEvents]=useState(false);

    const deleteOccasionOfEditOwnerHall = (eventId,name) => {
        if(checkEvents(eventId)){
            const eventsToSubmit= DataOfEditOwnerHall.events.filter((o) => {
                return o.name !== name;
            })
            setDataOfEditOwnerHall({ ...DataOfEditOwnerHall, events: eventsToSubmit });
        }
        else{
        const deleteEvents = async () => {
            try {
                const response = await axios.patch(`https://shinyproject.onrender.com/hall/${id}/event/deactivate/${eventId}`,
                    {},{
                    headers:{
                        Authorization: `shiny__${localStorage.getItem('token')}`
                    }
                    });
                if (response.data) {
                    setSuccessDeleteEvents(true);
                    setTimeout(()=>{
                        setSuccessDeleteEvents(false);
                        setDeleteEvent(!DeleteEvent);
                    },1000)
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
        deleteEvents();
        }
    };
    const ActiveOccasionOfEditOwnerHall = (eventId) => {
        const ActiveEvent = async () => {
            try {
                const response = await axios.patch(`https://shinyproject.onrender.com/hall/${id}/event/activate/${eventId}`,
                    {},
                    {
                        headers:{
                            Authorization: `shiny__${localStorage.getItem('token')}`,
                        }
                    });
                if (response.data) {
                    setSuccessActiveEvents(true);
                    setTimeout(()=>{
                        setSuccessActiveEvents(false);
                        setDeleteEvent(!DeleteEvent);
                    },1000)

                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
        ActiveEvent();
    }
    // Handle adding more occasions
    const addOccasionOfEditOwnerHall = () => {
        setFlageGhange(true);
        setDataOfEditOwnerHall((prevState) => ({
            ...prevState,
            events: [...prevState.events, { name: '', price: '',Arbon:'',priceOneHour:'' }],
        }));
        setVisibleEvents(DataOfEditOwnerHall.events.length + 1);
    };
    function calculateMinMax (){
        const allPrices = DataOfEditOwnerHall.events?.map((e)=>{
            return e.price;
        })
        const min = Math.min(...allPrices);
        const max = Math.max(...allPrices);

        return {min , max};
    }

    const handleSubmitInEditOwnerHall = (e) => {
        window.scrollTo(0, 0);
        e.preventDefault();
        const validationErrorsAddHall = validationDataOfEditOwnerHall();
        if (validationErrorsAddHall) {
            const { min, max } = calculateMinMax();
            const fetchHalls = async () => {
                try {
                    const response = await axios.put(`https://shinyproject.onrender.com/hall/${id}`,
                        {
                            name:DataOfEditOwnerHall.name,
                            priceRange: {
                                min: min,
                                max: max
                            },
                            address:DataOfEditOwnerHall.address,
                            city: DataOfEditOwnerHall.city,
                            capacity: DataOfEditOwnerHall.capacity,
                            rating:5,
                            camera:DataOfEditOwnerHall.camera,
                            food:DataOfEditOwnerHall.food,
                            DJ:DataOfEditOwnerHall.DJ,
                            refundTime:DataOfEditOwnerHall.refundTime,
                            bookingConfirmationTime: DataOfEditOwnerHall.bookingConfirmationTime,
                            contactPhone:DataOfEditOwnerHall.contactNumber,
                        },{
                            headers:{
                                Authorization: `shiny__${localStorage.getItem('token')}`,
                            }
                        });
                    if (response.data) {
                        setErrorsDataOfEditOwnerHall({});
                    }
                } catch (e) {
                    console.error('Error fetching halls:', e);
                }
            };
            fetchHalls().then(
                ()=>{
                    DataOfEditOwnerHall.events.map((e) => {
                        if(checkEvents(e.eventId)){
                            const fetch = async ()=>{
                                try {
                                    const response2 = await axios.post(
                                        `https://shinyproject.onrender.com/hall/${id}/event/createEvent`,
                                        {
                                            name:e.name,
                                            price:Number(e.price),
                                            priceOneHour:Number(e.priceOneHour),
                                            Arbon:Number(e.Arbon),
                                        },
                                        {
                                            headers: {
                                                Authorization:`shiny__${localStorage.getItem("token")}`
                                            },
                                        }
                                    );
                                    if(response2.data){
                                        setFlagSubmit(true);
                                    }
                                }catch (e){
                                    console.log("error in events")
                                }
                            }
                            fetch();
                        }
                        else {
                            console.log(e.name)
                            const fetch = async () => {
                                try {
                                    const response2 = await axios.put(
                                        `https://shinyproject.onrender.com/hall/${id}/event/updateEventDetails/${e.eventId}`,
                                        {
                                            price: Number(e.price),
                                            priceOneHour: Number(e.priceOneHour),
                                            Arbon: Number(e.Arbon),
                                        },
                                        {
                                            headers: {
                                                Authorization: `shiny__${localStorage.getItem("token")}`
                                            },
                                        }
                                    );
                                    if (response2.data) {
                                        setFlagSubmit(true);
                                    }
                                } catch (e) {
                                    console.log("error in update events")
                                }
                            }
                            fetch();
                        }
                    })

                }
            ).then(
                ()=>{
                    if(MainImageChange) {
                        const submitMain = async () => {
                            try {
                                const formData = new FormData();
                                formData.append("image", DataOfEditOwnerHall.hallImage);

                                const response = await axios.put(`https://shinyproject.onrender.com/hall/updateImage/${id}`,
                                    formData
                                    ,
                                    {
                                        headers: {
                                            'Content-Type': 'multipart/form-data', // This is important for file uploads
                                            Authorization: `shiny__${localStorage.getItem("token")}`
                                        }
                                    });
                                if (response.data) {
                                    setFlagSubmit(true);
                                }
                            } catch (e) {
                                console.error('Error fetching halls:', e);
                            }
                        };
                        submitMain();
                    }
                }
            ).then(
                ()=>{
                    DataOfEditOwnerHall?.subImages.map((i,index)=>{
                        if(SubImageChange[index]) {
                            console.log(OldImages[index])
                            console.log(DataOfEditOwnerHall.subImages[index])
                            const submitSub = async () => {
                                try {
                                    const formData = new FormData();
                                    formData.append("publicIdToReplace", OldImages[index]);
                                    formData.append("subImage1", DataOfEditOwnerHall.subImages[index]);

                                    const response = await axios.put(`https://shinyproject.onrender.com/hall/replaceSubImage/${id}`,
                                        formData
                                        ,
                                        {
                                            headers: {
                                                'Content-Type': 'multipart/form-data', // This is important for file uploads
                                                Authorization: `shiny__${localStorage.getItem("token")}`
                                            }
                                        });
                                    if (response.data) {
                                        setFlagSubmit(true);
                                    }
                                } catch (e) {
                                    console.error('Error submit sub images:', e);
                                }
                            };
                            submitSub();
                        }
                    })
                }
            ).then(
                ()=>{
                    if(VideoChange) {
                        const submitVideo = async () => {
                            try {
                                const formData = new FormData();
                                formData.append("video", DataOfEditOwnerHall.video);

                                const response = await axios.patch(`https://shinyproject.onrender.com/hall/updateHallVideo/${id}`,
                                    formData
                                    ,
                                    {
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                            Authorization: `shiny__${localStorage.getItem("token")}`
                                        }
                                    });
                                if (response.data) {
                                    setFlagSubmit(true);
                                }
                            } catch (e) {
                                console.error('Error fetching halls:', e);
                            }
                        };
                        submitVideo();
                    }
                }
            );
        }
    };

    const navigate = useNavigate();

    useEffect(()=>{
        if(FlagSubmit){
        setTimeout(()=>{
            navigate(`/DetailsOfHall/${id}`);
        },3000)
        }
    },[FlagSubmit])

    function handleMainImageChange(e){
        setFlageGhange(true);
        const newImages = e.target.files[0];
        setDataOfEditOwnerHall({ ...DataOfEditOwnerHall, hallImage: newImages });
        setMainImageChange(true);
    }

    function checkEvents(eventId){
       if(eventId===undefined){
           return true
       } else {
           return false;
       }
    }

    const [VisibleEvents,setVisibleEvents] = useState(2);
    return (
        <>
            <div style={{marginRight: "-130px", position: "absolute", top: "165px", zIndex: "10"}}>
                {FlagSubmit && <SignInAlert flag={FlagSubmit} SignInAlertText="تم التعديل على الصالة بنجاح!" AlertHeight="304vh"/>}
            </div>

            <div style={{marginRight: "-130px", position: "absolute", top: "165px", zIndex: "10"}}>
                {SuccessDeleteEvents && <SignInAlert flag={SuccessDeleteEvents} SignInAlertText="تم إيقاف المناسبة بنجاح!" AlertHeight="304vh"/>}
            </div>

            <div style={{marginRight: "-130px", position: "absolute", top: "165px", zIndex: "10"}}>
                {SuccessActiveEvents && <SignInAlert flag={SuccessActiveEvents} SignInAlertText="تم تفعيل المناسبة بنجاح!" AlertHeight="304vh"/>}
            </div>

            {Loading
                ? (
                    <div style={{marginTop: "100px", marginRight: "500px"}}><CircularProgress/></div>)
                :
                (<form className="FormAddNewOwnerHall" onSubmit={handleSubmitInEditOwnerHall}>
                    <div>
                        <label>اسم الصالة:</label>
                        <input type="text" name="hallName" value={DataOfEditOwnerHall.name}
                               onChange={(e) => handleChangeInEditOwnerHall(e, null, 'name')}
                        />
                        {ErrorsDataOfEditOwnerHall.hallName &&
                            <p className="error">{ErrorsDataOfEditOwnerHall.hallName}</p>
                        }
                    </div>

                    <div>
                        <label style={{marginTop: "10px"}}>المدينة:</label>
                        <select className="selectCity" value={DataOfEditOwnerHall.city} onChange={(e) => {
                            handleChangeInEditOwnerHall(e, null, 'city')
                        }}>
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
                        {ErrorsDataOfEditOwnerHall.city &&
                            <p className="error"><br/><br/>{ErrorsDataOfEditOwnerHall.city}</p>}
                    </div>
                    <br/>
                    <br/>

                    <div>
                        <label>العنوان:</label>
                        <input type="text" name="address" value={DataOfEditOwnerHall.address}
                               onChange={(e) => handleChangeInEditOwnerHall(e, null, 'address')}
                               placeholder="طولكرم، دير الغصون"
                        />
                        {ErrorsDataOfEditOwnerHall.address &&
                            <p className="error">{ErrorsDataOfEditOwnerHall.address}</p>}
                    </div>


                    {DataOfEditOwnerHall?.events?.slice(0, VisibleEvents).map((occ, index) => (
                            <div key={index} className="occasion-row">
                                <label>المناسبة {index + 1}:</label>
                                <br/>
                                <input
                                    type="text"
                                    value={occ.name || ''}
                                    onChange={(e) => handleChangeInEditOwnerHall(e, index, 'name', 'occasions')}
                                    disabled={!checkEvents(occ.eventId)}
                                />
                                <br/>
                                <label>السعر(₪):</label>
                                <input
                                    min="1"
                                    type="number"
                                    value={occ.price || ''}
                                    onChange={(e) => handleChangeInEditOwnerHall(e, index, 'price', 'occasions')}

                                />
                                {ErrorsDataOfEditOwnerHall[`occasionPrice${index}`] && (
                                    <p className="error">{ErrorsDataOfEditOwnerHall[`occasionPrice${index}`]}</p>
                                )}
                                <label>عربون(₪):</label>
                                <input
                                    min="1"
                                    type="number"
                                    value={occ.Arbon || ''}
                                    onChange={(e) => handleChangeInEditOwnerHall(e, index, 'Arbon', 'occasions')}

                                />
                                {ErrorsDataOfEditOwnerHall[`occasionDeposit${index}`] && (
                                    <p className="error">{ErrorsDataOfEditOwnerHall[`occasionDeposit${index}`]}</p>
                                )}
                                <label>سعر الساعة الإضافيّة(₪):</label>
                                <input
                                    min="1"
                                    type="number"
                                    value={occ.priceOneHour || ''}
                                    onChange={(e) => handleChangeInEditOwnerHall(e, index, 'priceOneHour', 'occasions')}

                                />
                                {ErrorsDataOfEditOwnerHall[`occasionAddOneHour${index}`] && (
                                    <p className="error">{ErrorsDataOfEditOwnerHall[`occasionAddOneHour${index}`]}</p>
                                )}

                                {occ.isActive === false
                                    ?
                                    <button
                                        className="btn btn-success deleteOwnerHall" type="button"
                                        onClick={() => ActiveOccasionOfEditOwnerHall(occ.eventId)
                                        }>تفعيل
                                    </button>
                                    :
                                    <button disabled={(index === 0 && ActualEvents === 1) ||
                                        (!occ.name || !occ.price || !occ.Arbon || !occ.priceOneHour)
                                    }
                                            className="btn btn-danger deleteOwnerHall" type="button"
                                            onClick={() => deleteOccasionOfEditOwnerHall(occ.eventId, occ.name)
                                            }>إيقاف
                                    </button>
                                }
                            </div>
                        )
                    )}

                    <button
                        type="button"
                        className="btn btn-success AddOwnerHall"
                        onClick={addOccasionOfEditOwnerHall}
                        disabled={
                            DataOfEditOwnerHall?.events?.length > 0 &&
                            (
                                !DataOfEditOwnerHall.events[DataOfEditOwnerHall.events.length - 1].name ||
                                !DataOfEditOwnerHall.events[DataOfEditOwnerHall.events.length - 1].price ||
                                !DataOfEditOwnerHall.events[DataOfEditOwnerHall.events.length - 1].Arbon ||
                                !DataOfEditOwnerHall.events[DataOfEditOwnerHall.events.length - 1].priceOneHour
                            )
                        }
                    >
                        إضافة مناسبة
                    </button>

                    <div style={{display: "flex", justifyContent: "center"}}>
                        {(VisibleEvents < DataOfEditOwnerHall?.events?.length)
                            && <button style={{
                                border: "none",
                                borderRadius: "50%",
                                padding: "7px 13px"
                            }} className="bg-mute" onClick={() => {
                                setVisibleEvents(DataOfEditOwnerHall.events.length)
                            }}><i className="fa-solid fa-arrow-down text-primary"></i></button>
                        }
                    </div>

                    <div style={{display: "flex", justifyContent: "center"}}>
                        {(DataOfEditOwnerHall?.events?.length > 2) && (VisibleEvents === DataOfEditOwnerHall?.events?.length) &&
                            <button style={{
                                border: "none",
                                borderRadius: "50%",
                                padding: "7px 13px"
                            }} onClick={() => {
                                setVisibleEvents(2)
                            }}><i className="fa-solid fa-arrow-up text-primary"></i></button>
                        }
                    </div>


                    <br/>


                    {/* Dynamic Services */}
                    <div className="services-section">
                        <label>الخدمات:</label>
                        <div style={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            marginRight: "-160px"
                        }}>
                            <label style={{margin: "10px"}}>
                                <input
                                    type="checkbox"
                                    checked={DataOfEditOwnerHall.DJ}
                                    onChange={() => handleServiceChangeOfEditOwnerHall('DJ', DataOfEditOwnerHall.DJ)}
                                />
                                دي جي
                            </label>
                            <br/>
                            <label style={{margin: "10px"}}>
                                <input
                                    type="checkbox"
                                    checked={DataOfEditOwnerHall.camera}
                                    onChange={() => handleServiceChangeOfEditOwnerHall('camera', DataOfEditOwnerHall.camera)}
                                />
                                تصوير
                            </label>
                            <br/>
                            <label style={{margin: "10px"}}>
                                <input
                                    type="checkbox"
                                    checked={DataOfEditOwnerHall.food}
                                    onChange={() => handleServiceChangeOfEditOwnerHall('food', DataOfEditOwnerHall.food)}
                                />
                                ضيافة
                            </label>
                        </div>
                    </div>


                    <div>
                        <label>زمن استرداد العربون(ساعة):</label>
                        <input min="1" type="number" name="refundTime" value={DataOfEditOwnerHall.refundTime || ''}
                               onChange={(e) => handleChangeInEditOwnerHall(e, null, 'refundTime')}/>
                        {ErrorsDataOfEditOwnerHall.returnArabon &&
                            <p className="error">{ErrorsDataOfEditOwnerHall.returnArabon}</p>}
                    </div>

                    <div>
                        <label>السعة:</label>
                        <input min="1" type="number" name="hallCapacity" value={DataOfEditOwnerHall.capacity || ''}
                               onChange={(e) => handleChangeInEditOwnerHall(e, null, 'capacity')}/>
                        {ErrorsDataOfEditOwnerHall.hallCapacity &&
                            <p className="error">{ErrorsDataOfEditOwnerHall.hallCapacity}</p>}
                    </div>

                    {/* File upload for exactly 4 images */}
                    <div>
                        <label>صور للقاعة:</label>
                        {DataOfEditOwnerHall?.hallImage &&
                            <div className="photoInput">
                                <img
                                    src={DataOfEditOwnerHall?.hallImage}
                                    alt={`Image 1`}
                                    className="image-preview"
                                    style={{width: '100px', height: '100px', objectFit: 'cover', padding: '3px'}}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleMainImageChange(e)}
                                />
                                {ErrorsDataOfEditOwnerHall.hallImage && (
                                    <p className="error">{ErrorsDataOfEditOwnerHall.hallImage}</p>
                                )}
                            </div>
                        }
                        {DataOfEditOwnerHall?.subImages?.map((i, index) => (
                            <div key={index} className="photoInput">
                                <img
                                    src={i.secure_url}
                                    alt={`Image ${index + 1}`}
                                    className="image-preview"
                                    style={{width: '100px', height: '100px', objectFit: 'cover', padding: '3px'}}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChangeOfEditOwnerHall(e, index)}
                                />
                                {ErrorsDataOfEditOwnerHall[`image${index}`] && (
                                    <p className="error">{ErrorsDataOfEditOwnerHall[`image${index}`]}</p>
                                )}
                            </div>

                        ))
                        }
                    </div>

                    <div>
                        <label>فيديو للقاعة:</label>
                        <input type="file" name="video" accept="video/*" onChange={(e) => {
                            setFlageGhange(true);
                            setDataOfEditOwnerHall({
                                ...DataOfEditOwnerHall,
                                video: e.target.files[0]
                            })
                            setVideoChange(true);
                        }
                        }/>
                        {ErrorsDataOfEditOwnerHall.video &&
                            <p className="error">{ErrorsDataOfEditOwnerHall.video}</p>
                        }
                    </div>

                    <div>
                        <label>رقم للتواصل:</label>
                        <input type="text" name="contactNumber" value={DataOfEditOwnerHall.contactPhone || ''}
                               onChange={(e) => handleChangeInEditOwnerHall(e, null, 'contactPhone')}/>
                        {ErrorsDataOfEditOwnerHall.contactNumber &&
                            <p className="error">{ErrorsDataOfEditOwnerHall.contactNumber}</p>
                        }
                    </div>

                    <div>
                        <label>الوقت المتاح لتأكيد الحجز(ساعة):</label>
                        <input min="1" type="number" name="payTime"
                               value={DataOfEditOwnerHall.bookingConfirmationTime || ''}
                               onChange={(e) => handleChangeInEditOwnerHall(e, null, 'bookingConfirmationTime')}/>
                        {ErrorsDataOfEditOwnerHall.payTime &&
                            <p className="error">{ErrorsDataOfEditOwnerHall.payTime}</p>
                        }
                    </div>

                    <input disabled={FlageChange === false} type="submit" value="حفظ التغييرات"/>
                </form>)
            }
        </>
    );
};

export default EditHallByOwner;
