import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RideContext } from '../utils/RideProvider';
import OpenStreetMapComponent from '../utils/OpenStreetMapComponent';
import toast from 'react-hot-toast';


const PickupLocation = () => {
  const { rideDetails, setRideDetails } = useContext(RideContext);
  const location = useLocation();
  const isReturnRide = location.pathname.includes('return');
  
  const [pickupLocation, setPickupLocation] = useState(
    isReturnRide 
      ? rideDetails.returnRide.pickupLocation || { lat: 20.5937, lng: 78.9629 }
      : rideDetails.outboundRide.pickupLocation || { lat: 20.5937, lng: 78.9629 }
  );
  
  const [pickupAddress, setPickupAddress] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');
  const [currentSearch, setCurrentSearch] = useState('');
  const navigate = useNavigate();

  const handleLocationChange = (location) => {
    setPickupLocation(location);
    setRideDetails(prevDetails => ({
      ...prevDetails,
      [isReturnRide ? 'returnRide' : 'outboundRide']: {
        ...prevDetails[isReturnRide ? 'returnRide' : 'outboundRide'],
        pickupLocation: location
      }
    }));
    setError('');
  };

  const handleAddressChange = (address) => {
    setPickupAddress(address);
    setRideDetails(prevDetails => ({
      ...prevDetails,
      [isReturnRide ? 'returnRide' : 'outboundRide']: {
        ...prevDetails[isReturnRide ? 'returnRide' : 'outboundRide'],
        pickupAddress: address
      }
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentSearch(searchInput);
  };

  const handleContinue = () => {
    if (!pickupAddress) {
      setError('Please select a valid pickup location');
      toast.error('Please select a valid location');
      return;
    }
    navigate(isReturnRide ? '/offerseat/return-arrival' : '/offerseat/arrival');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Select {isReturnRide ? 'Return ' : ''}Pickup Location</h2>
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter a location"
          style={styles.input}
        />
        <button type="submit" style={styles.searchButton}>Search</button>
      </form>
      <OpenStreetMapComponent
        location={pickupLocation}
        onLocationChange={handleLocationChange}
        onAddressChange={handleAddressChange}
        searchInput={currentSearch}
      />
      {error && <p style={styles.error}>{error}</p>}
      <p style={styles.address}>Selected Address: {pickupAddress}</p>
      <button
        onClick={handleContinue}
        style={styles.button}
      >
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
  searchForm: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  searchButton: {
    padding: '10px',
    backgroundColor: '#08c076',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  address: {
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
  },
};

export default PickupLocation;