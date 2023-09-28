import pool from "../config/db.js";
import { api_key } from "../model/api_key.js";
import { api_keyGenerator } from "../config/generateKey.js";
import { errorMessage, successMessage, status } from "../helper/status.js";

/**
 * Create API_KEY Table in a database || Add api_key to the database
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

const createApi_key = (req, res) => {
	pool.query(api_key, (err, result) => {
		err && res.status(status.error).json({ msg: err }) && console.log(err);
		res
			.status(status.success)
			.json({ msg: "API KEY table created successfully!" });
	});
};

/**
 * Creating api key route
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

const generateApi_key = async (req, res) => {
	const userId = req.params.id;
	const { access, api_name } = req.body;
	// API key generator algorithm
	const apiKey = api_keyGenerator();
	await pool.query(
		`INSERT INTO api_key SET userId = '${userId}', api_name = '${api_name}', access = '${access}', api_keys = '${apiKey}'`,
		(err, result) => {
			err && res.status(status.error).json({ msg: err }) && console.log(err);
			pool.query(
				`SELECT * FROM api_key WHERE userId = ${userId}`,
				(err, result) => {
					err &&
						res.status(status.error).json({ msg: err }) &&
						console.log(err);
					return res.status(status.success).json({
						msg: "API keys added successfully!",
						data: result,
					});
				}
			);
		}
	);
};
/**
 * Get all API keys
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const getAPIKeys = async (req, res) => {
	const userId = req.params.id;
	await pool.query(
		`SELECT * FROM api_key WHERE userId = ${userId}`,
		async (err, result) => {
			err && res.status(status.error).json({ msg: err }) && console.log(err);
			if (result.length > 0) {
				pool.query(
					`SELECT * FROM api_key WHERE userId = ${userId}`,
					(err, result) => {
						err &&
							res.status(status.error).json({ msg: err }) &&
							console.log(err);
						return res.status(status.success).json({
							msg: "API keys added successfully!",
							data: result,
						});
					}
				);
			} else {
				res.status(401).json({ msg: "No API keys!!!" });
			}
		}
	);
};
/**
 * Deleting api keys
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const deleteApi_key = async (req, res) => {
	const userId = req.params.id;
	await pool.query(
		`DELETE FROM api_key WHERE id = '${userId}'`,
		(err, result) => {
			err && res.status(status.error).json({ err: err }) && console.log(err);
			pool.query(
				`SELECT * FROM api_key WHERE userId = ${userId}`,
				(err, result) => {
					return res.status(status.success).json({
						msg: "API keys deleted successfully!",
						data: result,
					});
				}
			);
		}
	);
};

export { createApi_key, generateApi_key, deleteApi_key, getAPIKeys };
