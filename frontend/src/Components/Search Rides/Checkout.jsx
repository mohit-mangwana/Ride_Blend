import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar, faMoneyBillWave, faCommentDots, faCalendarAlt, faClock, faMapMarkerAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import io from 'socket.io-client';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './CheckOut.css';
import { APIurl } from '../utils/utils'; 

const socket = io(process.env.SOCKET_URL);

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { ride, passengers } = location.state || {};
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${APIurl}/auth/user`, {
          withCredentials: true,
        });
        setCurrentUser(response.data.name);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.error || 'Error fetching user details');
      }
    };

    fetchUserDetails();
  }, []);

  if (!ride) {
    return <div>Loading...</div>;
  }

  const { date, time, duration, pickupAddress, dropAddress, price, bookingOption } = ride.rideDetails;
  const { name, _id: recipientId } = ride.user; // Get recipient ID
  const rideId = ride._id;

  const calculateDropTime = (pickupTime, duration) => {
    const [hours, minutes] = pickupTime.split(':');
    const pickupDate = new Date();
    pickupDate.setHours(parseInt(hours, 10));
    pickupDate.setMinutes(parseInt(minutes, 10));
    const dropDate = new Date(pickupDate.getTime() + duration * 1000);
    return dropDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  const dropTime = calculateDropTime(time, duration);
  const totalPrice = price * passengers;

  const handleBookRide = async () => {
    try {
      const response = await axios.post(
        `${APIurl}/bookride/booking`,
        {
          rideId: rideId,
          seatsBooked: passengers,
        },
        { withCredentials: true }
      );

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      toast.success(response.data.message);
      navigate("/booked-rides");

      if (bookingOption === 'manual') {
        socket.emit('notification', {
          recipient: name,
          message: `New booking request from ${currentUser}`,
        });
      }
    } catch (error) {
      console.error("Error booking ride:", error);
      toast.error(error.response?.data?.error || 'Error booking ride');
    }
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    socket.emit('chatMessage', { rideId, sender: currentUser, recipient: name, content: message });
    setMessage('');
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Check your booking request details</h2>
      <p className="checkout-subtitle">Your booking won't be confirmed until the driver approves your request</p>

      <div className="ride-details">
        <div className="ride-info">
          <h3><FontAwesomeIcon icon={faCalendarAlt} /> {new Date(date).toDateString()}</h3>
          <p><FontAwesomeIcon icon={faClock} /> {time} - {dropTime}</p>
          <p><FontAwesomeIcon icon={faMapMarkerAlt} /> From: {pickupAddress}</p>
          <p><FontAwesomeIcon icon={faMapMarkerAlt} /> To: {dropAddress}</p>
        </div>

        <div className="price-summary">
          <h4><FontAwesomeIcon icon={faMoneyBillWave} /> Price summary</h4>
          <p>{passengers} seat(s): ₹{totalPrice.toFixed(2)}</p>
          <p>Pay in the car</p>
          <p>Cash</p>
        </div>

        <div className="message-section">
          <h4><FontAwesomeIcon icon={faCommentDots} /> Send a message to {name} to introduce yourself</h4>
          <textarea
            className="message-textarea"
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <button onClick={handleSendMessage} className="send-button">Send</button>
        </div>

        <div className="booking-button">
          <button onClick={handleBookRide} className="book-button">
            {bookingOption === 'manual' ? 'Request to book' : 'Book instantly'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
