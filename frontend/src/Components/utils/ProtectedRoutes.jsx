import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { RideContext } from './RideProvider';

const ProtectedRoute = ({ token, isAdmin, children, adminOnly = false, requiredFields = [] }) => {
  const { rideDetails } = useContext(RideContext);

  // Check if the user is logged in
  if (token === null) {
    // Optional: Add a loading indicator here if the login state is still being fetched
    return null;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (!adminOnly && isAdmin) {
    return <Navigate to="/admindashboard" />;
  }

  // Check if all required fields are present in rideDetails
  const isAuthorized = requiredFields.every(field => rideDetails.outboundRide[field]);

  if (!isAuthorized) {
    return <Navigate to="/offerseat/depature" replace />;
  }

  return children;
};

export default ProtectedRoute;
