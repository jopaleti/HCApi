import express from "express";
const router = express.Router();
import {
	addRide,
	createRide,
	cancel,
	updateRide,
	checkDriverTime,
	estimateCost,
	singleRide,
	getRides,
	getNearbyDriver,
} from "../controller/ride.js";

router.post("/ride/:id", addRide);
router.post("/ride/cancel/:id", cancel);
router.get("/ride/create", createRide);
router.post("/ride-update/:id", updateRide);
router.post("/ride-time", checkDriverTime);
router.post("/ride-cost", estimateCost);
router.post("/ride/single-ride/:id", singleRide);
router.post("/rides/:id", getRides);
router.post("/nearby-rides", getNearbyDriver);
export default router;
