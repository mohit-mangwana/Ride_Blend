import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY;;
import bcrypt from "bcrypt";
import { UserModel } from "../models/User.js";
import { RideModel } from "../models/TripModel.js";
import { BookingModel } from "../models/bookingSchema.js";


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "incorerct Email" });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(404).json({ error: "Password incorrect" });
    }

    const role = existingUser.role;
    if(role === "user") {
      return res.status(404).json({error:"you can not access this page without a role"});
    }
    const token = jwt.sign({ email: existingUser.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
    return res
      .status(200)
      .json({ status: true, message: "Login successful", token: token , role: existingUser.role});
  } catch (err) {
    // console.error("Error in login API:" + err);
    return res.status(404).json({ error: "Internal server error" });
  }
};

 // Fetch counts for users, rides, and bookings
export const getCount= async (req, res) => {
  try {
      const userCount = await UserModel.countDocuments({ role: { $ne: 'admin' } });
      const rideCount = await RideModel.countDocuments();
      const bookingCount = await BookingModel.countDocuments();
      
      res.status(200).json({ users: userCount, rides: rideCount, bookings: bookingCount });
  } catch (error) {
      res.status(500).json({ message: 'Error fetching counts', error });
  }
};


// Fetch all users
// In your backend, e.g., in adminController.js
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select('-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};


// Fetch all rides
export const getAllRides =  async (req, res) => {
  // try {
  //     const rides = await RideModel.find();
  //     console.log(rides)
  //     res.status(200).json(rides);
  // } catch (error) {
  //     res.status(500).json({ message: 'Error fetching rides', error });
  // }
  try {
    // Fetch all rides from the database and populate the 'user' field to include user details
    const rides = await RideModel.find().populate({
      path: 'user',
      select: 'name phoneNumber', // Include only 'name' and 'phoneNumber' fields of the user
    });

    // If no rides are found, return a 404 error
    // if (!rides || rides.length === 0) {
    //   return res.status(404).json({ error: 'No rides found' });
    // }

    // Return the fetched rides as a response
 
    res.status(200).json({ rides });
  } catch (error) {
    // If an error occurs, log the error and send a 500 error response
    console.error('Error fetching rides:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Fetch all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.find()
      .populate('ride')  // Populate the ride field with full ride details
      .populate('user'); // Populate the user field with full user details

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

