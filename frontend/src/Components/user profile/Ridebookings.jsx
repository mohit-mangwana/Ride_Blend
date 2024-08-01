import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-hot-toast";
import './RideBookings.css'
import UserSideBar from './UserSideBar';

const RideBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const confirmBooking = async (bookingId) => {
    try {
      await axios.post(`/${bookingId}/confirm`);
      setBookings(bookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: 'confirmed' } : booking
      ));
      toast.success("Booking confirmed successfully.");
    } catch (err) {
      console.error("Error confirming booking:", err);
      toast.error("Error confirming booking.");
    }
  };

  const declineBooking = async (bookingId) => {
    try {
      await axios.post(`/bookride/${bookingId}/decline`);
      setBookings(bookings.map(booking =>
        booking._id === bookingId ? { ...booking, status: 'declined' } : booking
      ));
      toast.success("Booking declined successfully.");
    } catch (err) {
      console.error("Error declining booking:", err);
      toast.error("Error declining booking.");
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/bookride/bookings', { withCredentials: true });
        if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Unexpected response format from server.");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Error fetching bookings.");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="ride-bookings-container">
      <UserSideBar />
      {error ? (
        <div>{error}</div>
      ) : (
        <>
          {bookings.length === 0 ? (
            <p style={{ width: '70vw', height: '100vh', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              No rides available
            </p>
          ) : (
            <>
              <h2>Bookings for Your Rides</h2>
              <ul className="bookings-list">
                {bookings.map((booking) => (
                  <li key={booking._id} className="booking-item">
                    <div><strong>User:</strong> {booking.user.name}</div>
                    <div><strong>Seats Booked:</strong> {booking.seatsBooked}</div>
                    <div><strong>Status:</strong> {booking.status}</div>
                    <div><strong>Ride ID:</strong> {booking.ride._id}</div>
                    {booking.status === 'pending' && (
                      <div className="actions">
                        <button className="confirm-btn" onClick={() => confirmBooking(booking._id)}>Confirm</button>
                        <button className="decline-btn" onClick={() => declineBooking(booking._id)}>Decline</button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RideBookings;
