import express from "express";
import {publishRide,getUserRides,searchRides,getAllRides,deleteRide,editRide,getRideById} from '../Controllers/RideController.js'
import {verifyToken} from '../Middleware/VerifyUser.js'
const TripRouter = express.Router();


TripRouter.post('/publishride',verifyToken,publishRide)

TripRouter.get('/user/rides', verifyToken, getUserRides);

TripRouter.get('/rides/search', searchRides);

TripRouter.get('/rides/getrides', getAllRides);

// Delete ride route
TripRouter.delete("/deleteride/:id", deleteRide);

// Edit ride route
TripRouter.put("/editride/:id", editRide);

TripRouter.get('/ride-detail/:rideId', verifyToken, getRideById);



export { TripRouter as TripRoute };
