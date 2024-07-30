import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideContext } from '../utils/RideProvider';
import toast from 'react-hot-toast';

const BookingOption = ({ isReturnRide }) => {
  const { rideDetails, setRideDetails } = useContext(RideContext);
  
  // Determine the initial state based on whether it's a return ride or not
  const rideType = isReturnRide ? 'returnRide' : 'outboundRide';
  const initialBookingOption = rideDetails[rideType].bookingOption || null;
  const [bookingOption, setBookingOption] = useState(initialBookingOption);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!bookingOption) {
      toast.error('Please select a booking option');
      return;
    }

    setRideDetails(prevDetails => ({
      ...prevDetails,
      [rideType]: {
        ...prevDetails[rideType],
        bookingOption,
      },
    }));
    navigate(isReturnRide ? '/offerseat/return-price' : '/offerseat/price');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Select {isReturnRide ? 'Return' : ''} Booking Option</h2>
      <div style={styles.optionContainer}>
        <label style={styles.label}>
          <input
            type="radio"
            name="bookingOption"
            value="instant"
            checked={bookingOption === 'instant'}
            onChange={() => setBookingOption('instant')}
            style={styles.radio}
          />
          Instant Booking
        </label>
        <label style={styles.label}>
          <input
            type="radio"
            name="bookingOption"
            value="manual"
            checked={bookingOption === 'manual'}
            onChange={() => setBookingOption('manual')}
            style={styles.radio}
          />
          Manual Approval
        </label>
      </div>
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
  optionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
  label: {
    margin: '10px 0',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  radio: {
    marginRight: '10px',
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
    marginTop: '20px',
  },
};

export default BookingOption;
