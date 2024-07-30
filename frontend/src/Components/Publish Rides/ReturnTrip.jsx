import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideContext } from '../utils/RideProvider';

const ReturnTrip = () => {
  const navigate = useNavigate();
  const { rideDetails, setRideDetails } = useContext(RideContext);

  const handlePublishNow = () => {
    if (window.confirm('Are you sure you want to publish your return ride now?')) {
      const { outboundRide, returnRide } = rideDetails;

      if (returnRide) {
        const updatedReturnRide = {
          ...returnRide,
          pickupAddress: outboundRide.dropAddress,
          dropAddress: outboundRide.pickupAddress,
          pickupLocation: outboundRide.dropLocation,
          dropLocation: outboundRide.pickupLocation,
        };

        setRideDetails({
          ...rideDetails,
          returnRide: updatedReturnRide,
        });
      }

      navigate('/offerseat/return-route');
    }
  };

  const handlePublishLater = () => {
    navigate('/offerseat/confirmation');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Coming back as well?</h2>
      <p>Publish your return ride now!</p>
      <button onClick={handlePublishNow} style={styles.button}>Yes, sure!</button>
      <button onClick={handlePublishLater} style={styles.button}>I'll publish my return ride later</button>
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
    textAlign: 'center',
  },
  title: {
    color: '#333',
  },
  button: {
    display: 'block',
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default ReturnTrip;
