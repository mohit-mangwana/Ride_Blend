import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./SearchedRides.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchToken } from "../utils/fetchToken";

const SearchResults = () => {
  const tokenToSend = fetchToken();
  const location = useLocation();
  const rides = location.state?.rides || [];
  const navigate = useNavigate();
  const [passenger,setPassengers] = useState('')
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const pickupAddress = searchParams.get("pickupAddress");
    const dropAddress = searchParams.get("dropAddress");
    const date = searchParams.get("date");
    const passengers = searchParams.get("passengers");
    setPassengers(passengers)

    if (!pickupAddress || !dropAddress || !date) {
      toast.error("Invalid access to search results page");
      navigate("/");
    }
  }, [location, navigate]);

  axios.defaults.withCredentials = true;

  // const bookRide = async (rideId, passengers) => {
  //   if (tokenToSend) {
  //     try {
  //       const response = await axios.post(
  //         "/bookride/booking",
  //         {
  //           rideId: rideId,
  //           seatsBooked: passengers,
  //         }
  //       );
  //       if (response.data.error) {
  //         toast.error(response.data.error);
  //         return;
  //       }
  //       toast.success(response.data.message);
  //       navigate("/booked-rides");
  //     } catch (error) {
  //       console.log("Error booking ride:", error);
  //       toast.error(error.response.data.error);
  //     }
  //   } else {
  //     toast.error("Please Login First");
  //   }
  // };

  const extractCityName = (address) => {
    const parts = address.split(", ");
    if (parts.length > 1) {
      return parts[parts.length - 4]; // Assuming city is the second last part
    }
    return address; // Return full address if city extraction fails
  };

  const handleRideClick = (rideId, passengers) => {
    navigate(`/ride-detail/${rideId}`, {
      state: { passengers },
    });
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
  };

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

  return (
    <div>
      {rides.length > 0 ? (
        <div className="search-rides">
          <div style={{ textAlign: "center" }} className="rides-heading">
            <h1>Book And Visit India Now</h1>
          </div>
          <div className="rides">
            <ul>
              {rides.map((ride) => {
                const { time } = formatDateTime(ride.rideDetails.date);
                const dropTime = calculateDropTime(
                  time,
                  ride.rideDetails.duration
                );
                const profilePicture = ride.user.profilePicture
                  ? `data:${ride.user.profilePicture.contentType};base64,${ride.user.profilePicture.data}`
                  : null;

                return (
                  <li
                    key={ride._id}
                    className="rides-lists"
                    onClick={() =>
                      handleRideClick(ride._id, passenger)
                    }
                  >
                    <div className="travel-section flex">
                      <div className="location">
                        <div className="flex">
                          <div>
                            <h4>{time}</h4>
                            <h4>
                              {extractCityName(ride.rideDetails.pickupAddress)}
                            </h4>
                            <FontAwesomeIcon
                              className="iconColor"
                              icon="fa-solid fa-city"
                            />
                          </div>
                          <div className="line"></div>
                          <h5>{formatDuration(ride.rideDetails.duration)}</h5>
                          <div className="line2"></div>
                          <div>
                            <h4>{dropTime}</h4>
                            <h4>
                              {extractCityName(ride.rideDetails.dropAddress)}
                            </h4>
                            <FontAwesomeIcon
                              className="iconColor"
                              icon="fa-solid fa-city"
                            />
                          </div>
                        </div>
                        <div className="flex">
                          <FontAwesomeIcon icon="fa-solid fa-indian-rupee-sign" />
                          <p>
                            {passenger === 1
                              ? ride.rideDetails.price
                              : (
                                  ride.rideDetails.price *
                                  passenger
                                ).toFixed(2)}
                            <sup>.00</sup>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="column">
                      <div className="flex name-id">
                        <div className="iconColor">
                          <FontAwesomeIcon icon="fa-car" />
                        </div>
                        {profilePicture ? (
                          <img
                            src={profilePicture}
                            className="profile-picture"
                            alt={`${ride.user.name}'s profile`}
                          />
                        ) : (
                          <p>No Profile Picture</p>
                        )}
                        <h4>{ride.user.name}</h4>
                        <hr />
                        {ride.rideDetails.bookingOption === "manual" ? (
                          <>
                            <FontAwesomeIcon
                              className="iconColor"
                              icon="fa-solid fa-question"
                            />{" "}
                            <h4>Request for Booking</h4>
                          </>
                        ) : (
                          <>
                          <FontAwesomeIcon
                              className="iconColor"
                              icon="fa-solid fa-bolt"
                            />
                          <h4>Instant Book</h4>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : (
        <p>No rides found.</p>
      )}
    </div>
  );
};

export default SearchResults;
