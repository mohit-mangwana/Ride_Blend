import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  rideId: { type: String, required: true },
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
