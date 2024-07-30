import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import imgUrls from "../Assets/ride-blend-favicon-color.png";
import "./navbar.css";
import AdminNavBar from '../../Admin/Home/AdminNavBar';
import React, { useState } from "react";
import Cookies from 'js-cookie';

function RepsonsiveNavBar({toggleSidebar,toggleButtonRef}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

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
    const loggedInState = Cookies.get('isLoggedIn');
    setIsLoggedIn(loggedInState === 'true');

    const handleLoginStateChange = () => {
      const loggedInState = Cookies.get('isLoggedIn');
      setIsLoggedIn(loggedInState === 'true');
    };

    window.addEventListener('loginStateChange', handleLoginStateChange);

    return () => {
      window.removeEventListener('loginStateChange', handleLoginStateChange);
    };
  }, []);

  const myStyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  };

  const styleLogo = {
    height: "50px",
    width: "50px",
  };

  const [isLoginFormVisible, setLoginFormVisible] = useState(false);
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
        <div className="right_sidenav flex" style={myStyle}>
          {isLoggedIn ? (
            <div className="user-profile">
              <button ref={toggleButtonRef} onClick={toggleSidebar}>
                <FontAwesomeIcon className="iconColor" icon="fa-solid fa-bars"  />
              </button>
            </div>
          ) : (
            <div className="loginButton">
              <button className="logbtn" onClick={toggleLoginForm}>
                <FontAwesomeIcon
                  className="iconColor"
                  icon="fa-solid fa-right-to-bracket"
                />
              </button>
              {isLoginFormVisible && (
                <div className="logindiv">
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
          )}
          <div className="logo">
            <Link to="">
              <img
                className="imgLogo"
                src={imgUrls}
                style={styleLogo}
                alt="no none"
              />
            </Link>
          </div>
          <div className="wrapp flex">
            <div className="search">
              <Link to="/search-ride" className="flex">
                <FontAwesomeIcon
                  className="iconColor"
                  icon={"magnifying-glass"}
                ></FontAwesomeIcon>
              </Link>
            </div>
            <div className="piblish_ride">
              <Link to="/offerseat" className="flex">
                <FontAwesomeIcon
                  className="iconColor"
                  icon={"circle-plus"}
                ></FontAwesomeIcon>
              </Link>
            </div>
          </div>
        </div>
      </nav>
     )}
    </>
  );
}

export default RepsonsiveNavBar;
