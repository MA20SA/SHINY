import React, {useEffect, useState} from 'react';
import mostVotingPic from "../../src/images/SarayaShereen.jpg"
import AutoChangingCategories from "./AutoChangingCategories";
import {Link} from "react-router-dom";
import HrDetailsHall from "../images/HrDetailsHall.png";
import axios from "axios";
const Aboutus = () => {

    const [halls, setHalls] = useState([]);

    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const response = await axios.get(`https://shinyproject.onrender.com/hall/`);
                if (response.data?.halls) {
                    setHalls(response.data.halls.filter((h) => h.isDisabled === false));
                    console.log(response.data.halls);
                }
            } catch (e) {
                console.error('Error fetching halls:', e);
            }
        };
        const intervalId = setInterval(() => {
            fetchHalls();
        },1000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(intervalId);
        };

    }, []);

    return (
        <div>
            <div className="divAbout">
                <div className="AboutR">
                    <h1 style={{fontFamily:"Amiri"}}><b>مَن نحن؟</b></h1>
                    <h2><b>-SHINY-</b></h2>
                    <br/>
                    <p style={{fontFamily:"Amiri"}}>
                        نحن أوّل موقع إلكتروني في الضفة الغربيّة - فلسطين،
                        <br/>
                        وُجد ليسهّل عليكم حجز وتنظيم مناسباتكم وأفراحكم أين ما
                        <br/>
                        كنتم في مكان واحد.
                    </p>

                    <ul >
                        <li><i className="fa-solid fa-circle-check"></i>
                            لست بحاجة لتضييع الوقت على محاولة معرفة المواعيد المتاحة.
                        </li>
                        <li><i className="fa-solid fa-circle-check"></i>
                            لست بحاجة لقطع المسافات لمعرفة الخدمات التي تقدمها الصالة.
                        </li>
                        <li><i className="fa-solid fa-circle-check"></i>
                            لست بحاجة لقطع المسافات لمعرفة أسعار الحجوزات.
                        </li>
                        <li><i className="fa-solid fa-circle-check"></i>
                            لست بحاجة لقطع المسافات لرؤية الصالة.
                        </li>
                    </ul>
                    <br/><br/> <br/> <br/> <br/>
                    <div className="OverallRating">
                        <div className="NoVisitor"><h1 style={{fontWeight: "bold"}}><i className="fa-solid fa-plus "
                                                                                       style={{
                                                                                           fontSize: "30px",
                                                                                           opacity: "0.6"
                                                                                       }}>
                        </i>500
                        </h1>
                            <p><b>إجمالي الزوّار</b></p>
                        </div>
                        <div className="NoHalls"><h1 style={{fontWeight: "bold"}}><i className="fa-solid fa-plus"
                                                                                     style={{
                                                                                         fontSize: "30px",
                                                                                         opacity: "0.6"
                                                                                     }}></i>25 </h1>
                            <p><b>إجمالي الصالات المدعومة</b></p>
                        </div>

                    </div>
                </div>
                <div className="AboutL">
                    <div className="highImg">
                        <img src={mostVotingPic} alt="no pic"/>
                    </div>
                    <div className="highVideo">
                        <video style={{borderRadius: "0 40px 0 40px"}} controls autoPlay loop muted>
                            <source src="/sarayaShereenVideo.mp4" type="video/mp4"/>
                        </video>
                    </div>
                </div>
            </div>


            <div style={{marginTop: "20px"}} className="HrDetailsHallAboutUs"><img style={{position:"relative",right:"230px"}} src={HrDetailsHall}/></div>

            <div className="StatementInAboutUS" style={{textAlign:"center",marginTop:"20px"}}>
                <h2 style={{fontFamily: "Amiri, sans-serif",color:"#0A499C"}}>
                    نقدّم لك أفضل القاعات الخاصّة بالمناسبات،
                    <br/>
                    كل ما تبحث عنه ستجده هنا:
                </h2>
            </div>

            <div className="categoriesAboutUS">
                <AutoChangingCategories/>
            </div>


            <div style={{display:"flex",justifyContent:"center",marginTop:"30px"}}>
                <Link className="SeenAllAboutUs" to={`/Halls`}>
                    <button style={{width:"170px",height:"40px",
                        fontFamily:"Amiri, sans-serif",border:"none",color:"#0A499C",
                        backgroundColor:"rgba(205,224,239,0.51)",
                        boxShadow:"2px 2px 2px gray",borderRadius:"5px",
                        fontSize:"23px",opacity:"0.8"
                    }}>
                        <i style={{rotate: "40deg",marginLeft:"4px"}} className="fa-solid fa-arrow-up"></i>
                        مشاهدة الكل
                    </button>
                </Link>
            </div>

        </div>
    );
};

export default Aboutus;








