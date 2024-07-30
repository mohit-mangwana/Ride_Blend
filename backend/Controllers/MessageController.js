import Message from '../models/MessageSchema.js';
import { UserModel } from '../models/User.js';
import {RideModel} from '../models/TripModel.js'; // Adjust the path as needed

export const getMessages = async (req, res) => {
  const { rideId } = req.params;
  const userEmail = req.userEmail; // Use the user email from the middleware

  try {
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const messages = await Message.find({
      rideId,
      $or: [
        { sender: user.name },
        { recipient: user.name }
      ]
    }).sort({ createdAt: 'asc' });

    const ride = await RideModel.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    res.status(200).json({ messages, ride });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Post a new message for a specific ride
export const postMessage = async (req, res) => {
  const { recipient, content } = req.body;
  const { rideId } = req.params;
  const senderEmail = req.userEmail; // Get sender's email from the middleware

  try {
    const senderUser = await UserModel.findOne({ email: senderEmail });
    if (!senderUser) {
      return res.status(404).json({ message: 'Sender user not found' });
    }

    const message = new Message({
      rideId,
      sender: senderUser.name,
      recipient,
      content
    });

  
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
