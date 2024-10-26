import React, {useEffect, useState} from 'react';
import Nav from "react-bootstrap/Nav";
import SignInAlert from "./SignInAlert";
import axios from "axios";

const ResetPassword = () => {

    const[resetPassword, setResetPassword] = useState({
        "Code":""
        ,"Pass":""
        ,"ConfirmPass":"",
    });

    const [errors, setErrors] = useState({});

    const [emailReciveReset, setEmailReciveReset] = useState("");
    const [flagReset,setflagReset] = useState(false);

    // Retrieve email from localStorage
    useEffect(() => {
        const storedEmail = localStorage.getItem("forgotPasswordEmail");
        if (storedEmail) {
            setEmailReciveReset(storedEmail);
        }
    }, []);

    function ValidationReset(){

        const newErrors = {};

        if(!resetPassword.Code){
            newErrors.Code="يجب إدخال الرمز.";
        }

        if(!resetPassword.Pass){
            newErrors.Pass="يجب إدخال  كلمة المرور.";
        }else if(!(/^(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/).test(resetPassword.Pass)){
            newErrors.Pass="يجب أن تتكون كلمة المرور من 8 خانات وتحتوي على رمز واحد على الأقل.";
        }

        if(!resetPassword.ConfirmPass){
            newErrors.ConfirmPass="يجب إدخال كلمة المرور مرة أخرى.";
        }else if(resetPassword.Pass !== resetPassword.ConfirmPass){
            newErrors.ConfirmPass="يجب أن تتطابق كلمتا المرور.";
        }

        return newErrors;

    }


    const handleResetSubmit = (e) => {
        e.preventDefault();
        const validationErrors = ValidationReset();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        }
        else {
            const fetchHalls = async () => {
                try {
                    const response = await axios.put(`https://shinyproject.onrender.com/auth/forgotpassword`,
                        {
                            email:emailReciveReset,
                            password:resetPassword.Pass,
                            cpassword: resetPassword.ConfirmPass,
                            code: resetPassword.Code
                        });

                    if (response.status===200) {
                        setflagReset(true);
                        setErrors({});
                        setTimeout(()=>{
                            window.location.href = "/LogIn"; // Redirect to home or another page
                        },1500)
                        console.log(response.status)
                    }
                } catch (e) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        Code: e.response?.data?.message?"الرمز غير صالح":"" || "An error occurred",
                    }));
                }
            };
            fetchHalls();
        }
    }




    return (
        <div id="ResetPassword" className="RestOut">
            <SignInAlert flag={flagReset} SignInAlertText={
                <>
                    تم تغيير كلمة المرور بنجاح
                    <br/>
                </>
            } AlertHeight="143vh"/>
            <div   className="ResetOuter">
                <div className="ResetInner">
                    <form onSubmit={handleResetSubmit} className="mt-2 pt-2">
                        <div>
                            {/*<label htmlFor="CodeID">الرمز:</label>*/}
                            <br/>
                            <input id="CodeID" value={resetPassword.Code} onChange={(event) => {
                                setResetPassword({...resetPassword, Code: event.target.value})
                            }} type="text" placeholder="الرمز"/>
                            {errors.Code && <p className="errorRest">{errors.Code}</p>}
                        </div>


                        <div>
                            {/*<label>كلمة المرور الجديدة:</label>*/}
                            <br/>
                            <input value={resetPassword.Pass} onChange={(event) => {
                                setResetPassword({...resetPassword, Pass: event.target.value})
                            }} type="password" placeholder="كلمة المرور الجديدة"/>
                            {errors.Pass && <p className="errorRest">{errors.Pass}</p>}
                        </div>

                        <div>
                            {/*<label>تأكيد كلمة المرور:</label>*/}
                            <br/>
                            <input value={resetPassword.ConfirmPass} onChange={(event) => {
                                setResetPassword({...resetPassword, ConfirmPass: event.target.value})
                            }} type="password" placeholder="تأكيد كلمة المرور"/>
                            {errors.ConfirmPass && <p className="errorRest">{errors.ConfirmPass}</p>}
                        </div>

                        <input className="ResetSubmit" type="submit" value="تأكيد كلمة المرور"/>

                    </form>
                </div>
            </div>

        </div>
    );
};

export default ResetPassword;