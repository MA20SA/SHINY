import React from 'react';
import {Link} from "react-router-dom";

const AddOwner = (props) => {
    return (
            <Link to={`/DetailsOfOwner/${props.id}`}>
                <div className="AddHall" style={{textAlign: "center", width: "270px"}}>
                    <img style={{width: "80%", boxShadow: "none", height: "210px", padding: "20px"}} src={props.src}
                         alt="hall"/>
                    <p style={{
                        fontSize: "19px",
                        color: "#0A499C",
                        fontWeight: "bold",
                        marginTop: "-13px"
                    }}>{props.name}</p>
                    <p style={{fontSize: "14px"}}>{props.address}</p>
                    <p style={{fontSize: "14px", paddingBottom: "3px"}}>{props.phone}</p>
                </div>
            </Link>
            );
            };

            export default AddOwner;