import React, { useState } from 'react';
import axios from "axios";
import LoadingDialog from "./LoadingDialog";
import SignInAlert from "./SignInAlert";

const AddNewOwnerHall = () => {

    const token = localStorage.getItem("token");
    const [DataOfAddNewOwnerHall, setDataOfAddNewOwnerHall] = useState({
        hallName: '',
        address: '',
        occasions: [{ occasion: 'أخرى', price: '', deposit:'',addOneHour:'' }], // Default first occasion
        services: {
            dj: false,
            photography: false,
            hospitality: false,
        },
        returnArabon: '',
        hallCapacity: '',
        images: ['', '', '', ''], // Initialize exactly four image slots
        video: '',
        contactNumber: '',
        payTime: '',
    });
    const [ErrorsDataOfAddNewOwnerHall, setErrorsDataOfAddNewOwnerHall] = useState({});

    const [selectCity, setSelectCity] = useState("");


    // Handle input change for dynamic fields
    const handleChange = (e, index, field, type) => {
        const { value } = e.target;
        if (type === 'occasions') {
            const newOccasions = [...DataOfAddNewOwnerHall.occasions];
            newOccasions[index][field] = value || ''; // Ensure value is an empty string if undefined
            setDataOfAddNewOwnerHall({ ...DataOfAddNewOwnerHall, occasions: newOccasions });
        } else {
            setDataOfAddNewOwnerHall({ ...DataOfAddNewOwnerHall, [field]: value || '' }); // Ensure value is an empty string if undefined
        }
    };

    const validationDataOfAddNewOwnerHall = () => {
        const errors = {};

        if (!DataOfAddNewOwnerHall.hallName)
            errors.hallName = "اسم الصالة مطلوب";
        else if(!DataOfAddNewOwnerHall.hallName.match(/^[\u0600-\u06FF\s]+$/)){
            errors.hallName = "يجب أن لا يحتوي اسم الصالة على حروف إنجليزية أو أرقام.";
        }

        if (selectCity==="")
            errors.city = "المدينة مطلوبة";

        if (!DataOfAddNewOwnerHall.address) errors.address = "العنوان مطلوب";
        else if(!DataOfAddNewOwnerHall.address.match(/^[\u0600-\u06FF\s]+$/)){
            errors.address = "يجب أن لا يحتوي العنوان على حروف إنجليزية أو أرقام.";
        }

        // Validate occasions (check price and deposit for each occasion)
        DataOfAddNewOwnerHall.occasions.forEach((occasion, index) => {
            if (!occasion.price  || (Number(occasion.price) <= 0)) errors[`occasionPrice${index}`] = "السعر مطلوب";
            if (!occasion.deposit  || (Number(occasion.deposit) > Number(occasion.price) ) ) errors[`occasionDeposit${index}`] = "العربون مطلوب";
            if (!occasion.addOneHour || (Number(occasion.addOneHour) > Number(occasion.price) ) ) errors[`occasionAddOneHour${index}`] = "الحقل مطلوب";
            if ((index > 0 && !occasion.occasion) || (occasion.occasion !=="أخرى" && occasion.occasion !=="زفاف" && occasion.occasion !=="خطوبة" && occasion.occasion !=="تخرج" &&
                occasion.occasion !=="ولائم" && occasion.occasion !=="حناء" && occasion.occasion !=="أعياد ميلاد" &&
                occasion.occasion !=="وداع عزوبية" )
                || !occasion.occasion.match(/^[\u0600-\u06FF\s]+$/)) errors[`occasionName${index}`] = "اسم المناسبة مطلوب";
        // if (index > 0 && (occasion.occasion !=="أخرى" || occasion.occasion !=="زفاف" || occasion.occasion !=="خطوبة" || occasion.occasion !=="تخرج" ||
        //         occasion.occasion !=="ولائم" || occasion.occasion !=="حناء" || occasion.occasion !=="أعياد ميلاد" ||
        //         occasion.occasion !=="وداع عزوبية" )
        //         && !occasion.occasion && occasion.occasion.match(/^[\u0600-\u06FF\s]+$/)) errors[`occasionName${index}`] = "اسم المناسبة مطلوب";
        //
            });


        if (!DataOfAddNewOwnerHall.contactNumber) errors.contactNumber = "رقم للتواصل مطلوب";
        else if ((!/^(059|056)\d{7}$/.test(DataOfAddNewOwnerHall.contactNumber))) {
            errors.contactNumber = "رقم الهاتف غير صالح.";
        }

        if (!DataOfAddNewOwnerHall.returnArabon) errors.returnArabon = "زمن استرداد العربون مطلوب";

        if (!DataOfAddNewOwnerHall.hallCapacity) errors.hallCapacity = "حقل سعة القاعة مطلوب";


        if (!DataOfAddNewOwnerHall.video) errors.video = "الفيديو مطلوب";

        if (!DataOfAddNewOwnerHall.payTime) errors.payTime = "الوقت المتاح لتأكيد الحجز مطلوب";

        // Check if four images are uploaded
        DataOfAddNewOwnerHall.images.forEach((image, index) => {
            if (!image) errors[`image${index}`] = `الصورة ${index + 1} مطلوبة`;

        });


        setErrorsDataOfAddNewOwnerHall(errors);

        // Return true if no errors
        console.log(errors);
        return Object.keys(errors).length === 0;
    };


    const handleImageChange = (e, index) => {
        const newImages = [...DataOfAddNewOwnerHall.images];
        newImages[index] = e.target.files[0] || ''; // Ensure value is an empty string if undefined
        setDataOfAddNewOwnerHall({ ...DataOfAddNewOwnerHall, images: newImages });
    };

    // Handle adding more occasions
    const addOccasion = () => {
        setDataOfAddNewOwnerHall((prevState) => ({
            ...prevState,
            occasions: [...prevState.occasions, { occasion: '', price: '' ,addOneHour : ''}],
        }));
    };

    // Handle service selection change
    const handleServiceChange = (serviceName) => {
        setDataOfAddNewOwnerHall((prevState) => ({
            ...prevState,
            services: {
                ...prevState.services,
                [serviceName]: !prevState.services[serviceName],
            },
        }));
    };

    function calculateMinMax (){
        const allPrices = DataOfAddNewOwnerHall.occasions.map((e)=>{
            return e.price;
        })
        const min = Math.min(...allPrices);
        const max = Math.max(...allPrices);

        return {min , max};
    }

    const [loading, setLoading] = useState(false);
    const [flag, setFlag] = useState(false);

    const handleSubmit = (e) => {
        window.scrollTo(0, 0);
        e.preventDefault();
        const validationErrorsAddHall = validationDataOfAddNewOwnerHall();
        if (!validationErrorsAddHall) {
            console.log(validationErrorsAddHall)

        }

        else {
            setLoading(true);
            setErrorsDataOfAddNewOwnerHall({});
            const { min, max } = calculateMinMax();

            const fetchHalls = async () => {
                const formData = new FormData();

                // Append regular form data
                formData.append("name", DataOfAddNewOwnerHall.hallName);
                formData.append("address", DataOfAddNewOwnerHall.address);
                formData.append("city", selectCity);
                formData.append("priceRange[min]", min);
                formData.append("priceRange[max]", max);
                formData.append("capacity", DataOfAddNewOwnerHall.hallCapacity);
                formData.append("rating", '5'); // Assuming rating is static as '5'
                formData.append("camera", DataOfAddNewOwnerHall.services.photography);
                formData.append("food", DataOfAddNewOwnerHall.services.hospitality);
                formData.append("DJ", DataOfAddNewOwnerHall.services.dj);
                formData.append("refundTime", DataOfAddNewOwnerHall.returnArabon);
                formData.append("bookingConfirmationTime", DataOfAddNewOwnerHall.payTime);
                formData.append("contactPhone", DataOfAddNewOwnerHall.contactNumber);

                // Append images and video
                if (DataOfAddNewOwnerHall.images && DataOfAddNewOwnerHall.images[0]) {
                    formData.append("image", DataOfAddNewOwnerHall.images[0]);
                }
                if (DataOfAddNewOwnerHall.images && DataOfAddNewOwnerHall.images[1]) {
                    formData.append("subImage1", DataOfAddNewOwnerHall.images[1]);
                }
                if (DataOfAddNewOwnerHall.images && DataOfAddNewOwnerHall.images[2]) {
                    formData.append("subImage2", DataOfAddNewOwnerHall.images[2]);
                }
                if (DataOfAddNewOwnerHall.images && DataOfAddNewOwnerHall.images[3]) {
                    formData.append("subImage3", DataOfAddNewOwnerHall.images[3]);
                }
                if (DataOfAddNewOwnerHall.video) {
                    formData.append("video", DataOfAddNewOwnerHall.video);
                }

                try {
                    const response = await axios.post(
                        'https://shinyproject.onrender.com/hall/createHall',
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data', // This is important for file uploads
                                Authorization:`shiny__${token}`
                            },
                        }
                    );
                    if(response.data?.hallId){
                        const id = response.data.hallId;
                        DataOfAddNewOwnerHall.occasions.map((e) => {
                            console.log(e.occasion)
                            console.log(e.price)
                            console.log(e.deposit)
                            console.log(e.addOneHour)
                            const fetch = async ()=>{
                                try {
                                    const response2 = await axios.post(
                                        `https://shinyproject.onrender.com/hall/${id}/event/createEvent`,
                                        {
                                            name:e.occasion,
                                            price:Number(e.price),
                                            priceOneHour:Number(e.addOneHour),
                                            Arbon:Number(e.deposit),
                                        },
                                        {
                                            headers: {
                                                Authorization:`shiny__${token}`
                                            },
                                        }
                                    );
                                    if(response2.data){
                                        console.log(response2.data)
                                    }
                                }catch (e){
                                    console.log("error in events")
                                    console.log(e.response.data)
                                    console.log(e.response.status)
                                    console.log(e.response.headers)
                                }
                            }
                            fetch();
                        })
                        setFlag(true);
                        setTimeout(()=>{
                            window.location.href ='/OwnerHall';
                        },1000)
                    }
                } catch (error) {
                    console.error('Error adding halls:', e.message);
                }
            };

            fetchHalls().finally(()=> setLoading(false));
        }

    };


    // Function to delete an occasion
    const deleteOccasion = (index) => {
        const newOccasions = DataOfAddNewOwnerHall.occasions.filter((_, i) => i !== index);
        setDataOfAddNewOwnerHall({ ...DataOfAddNewOwnerHall, occasions: newOccasions });
    };


    return (
        <>
            <form className="FormAddNewOwnerHall" onSubmit={handleSubmit}>
                <div>
                    <label style={{marginTop: "10px"}}>اسم الصالة:</label>
                    <input type="text" name="hallName" value={DataOfAddNewOwnerHall.hallName}
                           onChange={(e) => handleChange(e, null, 'hallName')}
                    />
                    {ErrorsDataOfAddNewOwnerHall.hallName &&
                        <p className="error">{ErrorsDataOfAddNewOwnerHall.hallName}</p>
                    }
                </div>

                <div>
                    <label style={{marginTop: "10px"}}>المدينة:</label>
                    <select className="selectCity" value={selectCity} onChange={(e)=>{setSelectCity(e.target.value);}}>
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
                    {ErrorsDataOfAddNewOwnerHall.city &&
                        <p className="error"><br/><br/>{ErrorsDataOfAddNewOwnerHall.city}</p>}
                </div>

                <br/>
                <br/>

                <div>
                    <label>العنوان:</label>
                    <input type="text" name="address" value={DataOfAddNewOwnerHall.address}
                           onChange={(e) => handleChange(e, null, 'address')}
                           placeholder="طولكرم، دير الغصون"
                    />
                    {ErrorsDataOfAddNewOwnerHall.address &&
                        <p className="error">{ErrorsDataOfAddNewOwnerHall.address}</p>}
                </div>


                {DataOfAddNewOwnerHall.occasions.map((occ, index) => (
                        <div key={index} className="occasion-row">
                            {index === 0 ? (
                                <>
                                    <label>المناسبة {index + 1}:</label>
                                    <br/>
                                    <input
                                        type="text"
                                        value="مناسبات أخرى(مولد، مباركة، تكريم...)"
                                        disabled
                                    />
                                    <br/>
                                    <label>السعر(₪):</label>
                                    <input
                                        min="1"
                                        type="number"
                                        value={occ.price || ''}
                                        onChange={(e) => handleChange(e, index, 'price', 'occasions')}

                                    />
                                    {ErrorsDataOfAddNewOwnerHall[`occasionPrice${index}`] && (
                                        <p className="error">{ErrorsDataOfAddNewOwnerHall[`occasionPrice${index}`]}</p>
                                    )}
                                    <label>عربون(₪):</label>
                                    <input
                                        min="1"
                                        type="number"
                                        value={occ.deposit || ''}
                                        onChange={(e) => handleChange(e, index, 'deposit', 'occasions')}

                                    />
                                    {ErrorsDataOfAddNewOwnerHall[`occasionDeposit${index}`] && (
                                        <p className="error">{ErrorsDataOfAddNewOwnerHall[`occasionDeposit${index}`]}</p>
                                    )}

                                    <label>سعر الساعة الإضافيّة(₪):</label>
                                    <input
                                        min="1"
                                        type="number"
                                        value={occ.addOneHour || ''}
                                        onChange={(e) => handleChange(e, index, 'addOneHour', 'occasions')}

                                    />
                                    {ErrorsDataOfAddNewOwnerHall[`occasionAddOneHour${index}`] && (
                                        <p className="error">{ErrorsDataOfAddNewOwnerHall[`occasionAddOneHour${index}`]}</p>
                                    )}
                                </>
                            ) : (
                                <>
                                    <label>المناسبة {index + 1}:</label>
                                    <input
                                        type="text"
                                        value={occ.occasion || ''}
                                        onChange={(e) => handleChange(e, index, 'occasion', 'occasions')}

                                    />
                                    <p style={{
                                       fontSize:"12px",
                                        position:"relative",
                                        right:"75px",
                                        color:"green"
                                    }}> المناسبات (زفاف، خطوبة، تخرج، ولائم، حناء، أعياد ميلاد، وداع عزوبية) </p>
                                    {ErrorsDataOfAddNewOwnerHall[`occasionName${index}`] && (
                                        <p className="error" style={{marginTop:"-8px"}}>{ErrorsDataOfAddNewOwnerHall[`occasionName${index}`]}</p>
                                    )}
                                    <label>السعر(₪):</label>
                                    <input
                                        min="1"
                                        type="number"
                                        value={occ.price || ''}
                                        onChange={(e) => handleChange(e, index, 'price', 'occasions')}

                                    />
                                    {ErrorsDataOfAddNewOwnerHall[`occasionPrice${index}`] && (
                                        <p className="error">{ErrorsDataOfAddNewOwnerHall[`occasionPrice${index}`]}</p>
                                    )}
                                    <label>عربون(₪):</label>
                                    <input
                                        min="1"
                                        type="number"
                                        value={occ.deposit || ''}
                                        onChange={(e) => handleChange(e, index, 'deposit', 'occasions')}

                                    />
                                    {ErrorsDataOfAddNewOwnerHall[`occasionDeposit${index}`] && (
                                        <p className="error">{ErrorsDataOfAddNewOwnerHall[`occasionDeposit${index}`]}</p>
                                    )}
                                    <label>سعر الساعة الإضافيّة(₪):</label>
                                    <input
                                        min="1"
                                        type="number"
                                        value={occ.addOneHour || ''}
                                        onChange={(e) => handleChange(e, index, 'addOneHour', 'occasions')}

                                    />
                                    {ErrorsDataOfAddNewOwnerHall[`occasionAddOneHour${index}`] && (
                                        <p className="error">{ErrorsDataOfAddNewOwnerHall[`occasionAddOneHour${index}`]}</p>
                                    )}
                                    <button className="btn btn-danger deleteOwnerHall" type="button"
                                            onClick={() => deleteOccasion(index)}>حذف
                                    </button>
                                </>
                            )}
                        </div>
                    )
                )}

                <button
                    type="button"
                    className="btn btn-success AddOwnerHall"
                    onClick={addOccasion}
                    disabled={
                        DataOfAddNewOwnerHall.occasions.length > 0 &&
                        (
                            !DataOfAddNewOwnerHall.occasions[DataOfAddNewOwnerHall.occasions.length - 1].occasion ||
                            !DataOfAddNewOwnerHall.occasions[DataOfAddNewOwnerHall.occasions.length - 1].price ||
                            !DataOfAddNewOwnerHall.occasions[DataOfAddNewOwnerHall.occasions.length - 1].deposit ||
                            !DataOfAddNewOwnerHall.occasions[DataOfAddNewOwnerHall.occasions.length - 1].addOneHour
                        )
                    }
                >
                    إضافة مناسبة
                </button>


                {/* Services */}
                <div className="services-section">
                    <br/>
                    <label>الخدمات:</label>
                    <div style={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        marginRight: "-160px"
                    }}>
                        <label style={{margin: "10px"}}>
                            <input className="border"
                                   type="checkbox"
                                   checked={DataOfAddNewOwnerHall.services.dj}
                                   onChange={() => handleServiceChange('dj')}
                            />
                            دي جي
                        </label>
                        <br/>
                        <label style={{margin: "10px"}}>
                            <input
                                type="checkbox"
                                checked={DataOfAddNewOwnerHall.services.photography}
                                onChange={() => handleServiceChange('photography')}
                            />
                            تصوير
                        </label>
                        <br/>
                        <label style={{margin: "10px"}}>
                            <input
                                type="checkbox"
                                checked={DataOfAddNewOwnerHall.services.hospitality}
                                onChange={() => handleServiceChange('hospitality')}
                            />
                            ضيافة
                        </label>
                    </div>
                </div>

                <br/>

                <div>
                    <label>زمن استرداد العربون(ساعة):</label>
                    <input min="1" type="number" name="returnArabon" value={DataOfAddNewOwnerHall.returnArabon || ''}
                           onChange={(e) => handleChange(e, null, 'returnArabon')}/>
                    {ErrorsDataOfAddNewOwnerHall.returnArabon &&
                        <p className="error">{ErrorsDataOfAddNewOwnerHall.returnArabon}</p>}
                </div>

                <div>
                    <label>السعة:</label>
                    <input min="1" type="number" name="hallCapacity" value={DataOfAddNewOwnerHall.hallCapacity || ''}
                           onChange={(e) => handleChange(e, null, 'hallCapacity')}/>
                    {ErrorsDataOfAddNewOwnerHall.hallCapacity &&
                        <p className="error">{ErrorsDataOfAddNewOwnerHall.hallCapacity}</p>}
                </div>

                {/* File upload for exactly 4 images */}
                <div>
                    <label>صور للقاعة:</label>
                    {DataOfAddNewOwnerHall.images.map((_, index) => (
                        <div key={index} className="photoInput">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, index)}
                            />
                            {ErrorsDataOfAddNewOwnerHall[`image${index}`] && (
                                <p className="error">{ErrorsDataOfAddNewOwnerHall[`image${index}`]}</p>
                            )}
                        </div>

                    ))}
                </div>

                <div>
                    <label>فيديو للقاعة:</label>
                    <input type="file" name="video" accept="video/*" onChange={(e) => setDataOfAddNewOwnerHall({
                        ...DataOfAddNewOwnerHall,
                        video: e.target.files[0]
                    })}/>
                    {ErrorsDataOfAddNewOwnerHall.video &&
                        <p className="error">{ErrorsDataOfAddNewOwnerHall.video}</p>
                    }
                </div>

                <div>
                    <label>رقم للتواصل:</label>
                    <input type="text" name="contactNumber" value={DataOfAddNewOwnerHall.contactNumber || ''}
                           onChange={(e) => handleChange(e, null, 'contactNumber')}/>
                    {ErrorsDataOfAddNewOwnerHall.contactNumber &&
                        <p className="error">{ErrorsDataOfAddNewOwnerHall.contactNumber}</p>
                    }
                </div>

                <div>
                    <label>الوقت المتاح لتأكيد الحجز(ساعة):</label>
                    <input min="1" type="number" name="payTime" value={DataOfAddNewOwnerHall.payTime || ''}
                           onChange={(e) => handleChange(e, null, 'payTime')}/>
                    {ErrorsDataOfAddNewOwnerHall.payTime &&
                        <p className="error">{ErrorsDataOfAddNewOwnerHall.payTime}</p>
                    }
                </div>

                <input type="submit" value="إرسال"/>
            </form>

            <div style={{marginRight: "-130px", position: "absolute", top: "165px",zIndex:"10"}}>
                {flag && <SignInAlert flag={flag} SignInAlertText="تم إنشاء الصالة بنجاح!" AlertHeight="304vh"/>}
            </div>

            <div style={{position: "absolute", right: "48%", top: "400px"}}>
                {loading &&
                    <LoadingDialog loading={loading}/>
                }
            </div>
        </>
    );
};

export default AddNewOwnerHall;
