import pool from "../config/db.js";
import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { users } from "../model/user.js";
import { otpModel } from "../model/otpModel.js";
import sgMail from "@sendgrid/mail";
// import { JWT_SECRET } from "../config/index.js";
import nodemailer from "nodemailer";
dotenv.config();
import {
	hashPassword,
	comparePassword,
	isValidEmail,
	validatePassword,
	isEmpty,
	generateUserToken,
} from "../helper/validation.js";
import { errorMessage, successMessage, status } from "../helper/status.js";
// Configuring sgMail

/**
 * Create User Table in a database || Add user to the database
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const createUser = (req, res) => {
	pool.query(users, (err, result) => {
		err && res.status(status.error).json({ err: err }) && console.log(err);
		res.status(status.success).json({ msg: "User table created successfully" });
	});
};

/**
 * Create OTP Table in a database || Add user to the database
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

const createOtp = (req, res) => {
	pool.query(otpModel, (err, result) => {
		err && res.status(status.error).json({ err: err }) && console.log(err);
		res.status(status.success).json({ msg: "OTP table created successfully" });
	});
};

/**
 * Create User in a database || Add user to the database
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const salt = bcrypt.genSaltSync(10);
const register = async (req, res) => {
	const { username, email, password, confirm_password } = req.body;
	if (
		isEmpty(username) ||
		isEmpty(email) ||
		isEmpty(password) ||
		isEmpty(confirm_password)
	) {
		errorMessage.error =
			"username, email, password, and confirm_password cannot be empty";
		return res.status(status.bad).send(errorMessage);
	}
	if (password != confirm_password) {
		errorMessage.error = "password and confirm_password must be the same";
		return res.status(status.bad).send(errorMessage);
	}
	try {
		req.body.password = bcrypt.hashSync(req.body.password, salt);
		req.body.confirm_password = bcrypt.hashSync(
			req.body.confirm_password,
			salt
		);
		let user = req.body;
		console.log(user);
		let sql = "INSERT INTO users SET ?";
		pool.query(
			`SELECT * FROM users WHERE email = '${email}'`,
			(err, result) => {
				err && res.json({ err: err }) && console.log(err);
				if (result != "") {
					return res
						.status(409)
						.json({ msg: "User with that email already existed!" });
				}
				pool.query(sql, user, (err, result) => {
					err && res.json({ err: err }) && console.log(err);
					// Testing by logging out the user result
					console.log(result.insertId);
					const data = {
						id: result.insertId,
						email: email,
					};
					// console.log(data);
					sendOtpVerificationEmail(data, res);
					res.status(200).json({ msg: "User created successfully" });
				});
				console.log(result);
			}
		);
	} catch (err) {
		console.log(err);
	}
};

/**
 * User login
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const login = async (req, res) => {
	const { email } = req.body;
	const sql = `SELECT * FROM users WHERE email = '${email}'`;
	await pool.query(sql, (err, result) => {
		err && result.status(400).json({ msg: err });
		if (result.length > 0) {
			for (var i = 0; i < result.length; i++) {
				const isPassCorrect = bcrypt.compareSync(
					req.body.password,
					result[i].password
				);
				// Getting first_name and last_name algorithm
				const user_name = result[i].username;
				const sName = user_name.split(" ");
				const first_name = sName[0];
				const last_name = sName && sName[1] != undefined ? sName[1] : "";

				console.log(isPassCorrect);
				if (isPassCorrect) {
					const generateToken = jwt.sign(
						{
							id: result[i].id,
							name: result[i].username,
							email: result[i].email,
							verified: result[i].verified,
							date: result[i].reg_date,
							profile_link: result[i].profile,
							isAdmin: result[i].isAdmin,
						},
						process.env.JWT_SECRET,
						{ expiresIn: "3d" }
					);
					res.status(200).json({
						id: result[0].id,
						email: result[i].email,
						date: result[i].reg_date,
						profile_link: result[i].profile,
						isAdmin: result[i].isAdmin,
						first_name: first_name,
						last_name: last_name,
						accesstoken: generateToken,
					});
				} else {
					res.status(401).json({ msg: "Incorrect Password" });
				}
			}
		} else {
			res.status(404).json({ msg: "User not found" });
		}
	});
};

/**
 * Forget Password
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const forget = async (req, res) => {
	const { email } = req.body;
	if (isEmpty(email)) {
		errorMessage.error = "Email cannot be empty";
		return res.status(status.bad).send(errorMessage);
	}
	// res.send(email);
	const oldUser = `SELECT * FROM users WHERE email = '${email}'`;
	await pool.query(oldUser, (err, result) => {
		err && result.status(400).json({ msg: err });
		if (result.length > 0) {
			const secret = process.env.JWT_SECRET;
			const token = jwt.sign(
				{ email: result[0].email, id: result[0].id },
				secret,
				{
					expiresIn: "3d",
				}
			);
			// Create a forget password link
			const link = `http://localhost:3000/api/v1/reset-password/${result[0].id}/${token}`;
			// SENDING RESET LINK MAIL TO THE USER

			/*	// SENDGRID CONFIGURATION
			sgMail.setApiKey(process.env.SENDGRID_API_KEY);

			const msg = {
				to: "oopaletijohnson@gmail.com",
				from: "segunopaleti@gmail.com", // Use the email address or domain you verified above
				subject: "Hospital Connect Reset Password Link",
				text: "and easy to do anywhere, even with Node.js",
				html: `<a>${link}</a>`,
			};
			sgMail.send(msg).then(
				() => {
					console.log("Message sent successfully!!!");
				},
				(error) => {
					console.error(error);

					if (error.response) {
						console.error(error.response.body);
					}
				}
			);*/

			// var transporter = nodemailer.createTransport({
			// 	service: "gmail",
			// 	auth: {
			// 		user: "segunopaleti@gmail.com",
			// 		pass: "segun1234#",
			// 	},
			// });

			// var mailOptions = {
			// 	from: "segunopaleti@gmail.com",
			// 	to: "oopaletijohnson@gmail.com",
			// 	subject: "Serve Reset Password Link",
			// 	html: `<a>${link}</a>`,
			// };

			// transporter.sendMail(mailOptions, function (error, info) {
			// 	if (error) {
			// 		console.log(error);
			// 	} else {
			// 		console.log("Email sent: " + info.response);
			// 	}
			// });
			// console.log(link);
			res
				.status(status.success)
				.json("Reset link has been sent successfully to the email");
		} else {
			res.status(404).json({ msg: "User not found" });
		}
	});
};

/**
 * Reset password
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const reset = async (req, res) => {
	const { id } = req.params;
	const { current_password, password, confirm_password } = req.body;

	if (password != confirm_password) {
		errorMessage.error = "password and confirm_password must be the same";
		return res.status(status.bad).json(errorMessage);
	} else if (!current_password) {
		errorMessage.error = "Your last password is required!";
		return res.status(status.bad).json(errorMessage);
	}
	// const secret = process.env.JWT_SECRET;
	await pool.query(
		`SELECT * FROM users WHERE id = ${id}`,
		async (err, result) => {
			err && result.status(400).json({ error: err });
			console.log(result[0].confirm_password);
			var pass = await bcrypt.compare(
				current_password,
				result[0].confirm_password
			);
			console.log(pass);
			if (pass) {
				const encryptedPass = await bcrypt.hash(password, salt);
				console.log(password, encryptedPass);
				var data = {
					password: encryptedPass,
					confirm_password: encryptedPass,
				};
				const sql = `UPDATE users SET ? WHERE id = ${id}`;
				pool.query(sql, data, (err, result) => {
					err && res.status(400).json({ error: err });
					console.log(result);
					res.status(200).json({ msg: "Password updated successfully!" });
				});
			} else {
				res.status(400).json({ error: "Invalid current password!" });
			}
		}
	);
};

/**
 * Verify email address
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const verify = (req, res) => {};

/**
 * Send otp verification email
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const sendOtpVerificationEmail = async ({ id, email }, res) => {
	try {
		const otpGen = `${Math.floor(Math.random() * 900000)}`;
		console.log(otpGen);
		// Create Email Messages

		// Hash the OTP
		const date = new Date();
		const hashedOTP = bcrypt.hashSync(otpGen, salt);
		console.log(hashedOTP);
		const user = {
			userId: id,
			otp: hashedOTP,
			createdAt: date.getHours(),
			expiresAt: date.getHours() + 4,
		};
		let sql = "INSERT INTO otp SET ?";
		await pool.query(sql, user, (err, result) => {
			err && res.json({ err: err }) && console.log(err);
			// Testing by logging out the user result
			console.log(result);
			// res.status(200).json({ msg: "OTP saved successfully" });
		});

		// Send the email

		// res.status(200).json({
		// 	status: "pending",
		// 	msg: "Verification otp email sent successfully",
		// 	data: {
		// 		userId: id,
		// 		email,
		// 	},
		// });
	} catch (err) {
		res.json({
			status: "Failed",
			msg: err.message,
		});
		console.log(err);
	}
};

/**
 * Verify OTP sent
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const verifyOtp = async (req, res) => {
	try {
		const id = req.params.id;
		const otpSent = req.body.otp;
		console.log(otpSent);
		console.log(id);
		if (isEmpty(otpSent)) {
			errorMessage.error = "OTP code is neccessary!";
			return res.status(status.bad).send(errorMessage);
		}
		const sql = `SELECT * FROM otp WHERE userId = '${id}'`;
		await pool.query(sql, (err, result) => {
			err && result.status(400).json({ msg: err });
			console.log(result);
			if (result.length > 0) {
				const { expiresAt, otp } = result[0];
				console.log(expiresAt, otp);
				const date = new Date();
				if (expiresAt < date.getHours()) {
					pool.query(
						`DELETE * FROM otp WHERE userId = '${id}'`,
						(err, result) => {
							err && res.status(400).json({ msg: err });
							res

								.status(401)
								.json({ msg: "The code has expired. Please request again." });
						}
					);
				} else {
					const validOtp = bcrypt.compareSync(otpSent, otp);
					console.log(validOtp);
					// res
					// 	.status(200)
					// 	.send({ message: bcrypt.hashSync(`${otpSent}`, salt) });
					if (validOtp) {
						console.log("Yes sure!!!!!!!!!!!!!");
						pool.query(`UPDATE users SET verified = TRUE WHERE id = '${id}'`);
						// Delete the old OTP after user has successfully verified his account with his id.
						pool.query(
							`DELETE FROM otp WHERE userId = '${id}'`,
							(err, result) => {
								// err && res.status(400).json({ msg: err });
							}
						);
						res
							.status(200)
							.json({ msg: "Your account has been verified successfully." });
					} else {
						res
							.status(status.error)
							.json({ msg: "Wrong OTP, please enter a valid OTP." });
					}
				}
			} else {
				res.status(200).json({
					msg: "Account record cannot be found or has been verified already. Please sign up or login...",
				});
			}
		});
	} catch (err) {
		res.status(status.error).json({
			status: "Failed",
			msg: err.message,
		});
	}
};

/**
 * Finding user by id
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const getUser = async (req, res) => {
	const id = req.params.id;
	pool.query(`SELECT * FROM users WHERE id = '${id}'`, async (err, result) => {
		err && result.status(400).json({ msg: err });
		if (result) {
			// res.status(status.success).json(result)
			await pool.query(
				`SELECT * FROM users WHERE id = '${id}'`,
				(err, result) => {
					err && result.status(400).json({ msg: err });
					if (result) {
						res.status(status.success).json(result);
						console.log(result);
					}
				}
			);
		} else {
			res.status(status.error).json({ msg: "User not found" });
		}
	});
};

export {
	createUser,
	register,
	login,
	forget,
	reset,
	createOtp,
	verifyOtp,
	getUser,
};
