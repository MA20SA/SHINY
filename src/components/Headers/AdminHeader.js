import React, {useEffect, useState} from 'react';
import NavbarBs from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import logoremovebg from "../../images/logo-removebg.png";
import {Button} from 'react-bootstrap';
import axios from "axios";
import {useRefreshAccount} from "../../Context/RefreshAccount";

const AdminHeader = () => {

    const handleLogout = () => {
        localStorage.removeItem("authRole"); // Clear the role
        localStorage.removeItem("userID"); // Clear the id
        window.location.href = "/AboutUs"; // Redirect to the login page
    };

    const{refresh} =useRefreshAccount();

    const [UserIdToEdit,setUserIdToEdit] = useState(localStorage.getItem("userID"));
    const [userNameById,setUserNameById] = useState('');
    const token = localStorage.getItem("token");

    //To Fetch Name
    useEffect(() => {
        const USERIDInHeader = localStorage.getItem("userID");
        if (USERIDInHeader) {
            setUserIdToEdit(USERIDInHeader);
            const fetchHalls = async () => {
                try {
                    const response = await axios.get(`https://shinyproject.onrender.com/user/getUserById/${USERIDInHeader}`,
                        {
                            headers: {
                                Authorization: `shiny__${token}`
                            }
                        });
                    if (response.data?.user) {
                        setUserNameById(response.data.user.username);
                    }
                } catch (e) {
                    console.error('Error fetching name:', e);
                    console.error('Error fetching name:', e.response.data.message);
                }
            };
            fetchHalls();
        }
    }, [refresh]);


    return (
        <div id="AdminHeader">
            <NavbarBs sticky="top" className="header navbar">
                <Container className="container-fluid ">
                    <Nav>
                        <Nav.Link href="/AboutUs"><img className="logoRemove" src={logoremovebg} alt="logo"/></Nav.Link>

                        <div className="divHeader">
                            <div className="divHeaderRight">

                                <Button className="btnUserHeader1" onClick={handleLogout}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                </Button>


                                < Nav.Link href={`/EditProfileRegUser/${UserIdToEdit}`}>
                                    <Button className="btnUserHeader">
                                        <i className="fa-solid fa-user"></i>
                                        <span> </span>
                                        <b>{userNameById}</b>
                                    </Button>
                                </Nav.Link>
                            </div>


                            <div style={{marginRight:"50px"}} className="divHeaderCenter">

                                < Nav.Link href="/ShowOwners"><Button className="btnUserHeader">
                                    <b>أصحاب القاعات</b>
                                </Button></Nav.Link>


                                < Nav.Link href="/Offers"><Button className="btnUserHeader">
                                    <b> خصومات الموقع</b>

                                </Button></Nav.Link>



                            </div>
                        </div>


                    </Nav>


                </Container>

            </NavbarBs>
        </div>
    );
};

export default AdminHeader;