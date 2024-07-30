import React, { createContext, useState, useCallback, useMemo } from 'react';

export const RideContext = createContext();

const initialRideState = {
  pickupAddress: null,
  pickupLocation: null,
  dropAddress: null,
  dropLocation: null,
  date: null,
  passengers: null,
  bookingOption: null,
  price: null,
  distance: null,
  duration: null,
};

export const RideProvider = ({ children }) => {
  const [rideDetails, setRideDetails] = useState({
    outboundRide: { ...initialRideState },
    returnRide: { ...initialRideState },
  });

  // Function to reset the ride details
  const resetRideDetails = useCallback(() => {
    setRideDetails({
      outboundRide: { ...initialRideState },
      returnRide: { ...initialRideState },
    });
  }, []);

  const contextValue = useMemo(() => ({
    rideDetails,
    setRideDetails,
    resetRideDetails
  }), [rideDetails, resetRideDetails]);

  return (
    <RideContext.Provider value={contextValue}>
      {children}
    </RideContext.Provider>
  );
};