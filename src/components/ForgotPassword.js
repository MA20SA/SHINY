import React, { useState } from 'react';
import Nav from "react-bootstrap/Nav";
import SignInAlert from "./SignInAlert";
import axios from "axios";

const ForgotPassword = () => {

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
                    const response = await axios.put(`https://shinyproject.onrender.com/auth/sendCode`,
                        {
                            email : ForgotPassEmail
                        }
                        );
                    if (response.status === 200) {
                        localStorage.setItem("forgotPasswordEmail", ForgotPassEmail);
                        setErrors({});
                        setflagForget(true);
                        setTimeout(()=>{
                            window.location.href = "/ResetPassword"; // Redirect to home or another page
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
        <div id="ForgotPass" className=" ForgetOut">
            <SignInAlert flag={flagForget} SignInAlertText={
                <>
                    سيتم إرسال الرمز في غضون ثواني،
                    <br/>
                    راجع بريدك الإلكتروني!
                </>
            } AlertHeight="135vh"/>
            <div className="ForgotDiv">
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

                        <input className="ForgotSubmit" type="submit" value="إرسال الرمز"/>


                        <Nav.Link className="mb-3 mt-3" style={{color: "#0A499C", textDecoration: "underline"}}
                                  href="/ResetPassword">
                            إعادة تعيين كلمة المرور
                        </Nav.Link>

                    </form>
                </div>
            </div>

        </div>
    );
};

export default ForgotPassword;
