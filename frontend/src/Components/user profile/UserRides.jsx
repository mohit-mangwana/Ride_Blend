import React, { useState, useEffect } from "react";
import axios from "axios";
import UserSideBar from "./UserSideBar";
import "./UserRides.css";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRideId, setEditingRideId] = useState(null);
  const [editedRide, setEditedRide] = useState({
    leavingFrom: "",
    goingTo: "",
    date: "",
    passengers: 0,
    price: 0,
  });

  useEffect(() => {
    const fetchUserRides = async () => {
      try {
        const response = await axios.get(
          "/ride/user/rides",
          {
            withCredentials: true,
          }
        );
        setRides(response.data);
        setLoading(false);
       
      } catch (error) {
        console.error("Error fetching user rides:", error);
      }
    };

    fetchUserRides();
  }, []);

  const handleDeleteRide = async (rideId) => {
    try {
      const res = await axios.delete(
        `/ride/deleteride/${rideId}`,
        {
          withCredentials: true,
        }
      );
      const updatedRides = rides.filter((ride) => ride._id !== rideId);
      setRides(updatedRides);
      toast.success(res.data.message);
    } catch (error) {
      console.error("Error deleting ride:", error);
    }
  };

  const handleEditRide = (ride) => {
    setEditingRideId(ride._id);
    setEditedRide({
      leavingFrom: ride.leavingFrom,
      goingTo: ride.goingTo,
      date: new Date(ride.date).toISOString().split("T")[0],
      passengers: ride.passengers,
      price: ride.price,
    });
  };

  const handleEditCRide = () => {
    setEditingRideId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRide({ ...editedRide, [name]: value });

    // Check if the input field is passengers
    if (name === "passengers") {
      // Convert the value to a number
      let passengers = parseInt(value);

      // Ensure the value is within the range of 1 to 5
      passengers = Math.min(Math.max(passengers, 1), 5);

      // Update the editedRide object
      setEditedRide({
        ...editedRide,
        [name]: passengers,
      });
    } else {
      // For other input fields, set the value as it is
      setEditedRide({
        ...editedRide,
        [name]: value,
      });
    }
  };

  const handleSaveRide = async (rideId) => {
    try {
      const res = await axios.put(
        `/ride/editride/${rideId}`,
        editedRide,
        {
          withCredentials: true,
        }
      );
      const updatedRides = rides.map((ride) =>
        ride._id === rideId
          ? { ...ride, ...editedRide, date: new Date(editedRide.date) }
          : ride
      );
      toast.success(res.data.message);
      setRides(updatedRides);
      setEditingRideId(null);
    } catch (error) {
      console.error("Error updating ride:", error);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="user-ride-container">
        <div className="parent-rides-container">
          <UserSideBar />
          <div className="my-rides">
            <h2>Your Rides</h2>
            <div className="rides">
              {loading ? (
                <p>Loading...</p>
              ) : rides.length === 0 ? (
                <p>No rides available</p>
              ) : (
                <ul>
                  {rides.map((ride) => (
                    <li key={ride._id} className="flex rides-lists">
                      {editingRideId === ride._id ? (
                        <>
                          <div
                            className="travel-section column"
                            style={{ width: "100%" }}
                          >
                            <div className="div">
                              <input
                                type="text"
                                name="leavingFrom"
                                value={editedRide.leavingFrom}
                                onChange={handleChange}
                                placeholder="Leaving From"
                                className="ride-edit-input"
                              />
                              <div className="line"></div>
                              <input
                                type="text"
                                name="goingTo"
                                value={editedRide.goingTo}
                                onChange={handleChange}
                                placeholder="Going To"
                                className="ride-edit-input"
                              />
                            </div>
                            <input
                              type="date"
                              name="date"
                              value={editedRide.date}
                              onChange={handleChange}
                              className="ride-edit-input"
                              min={minDate}
                              required
                            />
                          </div>
                          <div
                            className="pass-price column"
                            style={{ width: "100%" }}
                          >
                            <div className="div">
                              <input
                                type="number"
                                name="passengers"
                                value={editedRide.passengers}
                                onChange={handleChange}
                                className="ride-edit-input"
                                placeholder="Passengers"
                                min={1}
                                max={5}
                              />
                            </div>
                            <div className="div">
                              <input
                                type="number"
                                name="price"
                                value={editedRide.price}
                                onChange={handleChange}
                                className="ride-edit-input"
                                placeholder="Price"
                              />
                            </div>
                          </div>
                          <div
                            className="rides-buttons"
                            style={{ border: "none", width: "100%" }}
                          >
                            <button
                              className="buttons"
                              style={{ width: "80%" }}
                              onClick={() => handleSaveRide(ride._id)}
                            >
                              Save Ride
                            </button>
                            <button
                              className="buttons"
                              style={{ width: "80%" }}
                              onClick={() => handleEditCRide()}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="travel-section column">
                            <div className="div">
                              <h4>{ride.leavingFrom}</h4>
                              <div className="line"></div>
                              <h4>{ride.goingTo}</h4>
                            </div>
                            <h4>{new Date(ride.date).toLocaleDateString()}</h4>
                          </div>
                          <div className="pass-price column">
                            <div className="div">
                              <h4>Passengers</h4>
                              <h4>{ride.passengers}</h4>
                            </div>
                            <div className="div">
                              <h4>Price</h4>
                              <h4>{ride.price}</h4>
                            </div>
                          </div>
                          <div className="rides-buttons">
                            <button
                              className="buttons"
                              onClick={() => handleEditRide(ride)}
                            >
                              Edit Ride
                            </button>
                            <button
                              className="buttons"
                              onClick={() => handleDeleteRide(ride._id)}
                            >
                              Delete Ride
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
