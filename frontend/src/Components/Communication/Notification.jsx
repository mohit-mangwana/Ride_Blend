import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './Notification.css'; // Make sure to create this CSS file
import UserSideBar from '../user profile/UserSideBar';

const socket = io(process.env.SOCKET_URL); // Adjust the URL if different

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/notification/getnotifications', { withCredentials: true });
        setNotifications(response.data);
    
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    socket.on('notification', (notification) => {
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    });

    return () => {
      socket.off('notification');
    };
  }, []);

  return (
    <>
    <UserSideBar></UserSideBar>
    <div className="notifications-container">
      <h2 className="notifications-title">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications available</p>
      ) : (
        notifications.map((notification, index) => (
          <div key={index} className="notification">
            <p className="notification-message">{notification.message}</p>
            <span className="notification-time">{new Date(notification.time).toLocaleString()}</span>
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default Notifications;
