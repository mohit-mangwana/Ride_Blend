import React, { useState, useEffect } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import AdminNavBar from '../../Admin/Home/AdminNavBar';
import { useLocation } from 'react-router-dom';
import imgUrls from "../Assets/ride-blend-high-resolution-logo-transparent.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from 'js-cookie'

function NavBar() {
  const [isLoginFormVisible, setLoginFormVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
   
    const loggedInState = Cookies.get('isLoggedIn');
    setIsLoggedIn(loggedInState === 'true');


   
    const handleLoginStateChange = () => {
      const loggedInState = Cookies.get('isLoggedIn');
      setIsLoggedIn(loggedInState === 'true');
        
    };

    window.addEventListener('loginStateChange', handleLoginStateChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('loginStateChange', handleLoginStateChange);
    };
  }, []);

  useEffect(() => {
    const updateLoginState = () => {
      const loginStateFromCookie = Cookies.get('isLoggedIn') === 'true';
      const roleFromCookie = Cookies.get('role');
      setIsLoggedIn(loginStateFromCookie);
      setIsAdmin(roleFromCookie === 'admin');
      setIsLoading(false);
    };

    updateLoginState();

    const handleLoginStateChange = () => {
      updateLoginState();
    };

    window.addEventListener('loginStateChange', handleLoginStateChange);

    return () => {
      window.removeEventListener('loginStateChange', handleLoginStateChange);
    };
  }, [location]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isLoginFormVisible && !event.target.closest(".loginButton")) {
        setLoginFormVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isLoginFormVisible]);

  const toggleLoginForm = () => {
    setLoginFormVisible(!isLoginFormVisible);
  };

  const isAdminRoute = location.pathname.includes('/adminlogin') || location.pathname.includes('/adminsignup');
  if (isLoading) {
    return null;
  }

  return (
    <>
    {isAdminRoute || isAdmin ? <AdminNavBar /> : (
      <nav className="nav">
        <div className="logo">
          <Link to="">
            <img className="imgLogo" src={imgUrls} alt="no none" />
          </Link>
        </div>
        <div className="right_sidenav flex">
          <div className="search ">
            <Link to="/search-ride" className="flex">
              <FontAwesomeIcon
                className="iconColor"
                icon={"search"}
              ></FontAwesomeIcon>
              <p>Search</p>
            </Link>
          </div>
          <div className="piblish_ride  ">
            <Link to="/offerseat" className="flex">
              <FontAwesomeIcon
                className="iconColor"
                icon={"plus-circle"}
              ></FontAwesomeIcon>
              <p>Publish a ride</p>
            </Link>
          </div>
          {isLoggedIn ? <div className="user-profile">
            <Link to='/userprofile' >
              <FontAwesomeIcon className="iconColor" icon="fa-solid fa-user" />
            </Link>
          </div>
           :
          <div className="loginButton ">
          <button className="logbtn " onClick={toggleLoginForm}>
            <FontAwesomeIcon
              className="iconColor"
              icon="fa-solid fa-right-to-bracket"
            />
          </button>
          {isLoginFormVisible && (
            <div className="logindiv ">
              <ul>
                <li>
                  <Link to="/login" className="flex padding">
                    <span>Log In</span>
                    <span>
                      <FontAwesomeIcon
                        className="iconColor2"
                        icon={"caret-right"}
                      ></FontAwesomeIcon>
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="flex padding">
                    <span>Sign Up</span>
                    <span>
                      <FontAwesomeIcon
                        className="iconColor2"
                        icon={"caret-right"}
                      ></FontAwesomeIcon>
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
        }
        </div>
      </nav>
    )}
    </>
  );
}

export default NavBar;
