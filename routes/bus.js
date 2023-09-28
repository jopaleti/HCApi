import express from "express";
const router = express.Router();

import {
	getAllBuses,
	addBusDetails,
	updateBus,
	deleteBus,
	createBus,
} from "../controller/bus.js";

// buses Routes
// buses Routes
router.post("/bus", addBusDetails);
router.get("/bus", getAllBuses);
router.get("/bus/create", createBus);
router.put("/bus/:id", updateBus);
router.delete("/bus/:id", deleteBus);

export default router;
