import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import SignInAlert from "../SignInAlert";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import axios from "axios";
import {useRefreshAccount} from "../../Context/RefreshAccount"; // Assuming this component is available for alerts

const EditProfileRegUser = () => {
    const {UserIdToEdit} = useParams();

    const token = localStorage.getItem("token");
    const [flagToInformationRegister, setFlagToInformationRegister] = useState(true);
    const [flagToInformationRegisterPrivacy, setFlagToInformationRegisterPrivacy] = useState(false);
    const [userInfo, setUserInfo] = useState({
        email: '',
        username:'',
        Secondaryphone : '',
        Primaryphone :'',
        position :''
    });


    const [OldPasswordRegUser, setOldPasswordRegUser] = useState("");
    const [newPasswordRegUser, setNewPasswordRegUser] = useState("");
    const [newPasswordRegUserConfirm, setNewPasswordRegUserConfirm] = useState("");

    const navigate = useNavigate();
    const [errorsEditRegUser, setErrorsEditRegUser] = useState({});
    const [ErrorsEditPasswordRegUser, setErrorsEditPasswordRegUser] = useState({});
    const [flagRegUser, setFlagRegUser] = useState(false);

    const{refresh,setRefresh} =useRefreshAccount();
    // Fetch user info based on the email parameter
    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/user/getUserById/${UserIdToEdit}`,
                    {
                        headers: {
                            Authorization: `shiny__${token}`
                        }
                    });
                if (response.data?.user) {
                    setUserInfo(response.data.user);
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
                // console.error('Response data:', e.response.data);
                // console.error('Response status:', e.response.status);
                // console.error('Response headers:', e.response.headers)
            }
        };
        fetchHalls();

    }, [UserIdToEdit]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setChange(true);
        setUserInfo({ ...userInfo, [name]: value });
    };

    const validateEditRegProfile = () => {
        const newErrors = {};


        if (userInfo.username.length < 6 || !userInfo.username.match(/^[\u0600-\u06FF\s]+$/)) {
            newErrors.Name = "يجب إدخال الاسم الرباعي.";
        }

        if (!userInfo.Primaryphone) {
            newErrors.Phone = "يجب إدخال رقم الهاتف.";
        } else if (!/^(059|056)\d{7}$/.test(userInfo.Primaryphone)) {
            newErrors.Phone = "رقم الهاتف غير صالح.";
        }

        if (!userInfo.Secondaryphone) {
            newErrors.sPhone = "يجب إدخال رقم الهاتف.";
        } else if (!/^(059|056)\d{7}$/.test(userInfo.Secondaryphone)) {
            newErrors.sPhone = "رقم الهاتف غير صالح.";
        }

        if (!userInfo.position) {
            newErrors.Position = "يجب إدخال مكان السكن.";
        } else if (!userInfo.position.match(/^[\u0600-\u06FF\s]+$/)) {
            newErrors.Position = "يجب أن لا يحتوي الاسم على حروف إنجليزية أو أرقام.";
        }

        return newErrors;
    };

    const handleSubmitEditRegUser = (e) => {
        e.preventDefault();
        const validationErrors = validateEditRegProfile();
        if (Object.keys(validationErrors).length > 0) {
            setErrorsEditRegUser(validationErrors);
        } else {
            const fetchHalls = async () => {
                try {
                    const response = await axios.patch(`https://shinyproject.onrender.com/user/update/${UserIdToEdit}`,
                        {
                            username: userInfo.username,
                            Primaryphone: userInfo.Primaryphone,
                            Secondaryphone: userInfo.Secondaryphone,
                            position: userInfo.position
                        },
                        {
                            headers: {
                                Authorization: `shiny__${token}`
                            }
                        }
                    )

                    if (response && response.status===200) {
                        setErrorsEditRegUser({});
                        setFlagRegUser(true);
                        setRefresh(!refresh);

                        setTimeout(() => {
                            navigate("/AboutUs");
                        }, 1000);

                    }
                } catch (e) {
                    console.error('Error fetching halls:', e);
                }
            };
            fetchHalls();
        }
    }

    const validateEditPasswordRegUser = () => {
        const newErrors = {};
        if(!OldPasswordRegUser){
            newErrors.OldPasswordRegUser="يجب إدخال كلمة المرور.";
        }

        if(!newPasswordRegUser){
            newErrors.newPasswordRegUser="يجب إدخال كلمة المرور الجديدة.";
        }else if(!(/^(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]).{8,}$/).test(newPasswordRegUser)){
            newErrors.newPasswordRegUser="يجب أن تتكون كلمة المرور من 8 خانات وتحتوي على رمز واحد على الأقل.";
        }

        //ConfirmPassword Validation
        if(!newPasswordRegUserConfirm){
            newErrors.newPasswordRegUserConfirm="يجب إدخال كلمة المرور مرة أخرى.";
        }else if(newPasswordRegUserConfirm !== newPasswordRegUser){
            newErrors.newPasswordRegUserConfirm="يجب أن تتطابق كلمتا المرور.";
        }

        return newErrors;
    };

    const handleSubmitEditPasswordRegUser = (e) => {
        e.preventDefault();
        const validationErrors = validateEditPasswordRegUser();
        if (Object.keys(validationErrors).length > 0) {
            setErrorsEditPasswordRegUser(validationErrors);
        } else {
            const fetchHalls = async () => {
                try {
                    const response = await axios.patch(`https://shinyproject.onrender.com/user/updateUserPassword/${UserIdToEdit}`,
                        {
                            oldPassword: OldPasswordRegUser,
                            newPassword: newPasswordRegUser,
                            confirmPassword: newPasswordRegUserConfirm,
                        },
                        {
                            headers: {
                                Authorization: `shiny__${token}`
                            }
                        }
                    )

                    if (response && response.status===200) {
                        setErrorsEditPasswordRegUser({});
                        setFlagRegUser(true);

                        setTimeout(() => {
                            navigate("/AboutUs");
                        }, 1000);
                    }
                } catch (e) {
                    console.error('Error fetching halls:', e);
                    if(e.response?.data?.message === "Old password is incorrect"){
                        setErrorsEditPasswordRegUser({
                            ...ErrorsEditPasswordRegUser,
                            OldPasswordRegUser: "كلمة المرور غير صحيحة"
                        });
                    }
                }
            };
            fetchHalls();
        }
    }


    const [change, setChange] = useState(false)
    const isPasswordFormDirty = () => {
        return OldPasswordRegUser || newPasswordRegUser || newPasswordRegUserConfirm;
    };

    const [ShowPasswordEditPassRegUser, setShowPasswordEditPassRegUser] = useState(false); // New state for password visibility
    const [ShowPasswordEditNewPassRegUser, setShowPasswordEditNewPassRegUser] = useState(false); // New state for password visibility
    const [ShowPasswordEditNewPassConfirmRegUser, setShowPasswordEditNewPassConfirmRegUser] = useState(false); // New state for password visibility

    return (
        <div id="EditProfileRegUser" style={{position:"relative"}}>
            <div id="EditProfileRegUserBtn1" style={{
                display:"inline",
                position: "relative",
                width: "100%",
                margin: "auto",
                textAlign: "center",
                top: "0px",
                fontSize: "40px",
                color: "#0A499C",
                right:"450px",
            }}>
                <button
                         className={`FlagToInformationRegisterBtn ${flagToInformationRegister ? 'active' : ''}`}
                         onClick={(e)=>{
                    setFlagToInformationRegister(true);
                    setFlagToInformationRegisterPrivacy(false);
                }}><i className="fa-solid fa-user"></i></button>
            </div>

            <div id="EditProfileRegUserProgress" style={{
                height:"5px",
                width:"90px",
                zIndex:"-1",
                position:"absolute",
                backgroundColor:"#cde0ef",
                right:"510px",
                top:"45px"

            }}></div>

            <div id="EditProfileRegUserBtn2" style={{
                display:"inline",
                position: "relative",
                width: "100%",
                margin: "auto",
                // right: "50%",
                // left: "50%",
                textAlign: "center",
                top: "0px",
                fontSize: "40px",
                color: "#0A499C",
                // border: "1px solid red",
                right:"470px",

            }}>
                <button
                    className={`FlagToInformationRegisterPrivacyBtn ${flagToInformationRegisterPrivacy ? 'active' : ''}`}
                    onClick={(e)=>{
                    setFlagToInformationRegisterPrivacy(true);
                    setFlagToInformationRegister(false);
                }}>
                    <i  className="fa-solid fa-lock"></i>
                </button>

            </div>
            { flagToInformationRegister && <div className="EditProfileFormRegUser">
            <div className="EditProfileFormRegUserOuter">
                <div className="EditProfileFormRegUserInner">
                    <div style={{position:"absolute",right:"-462px",top:"-35px"}}>
                        <SignInAlert flag={flagRegUser} SignInAlertText="تم تحديث بياناتك بنجاح!" AlertHeight="176vh" />
                    </div>
                    <h3 className="EditProfileFormRegUserH3">تعديل الملف الشخصي</h3>
                    <form onSubmit={handleSubmitEditRegUser} className="mt-2 pt-2">
                        <div>
                            <label htmlFor="EmailIdReg">البريد الإلكتروني:</label>
                            <input
                                id="EmailIdReg"
                                name="email"
                                value={userInfo.email ? userInfo.email : ""}
                                onChange={handleInputChange}
                                type="text" // Changed to email type
                                placeholder="الإيميل"
                                disabled  />
                            {errorsEditRegUser.Email && <p className="error2">{errorsEditRegUser.Email}</p>}
                        </div>
                        <div>
                            <label htmlFor="NameReg">الاسم الرباعي:</label>
                            <input
                                id="NameReg"
                                name="username" // Added name attribute
                                value={userInfo.username ? userInfo.username : ""}
                                onChange={handleInputChange}
                                type="text"
                                placeholder="الاسم الرباعي"
                            />
                            {errorsEditRegUser.Name && <p className="error2">{errorsEditRegUser.Name}</p>}
                        </div>
                        <div>
                            <label htmlFor="PhoneReg">رقم الهاتف:</label>
                            <input
                                id="PhoneReg"
                                name="Primaryphone" // Added name attribute
                                value={userInfo.Primaryphone ? userInfo.Primaryphone : "" }
                                onChange={handleInputChange}
                                type="tel" // Changed to tel type
                                placeholder="رقم الهاتف"
                            />
                            {errorsEditRegUser.Phone && <p className="error2">{errorsEditRegUser.Phone}</p>}
                        </div>

                        <div>
                            <label htmlFor="PhoneReg">رقم هاتف ثاني:</label>
                            <input
                                id="Phone2Reg"
                                name="Secondaryphone" // Added name attribute
                                value={userInfo.Secondaryphone ? userInfo.Secondaryphone : "" }
                                onChange={handleInputChange}
                                type="tel" // Changed to tel type
                                placeholder="رقم الهاتف"
                            />
                            {errorsEditRegUser.sPhone && <p className="error2">{errorsEditRegUser.sPhone}</p>}
                        </div>

                        <div>
                            <label htmlFor="PositionReg">مكان السكن:</label>
                            <input
                                id="PositionReg"
                                name="position" // Added name attribute
                                value={userInfo.position ? userInfo.position : "" }
                                onChange={handleInputChange}
                                type="text"
                                placeholder="مكان السكن"
                            />
                            {errorsEditRegUser.Position && <p className="error2">{errorsEditRegUser.Position}</p>}
                        </div>

                        <input
                            className="EditProfileSubmitRegUser"
                            type="submit"
                            value="تحديث الملف الشخصي"
                            disabled={!change} // Disable button if no changes are made
                        />
                    </form>
                </div>
            </div>
          </div>}


            {flagToInformationRegisterPrivacy &&
                <div className="EditProfileFormRegUser">
                    <div className="EditProfileFormRegUserOuter">
                        <div className="EditProfileFormRegUserInner">
                            <div style={{position: "absolute", right: "-462px", top: "-35px"}}>
                                <SignInAlert flag={flagRegUser} SignInAlertText="تم تغيير كلمة المرور  بنجاح!"
                                             AlertHeight="156vh"/>
                            </div>
                            <h3 className="EditProfileFormRegUserH3">تعديل كلمة المرور</h3>
                            {/*تغيير*/}
                            <form onSubmit={handleSubmitEditPasswordRegUser} className="mt-2 pt-2">
                                <div style={{position:"relative"}}>
                                    <label style={{width: "120px",right:"50px"}} htmlFor="OldPasswordRegUser">كلمة المرور القديمة:</label>
                                    <input
                                        id="OldPasswordRegUser"
                                        name="OldPasswordRegUser" // Added name attribute
                                        value={OldPasswordRegUser} //original from db
                                        onChange={(e) => {
                                            setOldPasswordRegUser(e.target.value);
                                        }}
                                        type={ShowPasswordEditPassRegUser ? "text" : "password"}
                                        placeholder=""
                                    />
                                    <span
                                        className="password-toggle-icon"
                                        style={{backgroundColor: "", position: "absolute", left: "50px",top:"20px"}}
                                        onClick={() => setShowPasswordEditPassRegUser(!ShowPasswordEditPassRegUser)} // Toggle the password visibility
                                    >
                                {ShowPasswordEditPassRegUser ? <FaEyeSlash/> : <FaEye/>}
                            </span>
                                    {ErrorsEditPasswordRegUser.OldPasswordRegUser &&
                                        <p className="error2">{ErrorsEditPasswordRegUser.OldPasswordRegUser}</p>}
                                </div>

                                <div style={{position:"relative"}}>
                                    <label style={{width: "120px" ,right:"50px"}} htmlFor="newPasswordRegUser">كلمة المرور
                                        الجديدة:</label>
                                    <input
                                        id="newPasswordRegUser"
                                        name="newPasswordRegUser" // Added name attribute
                                        value={newPasswordRegUser}
                                        onChange={(e) => {
                                            setNewPasswordRegUser(e.target.value);
                                        }}
                                        type={ShowPasswordEditNewPassRegUser ? "text" : "password"}
                                        placeholder=""
                                    />
                                    <span
                                        className="password-toggle-icon"
                                        style={{backgroundColor: "", position: "absolute", left: "50px",top:"20px"}}
                                        onClick={() => setShowPasswordEditNewPassRegUser(!ShowPasswordEditNewPassRegUser)} // Toggle the password visibility
                                    >
                                {ShowPasswordEditNewPassRegUser ? <FaEyeSlash/> : <FaEye/>}
                                  </span>
                                    {ErrorsEditPasswordRegUser.newPasswordRegUser &&
                                        <p className="error2">{ErrorsEditPasswordRegUser.newPasswordRegUser}</p>}
                                </div>

                                <div style={{position:"relative"}}>
                                    <label style={{width: "120px",right:"50px"}} htmlFor="newPasswordRegUserConfirm">تأكيد كلمة
                                        المرور الجديدة:</label>
                                    <input
                                        id="newPasswordRegUserConfirm"
                                        name="newPasswordRegUserConfirm" // Added name attribute
                                        value={newPasswordRegUserConfirm}
                                        onChange={(e) => {
                                            setNewPasswordRegUserConfirm(e.target.value);
                                        }}
                                        type={ShowPasswordEditNewPassConfirmRegUser ? "text" : "password"}
                                        placeholder=""
                                    />
                                    <span
                                        className="password-toggle-icon"
                                        style={{backgroundColor: "", position: "absolute", left: "50px",top:"20px"}}
                                        onClick={() => setShowPasswordEditNewPassConfirmRegUser(!ShowPasswordEditNewPassConfirmRegUser)} // Toggle the password visibility
                                    >
                                {ShowPasswordEditNewPassConfirmRegUser ? <FaEyeSlash/> : <FaEye/>}
                                  </span>
                                    {ErrorsEditPasswordRegUser.newPasswordRegUserConfirm &&
                                        <p className="error2">{ErrorsEditPasswordRegUser.newPasswordRegUserConfirm}</p>}
                                </div>

                                <input
                                    className="EditProfileSubmitRegUser"
                                    type="submit"
                                    value="تأكيد كلمة المرور"
                                    disabled={!isPasswordFormDirty()} // Disable button if no changes are made to the password
                                />
                            </form>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default EditProfileRegUser;
