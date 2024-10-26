import React, {useEffect, useState} from 'react';
import NavbarBs from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import logoremovebg from "../../images/logo-removebg.png";
import {Dropdown, Button} from 'react-bootstrap';
import EditProfileRegUser from "../EditProfile/EditProfileRegUser";
import OwnerDiscount from "../OwnerDiscount";
import OwnerShowBooking from "../OwnerShowBooking";
import axios from "axios";
import {useRefreshAccount} from "../../Context/RefreshAccount";

const OwnerHeader = () => {

    const handleLogout = () => {
        localStorage.removeItem("authRole"); // Clear the role
        localStorage.removeItem("userID"); // Clear the id
        window.location.href = "/AboutUs"; // Redirect to the login page
    };

    const [notifications, setNotifications] = useState([
        // { id: 1, message: "تم تأكيد حفل خطوبتك في صالة ريم البوادي." },
        // { id: 2, message: "تم تأكيد حفل زفافك في صالة سان موريس." },
        // { id: 3, message: "تم تأكيد حفل زفافك في صالة سان موريس." },
        // { id: 4, message: "تم تأكيد حفل زفافك في صالة سان موريس." },
        // { id: 5, message: "تم تأكيد حفل زفافك في صالة سان موريس." },
        // { id: 6, message: "تم تأكيد حفل زفافك في صالة سان موريس." },
        // { id: 7, message: "تم تأكيد حفل زفافك في صالة سان موريس." },
    ]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const newNotification = {
                id: Date.now(),
                message: "قام علا غصوب أبو صاع بحجز صالة ريم البوادي.",
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

    const [OwnerIdToEdit,setOwnerIdToEdit] = useState('');
    const [OwnerName,setOwnerName] = useState('');
    const token = localStorage.getItem("token");

    const{refresh} =useRefreshAccount();
    useEffect(() => {
        const OwnerIDInHeader = localStorage.getItem("userID");
        // Retrieve email from localStorage and set it to state
        if (OwnerIDInHeader) {
            setOwnerIdToEdit(OwnerIDInHeader);
            const fetchHalls = async () => {
                try {
                    const response = await axios.get(`https://shinyproject.onrender.com/user/getUserById/${OwnerIDInHeader}`,
                        {
                            headers: {
                                Authorization: `shiny__${token}`
                            }
                        });
                    if (response.data?.user) {
                        setOwnerName(response.data.user.username);
                    }
                } catch (e) {
                    console.error('Error fetching halls:', e);
                    console.error('Error fetching halls:', e.response.data.message);
                }
            };
            fetchHalls();
        }
    }, [refresh]);


    return (
        <div id="ownerHeader">
            <NavbarBs sticky="top" className="header navbar">
                <Container className="container-fluid ">
                    <Nav>
                        <Nav.Link href="/AboutUs"><img className="logoRemove" src={logoremovebg} alt="logo"/></Nav.Link>

                        <div className="divHeader">
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
                                                    <span style={{display:"block"}}>{notification.message}</span>
                                                    <br />
                                                    <small style={{position:"absolute",left:"5px",bottom:"13px"}} className="text-muted">{notification.time}</small>
                                                </Dropdown.Item>
                                            ))
                                        ) : (
                                            <Dropdown.Item className="empty-message-UserNotifications">لا يوجد إشعارات</Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>

                                {/*notReady*/}

                                < Nav.Link href={`/EditProfileRegUser/${OwnerIdToEdit}`}>
                                    <Button className="btnUserHeader">
                                        <i className="fa-solid fa-user"></i>
                                        <span> </span>
                                        <b>{OwnerName}</b>
                                    </Button>
                                </Nav.Link>
                            </div>


                            <div style={{marginRight:"-60px"}} className="divHeaderCenter">

                                < Nav.Link href="/Halls"><Button className="btnUserHeader">
                                    <b> صالات الأفراح</b>
                                </Button></Nav.Link>

                                {/*Later*/}
                                < Nav.Link href="/OwnerDiscount"><Button className="btnUserHeader">
                                    <b>تخفيضات</b>
                                </Button></Nav.Link>

                                < Nav.Link href="/Offers"><Button className="btnUserHeader">
                                    <b> خصومات الموقع</b>

                                </Button></Nav.Link>

                                {/*Later*/}
                                < Nav.Link href="/OwnerShowBooking"><Button className="btnUserHeader">
                                    <b>الحجوزات</b>
                                </Button></Nav.Link>

                            </div>
                        </div>


                    </Nav>


                </Container>

            </NavbarBs>
        </div>
    );
};

export default OwnerHeader;