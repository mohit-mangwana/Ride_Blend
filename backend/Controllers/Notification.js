import Notification from '../models/NotificationSchema.js';

// Get all notifications for a user
export const getNotifications = async (req, res) => {
    try {
      const userEmail = req.userEmail; // Get the user's email from the middleware
      const notifications = await Notification.find({ recipient: userEmail }).sort({ createdAt: 'asc' });
      res.status(200).json(notifications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// Create a new notification
export const createNotification = async (req, res) => {
    const { message, type, time, redirect, sender, recipient } = req.body;
    try {
      const notification = new Notification({
        message,
        type,
        time,
        redirect,
        sender,
        recipient
      });
      const newNotification = await notification.save();
      res.status(201).json(newNotification);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  