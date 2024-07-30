import express from "express";
import {
  signup,
  } from "../Controllers/UserController.js";
  import {
    getCount,
    getAllRides,
    getBookings,
    getAllUsers
} from "../Controllers/AdminController.js";
import { login } from "../Controllers/AdminController.js";
import { verifyToken } from "../Middleware/VerifyUser.js";


const AdminRouter = express.Router();

AdminRouter.post("/signup", signup);

AdminRouter.post("/adminlogin", login);

AdminRouter.get("/getcount",verifyToken, getCount);

AdminRouter.get("/getUsers",verifyToken, getAllUsers);

AdminRouter.get("/getRides",verifyToken, getAllRides);

AdminRouter.get("/getBookings",verifyToken, getBookings);





export { AdminRouter as AdminRouter };