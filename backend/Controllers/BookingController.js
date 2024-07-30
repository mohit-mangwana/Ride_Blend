import { BookingModel } from "../models/bookingSchema.js";
import { UserModel } from "../models/User.js";
import { RideModel } from "../models/TripModel.js";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;
import Notification from "../models/NotificationSchema.js";


// Endpoint for booking a ride
export const bookRide = async (req, res) => {
  const { rideId, seatsBooked } = req.body;

  try {
    const userEmail = req.userEmail;
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const ride = await RideModel.findById(rideId).populate('user');

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    if (ride.user._id.equals(user._id)) {
      return res.status(400).json({ error: "You cannot book your own ride" });
    }

    if (seatsBooked > ride.rideDetails.passengers) {
      return res.status(400).json({ error: "Not enough available seats" });
    }

    // Decrement available seats by the number of seats booked
    ride.rideDetails.passengers -= seatsBooked;
    await ride.save();

    // Determine the booking status based on the booking option
    const bookingStatus = ride.rideDetails.bookingOption === 'manual' ? 'pending' : 'confirmed';

    // Create a new booking document
    const booking = new BookingModel({
      ride: rideId,
      user: user._id,
      seatsBooked: seatsBooked,
      status: bookingStatus,
    });

    await booking.save();

    // Prepare notification message for the publisher
    const publisherNotificationMessage = ride.rideDetails.bookingOption === 'manual'
      ? `${user.name} has requested to book ${seatsBooked} seat(s) for your ride.`
      : `${user.name} has booked ${seatsBooked} seat(s) for your ride.`;

    // Create notification for the publisher
    const publisherNotification = new Notification({
      message: publisherNotificationMessage,
      type: 'booking',
      time: new Date(),
      redirect: `/rides/${rideId}`,
      sender: user._id,
      recipient: ride.user.email, // Set recipient as publisher's email
    });

    await publisherNotification.save();

    // Send a notification to the user if the booking is confirmed instantly
    if (ride.rideDetails.bookingOption !== 'manual') {
      const userNotification = new Notification({
        message: `Your booking for ride ${rideId} has been confirmed.`,
        type: 'booking',
        time: new Date(),
        redirect: `/rides/${rideId}`,
        sender: ride.user._id,
        recipient: user.email,
      });

      await userNotification.save();
    }

    res.status(201).json({ message: "Ride booked successfully" });
  } catch (error) {
    console.error("Error booking ride:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



export const bookedRides = async (req, res) => {
  try {
    // Get userEmail from middleware
    const userEmail = req.userEmail;

    // Fetch user by userEmail
    const user = await UserModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all booked rides for the user from the database
    const bookedRides = await BookingModel.find({ user: user._id }).populate({
      path: 'ride',
      populate: {
        path: 'user',
        model: 'User'
      }
    });

    res.status(200).json({ bookedRides });
  } catch (error) {
    console.error("Error fetching booked rides:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const cancelRide = async (req, res) => {
  const { rideId } = req.params;

  try {
    // Find the booking associated with the provided rideId
    const booking = await BookingModel.findOneAndDelete({ ride: rideId }).populate('ride');
  

    // If the booking is not found, return a 404 error
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // If the booking is successfully cancelled, send a success message
    res.status(200).json({ message: "Ride cancelled successfully" });
  } catch (error) {
    // If an error occurs, log the error and send a 500 error response
    console.error("Error cancelling ride:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getRideBookings = async (req, res) => {
  try {
    const userEmail = req.userEmail; // Get the user's email from the middleware
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bookings = await BookingModel.find({}).populate('ride').populate('user');
    const userBookings = bookings.filter(booking => booking.ride.user.toString() === user._id.toString());

    res.status(200).json(userBookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status = 'confirmed';
    await booking.save();

    res.status(200).json({ message: "Booking confirmed successfully" });
  } catch (err) {
    console.error("Error confirming booking:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const declineBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const booking = await BookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const ride = await RideModel.findById(booking.ride);
    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }


    ride.rideDetails.passengers += booking.seatsBooked;
    await ride.save();

    await BookingModel.deleteOne({ _id: bookingId });

    res.status(200).json({ message: "Booking declined successfully." });
  } catch (error) {
    console.error("Error declining booking:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



