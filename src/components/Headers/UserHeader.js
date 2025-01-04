import React, {useEffect, useState} from 'react';
import NavbarBs from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import logoremovebg from "../../images/logo-removebg.png";
import {Dropdown, Button} from 'react-bootstrap';
import axios from "axios";
import {useRefreshAccount} from "../../Context/RefreshAccount";
import {useRole} from "../../Context/Role";

const UserHeader = () => {

    const handleLogout = () => {
        localStorage.removeItem("authRole"); // Clear the role
        localStorage.removeItem("userID"); // Clear the id
        window.location.href = "/AboutUs"; // Redirect to the login page
    };

    const [notifications, setNotifications] = useState([

    ]);
    const [unreadCount, setUnreadCount] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            const newNotification = {
                id: Date.now(),
                message: "تم تحديث حالة حجزك.",
                time: new Date().toLocaleTimeString(),
                isRead: false
            };
            setNotifications((prevNotifications) => [
                newNotification, // Add the new notification at the beginning
                ...prevNotifications
            ]);
            setUnreadCount((prevCount) => prevCount + 1);
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const handleDropdownToggle = () => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notif) => ({ ...notif, isRead: true }))
        );
        setUnreadCount(0);
    };

    const [UserIdToEdit,setUserIdToEdit] = useState(localStorage.getItem("userID"));
    const [userNameById,setUserNameById] = useState('');
    const token = localStorage.getItem("token");

    const{refresh} =useRefreshAccount();
    const{Role} =useRole();

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
                    console.error('Error fetching user:', e);
                }
            };
            fetchHalls();
        }
    }, [refresh]);

    // IF Owner Added By Admin
    useEffect(() => {
        if(Role==="owner"){
            handleLogout();
        }
    }, [Role]);


    return (
        <div>
            <NavbarBs sticky="top" className="header navbar">
                <Container className="container-fluid ">
                    <Nav>
                        <Nav.Link href="/AboutUs"><img className="logoRemove" src={logoremovebg} alt="logo"/></Nav.Link>

                        <div id="UesrHeader" className="divHeader">
                            <div className="divHeaderRight">

                                <Button className="btnUserHeader1" onClick={handleLogout}>
                                        <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                </Button>

                                {/*Notifications*/}
                                <Dropdown align="end" onToggle={handleDropdownToggle}>
                                    <Dropdown.Toggle as={Button} className="btnUserHeader1 no-caret" aria-label="Notifications">
                                        <div className="notification-container">
                                            <i className="fa-solid fa-bell"></i>
                                            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                                        </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <Dropdown.Item style={{position:"relative"}} key={notification.id}>
                                                    {notification.message}
                                                    <br />
                                                    <small style={{position:"absolute",left:"5px",bottom:"13px"}} className="text-muted">{notification.time}</small>
                                                </Dropdown.Item>
                                            ))
                                        ) : (
                                            <Dropdown.Item className="empty-message-UserNotifications">لا يوجد إشعارات</Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>



                                 < Nav.Link href={`/EditProfileRegUser/${UserIdToEdit}`}>
                                     <Button id="editReg" className="btnUserHeader">
                                            <i className="fa-solid fa-user"></i>
                                            <span> </span>
                                            <b>{userNameById}</b>
                                     </Button>
                                 </Nav.Link>
                                </div>


                                <div style={{marginRight:"-60px"}} className="divHeaderCenter">

                                < Nav.Link href="/Halls"><Button className="btnUserHeader">
                                    <b> صالات الأفراح</b>
                                </Button></Nav.Link>

                                < Nav.Link href="/Discount"><Button className="btnUserHeader">
                                    <b>تخفيضات</b>

                                </Button></Nav.Link>

                                < Nav.Link href="/Offers"><Button className="btnUserHeader">
                                    <b> خصومات الموقع</b>

                                </Button></Nav.Link>

                                < Nav.Link href="/UserBooking"><Button className="btnUserHeader">
                                    <b>حجوزاتي</b>
                                </Button></Nav.Link>

                            </div>
                        </div>


                    </Nav>


                </Container>

            </NavbarBs>
        </div>
    );
};

export default UserHeader;