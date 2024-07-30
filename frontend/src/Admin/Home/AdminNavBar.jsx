import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import imgurl from '../../Components/Assets/ride-blend-high-resolution-logo-transparent.png'



export default function AdminNavBar() {
    return (
        <>
          <nav className="nav">
            <div className="logo">
              <Link to="/admindashboard">
                <img className="imgLogo" src={imgurl} alt="no none" />
              </Link>
            </div>
            <div className="right_sidenav flex">
              <div class="search ">
                <Link to="/admin/users" className="flex">
                  <FontAwesomeIcon
                    className="iconColor"
                    icon={"search"}
                  ></FontAwesomeIcon>
                  <p>See All Users</p>
                </Link>
              </div>
              <div className="piblish_ride  ">
                <Link to="/admin/rides" className="flex">
                  <FontAwesomeIcon
                    className="iconColor"
                    icon={"plus-circle"}
                  ></FontAwesomeIcon>
                  <p>See All rides</p>
                </Link>
              </div>
            </div>
          </nav>
        </>
      );
}
