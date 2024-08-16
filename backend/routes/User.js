import express from "express";
import multer from 'multer';
import {
  forgotPassword,
  login,
  signup,
  resetPassword,
  findUser,
  logout,
  updateProfilePicture,
  updateUser,
  addVehicle,
  addOrUpdateBio,
  updateTravelPreferences,
  getUserInfo
} from "../Controllers/UserController.js";
import { verifyToken } from "../Middleware/VerifyUser.js";
const UserRouter = express.Router();

const upload = multer({
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB max file size
    },
  });

UserRouter.post("/signup", signup);

UserRouter.post("/login", login);

UserRouter.post("/forgotpassword", forgotPassword);

UserRouter.post("/resetpassword/:token", resetPassword);

UserRouter.get("/user", verifyToken, findUser);

UserRouter.get("/info/:userId", getUserInfo);

UserRouter.post("/logout", logout);

UserRouter.put("/profilepicture", upload.single('profilePicture'),verifyToken,updateProfilePicture);

UserRouter.put("/update", verifyToken, updateUser);

UserRouter.post("/vehicle", verifyToken, addVehicle);

UserRouter.post("/bio", verifyToken, addOrUpdateBio);

UserRouter.post("/travel-preferences", verifyToken, updateTravelPreferences);






export { UserRouter as UserRouter };
