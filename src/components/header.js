import React from 'react';
import  Nav from "react-bootstrap/Nav"
import NavbarBs from "react-bootstrap/Navbar"
import logoremovebg from "../../src/images/logo-removebg.png"
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container"
import UserHeader from "./Headers/UserHeader";
import OwnerHeader from "./Headers/OwnerHeader";
import AdminHeader from "./Headers/AdminHeader";

const Header = () => {

    // Retrieve role from localStorage
    const role = localStorage.getItem('authRole'); // "Guest", "Registered User", "Owner", "Admin"

    // Render different header based on the role
    if (role === "user") return <UserHeader/>;
    if (role === "owner") return <OwnerHeader/>;
    if (role === "admin") return <AdminHeader/>;

    return (
        <NavbarBs sticky="top" className="header navbar ">
            <Container className="container-fluid ">
                <Nav>
                    <Nav.Link href="/AboutUs"><img className="logoRemove" src={logoremovebg} alt="logo"/></Nav.Link>

                    <div className="divHeader">

                            <div className="divHeaderRight">
                            < Nav.Link href="/SignIn">
                                <Button className="btn1">
                                    <i className=" fa-solid fa-user-plus"></i>
                                    <span> </span>
                                    <b>إنشاء حساب</b>
                                </Button>
                            </Nav.Link>

                            < Nav.Link href="/LogIn"><Button className="btn1">
                                <i className="fa-solid fa-user"></i>
                                <span> </span>
                                <b> تسجيل الدخول</b>

                            </Button></Nav.Link>
                            </div>

                            <div className="divHeaderCenter">
                            < Nav.Link href="/Halls"><Button className="btn2">
                               <b> صالات الأفراح</b>

                            </Button></Nav.Link>

                            < Nav.Link href="/Discount"><Button className="btn2">
                               <b>تخفيضات</b>

                            </Button></Nav.Link>

                            < Nav.Link href="/Offers"><Button className="btn2">
                                <b> خصومات الموقع</b>

                            </Button></Nav.Link>
                            </div>

                    </div>

                </Nav>


            </Container>

        </NavbarBs>
    );
};

export default Header;


