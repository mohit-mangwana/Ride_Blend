import React, { useState, useEffect } from "react";
import axios from "axios";
import UserSideBar from "./UserSideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Typography, Box } from "@mui/material";
import toast from "react-hot-toast";
import "./UserRides.css";
import { APIurl } from "../utils/utils";

// Utility function to extract city name from address
const extractCityName = (address) => {
  const parts = address.split(", ");
  if (parts.length > 1) {
    return parts[parts.length - 4]; // Assuming city is the second last part
  }
  return address; // Return full address if city extraction fails
};

// Utility function to format date and time
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

// Utility function to calculate drop time
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

// Utility function to format duration
const formatDuration = (duration) => {
  if (!duration) return "Not set";
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const UserProfile = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRideId, setEditingRideId] = useState(null);
  const [editedRide, setEditedRide] = useState({
    date: "",
    time: "",
    passengers: 0,
    price: 0,
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rideToDelete, setRideToDelete] = useState(null);

  const fetchUserRides = async () => {
    try {
      const response = await axios.get(`${APIurl}/ride/user/rides`, {
        withCredentials: true,
      });
      setRides(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user rides:", error);
    }
  };

  useEffect(() => {
    fetchUserRides();
  }, []);

  const handleDeleteRide = async () => {
    try {
      const res = await axios.delete(`/ride/deleteride/${rideToDelete}`, {
        withCredentials: true,
      });
      setRides(rides.filter((ride) => ride._id !== rideToDelete));
      toast.success(res.data.message);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting ride:", error);
    }
  };

  const handleEditRide = (ride) => {
    setEditingRideId(ride._id);
    setEditedRide({
      date: new Date(ride.rideDetails.date).toISOString().split("T")[0],
      time: ride.rideDetails.time,
      passengers: ride.rideDetails.passengers,
      price: ride.rideDetails.price,
    });
    setOpenEditDialog(true);
  };

  const handleEditCancel = () => {
    setEditingRideId(null);
    setOpenEditDialog(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedRide({ ...editedRide, [name]: value });

    if (name === "passengers") {
      let passengers = parseInt(value);
      passengers = Math.min(Math.max(passengers, 1), 5);
      setEditedRide({ ...editedRide, [name]: passengers });
    }
  };

  const handleSaveRide = async () => {
    try {
      const res = await axios.put(`/ride/editride/${editingRideId}`, editedRide, {
        withCredentials: true,
      });
      const updatedRides = rides.map((ride) =>
        ride._id === editingRideId
          ? { ...ride, rideDetails: { ...ride.rideDetails, ...editedRide, date: new Date(editedRide.date) } }
          : ride
      );
      toast.success(res.data.message);
      setRides(updatedRides);
      setOpenEditDialog(false);
      setEditingRideId(null);
      fetchUserRides();
    } catch (error) {
      console.error("Error updating ride:", error);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <>
      <UserSideBar />
      <div className="user-ride-container">
        <div className="search-rides">
          <div style={{ textAlign: "center" }} className="rides-heading">
            <h1>My Publish Rides</h1>
          </div>
          <div className="rides">
            {loading ? (
              <p>Loading...</p>
            ) : rides.length === 0 ? (
              <p style={{ width: '70vw', height: '100vh', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No rides available</p>
            ) : (
              <ul>
                {rides.map((ride) => {
                  const { date, time } = formatDateTime(ride.rideDetails.date);
                  const dropTime = calculateDropTime(time, ride.rideDetails.duration);
                  return (
                    <li key={ride._id} className="rides-lists">
                      <div className="travel-section flex">
                        <div className="location">
                          <div className="flex">
                            <div>
                              <h4>{time}</h4>
                              <h4>{extractCityName(ride.rideDetails.pickupAddress)}</h4>
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
                              <h4>{extractCityName(ride.rideDetails.dropAddress)}</h4>
                              <FontAwesomeIcon
                                className="iconColor"
                                icon="fa-solid fa-city"
                              />
                            </div>
                          </div>
                          <div className="flex">
                            <FontAwesomeIcon icon="fa-solid fa-indian-rupee-sign" />
                            <p>
                              {ride.rideDetails.price}
                              <sup>.00</sup>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="flex name-id">
                          <div className="iconColor">
                          </div>
                          <div className="flex">
                            <h4>
                            <FontAwesomeIcon icon="fa-solid fa-clock" className="iconColor" style={{marginInline:'10px'}}/>
                              {ride.rideDetails.time}
                              <FontAwesomeIcon icon="fa-solid fa-calendar-days" className="iconColor" style={{marginInline:'10px'}}/>
                              {date} {/* Format date using the utility function */}
                            </h4>
                          </div>
                          <hr />
                          <div className="flex">
                          <FontAwesomeIcon icon="fa-solid fa-person-walking" className="iconColor" />
                            <h2>
                              {ride.rideDetails.passengers}
                            </h2>
                          </div>
                        </div>
                        <div className="actions flex">
                        <Button variant="contained" style={{backgroundColor:'#08c076'}} onClick={() => handleEditRide(ride)}>Edit</Button>
                        <Button variant="outlined" color="error" onClick={() => {
                          setRideToDelete(ride._id);
                          setOpenDeleteDialog(true);
                        }}>Delete</Button>
                      </div>
                      </div>
                      
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Edit Ride Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Ride</DialogTitle>
          <DialogContent>
            <Box component="form" noValidate>
              <TextField
                margin="normal"
                fullWidth
                label="Date"
                type="date"
                name="date"
                InputLabelProps={{ shrink: true }}
                value={editedRide.date}
                onChange={handleChange}
                inputProps={{ min: minDate }}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Time"
                type="time"
                name="time"
                InputLabelProps={{ shrink: true }}
                value={editedRide.time}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Price"
                type="number"
                name="price"
                value={editedRide.price}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Passengers"
                type="number"
                name="passengers"
                min="1"
                max="5"
                value={editedRide.passengers}
                onChange={handleChange}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditCancel}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSaveRide}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this ride?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteRide}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default UserProfile;
