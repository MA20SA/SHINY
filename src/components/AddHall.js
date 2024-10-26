import React from 'react';
import Rating from "./Rating";
// import Nav from "react-bootstrap/Nav"
import {Link} from "react-router-dom";

const Hall = (props) => {
    return (
        <Link to={`/DetailsOfHall/${props.id}`}>
            <div className="AddHall"
                 style={props.isDisabled ? { opacity: 0.5, pointerEvents: 'none' } : {}}
            >
                <img src={props.src} alt="hall"/>
                <p style={{fontSize: "18px", color: "#0A499C", fontWeight: "bold", marginTop: "8px"}}>{props.name}</p>
                <p>{props.address}</p>
                <p>تتسع الصالة
                    <span> </span>
                    {props.capacity}
                    <span> </span>
                    شخص
                </p>
                <p style={{fontSize: "13px"}}>الأسعار:
                    ₪
                    {props.range.max}
                    -
                    {props.range.min}
                    <span></span>
                </p>
                <span className="HallRating">
                    <Rating rating={props.rating}/>
                </span>
            </div>
        </Link>

    );
};

export default Hall;