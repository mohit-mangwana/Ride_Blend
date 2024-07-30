import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seatsBooked: { type: Number, required: true },
  bookedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'booked' } 
});

const BookingModel = mongoose.model('Booking', bookingSchema);

export {BookingModel as BookingModel}