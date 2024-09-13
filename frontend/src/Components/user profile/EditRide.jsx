import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
// import './EditRide.css'; // Add your styling here
import { APIurl } from "../utils/utils";

const EditRide = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState({
    leavingFrom: "",
    goingTo: "",
    date: "",
    passengers: 0,
    price: 0,
  });

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const response = await axios.get(`${APIurl}/ride/${rideId}`, {
          withCredentials: true,
        });
        const fetchedRide = response.data;

        // Format the date properly before setting state
        const formattedDate = new Date(fetchedRide.date).toISOString().split('T')[0];

        setRide({ ...fetchedRide, date: formattedDate });
      } catch (error) {
        console.error("Error fetching ride details:", error);
      }
    };

    fetchRide();
  }, [rideId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRide({ ...ride, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/ride/${rideId}`, ride, {
        withCredentials: true,
      });
      navigate('/userprofile'); // Redirect to the profile page after editing
    } catch (error) {
      console.error("Error updating ride:", error);
    }
  };

  return (
    <div className="edit-ride-container">
      <h2>Edit Ride</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Leaving From:</label>
          <input
            type="text"
            name="leavingFrom"
            value={ride.leavingFrom}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Going To:</label>
          <input
            type="text"
            name="goingTo"
            value={ride.goingTo}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={ride.date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Passengers:</label>
          <input
            type="number"
            name="passengers"
            value={ride.passengers}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={ride.price}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="buttons">Save Changes</button>
      </form>
    </div>
  );
};

export default EditRide;
