import express from 'express';
import { getNotifications, createNotification } from '../Controllers/Notification.js';
import { verifyToken } from '../Middleware/VerifyUser.js';


const router = express.Router();

// Get all notifications for a specific user
router.get('/getnotifications',verifyToken ,getNotifications);

// Create a new notification
router.post('/notifications', verifyToken,createNotification);

export default router;
