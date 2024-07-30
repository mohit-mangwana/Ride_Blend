import express from 'express';
import { getMessages, postMessage } from '../Controllers/MessageController.js';
import { verifyToken } from '../Middleware/VerifyUser.js';

const router = express.Router();

// Get all messages for a specific ride
router.get('/ride/:rideId/messages', verifyToken,getMessages);

// Post a new message for a specific ride
router.post('/ride/:rideId/message',verifyToken, postMessage);

export default router;



