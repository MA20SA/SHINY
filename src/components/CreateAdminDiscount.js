import React, { useState} from 'react';
import axios from "axios";
import moment from "moment/moment";
import SignInAlert from "./SignInAlert";

const CreateAdminDiscount = () => {
    const [DataOfAddNewAdminDiscount, setDataOfAddNewAdminDiscount] = useState({
        discountPercentage: "" ,
        startDate: "",
        endDate: ""
    });

    const [ErrorsDataOfAddAdminDiscount, setErrorsDataOfAddAdminDiscount] = useState({});

    const handleChangeInAddAdminDiscount = (e, field) => {
        const { value } = e.target;
        setDataOfAddNewAdminDiscount(prevData => ({
            ...prevData,
            [field]: value
        }));
    };

    const validateAdminDiscountForm = () => {
        const errors = {};
        if (!DataOfAddNewAdminDiscount.startDate) errors.startDate = "تاريخ البداية مطلوب";
        if (!DataOfAddNewAdminDiscount.endDate) errors.endDate = "تاريخ النهاية مطلوب";
        if (!DataOfAddNewAdminDiscount.discountPercentage) errors.DiscountValue = "نسبة الخصم مطلوبة";

        setErrorsDataOfAddAdminDiscount(errors);
        return Object.keys(errors).length === 0;
    };

    const formatDateToDDMMYYYY = (date) => {
        if (!date) return '';
        return moment(date).format('DD-MM-YYYY');

    };
    const[FlageAddDiscount,setFlageAddDiscount]=useState(false);

    const handleSubmitAdminDiscount = (e) => {
        e.preventDefault();
        //true so no errors
        if (validateAdminDiscountForm()) {
            const fetchHalls = async () => {
                try {
                    const response = await axios.post(`https://shinyproject.onrender.com/discount/createWebsiteDiscount`,{
                        discountPercentage: Number(DataOfAddNewAdminDiscount.discountPercentage / 100),
                        startDate:`${formatDateToDDMMYYYY(DataOfAddNewAdminDiscount.startDate)}`,
                        endDate:`${formatDateToDDMMYYYY(DataOfAddNewAdminDiscount.endDate)}`,
                    },{
                        headers:{
                            Authorization: `shiny__${localStorage.getItem("token")}`
                        }
                    });

                    if(response?.data){
                        setFlageAddDiscount(true);
                        setTimeout(()=>{
                            window.location.href='/offers';
                        },500)
                    }
                } catch (e) {
                    if (e.response?.data?.message === "There is already an active website discount for the selected dates.") {
                        setErrorsDataOfAddAdminDiscount({
                            ...ErrorsDataOfAddAdminDiscount,
                            startDate: "لا يمكنك إضافة خصمين في نفس الفترة."
                        });
                    } else if (e.response?.data?.message === "Start date cannot be in the past.") {
                        setErrorsDataOfAddAdminDiscount({
                            ...ErrorsDataOfAddAdminDiscount,
                            startDate: "لا يمكنك إضافة خصم على تاريخ مضى."
                        });
                    }
                    console.error('Error adding discount:', e);
                }
            };
            fetchHalls();
        } else {
            window.scrollTo(0, 0);
        }
    };

    return (
        <div id="CreateAdminDoscount" className="offers">
            <div style={{position: "relative", zIndex: "15", left: "133px"}}>
                <SignInAlert flag={FlageAddDiscount} SignInAlertText={"تم إضافة الخصم بنجاح"}
                             AlertHeight="172vh"/>
            </div>

            <div className="FormAddNewOwnerHall" style={{
                borderColor: "firebrick",
                borderWidth: "8px",
                position: "absolute",
                width: "100%",
                top: "370px",
                right: "360px"
            }}>
                <form onSubmit={handleSubmitAdminDiscount}>
                    <div>
                        <label>تاريخ البداية:</label>
                        <input type="date" value={DataOfAddNewAdminDiscount.startDate}
                               onChange={(e) => handleChangeInAddAdminDiscount(e, 'startDate')}/>
                        {ErrorsDataOfAddAdminDiscount.startDate &&
                            <p className="error">{ErrorsDataOfAddAdminDiscount.startDate}</p>}
                    </div>

                    <div>
                        <label>تاريخ النهاية:</label>
                        <input type="date" value={DataOfAddNewAdminDiscount.endDate}
                               onChange={(e) => handleChangeInAddAdminDiscount(e, 'endDate')}/>
                        {ErrorsDataOfAddAdminDiscount.endDate &&
                            <p className="error">{ErrorsDataOfAddAdminDiscount.endDate}</p>}
                    </div>

                    <div>
                        <label>نسبة الخصم(%):</label>
                        <input type="number" min="1" value={DataOfAddNewAdminDiscount.discountPercentage}
                               onChange={(e) => handleChangeInAddAdminDiscount(e, 'discountPercentage')}/>
                        {ErrorsDataOfAddAdminDiscount.DiscountValue &&
                            <p className="error">{ErrorsDataOfAddAdminDiscount.DiscountValue}</p>}
                    </div>

                    <input id="SubmitAdminDiscount" style={{backgroundColor: "firebrick", color: "white", fontSize: "19px"}} type="submit"
                           value="إرسال"/>
                </form>
            </div>
        </div>
    );
};

export default CreateAdminDiscount;