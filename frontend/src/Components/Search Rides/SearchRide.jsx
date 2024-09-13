import React from "react";
import SearchForm from "./SearchForm";
import { useEffect, useState } from "react";
import axios from "axios";
import "./SearchRide.css"
import "../Publish Rides/Rides.css"
import rideData from '../../data'
import Rides from "../Publish Rides/Rides";
import Footer from "../Home Component/Footer";
import { useNavigate } from "react-router-dom";
import { APIurl } from "../utils/utils";

// import '../Home/meadiQuerry.css'

export default function SearchRide() {

  const navigate = useNavigate();


  // const [rides, setRides] = useState([]);


  const fetchAllRides = async () => {
    try {
      // Fetch all rides from the backend API
      const response = await axios.get(`${APIurl}/ride/rides/getrides`);
      // console.log(response.data);
      // setRides(response.data.rides);
      navigate("/search-results", { state: { rides: response.data.rides } });
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  };

  // rideData.map((route) => {
  //   console.log(route.leaving);
  //   console.log(route.going);
  // })
  return (
    <>
      <div className="search-cont">
      <div className="text-head"><h1>Find A Ride</h1></div>
        <div className="srch-form">
          <SearchForm></SearchForm>
        </div>
      </div>
      <div className="all-rides">
        <button onClick={() => fetchAllRides()} >See All Rides</button>
      </div>
      <div className="rides-container">
    <h1>Travel for less on these popular routes</h1>
    <div className="rides-cont">
      {rideData.map((ride) => {
        return(
          <Rides 
          leaving = {ride.leaving}
          going = {ride.going}
          ></Rides>
        )
      })}
      </div>
      </div>
      <Footer></Footer>
      </>
  );
}
