import React from 'react';
import UnderLogoInFooter from "../images/UnderLogoInFooter.png"
import imgInFooter from "../images/4imgInFooter.png"
import singleflowerFooter from "../images/singleflowerFooter.png"

const Footer = () => {
    return (
        <div className="supFooter">
            <div className="footer">
                <div className="FooterDiv1">
                    <img className="singleflowerFooter2" src={singleflowerFooter} alt="noPic"/>
                    <p>,There is only one happiness in this life
                        <br/>
                        to love and be loved</p>
                    <img className="imgInFooter" src={imgInFooter} alt="noPic"/>
                </div>

                <div className="FooterDiv2">
                    <h3 style={{textShadow:"1px 1px 1px #E9CEC3"}}>Contact</h3>
                    <p className="pt-1" style={{opacity:"0.8",textShadow:"1px 1px 1px #E9CEC3"}}>,Would you have any enquiries
                        <br/>
                        Please feel free to contact us
                    </p>

                    <div style={{marginTop:"30px",textAlign:"start",float:"left",position:"relative",left:"80px"}}>
                        <p>shiny-palestine@gmail.com
                            <i style={{color: "#f7d93b", padding: "5px", marginTop: "3px"}}
                                                       className="fa-solid fa-envelope"></i>
                        </p>
                        <p style={{marginTop:"-10px",direction: "ltr"}}>
                            <i style={{color: "#f7d93b", padding: "5px"}}
                               className="fa-solid fa-phone"></i>
                            +972
                            <span> </span>599456789</p>

                        <p style={{marginTop:"-10px",direction: "ltr"}}>
                            <i style={{color: "#f7d93b", padding: "5px"}}
                               className="fa-solid fa-location-dot"></i>
                            West Bank, Tulkarm
                        </p>
                    </div>

                </div>

                <div className="FooterDiv3">
                    <h4>SHINY</h4>
                    <h5>Weeding & Event</h5>
                    <img className="UnderLogoInFooter" src={UnderLogoInFooter} alt="noPic"/>
                    <div className="FooterDiv3Text">
                        <p>Save your the date year with SHINY..</p>
                    </div>

                    <div className="contactIcons">
                        <i className="rounded-circle fa-brands fa-facebook"></i>
                        <i className="rounded-circle fa-brands fa-twitter"></i>
                        <i className="rounded-circle fa-brands fa-instagram"></i>
                        <i className="rounded-circle fa-brands fa-linkedin"></i>
                    </div>
                </div>
            </div>
        </div>

    )
        ;
};

export default Footer;