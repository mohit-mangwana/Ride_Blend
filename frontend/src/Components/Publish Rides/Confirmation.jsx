import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideContext } from '../utils/RideProvider';
import Axios from 'axios'; // Assuming you're using Axios for HTTP requests
import { toast } from "react-hot-toast"; // Assuming you're using react-toastify for notifications

const Confirmation = () => {
  const { rideDetails } = useContext(RideContext);
  const navigate = useNavigate();

  Axios.defaults.withCredentials = true;

  const handleConfirm = async () => {
    const { outboundRide, returnRide } = rideDetails;

    if (!outboundRide || !outboundRide.pickupAddress || !outboundRide.dropAddress) {
      toast.error("Outbound ride details are missing");
      return;
    }

    try {
      const requestBody = { outboundRide };

      if (returnRide && returnRide.pickupAddress && returnRide.dropAddress) {
        requestBody.returnRide = returnRide;
      }

      // Publish outbound and return rides
      await Axios.post("/ride/publishride", requestBody);

      toast.success("Rides published successfully");
      navigate('/offerseat/published',
        {state:{message:'Rides published successfully'}}
      ); // Navigate to a confirmation or success page
    } catch (error) {
      console.error("Error publishing ride:", error);
      toast.error("Failed to publish ride");
    }
  };

  const handleBack = () => {
    navigate('/offerseat/price',
    );
  };

  const formatLocation = (location) => {
    if (!location) return 'Not set';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      return `Lat: ${location.lat}, Lng: ${location.lng}`;
    }
    return 'Invalid location data';
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    if (typeof date === 'string') return new Date(date).toLocaleDateString();
    if (date instanceof Date) return date.toLocaleDateString();
    return 'Invalid date';
  };

  const formatTime = (time) => {
    if (!time) return 'Not set';
    return time;
  };

  const formatRoute = (route) => {
    if (!route) return 'Not set';
    if (typeof route === 'string') return route;
    if (typeof route === 'object') {
      return 'Route set';
    }
    return 'Invalid route data';
  };

  const formatDistance = (distance) => {
    if (!distance) return 'Not set';
    // Assuming distance is in meters
    return `${(distance / 1000).toFixed(2)} km`;
  };

  const formatDuration = (duration) => {
    if (!duration) return 'Not set';
    // Assuming duration is in seconds
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getRideDetails = (ride, key) => {
    return ride && ride[key] !== undefined ? ride[key] : 'Not set';
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Confirm Ride</h2>
      <div style={styles.details}>
        <h3>Outbound Ride</h3>
        <p>Pickup Location: {formatLocation(getRideDetails(rideDetails.outboundRide, 'pickupLocation'))}</p>
        <p>Drop-off Location: {formatLocation(getRideDetails(rideDetails.outboundRide, 'dropLocation'))}</p>
        <p>Route: {formatRoute(getRideDetails(rideDetails.outboundRide, 'route'))}</p>
        <p>Date: {formatDate(getRideDetails(rideDetails.outboundRide, 'date'))}</p>
        <p>Time: {formatTime(getRideDetails(rideDetails.outboundRide, 'time'))}</p>
        <p>Distance: {formatDistance(getRideDetails(rideDetails.outboundRide, 'distance'))}</p>
        <p>Estimated Time: {formatDuration(getRideDetails(rideDetails.outboundRide, 'duration'))}</p>
        <p>Passengers: {getRideDetails(rideDetails.outboundRide, 'passengers')}</p>
        <p>Booking Option: {getRideDetails(rideDetails.outboundRide, 'bookingOption')}</p>
        <p>Price: {getRideDetails(rideDetails.outboundRide, 'price')}</p>
      </div>

      {rideDetails.returnRide && rideDetails.returnRide.pickupLocation && rideDetails.returnRide.dropLocation && (
        <div style={styles.details}>
          <h3>Return Ride</h3>
          <p>Pickup Location: {formatLocation(getRideDetails(rideDetails.returnRide, 'pickupLocation'))}</p>
          <p>Drop-off Location: {formatLocation(getRideDetails(rideDetails.returnRide, 'dropLocation'))}</p>
          <p>Route: {formatRoute(getRideDetails(rideDetails.returnRide, 'route'))}</p>
          <p>Date: {formatDate(getRideDetails(rideDetails.returnRide, 'date'))}</p>
          <p>Time: {formatTime(getRideDetails(rideDetails.returnRide, 'time'))}</p>
          <p>Distance: {formatDistance(getRideDetails(rideDetails.returnRide, 'distance'))}</p>
          <p>Estimated Time: {formatDuration(getRideDetails(rideDetails.returnRide, 'duration'))}</p>
          <p>Passengers: {getRideDetails(rideDetails.returnRide, 'passengers')}</p>
          <p>Booking Option: {getRideDetails(rideDetails.returnRide, 'bookingOption')}</p>
          <p>Price: {getRideDetails(rideDetails.returnRide, 'price')}</p>
        </div>
      )}

      <div style={styles.buttonContainer}>
        <button onClick={handleBack} style={styles.backButton}>Back</button>
        <button onClick={handleConfirm} style={styles.confirmButton}>Confirm</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    top: '100px',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  details: {
    marginTop: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  confirmButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Confirmation;
