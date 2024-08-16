import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideContext } from '../utils/RideProvider';
import toast from 'react-hot-toast';

const DatePicker = ({ isReturnRide }) => {
  const { rideDetails, setRideDetails } = useContext(RideContext);
  const rideType = isReturnRide ? 'returnRide' : 'outboundRide';

  const initialDate = rideDetails[rideType]?.date ? new Date(rideDetails[rideType].date).toISOString().split('T')[0] : '';
  const initialTime = rideDetails[rideType]?.time || '';

  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const navigate = useNavigate();

  useEffect(() => {
    setDate(initialDate);
    setTime(initialTime);
  }, [rideDetails]);

  const handleContinue = () => {
    if (!date || !time) {
      toast.error('Please select both date and time');
      return; // Prevent further execution if date or time is missing
    }

    setRideDetails(prevDetails => ({
      ...prevDetails,
      [rideType]: {
        ...prevDetails[rideType],
        date: new Date(date).toISOString(),
        time: time,
      },
    }));
    
    navigate(isReturnRide ? '/offerseat/return-passengers' : '/offerseat/passengers');
  };

  const minDate = new Date().toISOString().split('T')[0];
  const minTime = date === minDate ? new Date().toISOString().split('T')[1].substring(0, 5) : "00:00";

  const isDateValid = (selectedDate) => {
    if (!rideDetails.outboundRide?.date) return true;
    const outboundDate = new Date(rideDetails.outboundRide.date);
    const selectedDateTime = new Date(`${selectedDate}T${time}`);
    return selectedDateTime >= outboundDate;
  };

  // const isContinueDisabled = !date || !time || !isDateValid(date);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Select {isReturnRide ? 'Return' : 'Outbound'} Date and Time</h2>
      <input
        type="date"
        value={date}
        min={minDate}
        onChange={(e) => setDate(e.target.value)}
        style={styles.input}
      />
      <input
        type="time"
        value={time}
        min={minTime}
        onChange={(e) => setTime(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleContinue} style={styles.button} >Continue</button>
      {!isDateValid(date) && (
        <p style={styles.errorMsg}>Return date cannot be earlier than outbound date ({rideDetails.outboundRide?.date})</p>
      )}
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
  errorMsg: {
    color: 'red',
    textAlign: 'center',
    marginTop: '10px',
  },
};

export default DatePicker;
