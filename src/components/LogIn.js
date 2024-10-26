import React, {useState} from 'react';
import Nav from "react-bootstrap/Nav"
import LogInCouple from "../images/singInCouple.png";
import LogInFlowedBlue from "../images/SignInFlowedBlue.png";
import SigninFormFlower from "../images/SigninFormFlower.png";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import Aboutus from "./aboutus";

const LogIn = () => {

    const[logInInput, setlogInInput] = useState({
        "email":""
        ,"password":""

    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility

    function ValidationLogIn(){

        const newErrors = {};

        //email Validation
        if(!logInInput.email){
            newErrors.Email="يجب إدخال البريد الإلكتروني."
        }else if (!/\S+@\S+\.\S+/.test(logInInput.email)) {
            newErrors.Email = "البريد الإلكتروني غير صالح";
        }


        //Password Validation
        if(!logInInput.password){
            newErrors.Password="يجب إدخال كلمة المرور.";
        }

        return newErrors;

    }

    const handleLogInSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = ValidationLogIn();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        }else {
            setErrors({});

            try {
                const response = await axios.post('https://shinyproject.onrender.com/auth/login', {
                    email: logInInput.email,
                    password: logInInput.password,
                });

                if (response.status === 200) {
                    // Store role and email in localStorage
                    const token = response.data.token;
                    localStorage.setItem("token",token);
                    // Decode token to extract role and other info
                    const decoded = jwtDecode(token);

                    const { role, id } = decoded;
                    localStorage.setItem("authRole", role);
                    localStorage.setItem("userID", id); // Store user email for later use
                    setTimeout(()=>{
                        window.location.href = "/AboutUs"; // Redirect to home or another page
                    },1000)
                }

            } catch (error) {
                setErrors({...errors , Password : "كلمة المرور أو البريد الإلكتروني غير صحيح."});
            }
        }
    };

    if(localStorage.getItem("authRole")!== null){
        return <Aboutus></Aboutus>
    }
    
    return (
        <div id="LogInFormOutLogIn" className="LogInFormOut">
            <div className="LogInCouple">
                <img src={LogInCouple} alt="noPic"/>

            </div>

            <div className="LogInFlowedBlue">
                <img src={LogInFlowedBlue} alt="noPic"/>
            </div>

            <div className="LogInDiv">
                <div className="LogInDivIn">
                    <div>
                        <h3 className="SigninFormH3">أهلاً بك </h3>
                        <img className="SigninFormFlower" src={SigninFormFlower} alt="noPic"/>
                    </div>
                    <form onSubmit={handleLogInSubmit} className="mt-2 pt-2">
                        <div>
                            {/*<label htmlFor="EmailId">البريد الإلكتروني:</label>*/}
                            <br/>
                            <input id="EmailId" value={logInInput.email} onChange={(event) => {
                                setlogInInput({...logInInput, email: event.target.value})
                            }} type="text" placeholder="البريد الإلكتروني"
                            />
                            {errors.Email && <p className="errorLogIn">{errors.Email}</p>}
                        </div>


                        <div style={{position:"relative"}}>
                            {/*<label>كلمة المرور:</label>*/}
                            <br/>
                            <input value={logInInput.password} onChange={(event) => {
                                setlogInInput({...logInInput, password: event.target.value})
                            }}  type={showPassword ? "text" : "password"} placeholder="كلمة المرور"/>
                            <span
                                className="password-toggle-icon"
                                style={{backgroundColor:"",position:"absolute", left:"40px",top:"25px"}}
                                onClick={() => setShowPassword(!showPassword)} // Toggle the password visibility
                            >
                                {showPassword ? <FaEyeSlash/> : <FaEye/>}
                            </span>
                            {errors.Password && <p className="errorLogIn">{errors.Password}</p>}
                        </div>


                        <input className="logInSubmit" type="submit" value="تسجيل الدخول"/>

                        <Nav.Link style={{marginTop:"15px"}} className="forget" href="/SignIn">إنشاء حساب</Nav.Link>
                        <Nav.Link style={{marginTop:"3px"}} className="forget" href="/ForgotPassword">هل نسيت كلمة المرور؟</Nav.Link>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default LogIn;