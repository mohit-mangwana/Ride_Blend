import express from 'express';
import Message from '../models/MessageSchema.js';
import {UserModel} from '../models/User.js';
import { verifyToken } from '../Middleware/VerifyUser.js';

const router = express.Router();

router.get('/chats', verifyToken, async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const username = user.name;


    const messages = await Message.find({
      $or: [{ sender: username }, { recipient: username }]
    }).sort({ createdAt: -1 });



    const chats = messages.reduce((acc, message) => {
      const chatPartner = message.sender === username ? message.recipient : message.sender;
      const chatId = `${username}_${chatPartner}`;
      
      if (!acc[chatId]) {
        acc[chatId] = {
          chatId: chatId,
          title: `Chat with ${chatPartner}`,
          lastMessage: message.content,
          recipient: chatPartner,
          sender: username,
          rideId:message.rideId,
          recipientProfilePicture: message.sender === username ? message.recipientProfilePicture : message.senderProfilePicture,
          senderProfilePicture: message.sender === username ? message.senderProfilePicture : message.recipientProfilePicture,
          createdAt: message.createdAt,
        };
      }
      return acc;
    }, {});


    res.json(Object.values(chats));
  } catch (error) {
    console.error('Error in /chats route:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

export default router;