import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideContext } from '../utils/RideProvider';

const PassengerCount = ({ isReturnRide }) => {
  const { rideDetails, setRideDetails } = useContext(RideContext);
  const rideType = isReturnRide ? 'returnRide' : 'outboundRide'; // Determine ride type
  const [passengers, setPassengers] = useState(
    rideDetails[rideType].passengers || 1
  );
  const navigate = useNavigate();

  const handleContinue = () => {
    setRideDetails(prevDetails => ({
      ...prevDetails,
      [rideType]: {
        ...prevDetails[rideType],
        passengers,
      },
    }));
    navigate(isReturnRide ? '/offerseat/return-bookoption' : '/offerseat/bookoption');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Select {isReturnRide ? 'Return' : ''} Passengers</h2>
      <div style={styles.passengerControl}>
        <button
          style={styles.button}
          disabled={passengers <= 1}
          onClick={() => setPassengers(passengers - 1)}
        >
          -
        </button>
        <span style={styles.passengerCount}>{passengers}</span>
        <button
          style={styles.button}
          disabled={passengers >= 4}
          onClick={() => setPassengers(passengers + 1)}
        >
          +
        </button>
      </div>
      <button onClick={handleContinue} style={styles.continueButton}>
        Continue
      </button>
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
  passengerControl: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    margin: '0 10px',
  },
  passengerCount: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  continueButton: {
    display: 'block',
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default PassengerCount;
