import React, {useState} from 'react';
import SignInAlert from "./SignInAlert";
import Nav from "react-bootstrap/Nav";
import axios from "axios";

const AddNewOwnerByAdmin = () => {

    const [ForgotPassEmail, setForgotPassEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [flagForget,setflagForget] = useState(false);

    function ValidationForgot(){

        const newErrors = {};

        //email Validation
        if(!ForgotPassEmail){
            newErrors.ForgotPassEmail="يجب إدخال البريد الإلكتروني."
        }else if (!/\S+@\S+\.\S+/.test(ForgotPassEmail)) {
            newErrors.ForgotPassEmail = "البريد الإلكتروني غير صالح";
        }

        return newErrors;

    }


    const handleForgotSubmit = (e) => {
        e.preventDefault();
        const validationErrors = ValidationForgot();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            const fetchHalls = async () => {
                try {
                    const response = await axios.put(`https://shinyproject.onrender.com/user/updateUserRole/${ForgotPassEmail}`,
                    {
                        role : "owner"
                    },
                        {
                            headers:{
                                Authorization: `shiny__${localStorage.getItem('token')}`,
                            }
                        }
                    );
                    if (response.status === 200) {
                        console.log(response.data);
                        setErrors({});
                        setflagForget(true);
                        setTimeout(()=>{
                            window.location.href = "/ShowOwners"; // Redirect to home or another page
                        },1500)
                    }
                } catch (e) {
                    console.error('Response data:', e.response.data);
                    console.error('Response status:', e.response.status);
                    console.error('Response headers:', e.response.headers)
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        ForgotPassEmail: e.response?.data?.message?"البريد الإلكتروني غير صالح":"" || "An error occurred",
                    }));
                }
            };
            fetchHalls();
        }
    }

    return (
        <div id="AddNEWOWNER" className=" ForgetOut">
            <SignInAlert flag={flagForget} SignInAlertText={
                <>
                    تم إضافة مالك القاعة بنجاج!
                </>
            } AlertHeight="135vh"/>
            <div className=" ForgotDiv">
                <div className="ForgotDivIn">
                    <form onSubmit={handleForgotSubmit} className="mt-2 pt-2">
                        <div>
                            {/*<label htmlFor="EmailId">البريد الإلكتروني:</label>*/}
                            <br/>
                            <input id="EmailId" value={ForgotPassEmail} onChange={(event) => {
                                setForgotPassEmail(event.target.value)
                            }} type="text" placeholder="البريد الإلكتروني"/>
                            {errors.ForgotPassEmail && <p className="errorForget">{errors.ForgotPassEmail}</p>}
                        </div>

                        <input className="ForgotSubmit" type="submit" value="إضافة المالك"/>
                        <br/>

                    </form>
                </div>
            </div>

        </div>
    );
};

export default AddNewOwnerByAdmin;