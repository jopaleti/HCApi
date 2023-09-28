import pool from "../config/db.js";
import dotenv from "dotenv";
import { empty } from "../helper/validation.js";
import { ride } from "../model/ride.js";
import { errorMessage, status, successMessage } from "../helper/status.js";

/**
 * Create Table for Ride
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const createRide = (req, res) => {
	pool.query(ride, (err, result) => {
		err && res.status(status.error).json({ err: err }) && console.log(err);
		res.status(status.success).json({ msg: "Ride table created successfully" });
	});
};

/**
 * Add A Ride
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const addRide = async (req, res) => {
	if (
		empty(req.params.id) ||
		empty(req.body.start_lat) ||
		empty(req.body.start_log) ||
		empty(req.body.end_lat) ||
		empty(req.body.end_log)
	) {
		errorMessage.error = "All fields are required";
		return res.status(status.bad).json(errorMessage);
	}
	try {
		pool.query(
			`SELECT * FROM ride WHERE end_lat = '${req.body.end_lat}' AND end_log = '${req.body.end_log}' AND userId = '${req.params.id}' AND start_lat = '${req.body.start_lat}' AND start_log = '${req.body.start_log}'`,
			(err, result) => {
				err && res.status(status.error).json({ err: err }) && console.log(err);
				if (result.length > 0) {
					res
						.status(status.error)
						.json({ msg: "This ride has already been created!" });
				} else {
					function distance(lat1, lon1, lat2, lon2, unit) {
						var radlat1 = (Math.PI * lat1) / 180;
						var radlat2 = (Math.PI * lat2) / 180;
						var theta = lon1 - lon2;
						var radtheta = (Math.PI * theta) / 180;
						var dist =
							Math.sin(radlat1) * Math.sin(radlat2) +
							Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
						if (dist > 1) {
							dist = 1;
						}
						dist = Math.acos(dist);
						dist = (dist * 180) / Math.PI;
						dist = dist * 60 * 1.1515;
						if (unit == "K") {
							dist = dist * 1.609344;
						}
						if (unit == "N") {
							dist = dist * 0.8684;
						}
						return Math.floor(dist);
					}
					var datalist;
					var value = [];
					var poslat = req.body.start_lat;
					var poslng = req.body.start_log;
					pool.query("SELECT * FROM ambulance", (err, result) => {
						err &&
							res.status(status.error).json({ err: err }) &&
							console.log(err);
						datalist = result;
						for (var i = 0; i < datalist.length; i++) {
							if (datalist[i].isAvailable) {
								value.push(
									parseInt(
										distance(
											poslat,
											poslng,
											datalist[i].lat,
											datalist[i].log,
											"K"
										)
									)
								);
							} else {
								res.status().json({
									msg: "Please wait for a while, no available ambulance at the moment.",
								});
							}
						}
						var busAssigned = datalist.find(
							(item) => item.id > value.indexOf(Math.min(...value))
						);
						function distance(lat1, lon1, lat2, lon2, unit) {
							if (lat1 == lat2 && lon1 == lon2) {
								return 0;
							} else {
								var radlat1 = (Math.PI * lat1) / 180;
								var radlat2 = (Math.PI * lat2) / 180;
								var theta = lon1 - lon2;
								var radtheta = (Math.PI * theta) / 180;
								var dist =
									Math.sin(radlat1) * Math.sin(radlat2) +
									Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
								if (dist > 1) {
									dist = 1;
								}
								dist = Math.acos(dist);
								dist = (dist * 180) / Math.PI;
								dist = dist * 60 * 1.1515;
								if (unit == "K") {
									dist = dist * 1.609344;
								}
								if (unit == "N") {
									dist = dist * 0.8684;
								}
								return dist;
							}
						}
						const dist = distance(
							req.body.start_lat,
							req.body.start_log,
							req.body.end_lat,
							req.body.end_log,
							"k"
						);
						// Assuming the cost is #200.00 per kilometer
						const amt = `#${Math.round(200.0 * dist)}`;
						console.log(amt);
						let data = {
							userId: req.params.id,
							busId: busAssigned.id,
							fare: amt,
							status: "processing",
							start_lat: req.body.start_lat,
							start_log: req.body.start_log,
							end_lat: req.body.end_lat,
							end_log: req.body.end_log,
							origin_loc: req.body.origin_loc,
							dest_loc: req.body.dest_loc,
						};
						let sql = "INSERT INTO ride set ?";
						pool.query(sql, data, (err, result) => {
							err &&
								res.status(status.error).json({ err: err }) &&
								console.log(err);
							res
								.status(status.success)
								.json({ msg: "Ride successfully requested", result });
						});
					});
				}
			}
		);
	} catch (err) {
		errorMessage.error = "An error occurred";
		res.status(status.error).json(errorMessage);
	}
};

/**
 * cancelRequestedRide
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const cancel = async (req, res) => {
	// rideId
	const id = req.params.id;
	console.log(id);
	await pool.query(`SELECT * FROM ride WHERE id = '${id}'`, (err, result) => {
		err && res.status(status.error).json({ err: err }) && console.log(err);
		const user = result[0].userId;
		// console.log(user);
		if (user) {
			console.log(user);
			pool.query(`DELETE FROM ride WHERE id = '${id}'`, (err, result) => {
				err && res.status(status.error).json({ err: err }) && console.log(err);
				res
					.status(status.success)
					.json({ msg: "Ride was successfully canceled!", result });
			});
		}
	});
};

/** NEEDS FOCUS ON AUTHORISATION
 * updateRideDestination
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const updateRide = async (req, res) => {
	if (
		empty(req.params.id) ||
		empty(req.body.end_lat) ||
		empty(req.body.end_log) ||
		empty(req.body.origin_loc) ||
		empty(req.body.dest_loc)
	) {
		errorMessage.error = "Destination coordinates or addresses are required";
		return res.status(status.bad).json(errorMessage);
	}
	await pool.query(
		`SELECT * FROM ride WHERE id = '${req.params.id}'`,
		(err, result) => {
			err && res.status(status.error).json({ err: err }) && console.log(err);
			// REMEMBER TO AUTHENTICATE IF PASS req.user.id = reqsult[0].userId
			if (result[0].userId.length != "") {
				const sql = `UPDATE ride SET end_lat = '${req.body.end_lat}', end_log = '${req.body.end_log}', origin_loc = '${req.body.origin_loc}', dest_loc = '${req.body.dest_loc}' WHERE id = ${req.params.id}`;
				pool.query(sql, (err, result) => {
					err &&
						res.status(status.error).json({ err: err }) &&
						console.log(err);
					res
						.status(status.success)
						.json({ msg: "Ride destinations updated successfully" });
				});
			}
		}
	);
};

/**
 * checkDriverComeTiming
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

const checkDriverTime = async (req, res) => {
	if (empty(req.body.start_lat) || empty(req.body.start_log)) {
		errorMessage.error = "Coordinates or addresses are required";
		return res.status(status.bad).json(errorMessage);
	}
	function distance(lat1, lon1, lat2, lon2, unit) {
		var radlat1 = (Math.PI * lat1) / 180;
		var radlat2 = (Math.PI * lat2) / 180;
		var theta = lon1 - lon2;
		var radtheta = (Math.PI * theta) / 180;
		var dist =
			Math.sin(radlat1) * Math.sin(radlat2) +
			Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = (dist * 180) / Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit == "K") {
			dist = dist * 1.609344;
		}
		if (unit == "N") {
			dist = dist * 0.8684;
		}
		return Math.floor(dist);
	}
	var datalist;
	var value = [];
	var poslat = req.body.start_lat;
	var poslng = req.body.start_log;
	await pool.query("SELECT * FROM ambulance", (err, result) => {
		err && res.status(status.error).json({ err: err }) && console.log(err);
		datalist = result;
		for (var i = 0; i < datalist.length; i++) {
			if (datalist[i].isAvailable) {
				value.push(
					parseInt(
						distance(poslat, poslng, datalist[i].lat, datalist[i].log, "K")
					)
				);
			} else {
				res.status().json({
					msg: "Please wait for a while, no available ambulance at the moment.",
				});
			}
		}
		var busAssigned = datalist.find(
			(item) => item.id > value.indexOf(Math.min(...value))
		);
		function distance(lat1, lon1, lat2, lon2, unit) {
			if (lat1 == lat2 && lon1 == lon2) {
				return 0;
			} else {
				var radlat1 = (Math.PI * lat1) / 180;
				var radlat2 = (Math.PI * lat2) / 180;
				var theta = lon1 - lon2;
				var radtheta = (Math.PI * theta) / 180;
				var dist =
					Math.sin(radlat1) * Math.sin(radlat2) +
					Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
				if (dist > 1) {
					dist = 1;
				}
				dist = Math.acos(dist);
				dist = (dist * 180) / Math.PI;
				dist = dist * 60 * 1.1515;
				if (unit == "K") {
					dist = dist * 1.609344;
				}
				if (unit == "N") {
					dist = dist * 0.8684;
				}
				return dist;
			}
		}
		const dist = distance(
			busAssigned.lat,
			busAssigned.log,
			req.body.start_lat,
			req.body.start_log,
			"k"
		);
		// Assuming the time taken to complete 1 kilometer is 30minutes
		// Convert minutes to hour to calculate time to reach a destination
		const time = dist * 0.5;
		if (time != "") {
			res.status(status.success).json({ msg: time });
		} else {
			errorMessage.error = "Error Occured";
			return res.status(status.bad).json(errorMessage);
		}
	});
};

/**
 * estimateRideCost
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

const estimateCost = (req, res) => {
	if (
		empty(req.body.end_lat) ||
		empty(req.body.end_log) ||
		empty(req.body.origin_loc) ||
		empty(req.body.dest_loc)
	) {
		errorMessage.error = "Destination coordinates or addresses are required";
		return res.status(status.bad).json(errorMessage);
	}
	function distance(lat1, lon1, lat2, lon2, unit) {
		if (lat1 == lat2 && lon1 == lon2) {
			return 0;
		} else {
			var radlat1 = (Math.PI * lat1) / 180;
			var radlat2 = (Math.PI * lat2) / 180;
			var theta = lon1 - lon2;
			var radtheta = (Math.PI * theta) / 180;
			var dist =
				Math.sin(radlat1) * Math.sin(radlat2) +
				Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			if (dist > 1) {
				dist = 1;
			}
			dist = Math.acos(dist);
			dist = (dist * 180) / Math.PI;
			dist = dist * 60 * 1.1515;
			if (unit == "K") {
				dist = dist * 1.609344;
			}
			if (unit == "N") {
				dist = dist * 0.8684;
			}
			return dist;
		}
	}
	const dist = distance(
		req.body.start_lat,
		req.body.start_log,
		req.body.end_lat,
		req.body.end_log,
		"k"
	);
	// Assuming the cost is #200.00 per kilometer and amount is in naira
	const amt = Math.round(200.0 * dist);
	res.status(status.success).json({ msg: amt });
};

/**
 * getMySingleRide
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

const singleRide = async (req, res) => {
	if (empty(req.params.id)) {
		errorMessage.error = "Ride Id params is required!";
		return res.status(status.bad).json(errorMessage);
	}
	const sql = `SELECT * FROM ride WHERE id = '${req.params.id}'`;
	await pool.query(sql, (err, result) => {
		err && res.status(status.error).json({ err: err }) && console.log(err);
		res.status(status.success).json({ msg: result[0] });
	});
};

/**
 * getMySingleRide
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const getRides = async (req, res) => {
	if (empty(req.params.id)) {
		errorMessage.error = "Ride Id params is required!";
		return res.status(status.bad).json(errorMessage);
	}
	const sql = `SELECT * FROM ride WHERE userId = '${req.params.id}'`;
	await pool.query(sql, (err, result) => {
		err && res.status(status.error).json({ err: err }) && console.log(err);
		if (result.length) {
			res.status(status.success).json({ msg: result });
		} else {
			res
				.status(status.success)
				.json({ msg: "This user has not requested any ride!" });
		}
	});
};

/**
 *getNearbyAvailableDrivers
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

const getNearbyDriver = async (req, res) => {
	if (
		empty(req.body.start_lat) ||
		empty(req.body.start_log) ||
		empty(req.body.origin_loc)
	) {
		errorMessage.error = "Destination coordinates or addresses are required";
		return res.status(status.bad).json(errorMessage);
	}

	function distance(lat1, lon1, lat2, lon2, unit) {
		var radlat1 = (Math.PI * lat1) / 180;
		var radlat2 = (Math.PI * lat2) / 180;
		var theta = lon1 - lon2;
		var radtheta = (Math.PI * theta) / 180;
		var dist =
			Math.sin(radlat1) * Math.sin(radlat2) +
			Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = (dist * 180) / Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit == "K") {
			dist = dist * 1.609344;
		}
		if (unit == "N") {
			dist = dist * 0.8684;
		}
		return Math.floor(dist);
	}
	var datalist;
	var value = [];
	var poslat = req.body.start_lat;
	var poslng = req.body.start_log;
	await pool.query("SELECT * FROM ambulance", (err, result) => {
		err && res.status(status.error).json({ err: err }) && console.log(err);
		datalist = result;
		for (var i = 0; i < datalist.length; i++) {
			if (datalist[i].isAvailable) {
				value.push(
					parseInt(
						distance(poslat, poslng, datalist[i].lat, datalist[i].log, "K")
					)
				);
			} else {
				res.status().json({
					msg: "Please wait for a while, no available ambulance at the moment.",
				});
			}
		}
		var busAssigned = datalist.find(
			(item) => item.id > value.indexOf(Math.min(...value))
		);
		if (busAssigned) {
			res.status(status.success).json({ msg: busAssigned });
		} else {
			result.status(status.nocontent).json({ msg: "No bus assigned!" });
		}
	});
};

export {
	addRide,
	createRide,
	cancel,
	updateRide,
	checkDriverTime,
	estimateCost,
	singleRide,
	getRides,
	getNearbyDriver,
};
