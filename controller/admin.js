import pool from "../config/db.js";
import { errorMessage, successMessage, status } from "../helper/status.js";

/**
 *Getting all registered users
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

const getAllUsers = async (req, res) => {
	const sql = "SELECT * FROM users";
	try {
		pool.query(sql, (err, result) => {
			err && res.status(status.error).json({ err: err }) && console.log(err);
			res.status(status.success).json({ msg: result });
		});
	} catch (err) {
		res.status(status.error).json({ msg: err }) && console.log(err);
	}
};

/**
 *Delete users from the database
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

const deleteUser = (req, res) => {
	const userId = req.params.id;
	const sql = `DELETE FROM users WHERE id = '${userId}'`;
	try {
		pool.query(sql, (err, result) => {
			err && res.status(status.error).json({ err: err }) && console.log(err);
			res.status(status.success).json({ msg: "User deleted successfully!" });
		});
	} catch (err) {
		res.status(status.error).json({ msg: err }) && console.log(err);
	}
};

export { getAllUsers, deleteUser };
