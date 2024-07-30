import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
// import "./App.css";
import axios from "axios";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import Home from "./Components/Home/Home";
import NavBar from "./Components/Home/Navbar";
import RepsonsiveNavBar from "./Components/Home/ResponsiveNavBar";
import Login from "./Components/Auth/Login";
import Email from "./Components/Auth/Loginemail";
import PublishRide from "./Components/Publish Rides/PublishRide";
import ResetPassword from "./Components/Auth/ResetPassword";
import SearchRide from "./Components/Search Rides/SearchRide";
import SignUp from "./Components/Auth/Signup";
import SignEmail from "./Components/Auth/Signupemail";
import UserProfile from "./Components/user profile/UserProfile";
import UserRides from "./Components/user profile/UserRides";
import SearchResults from "./Components/Search Rides/SearchedRides";
import UserBookedRides from "./Components/user profile/UserBookedRides";
import EditRide from "./Components/user profile/EditRide.jsx";
import UserSideBar from "./Components/user profile/UserSideBar.jsx";
import AdminDashBoard from "./Admin/Home/AdminDashBoard.jsx";
import AdminLogin from "./Admin/Auth/AdminLogin.jsx";
import AdminSignup from "./Admin/Auth/AdminSignup.jsx";
import ProtectedRoute from "./Components/utils/ProtectedRoutes.jsx";
import NotFound from "./Admin/Home/NotFound.jsx";
import AdminRides from "./Admin/Home/AdminRides.jsx";
import BookedRides from "./Admin/Home/BookedRides.jsx";
import AdminUser from "./Admin/Home/AdminUsers.jsx";
import EditProfile from "./Components/Home/EditProfile.jsx";
import PickupLocation from "./Components/Publish Rides/PickUpLocation.jsx";
import DropLocation from "./Components/Publish Rides/DropLocation.jsx";
import SelectRoute from "./Components/Publish Rides/SelectRoute.jsx";
import DateTimePicker from "./Components/Publish Rides/DateTimePicker.jsx";
import PassengerCount from "./Components/Publish Rides/PassengerCount.jsx";
import BookingOption from "./Components/Publish Rides/BookingOption.jsx";
import Price from "./Components/Publish Rides/Price.jsx";
import ReturnTrip from "./Components/Publish Rides/ReturnTrip.jsx";
import Confirmation from "./Components/Publish Rides/Confirmation.jsx";
import { RideProvider } from "./Components/utils/RideProvider.jsx";
import RideDetails from "./Components/Search Rides/RideDetails.jsx";
import UserInfo from "./Components/user profile/Userinfo.jsx";
import Checkout from "./Components/Search Rides/Checkout.jsx";
import Notifications from "./Components/Communication/Notification.jsx";
import Chat from "./Components/Communication/Chat.jsx";
import Inbox from "./Components/Communication/Inbox.jsx";
import RideBookings from "./Components/user profile/Ridebookings.jsx";
import BookingConfirmation from "./Components/user profile/BookingConfirmation.jsx";

library.add(fas);

function App() {
  const [isResponsive, setResponsive] = useState(window.innerWidth < 868);
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const toggleButtonRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = useCallback(() => {
    setIsSidebarVisible((prevState) => !prevState);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await axios.post("http://localhost:4000/auth/logout"); // Call your logout API
      Cookies.remove("token");
      Cookies.remove("role");
      Cookies.remove("isLoggedIn");
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("loginStateChange"));
      setToken(null);
      setIsAdmin(false);
      alert("Session Expired");
      navigate("/loginemail");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [navigate]);

  useEffect(() => {
    const retrieveToken = () => {
      const tokenFromCookie = Cookies.get("isLoggedIn") === "true";
      const roleFromCookie = Cookies.get("role");
      setToken(tokenFromCookie); // Set the token in state
      setIsAdmin(roleFromCookie === "admin");
    };

    // Function to handle login state change
    const handleLoginStateChange = () => {
      retrieveToken(); // Retrieve token when the event is triggered
    };

    // Add event listener for the loginStateChange event
    window.addEventListener("loginStateChange", handleLoginStateChange);

    // Call the function to retrieve token when the component mounts
    retrieveToken();

    // Resize event handler
    const handleResize = () => {
      setResponsive(window.innerWidth < 868);
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Check token expiration and handle auto logout
    const tokenExpirationTime = 3600000; // 1 hour
    const logoutTimer = setTimeout(handleLogout, tokenExpirationTime);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("loginStateChange", handleLoginStateChange);
      clearTimeout(logoutTimer);
    };
  }, [handleLogout]);

  return (
    <>
      <RideProvider>
        <div>
          {isResponsive ? (
            <RepsonsiveNavBar
              toggleSidebar={toggleSidebar}
              toggleButtonRef={toggleButtonRef}
            />
          ) : (
            <NavBar toggleButtonRef={toggleButtonRef} />
          )}
        </div>
        <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
        {isResponsive && (
          <UserSideBar
            isSidebarVisible={isSidebarVisible}
            setIsSidebarVisible={setIsSidebarVisible}
            toggleButtonRef={toggleButtonRef}
          />
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search-ride" element={<SearchRide />} />
          <Route path="/offerseat" element={<PublishRide />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/loginemail" element={<Email />} />
          <Route path="/signupemail" element={<SignEmail />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route path="/ride-detail/:rideId" element={<RideDetails />} />
          <Route path="/user-info/:userId" element={<UserInfo />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editprofile"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin}>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userprofile"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin}>
                <UserProfile isSidebarVisible={isResponsive} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userride"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin}>
                <UserRides />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booked-rides"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin}>
                <UserBookedRides />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-booked-rides"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin}>
                <RideBookings />
              </ProtectedRoute>
            }
          />
          <Route path="/search-results" element={<SearchResults />} />
          <Route
            path="/offerseat/depature"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin}>
                <PickupLocation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/arrival"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin}>
                <DropLocation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/selectroute"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} requiredFields={['pickupLocation']}>
                <SelectRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/date"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} requiredFields={['pickupLocation', 'dropLocation']}>
                <DateTimePicker isReturnRide={false} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/passengers"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} requiredFields={['pickupLocation', 'dropLocation', 'date']}>
                <PassengerCount isReturnRide={false} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/bookoption"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} requiredFields={['pickupLocation', 'dropLocation', 'date', 'passengers']}>
                <BookingOption isReturnRide={false} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/price"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} requiredFields={['pickupLocation', 'dropLocation', 'date', 'passengers', 'bookingOption']}>
                <Price isReturnRide={false} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/return-trip"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} requiredFields={['pickupLocation', 'dropLocation', 'date', 'passengers', 'bookingOption', 'price']}>
                <ReturnTrip />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/confirmation"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} requiredFields={['pickupLocation', 'dropLocation', 'date', 'passengers', 'bookingOption', 'price']}>
                <Confirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/published"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin}>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/return-route"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} requiredFields={['pickupLocation']}>
                <SelectRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/return-date"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} requiredFields={['pickupLocation', 'dropLocation']}>
                <DateTimePicker isReturnRide={true} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/return-passengers"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} requiredFields={['pickupLocation', 'dropLocation', 'date']}>
                <PassengerCount isReturnRide={true} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/return-bookoption"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} requiredFields={['pickupLocation', 'dropLocation', 'date', 'passengers', 'bookingOption']}>
                <BookingOption isReturnRide={true} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offerseat/return-price"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} requiredFields={['pickupLocation', 'dropLocation', 'date', 'passengers', 'bookingOption']}>
                <Price isReturnRide={true} />
              </ProtectedRoute>
            }
          />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/adminsignup" element={<AdminSignup />} />
          <Route
            path="/admindashboard"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin} adminOnly={true}>
                <AdminDashBoard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/rides" element={<AdminRides />} />
          <Route path="/admin/bookings" element={<BookedRides />} />
          <Route path="/admin/users" element={<AdminUser />} />
         
         {/* Notifications and Inbox */}
         <Route
            path="/notifications"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin}>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin}>
                <Inbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:rideId"
            element={
              <ProtectedRoute token={token} isAdmin={isAdmin}>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RideProvider>
    </>
  );
}

export default App;
