// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const NotFound = () => {
  const role = Cookies.get('role');
  const isAdmin = role === 'admin';

  return (
    <div style={{ textAlign: 'center', padding: '50px' ,position:'absolute',top:'200px',width:'100%'}}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      {isAdmin ? (
        <Link to="/admindashboard">Go to Admin Dashboard</Link>
      ) : (
        <Link to="/">Go to Home</Link>
      )}
    </div>
  );
};

export default NotFound;
