import React from 'react';
import {useState} from "react";
import SignInAlert from "../components/SignInAlert";
import SigninFormFlower from "../images/SigninFormFlower.png";
import singInCouple from "../images/singInCouple.png"
import SignInFlowedBlue from "../images/SignInFlowedBlue.png"
import {FaEye, FaEyeSlash} from "react-icons/fa";
import axios from "axios";
import Aboutus from "./aboutus";


const SignIn = () => {
  const [sgininInput, setsgininInput] = useState({
      "username": "",
      "email": "",
      "Primaryphone": "",
      "Secondaryphone": "",
      "position": "",
      "password": "",
      "cpassword": ""
  });
  const [flag,setFlag] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPasswordSignIn, setShowPasswordSignIn] = useState(false); // New state for password visibility
  const [showPasswordSignInConfirm, setShowPasswordSignInConfirm] = useState(false);

    function ValidationSignIn(){

      const newErrors = {};

      //email Validation
      if(!sgininInput.email){
          newErrors.Email="يجب إدخال البريد الإلكتروني."
      }else if (!/\S+@\S+\.\S+/.test(sgininInput.email)) {
          newErrors.Email = "البريد الإلكتروني غير صالح";
      }

      //Name Validation
      if((sgininInput.username ==="" || (sgininInput.username.length <= 6 && (sgininInput.username.match(/^[\u0600-\u06FF\s]+$/))))){
          newErrors.Name="يجب إدخال الاسم الرباعي.";
      }else if(!sgininInput.username.match(/^[\u0600-\u06FF\s]+$/)){
          newErrors.Name="يجب أن لا يحتوي الاسم على حروف إنجليزية أو أرقام.";
      }

      //Phone Validation
      if(!sgininInput.Primaryphone){
          newErrors.Phone="يجب إدخال رقم الهاتف.";
      }else if (!/^(059|056)\d{7}$/.test(sgininInput.Primaryphone)) {
          newErrors.Phone = "رقم الهاتف غير صالح.";
      }

      //sPhone Validation
      if(!sgininInput.Secondaryphone){
          newErrors.sPhone="يجب إدخال رقم هاتف آخر.";
      }else if ((!/^(059|056)\d{7}$/.test(sgininInput.Secondaryphone))) {
          newErrors.sPhone = "رقم الهاتف غير صالح.";
      }


      //Position Validation
      if(!sgininInput.position){
          newErrors.Position="يجب إدخال مكان السكن.";
      }else if(!sgininInput.position.match(/^[\u0600-\u06FF\s]+$/)){
          newErrors.Position="يجب أن لا يحتوي الاسم على حروف إنجليزية أو أرقام.";
      }

      //Password Validation
      if(!sgininInput.password){
          newErrors.Password="يجب إدخال كلمة المرور.";
      }else if(!(/^(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/).test(sgininInput.password)){
          newErrors.Password="يجب أن تتكون كلمة المرور من 8 خانات وتحتوي على رمز واحد على الأقل.";
      }

      //ConfirmPassword Validation
      if(!sgininInput.cpassword){
          newErrors.ConfirmPassword="يجب إدخال كلمة المرور مرة أخرى.";
      }else if(sgininInput.password !== sgininInput.cpassword){
          newErrors.ConfirmPassword="يجب أن تتطابق كلمتا المرور.";
      }

      return newErrors;

  }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = ValidationSignIn();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        }
        else {
        setErrors({});

            try {
                const response = await axios.post('https://shinyproject.onrender.com/auth/register', {
                    username: sgininInput.username,
                    email: sgininInput.email,
                    Primaryphone: sgininInput.Primaryphone,
                    Secondaryphone: sgininInput.Secondaryphone,
                    position: sgininInput.position,
                    password: sgininInput.password,
                    cpassword: sgininInput.cpassword
                });

                // Check if registration was successful
                if (response.status === 201) {
                    setFlag(true);
                    setTimeout(()=>{
                        setFlag(false);
                        setsgininInput({
                            "username": "",
                            "email": "",
                            "Primaryphone": "",
                            "Secondaryphone": "",
                            "position": "",
                            "password": "",
                            "cpassword": ""
                        });
                    },2000);
                }

            } catch (error) {
                setFlag(false);
                alert("الإيميل مستخدم مسبقاً.");
                console.log("There's Error IN Create Account");
            }
        }
    };

    if(localStorage.getItem("authRole")!== null){
        return <Aboutus></Aboutus>
    }

    return (
        <div id="SinINFormOutLogIn" className="SignInForm">
            <SignInAlert flag={flag} SignInAlertText={
                <>
                    راجع بريدك الإلكتروني لتأكيد حسابك!
                    <br/>

                </>
            } AlertHeight="197vh"/>

            <div className="singInCouple">
                <img src={singInCouple} alt="noPic"/>
            </div>

            <div className="SignInFlowedBlue">
                <img src={SignInFlowedBlue} alt="noPic"/>
            </div>

            <div className="SignInOuter">
                <div className="SignInInner">
                    <div>
                        <h3 className="SigninFormH3">إنضم لعائلة شايني</h3>
                        <img className="SigninFormFlower" src={SigninFormFlower} alt="noPic"/>
                    </div>

                    <form onSubmit={handleSubmit} className="mt-2 pt-2">
                        <div>
                            {/*<label htmlFor="EmailId">البريد الإلكتروني:</label>*/}
                            <br/>
                            <input name="EmailSignIn" value={sgininInput.email} onChange={(event) => {
                                setsgininInput({...sgininInput, email: event.target.value})
                            }} type="text" placeholder="الإيميل"/>
                            {errors.Email && <p className="error">{errors.Email}</p>}
                        </div>

                        <div>
                            {/*<label>الاسم الرباعي:</label>*/}
                            <br/>
                            <input name="NameSignIn" value={sgininInput.username} onChange={(event) => {
                                setsgininInput({...sgininInput, username: event.target.value})
                            }} type="text" placeholder="الاسم الرباعي"/>
                            {errors.Name && <p className="error">{errors.Name}</p>}
                        </div>

                        <div>
                            {/*<label>رقم الهاتف:</label>*/}
                            <br/>
                            <input name="PhoneSignIn" value={sgininInput.Primaryphone} onChange={(event) => {
                                setsgininInput({...sgininInput, Primaryphone: event.target.value})
                            }} type="tel" placeholder="رقم الهاتف"/>
                            {errors.Phone && <p className="error">{errors.Phone}</p>}
                        </div>

                        <div>
                            {/*<label> 2 رقم الهاتف:</label>*/}
                            <br/>
                            <input name="SPhoneSignIn" value={sgininInput.Secondaryphone} onChange={(event) => {
                                setsgininInput({...sgininInput, Secondaryphone: event.target.value})
                            }} type="tel" placeholder="رقم هاتف آخر"/>
                            {errors.sPhone && <p className="error">{errors.sPhone}</p>}
                        </div>


                        <div>
                            {/*<label>مكان السكن:</label>*/}
                            <br/>
                            <input name="PositionSignIn" value={sgininInput.position} onChange={(event) => {
                                setsgininInput({...sgininInput, position: event.target.value})
                            }} type="text" placeholder="مكان السكن"/>
                            {errors.Position && <p className="error">{errors.Position}</p>}
                        </div>

                        <div>
                            {/*<label>كلمة المرور:</label>*/}
                            <br/>
                            <input name="PasswordSignIn" value={sgininInput.password} onChange={(event) => {
                                setsgininInput({...sgininInput, password: event.target.value})
                            }} type={showPasswordSignIn ? "text" : "password"} placeholder="كلمة المرور"/>

                            <span
                                className="password-toggle-icon"
                                style={{backgroundColor: "", position: "absolute", left: "57px", }}
                                onClick={() => setShowPasswordSignIn(!showPasswordSignIn)} // Toggle the password visibility
                            >
                                {showPasswordSignIn ? <FaEyeSlash/> : <FaEye/>}
                            </span>

                            {errors.Password && <p className="error">{errors.Password}</p>}
                        </div>

                        <div>
                            {/*<label>تأكيد كلمة المرور:</label>*/}
                            <br/>
                            <input name="cPasswordSignIn" value={sgininInput.cpassword} onChange={(event) => {
                                setsgininInput({...sgininInput, cpassword: event.target.value})
                            }} type={showPasswordSignInConfirm ? "text" : "password"} placeholder="تأكيد كلمة المرور"/>

                            <span
                                className="password-toggle-icon"
                                style={{backgroundColor: "", position: "absolute", left: "57px",}}
                                onClick={() => setShowPasswordSignInConfirm(!showPasswordSignInConfirm)} // Toggle the password visibility
                            >
                                {showPasswordSignInConfirm ? <FaEyeSlash/> : <FaEye/>}
                            </span>

                            {errors.ConfirmPassword && <p className="error">{errors.ConfirmPassword}</p>}
                        </div>

                        <input className="SignInSubmit" type="submit" value="إنشاء حساب"/>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;