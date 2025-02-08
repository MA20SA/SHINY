import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';
import axios from "axios";

const ShowUserInfoByOwner = () => {
    const {userId} = useParams();

    const token = localStorage.getItem("token");
    const [userInfo, setUserInfo] = useState({
        email: '',
        username:'',
        Secondaryphone : '',
        Primaryphone :'',
        position :''
    });


    // Fetch user info based on the id
    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/user/getUserById/${userId}`,
                    {
                        headers: {
                            Authorization: `shiny__${token}`
                        }
                    });
                if (response.data?.user) {
                    setUserInfo(response.data.user);
                }
            } catch (e) {
                console.error('Error fetching user:', e);
            }
        };
        fetchHalls();

    }, [userId]);

  return (
        <div id="EditProfileRegUser" style={{position:"relative"}}>
                <div className="EditProfileFormRegUser">
                    <div className="EditProfileFormRegUserOuter" style={{marginTop:"-25px"}}>
                        <div className="EditProfileFormRegUserInner">

                            <h3 className="EditProfileFormRegUserH3">معلومات الزبون</h3>
                            <form className="mt-2 pt-2">
                                <div>
                                    <label htmlFor="EmailIdReg">البريد الإلكتروني:</label>
                                    <input
                                        id="EmailIdReg"
                                        name="email"
                                        value={userInfo.email ? userInfo.email : ""}
                                        type="text" // Changed to email type
                                        disabled  />
                                </div>
                                <div>
                                    <label htmlFor="NameReg">الاسم الرباعي:</label>
                                    <input
                                        id="NameReg"
                                        name="username"
                                        value={userInfo.username ? userInfo.username : ""}
                                        type="text"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label htmlFor="PhoneReg">رقم الهاتف:</label>
                                    <input
                                        id="PhoneReg"
                                        name="Primaryphone"
                                        value={userInfo.Primaryphone ? userInfo.Primaryphone : "" }
                                        type="tel"
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label htmlFor="PhoneReg">رقم هاتف ثاني:</label>
                                    <input
                                        id="Phone2Reg"
                                        name="Secondaryphone"
                                        value={userInfo.Secondaryphone ? userInfo.Secondaryphone : "" }
                                        type="tel"
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label htmlFor="PositionReg">مكان السكن:</label>
                                    <input
                                        id="PositionReg"
                                        name="position"
                                        value={userInfo.position ? userInfo.position : "" }
                                        type="text"
                                        disabled
                                    />
                                </div>

                            </form>
                        </div>
                    </div>
                </div>

        </div>
    );
};

export default ShowUserInfoByOwner;
