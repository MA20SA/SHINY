import React from 'react';
import {useState} from "react";

const SignInAlert = ({flag, SignInAlertText,AlertHeight}) => {

    const [isVisible, setVisible] = useState(true);

    const handelClose =()=>{
        setVisible(false);
    }
    const AlertHeightStyle = {
        height: AlertHeight
    };

    if(flag){
        return (
            isVisible &&
            <div className="DivOutAlert" style={AlertHeightStyle}>
                <div className="DivSignIn">
                    <div className="DivSignInOut">
                        <i style={{color: 'green'}} className="mb-3 fa-solid fa-circle-check"></i>
                        <p className="messageText">
                            {SignInAlertText}
                        </p>
                        <button className="CloseBtn" onClick={handelClose}><i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
            </div>

        );
    }
    return <></>;

};

export default SignInAlert;