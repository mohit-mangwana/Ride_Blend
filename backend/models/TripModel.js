import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
});

const rideDetailsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true }, // New field for time
  passengers: { type: Number, required: true },
  price: { type: Number, required: true },
  distance: { type: Number, required: true },
  duration: { type: Number, required: true },
  bookingOption: { type: String, required: true },
  pickupLocation: { type: locationSchema, required: true },
  dropLocation: { type: locationSchema, required: true },
  pickupAddress: { type: String, required: true },
  dropAddress: { type: String, required: true },
});

const rideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rideDetails: { type: rideDetailsSchema, required: true },
});

const RideModel = mongoose.model("Ride", rideSchema);

export { RideModel as RideModel };
