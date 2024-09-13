import React, { useRef } from "react";
import { Link,NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Sidebar.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { APIurl } from "../utils/utils";

export default function UserSideBar({ isSidebarVisible, setIsSidebarVisible, toggleButtonRef }) {
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const handleLogout = async () => {
    axios.defaults.withCredentials = true;
    try {
      await axios.post(`${APIurl}/auth/logout`, {
        withCredentials: true,
      });
      window.dispatchEvent(new Event("loginStateChange"));
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className={`side-container ${isSidebarVisible && "visible"}`} ref={sidebarRef}>
      <div className="side-bar flex">
        <NavLink className="side menu-item" to="/userprofile">
          Profile
          <FontAwesomeIcon className="iconColor" icon="fa-solid fa-user" />
        </NavLink>
        <NavLink to="/userride" className="side menu-item">
          My Rides
          <FontAwesomeIcon icon="fa-solid fa-car" />
        </NavLink>
        <NavLink className="side menu-item" to="/booked-rides">
          My Bookings
          <FontAwesomeIcon icon="fa-solid fa-car-side" />
        </NavLink>
        <NavLink className="side menu-item" to="/my-booked-rides">
          My Booked Ride
          <FontAwesomeIcon icon="fa-solid fa-car-side" />
        </NavLink>
        <NavLink className="side menu-item" to="/editprofile">
          Edit Profile
          <FontAwesomeIcon icon="fa-solid fa-user-pen" />
        </NavLink>
        <NavLink className="side menu-item" to="/notifications">
          Notifications
          <FontAwesomeIcon icon="fa-solid fa-bell" />
        </NavLink>
        <NavLink className="side menu-item" to="/inbox">
          Inbox
          <FontAwesomeIcon icon="fa-solid fa-envelope" />
        </NavLink>
        <Link onClick={handleLogout} className="side menu-item">
          Log Out
          <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
        </Link>
      </div>
    </div>
  );
}
