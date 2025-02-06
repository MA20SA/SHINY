import React, { useEffect } from "react";

const AlertToLogIn = ({ message, onClose }) => {
    const modalStyles = {
        overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.55)",
            zIndex:"2",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        modal: {
            backgroundColor: "#fff",
            color:"#0A499C",
            fontSize: "18px",
            padding: "24px 0px 5px 0px",
            borderRadius: "5px",
            textAlign: "center",
            maxWidth: "400px",
            width: "100%",
            boxShadow: "5px 5px 5px #E9CEC3"
        }
    };

    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer); // Cleanup timer on component unmount
    }, [onClose]);

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <p>{message}</p>
            </div>
        </div>
    );
};

export default AlertToLogIn;
