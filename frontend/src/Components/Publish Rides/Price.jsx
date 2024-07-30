import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideContext } from '../utils/RideProvider';
import toast from 'react-hot-toast';

const PriceSelection = ({ isReturnRide }) => {
  const { rideDetails, setRideDetails } = useContext(RideContext);

  const initialPrice = isReturnRide ? rideDetails?.returnRide?.price : rideDetails?.outboundRide?.price;
  const [price, setPrice] = useState(initialPrice ?? ''); // Use nullish coalescing to handle undefined values

  const navigate = useNavigate();

  const handleContinue = () => {
    if (!price) {
      toast.error('Please enter a price');
      return;
    }
    setRideDetails(prevDetails => ({
      ...prevDetails,
      ...(isReturnRide
        ? { returnRide: { ...prevDetails.returnRide, price } }
        : { outboundRide: { ...prevDetails.outboundRide, price } }),
    }));
    navigate(isReturnRide ? '/offerseat/confirmation' : '/offerseat/return-trip');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Set {isReturnRide ? 'Return' : ''} Price</h2>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={styles.input}
        placeholder="Enter price"
      />
      <button onClick={handleContinue} style={styles.button}>Continue</button>
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
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
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
    textAlign: 'center',
  },
};

export default PriceSelection;
