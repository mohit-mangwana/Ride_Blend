import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, required: true },
  time: { type: Date, default: Date.now },
  redirect: { type: String, required: true },
  sender: { type: String, required: true },
  recipient: { type: String, required: true }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
