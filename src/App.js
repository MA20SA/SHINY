import './App.css';
import Header from "./components/header";
import Container from  "react-bootstrap/Container";
import {Route, Routes} from "react-router-dom";
import SignIn from "./components/SignIn";
import LogIn from "./components/LogIn";
import Halls from "./components/Halls";
import Discount from "./components/Discount";
import Offers from "./components/Offers";
import Timedate from "./components/timedate";
import Aboutus from "./components/aboutus";
import Footer from "./components/footer";
import ForgetPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import React from "react";
import DetailsOfHall from "./components/DetailsOfHall";
import BookingHall from "./components/BookingHall";
import UserBooking from "./components/UserBooking";
import EditProfileRegUser from "./components/EditProfile/EditProfileRegUser";

import OwnerHall from "./components/OwnerHall";
import AddNewOwnerHall from "./components/AddNewOwnerHall";
import EditHallByOwner from "./components/EditHallByOwner";
import OwnerDiscount from "./components/OwnerDiscount";
import AddNewOwnerDiscount from "./components/AddNewOwnerDiscount";
import OwnerShowBooking from "./components/OwnerShowBooking";
import {RefreshAccountProvider} from "./Context/RefreshAccount";
import ShowOwners from "./components/ShowOwners";
import AddNewOwnerByAdmin from "./components/AddNewOwnerByAdmin";
import DetailsOfOwner from "./components/DetailsOfOwner";
import ShowOwnerBookingByAdmin from "./components/ShowOwnerBookingByAdmin";
import CreateAdminDiscount from "./components/CreateAdminDiscount";
import {RoleProvider} from "./Context/Role";
import ShowUserInfoByOwner from "./components/ShowUserInfoByOwner";

function App() {
  return (
      <RoleProvider>
      <RefreshAccountProvider>
      <div className="App">
          <Header/>
          <Timedate/>

          <Container>
              <Routes>
                  <Route path="*" element={<Aboutus/>}/>
                  <Route path="/SignIn" element={<SignIn/>}/>
                  <Route path="/LogIn" element={<LogIn/>}/>
                  <Route path="/Halls" element={<Halls/>}/>
                  <Route path="/Discount" element={<Discount/>}/>
                  <Route path="/Offers" element={<Offers/>}/>
                  <Route path="/ForgotPassword" element={<ForgetPassword/>}/>
                  <Route path="/ResetPassword" element={<ResetPassword/>}/>
                  <Route path="/DetailsOfHall/:id" element={<DetailsOfHall/>}/>
                  <Route path="/BookingHall/:id" element={<BookingHall/>}/>
                  <Route path="/UserBooking" element={<UserBooking/>}/>
                  <Route path="/EditProfileRegUser/:UserIdToEdit" element={<EditProfileRegUser/>}/>
                  <Route path="/OwnerHall" element={<OwnerHall/>}/>
                  <Route path="/AddNewOwnerHall" element={<AddNewOwnerHall/>}/>
                  <Route path="/EditHallByOwner/:id" element={<EditHallByOwner/>}/>
                  <Route path="/OwnerDiscount" element={<OwnerDiscount/>}/>
                  <Route path="/AddNewOwnerDiscount" element={<AddNewOwnerDiscount/>}/>
                  <Route path="/OwnerShowBooking" element={<OwnerShowBooking/>}/>
                  <Route path="/ShowOwners" element={<ShowOwners/>}/>
                  <Route path="/AddNewOwnerByAdmin" element={<AddNewOwnerByAdmin/>}/>
                  <Route path="/DetailsOfOwner/:id" element={<DetailsOfOwner/>}/>
                  <Route path="/ShowOwnerBookingByAdmin/:id" element={<ShowOwnerBookingByAdmin/>}/>
                  <Route path="/CreateAdminDiscount" element={<CreateAdminDiscount/>}/>
                  <Route path="/ShowUserInfoByOwner/:userId" element={<ShowUserInfoByOwner/>}/>
              </Routes>
          </Container>


          <Footer/>
      </div>

      </RefreshAccountProvider>
      </RoleProvider>
  );
}

export default App;

