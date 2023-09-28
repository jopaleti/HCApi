import pool from "../config/db.js";
import { status } from "../helper/status.js";
import { image } from "../model/image.js";

/**
 * Create Table for Images
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const createImage = (req, res) => {
	pool.query(image, (err, result) => {
		err && res.status(status.error).json({ error: err }) && console.log(err);
		res
			.status(status.success)
			.json({ msg: "Image table created successfully" });
	});
};

/**
 * Fetch image functional component
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const fetchImage = (req, res) => {
	const userId = req.params.id;
	pool.query(`SELECT * FROM images WHERE userId = ${userId}`, (err, result) => {
		err && res.status(status.error).json({ error: err }) && console.log(err);
		res
			.status(status.success)
			.json({ msg: result });
	});
};

export { createImage, fetchImage };
