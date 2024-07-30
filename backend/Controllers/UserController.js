import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";
import {RideModel} from '../models/TripModel.js'
import bcrypt from "bcrypt";
import Notification from "../models/NotificationSchema.js";
import nodemailer from "nodemailer";


export const signup = async (req, res) => {
  const { name, email, password, phoneNumber ,role} = req.body;
  try {
    const existingName = await UserModel.findOne({ name });
    if (existingName) {
      return res.status(401).json({ message: "User Name already exists" });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(401).json({ message: "Email already exists" });
    }

    const existingNumber = await UserModel.findOne({ phoneNumber });
    if (existingNumber) {
      return res.status(401).json({ message: "Phone Number already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      name: name,
      email: email,
      password: hashpassword,
      phoneNumber: phoneNumber,
      role: role,
    });

    console.log( 
      process.env.JWT_SECRET
     
    )
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET
    );
    res.status(201).json({
      user: newUser,
      token: token,
      message: "created successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

export const login = async (req, res) => {

  const { email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "Incorrect Email" });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(404).json({ error: "Password incorrect" });
    }
  
    const token = jwt.sign({ email: existingUser.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    // Create a notification
    const notification = new Notification({
      message: "You have successfully logged in.",
      type: "info",
      time: new Date(),
      redirect: "/dashboard",
      sender: "system",
      recipient: email
    });
    await notification.save();

    return res.status(200).json({ status: true, message: "Login successful", token: token, role: existingUser.role });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5m" });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

  
    var mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Reset Password",
      text: `${process.env.REACT_APP_API_BASE_URL}/resetpassword/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(401).json({ message: "error sending email" });
      } else {
        return res.json({ status: true, message: "email sent successfully" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  const token = req.params.token; // Assuming the token is passed in req.params.token
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;
    const hashpassword = await bcrypt.hash(password, 10);
    await UserModel.findByIdAndUpdate(id, { password: hashpassword });
    return res.json({ status: true, message: "Password updated" });
  } catch (err) {
    return res.json("invalid token ");
  }
};


export const findUser = async (req, res) => {
  try {
    const emailFromToken = req.userEmail; // Access userEmail from req object
    const user = await UserModel.findOne({ email: emailFromToken });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Extract the necessary user details
    const { name, email, phoneNumber, profilePicture, bio, travelPreferences, vehicles } = user;

    let profilePictureData = null;
    if (profilePicture && profilePicture.data && profilePicture.contentType) {
      profilePictureData = {
        data: profilePicture.data.toString("base64"),
        contentType: profilePicture.contentType,
      };
    }

    res.json({ name, email, phoneNumber, profilePicture: profilePictureData, bio, travelPreferences, vehicles });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserInfo = async (req, res) => {
   try {
    const emailFromToken = req.userEmail; // Access userEmail from req object
    const user = await UserModel.findOne({ email: emailFromToken });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Count the number of rides published by the user
    const publishedRidesCount = await RideModel.countDocuments({ user: user._id });

    // Extract the necessary user details
    const { name, email, phoneNumber, profilePicture, bio, travelPreferences, vehicles, createdAt } = user;

    let profilePictureData = null;
    if (profilePicture && profilePicture.data && profilePicture.contentType) {
      profilePictureData = {
        data: profilePicture.data.toString("base64"),
        contentType: profilePicture.contentType,
      };
    }

    res.json({
      name,
      email,
      phoneNumber,
      profilePicture: profilePictureData,
      bio,
      travelPreferences,
      vehicles,
      publishedRidesCount,
      joinedDate: createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


export const logout = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("isLoggedIn");
  res.clearCookie('role');
  // localStorage.removeItem("token");
  res.json({ message: "Logged out successfully" });
};

export const updateProfilePicture = async (req, res) => {
  const userEmail = req.userEmail;

  try {
    let user = await UserModel.findOne({ email: userEmail }).populate('profilePicture');

      if (!user) {
          return res.status(404).json({ error: "User not found" });
      }

      // Check if a profile picture was uploaded
      if (req.file) {
        // Ensure user.profilePicture is properly initialized
        user.profilePicture = user.profilePicture || {};
      
        // Set profile picture data and content type
        user.profilePicture.data = req.file.buffer;
        user.profilePicture.contentType = req.file.mimetype;
      
        // Save the updated user
        await user.save();
      
        res.status(200).json({ message: "Profile picture updated successfully" });
      } else {
        res.status(400).json({ error: "No file uploaded" });
      }
  } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  const userEmail = req.userEmail; // Assuming you have a middleware that sets req.userEmail
  const { name, email, phoneNumber, bio } = req.body;

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio !== undefined) {
      user.bio = bio === '' ? null : bio; // Set bio to null if it's cleared, otherwise update normally
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


export const addVehicle = async (req, res) => {
    try {
        const userEmail = req.userEmail;
        const { make, model, year } = req.body;
        
        const user = await UserModel.findOneAndUpdate(
            { email: userEmail },
            { $push: { vehicles: { make, model, year } } },
            { new: true }
        );

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error adding vehicle:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const  addOrUpdateBio = async (req, res) => {
  const { bio } = req.body;
  const emailFromToken = req.userEmail; // Access userEmail from req object

  try {
    const user = await UserModel.findOne({email:emailFromToken});

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.bio = bio;
    await user.save();

    res.status(200).json({ message: 'Bio updated successfully' });
  } catch (error) {
    console.error('Error updating bio:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTravelPreferences = async (req, res) => {
  try {
    const emailFromToken = req.userEmail; // Access userEmail from req object
    const { preferences } = req.body;

    // Validate that preferences is an array
    if (!Array.isArray(preferences)) {
      return res.status(400).json({ error: "Preferences should be an array" });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email: emailFromToken });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user's travel preferences
    user.travelPreferences = preferences;

    // Save the updated user
    await user.save();

    // Respond with success message
    res.json({ message: "Travel preferences updated successfully" });
  } catch (error) {
    console.error('Failed to update travel preferences:', error);
    res.status(500).json({ error: "Internal server error", error });
  }
};
