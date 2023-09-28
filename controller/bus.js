import pool from "../config/db.js";
import dotenv from "dotenv";
import { empty } from "../helper/validation.js";
import { bus } from "../model/bus.js";
import { errorMessage, status, successMessage } from "../helper/status.js";

/**
 * Create Table Bus
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const createBus = (req, res) => {
	pool.query(bus, (err, result) => {
		err && res.status(status.error).json({ err: err }) && console.log(err);
		res
			.status(status.success)
			.json({ msg: "Ambulance table created successfully" });
	});
};
/**
 * Add A Bus
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const addBusDetails = async (req, res) => {
	if (
		empty(req.body.driver) ||
		empty(req.body.email) ||
		empty(req.body.vehicle) ||
		empty(req.body.phone_number) ||
		empty(req.body.lat) ||
		empty(req.body.log)
	) {
		errorMessage.error = "All fields are required";
		return res.status(status.bad).json(errorMessage);
	}
	try {
		let sql = "INSERT INTO ambulance set ?";
		await pool.query(sql, req.body, (err, result) => {
			err && res.status(status.error).json({ err: err }) && console.log(err);
			res.status(status.success).json({ msg: "Ambulance added successfully" });
		});
	} catch (err) {
		errorMessage.error = "An error occurred";
		res.status(status.error).json(errorMessage);
	}
};

/**
 * Update bus
 * @param {object} req
 * @param {object} res
 * @return {object} Bus object
 */

const updateBus = async (req, res) => {
	if (
		empty(req.body.driver) ||
		empty(req.body.email) ||
		empty(req.body.vehicle) ||
		empty(req.body.phone_number) ||
		empty(req.body.lat) ||
		empty(req.body.log)
	) {
		errorMessage.error = "All fields are required";
		return res.status(status.bad).json(errorMessage);
	}
	try {
		const sql = `UPDATE ambulance SET driver = '${req.body.driver}', email='${req.body.email}', phone_number='${req.body.phone_number}', lat='${req.body.lat}', long='${req.body.log}' WHERE id = '${req.params.id}'`;
		// Updating the ambulance
		await pool.query(sql, (err, result) => {
			err && result.status(status.error).json({ msg: err });
			successMessage.data = req.body;
			res
				.status(status.success)
				.json({ msg: "Ambulance updated successfully!", successMessage });
		});
	} catch (err) {
		errorMessage.error = "An error occurred";
		res.status(status.error).json(errorMessage);
	}
};

/**
 * Get all Buses
 * @param {object} req
 * @param {object} res
 * @returns {object} buses array
 */

const getAllBuses = async (req, res) => {
	const sql = "SELECT * FROM ambulance";
	try {
		await pool.query(sql, (err, result) => {
			err && result.status(status.error).json({ msg: err });
			res.status(status.success).json({ msg: result });
		});
	} catch (err) {
		errorMessage.error = "An error occurred";
		res.status(status.error).json(errorMessage);
	}
};

/**
 * Delete bus
 * @param {object} req
 * @param {object} res
 * @returns {void} response bus deleted successfully
 */

const deleteBus = async (req, res) => {
	const busId = req.params.id;
	try {
		const sql = `DELETE FROM ambulance WHERE id = '${busId}'`;
		await pool.query(sql, (err, result) => {
			err && result.status(status.error).json({ msg: err });
			res.status(status.success).json("Ambulance deleted successfully");
		});
	} catch (err) {
		errorMessage.error = "An error occurred";
		res.status(status.error).json(errorMessage);
	}
};

export { getAllBuses, addBusDetails, updateBus, deleteBus, createBus };
