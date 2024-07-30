import { UserModel } from "../models/User.js";
import { RideModel } from "../models/TripModel.js";

export const publishRide = async (req, res) => {
  try {
    const userEmail = req.userEmail;
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user._id;
    const { outboundRide, returnRide } = req.body;

    // Save outbound ride
    if (outboundRide) {
      const newOutboundRide = new RideModel({
        user: userId,
        rideDetails: outboundRide,
      });
      await newOutboundRide.save();
    }

    // Save return ride if available
    if (returnRide) {
      const newReturnRide = new RideModel({
        user: userId,
        rideDetails: returnRide,
      });
      await newReturnRide.save();
    }

    res.status(201).json({ message: "Rides saved successfully" });
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid token" });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
};

export const getUserRides = async (req, res) => {
  try {
    // Get the user's email from the request object
    const userEmail = req.userEmail;

    // Query rides collection for rides published by the user with the extracted email
    const user = await UserModel.findOne({ email: userEmail });

    const userId = user._id; // Retrieve the user's ID from the user object

    // Query rides collection for rides published by the user with the extracted ID
    const rides = await RideModel.find({ user: userId });

    // Return the list of rides in the response
    res.json(rides);
  } catch (error) {
    // Handle errors
    console.error("Error fetching rides:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const searchRides = async (req, res) => {
  try {
    const { pickupAddress, dropAddress, date, passengers } = req.query;

    if (!pickupAddress || !dropAddress || !date || !passengers) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const parsedDate = new Date(date);
    const numberOfPassengers = parseInt(passengers, 10);
    if (isNaN(parsedDate) || isNaN(numberOfPassengers)) {
      return res.status(400).json({ error: "Invalid date or passengers format" });
    }

    const rides = await RideModel.find({
      "rideDetails.pickupAddress": { $regex: new RegExp(pickupAddress, 'i') },
      "rideDetails.dropAddress": { $regex: new RegExp(dropAddress, 'i') },
      "rideDetails.date": { $gte: parsedDate },
      "rideDetails.passengers": { $gte: numberOfPassengers }, // Filter based on passengers
    }).populate({
      path: 'user',
      model: 'User',
      select: 'name phoneNumber profilePicture',
    });

    const ridesWithProfilePic = rides.map(ride => {
      const user = ride.user.toObject();
      let profilePictureData = null;
      if (user.profilePicture && user.profilePicture.data && user.profilePicture.contentType) {
        profilePictureData = {
          data: user.profilePicture.data.toString("base64"),
          contentType: user.profilePicture.contentType,
        };
      }
      return {
        ...ride.toObject(),
        user: {
          ...user,
          profilePicture: profilePictureData,
        },
      };
    });

    res.json(ridesWithProfilePic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getAllRides = async (req, res) => {
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

export const deleteRide = async (req, res) => {
  const rideId = req.params.id;

  try {
    const deletedRide = await RideModel.findByIdAndDelete(rideId);

    if (!deletedRide) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json({ message: "Ride deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ride", error });
  }
};

export const editRide = async (req, res) => {
  const rideId = req.params.id;
  const updatedRideData = req.body;

  try {
    const updatedRide = await RideModel.findByIdAndUpdate(rideId, updatedRideData, { new: true });

    if (!updatedRide) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json({ message: "Ride updated successfully", ride: updatedRide });
  } catch (error) {
    res.status(500).json({ message: "Error updating ride", error });
  }
};

export const getRideById = async (req, res) => {
  const { rideId } = req.params;

  try {
    const ride = await RideModel.findById(rideId).populate('user', 'name profilePicture travelPreferences vehicles');

    if (!ride) {
      return res.status(404).json({ error: "Ride not found" });
    }

    let profilePictureData = null;
    if (ride.user.profilePicture && ride.user.profilePicture.data && ride.user.profilePicture.contentType) {
      profilePictureData = {
        data: ride.user.profilePicture.data.toString("base64"),
        contentType: ride.user.profilePicture.contentType,
      };
    }

    const rideData = {
      ...ride.toObject(),
      user: {
        ...ride.user.toObject(),
        profilePicture: profilePictureData,
      },
    };

    res.status(200).json(rideData);
  } catch (error) {
    console.error("Error fetching ride details:", error);
    res.status(500).json({ error: "Server error" });
  }
};
