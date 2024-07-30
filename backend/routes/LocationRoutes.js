import express from "express";
import { geoCode } from "../Controllers/LocationController.js";
const LocationRouter = express.Router();


LocationRouter.get('/location',geoCode)

export { LocationRouter as LocationRouter };
