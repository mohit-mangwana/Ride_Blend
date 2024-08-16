import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RideContext } from '../utils/RideProvider';
import OpenStreetMapComponent from '../utils/OpenStreetMapComponent';
import toast from 'react-hot-toast';


const DropLocation = () => {
    const { rideDetails, setRideDetails } = useContext(RideContext);
    const location = useLocation();
    const navigate = useNavigate();
    const isReturnRide = location.pathname.includes('return');

    const [dropLocation, setDropLocation] = useState(
        isReturnRide
            ? rideDetails.returnRide.daropLocation || { lat: 20.5937, lng: 78.9629 }
            : rideDetails.outboundRide.dropLocation || { lat: 20.5937, lng: 78.9629 }
    );
    const [dropAddress, setDropAddress] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [error, setError] = useState('');
    const [currentSearch, setCurrentSearch] = useState(''); // Track current search input

    useEffect(() => {
        // Update the context when dropLocation changes
        setRideDetails(prevDetails => ({
            ...prevDetails,
            [isReturnRide ? 'returnRide' : 'outboundRide']: {
                ...prevDetails[isReturnRide ? 'returnRide' : 'outboundRide'],
                dropLocation
            }
        }));
    }, [dropLocation, isReturnRide, setRideDetails]);

    const handleLocationChange = (location) => {
        setDropLocation(location);
        setError('');
    };

    const handleAddressChange = (address) => {
        setDropAddress(address);
        setRideDetails(prevDetails => ({
            ...prevDetails,
            [isReturnRide ? 'returnRide' : 'outboundRide']: {
                ...prevDetails[isReturnRide ? 'returnRide' : 'outboundRide'],
                dropAddress: address
            }
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentSearch(searchInput); // Update current search input
    };

    const handleContinue = () => {
        if (!dropAddress) {
            setError('Please select a valid drop-off location');
            toast.error("Please select a valid drop-off location")
            return;
        }
        navigate(isReturnRide ? '/offerseat/return/selectroute' : '/offerseat/selectroute'); // Adjust this path as needed
    };

    const handleBack = () => {
        navigate(isReturnRide ? '/offerseat/return/depature' : '/offerseat/depature');
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Select Drop-off Location</h2>
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
                location={dropLocation}
                onLocationChange={handleLocationChange}
                onAddressChange={handleAddressChange}
                searchInput={currentSearch} // Pass current search input to map component
            />
            {error && <p style={styles.error}>{error}</p>}
            <p style={styles.address}>Selected Drop-off Address: {dropAddress}</p>
            <div style={styles.buttonContainer}>
                <button 
                    onClick={handleBack}
                    style={styles.backButton}
                >
                    Back
                </button>
                <button 
                    onClick={handleContinue}
                    style={styles.continueButton}
                >
                    Continue
                </button>
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
        textAlign: 'center',
    },
    address: {
        marginTop: '10px',
        textAlign: 'center',
        fontWeight: 'bold',
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
    continueButton: {
        padding: '10px 20px',
        backgroundColor: '#08c076',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default DropLocation;