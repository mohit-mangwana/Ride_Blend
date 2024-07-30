import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./RideDetails.css";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../Home Component/Footer.jsx";

const RideDetails = () => {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const location = useLocation();
  const passengers = location.state?.passengers || null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await axios.get(
          `/ride/ride-detail/${rideId}`
        );  
        setRide(response.data);
      } catch (error) {
        console.error("Error fetching ride details:", error);
      }
    };

    if (rideId) {
      fetchRideDetails();
    }
  }, [rideId]);

  if (!ride) {
    return <div className="loading">Loading...</div>;
  }

  const formatDistance = (distance) => {
    if (!distance) return "Not set";
    return `${(distance / 1000).toFixed(2)} km`;
  };

  const formatDuration = (duration) => {
    if (!duration) return "Not set";
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const formattedDate = `${day} ${month}, ${year}`;

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    return {
      date: formattedDate,
      time: formattedTime,
    };
  };

  const { date, time } = formatDateTime(ride.rideDetails.date);

  const calculateDropTime = (pickupTime, duration) => {
    const [hours, minutes] = pickupTime.split(":");
    const pickupDate = new Date();
    pickupDate.setHours(parseInt(hours, 10));
    pickupDate.setMinutes(parseInt(minutes, 10));

    const dropDate = new Date(pickupDate.getTime() + duration * 1000);
    return dropDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handlePublisherInfoClick = () => {
    navigate(`/user-info/${ride.user._id}`);
  };

  const handleBooking = (ride, passengers) => {
    navigate(`/checkout?${ride._id}`, {
      state: { ride, passengers },
    });
  };

  const handleAskQuestionClick = () => {
    // Navigate to the chat page with the ride publisher
    navigate(`/chat/${ride._id}`, {
      state: { recipientUsername: ride.user.name },
    });
  };

  return (
    <>
      <div className="ride-details-container">
        <div className="ride-details-card">
          <div className="ride-details-info">
            <div className="date-heading">
              <h1>{date}</h1>
            </div>
            <div className="location-div flex">
              <div className="times-div">
                <h4>{time}</h4>
                <h5>{formatDuration(ride.rideDetails.duration)}</h5>
                <h4>{calculateDropTime(time, ride.rideDetails.duration)}</h4>
              </div>
              <div className="location lc-div">
                <div className="flex lv">
                  <div className="line-div flex"></div>
                  <div>
                    <h4>{ride.rideDetails.pickupAddress}</h4>
                    <h4>{ride.rideDetails.dropAddress}</h4>
                  </div>
                </div>
              </div>
            </div>
            <hr className="line-hr" />
            <div className="pass-div">
              <h4>Total Price for {passengers} Passenger:</h4>
                          <p>
              <FontAwesomeIcon icon="fa-solid fa-indian-rupee-sign" />
                            {passengers === 1
                              ? ride.rideDetails.price
                              : (
                                  ride.rideDetails.price *
                                  passengers
                                ).toFixed(2)}
                            <sup>.00</sup>
                          </p>
            </div>
            <hr className="line-hr" />
            <div
              className="publisher-info flex"
              onClick={handlePublisherInfoClick}
            >
              <div className="flex">
                {ride.user.profilePicture && (
                  <img
                    src={`data:${ride.user.profilePicture.contentType};base64,${ride.user.profilePicture.data}`}
                    alt="Profile"
                    className="profile-picture"
                    style={{
                      width: "55px",
                      height: "55px",
                      borderRadius: "50%",
                    }}
                  />
                )}
                <div className="publisher-name">
                  <h2>{ride.user.name}</h2>
                </div>
              </div>
              <FontAwesomeIcon icon="fa-solid fa-caret-right" />
            </div>
            <div className="user-info-div">
              <div className="ride-check flex">
                <FontAwesomeIcon icon="fa-solid fa-calendar-days" />
                <h4>Sometime cancel Ride</h4>
              </div>
            </div>
            <div className="travel-pref">
              <div>
                {ride.user.travelPreferences &&
                ride.user.travelPreferences.length > 0 ? (
                  ride.user.travelPreferences.map((preference, index) => (
                    <>
                      <hr className="thin-line" />
                      <div key={index} className="ask-question">
                        {/* Render the icon */}
                        <h4>
                          {preference.name}: {preference.option}
                        </h4>
                      </div>
                    </>
                  ))
                ) : (
                  <p>No travel preferences selected yet.</p>
                )}
              </div>
            </div>

            <hr className="thin-line" />
            <div className="ask-question flex" onClick={handleAskQuestionClick}>
              <FontAwesomeIcon icon="fa-solid fa-message" />
              <h4>Ask {ride.user.name} a question</h4>
            </div>
            <hr className="thin-line" />
            {ride.user.vehicles && ride.user.vehicles.length > 0 && (
        <div className="ask-question flex">
          <FontAwesomeIcon icon="fa-solid fa-car-side" />
          <h4>{ride.user.vehicles[0].make}</h4>
          <h5>{ride.user.vehicles[0].model}</h5>
        </div>
      )}
            <hr className="thin-line" />
            <div className="book-btn-div">
              <button
                className={`book-btn ${
                  ride.rideDetails.bookingOption === "manual"
                    ? "manual"
                    : "instant"
                }`}
                onClick={() =>
                  handleBooking(ride, passengers)
                }
              >
                {ride.rideDetails.bookingOption === "manual" ? (
                  <>
                    Request Book{" "}
                    <FontAwesomeIcon icon="fa-solid fa-hourglass-start" />
                  </>
                ) : (
                  <>
                    Book Instantly <FontAwesomeIcon icon="fa-solid fa-bolt" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RideDetails;
