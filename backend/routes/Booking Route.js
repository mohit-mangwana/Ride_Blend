import express from "express";
import { bookRide, bookedRides, cancelRide,getRideBookings,confirmBooking,declineBooking } from "../Controllers/BookingController.js";
import { verifyToken } from "../Middleware/VerifyUser.js";

const BookingRouter = express.Router();

BookingRouter.post("/booking", verifyToken,bookRide);

BookingRouter.get("/bookedrides",verifyToken, bookedRides);

BookingRouter.get("/bookings",verifyToken, getRideBookings);

BookingRouter.put("/cancel/:rideId",verifyToken, cancelRide);

BookingRouter.post('/:bookingId/confirm', confirmBooking);

BookingRouter.post('/:bookingId/decline', declineBooking);



export { BookingRouter as BookingRouter };
