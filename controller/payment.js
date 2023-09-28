import pool from "../config/db.js";
import bcrypt, { genSalt } from "bcrypt";
import jwt from "jsonwebtoken";
import Paystack from "paystack";
import { paymentDetails } from "../model/payment.js";
import { status } from "../helper/status.js";
import dotenv from "dotenv";
dotenv.config();
const paystack = Paystack("sk_test_c0523d1fb2ab0b4e0c299ccefa70a7c7a63deadc");
/**
 * CREATE PAYMENT TABLE
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const createPayment = (req, res) => {
	pool.query(paymentDetails, (err, result) => {
		// Handle the error
		err && res.status(status.error).json({ msg: err }) && console.log(err);
		res
			.status(status.success)
			.json({ msg: "User payment details table created successfully!!!" });
	});
};

/**
 * Create Paystack payment processing API
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */

// Create payment plan
const payment_plans = {
	monthly: {
		basic: {
			price: 10000,
			desc: "A simple start for everyone",
		},
		standard: {
			price: 20000,
			desc: "For small to medium businesses",
		},
		enterprise: {
			price: 49900,
			desc: "Solution for big organizations",
		},
	},
	annually: {
		basic: {
			price: 20000,
			desc: "A simple start for everyone",
		},
		standard: {
			price: 40000,
			desc: "For small to medium businesses",
		},
		enterprise: {
			price: 90000,
			desc: "Solution for big organizations",
		},
	},
};

const initialisePayment = async (req, res) => {
	const userId = req.params.id;
	const { payment_plan, plan_type, email, first_name, last_name } = req.body;
	console.log({ body: req.body });
	await pool.query(
		`SELECT * FROM payment WHERE userId = ${userId}`,
		(err, result) => {
			if (err) {
				return res.status(status.bad).json({ error: err });
			} else {
				if (result.length == 0) {
					// res
					// 	.status(status.success)
					// 	.json({ msg: "You can create or initialise the payment..." });
					paystack.customer.create(
						{
							email: email,
							first_name: first_name,
							last_name: last_name,
							phone: null,
						},
						function (err, result) {
							if (err) {
								// Handle error
								console.log(err);
								// return
							}
							console.log("customer created", result);
							console.log({
								description: payment_plans[plan_type][payment_plan]["price"],
							});
							paystack.plan.create(
								{
									name: `${plan_type} Subscription`,
									description: payment_plans[plan_type][payment_plan]["desc"],
									amount: payment_plans[plan_type][payment_plan]["price"],
									interval: plan_type,
								},
								function (err, plan) {
									if (err) {
										console.log(err);
									}
									// Log plan details
									console.log("Plan created", plan);

									paystack.transaction.initialize(
										{
											email: email,
											amount: payment_plans[plan_type][payment_plan]["price"],
											callback_url: "http://localhost:3000/api/v1/callback",
											plan: plan.data.plan_code,
										},
										async function (err, body) {
											if (err) {
												console.log({ "Initialisation Error": err });
											}
											var authorization_code = body.data.authorization_code;
											var authorization_url = body.data.authorization_url;
											var access_code = body.data.access_code;
											console.log({
												auth_url: authorization_url,
												access_code: access_code,
												auth_code: authorization_code,
												body: body,
											});
											// INSERT THE REQUIRED FIELD INTO THE DATABASE
											let data = {
												userId: userId,
												plan: payment_plan,
												plan_code: plan.data.plan_code,
												inter_val: plan.data.interval,
												amount: plan.data.amount,
												currency: plan.data.currency,
												phone_number: result.data.phone,
												name: result.data.first_name + result.data.last_name,
												reference: body.data.reference,
												email: result.data.email,
											};
											console.log(data);
											let sql = "INSERT INTO payment SET ?";
											await pool.query(sql, data, (err, result) => {
												if (err) {
													return res.json({ err: err }) && console.log(err);
												}
												console.log({ msg: result });
											});
											res.status(status.success).json(body);
										}
									);
								}
							);
						}
					);
				} else if (result.length > 0 && result[0].status != "success") {
					paystack.transaction.initialize(
						{
							email: email,
							amount: payment_plans[plan_type][payment_plan]["price"],
							callback_url: "http://localhost:3000/api/v1/callback",
						},
						async function (err, body) {
							if (err) {
								console.log({ "Initialisation Error": err });
							}
							var authorization_code = body.data.authorization_code;
							var authorization_url = body.data.authorization_url;
							var access_code = body.data.access_code;
							console.log({
								auth_url: authorization_url,
								access_code: access_code,
								auth_code: authorization_code,
								body: body,
							});
							// INSERT THE REQUIRED FIELD INTO THE DATABASE
							let data = {
								plan: payment_plan,
								inter_val: plan_type,
								amount: payment_plans[plan_type][payment_plan]["price"],
								name: first_name + last_name,
								reference: body.data.reference,
								email: email,
							};
							console.log(data);
							let sql = `UPDATE payment SET ? WHERE userId = ${userId}`;
							await pool.query(sql, data, (err, result) => {
								if (err) {
									return res.json({ err: err }) && console.log(err);
								}
								console.log({ msg: result });
							});
							res.status(status.success).json(body);
						}
					);
				} else {
					res.status(status.bad).json({
						error:
							"You have already initialized the payment, you can proceed to upgrade your plan",
					});
				}
				console.log(result.length);
			}
		}
	);
};

const callBack = async (req, res) => {
	try {
		await paystack.transaction.verify(
			req.query.reference,
			async function (err, body) {
				if (err) {
					console.log(err);
					return res.status(status.error).json({ msg: err });
				}
				const data = {
					transaction_id: body.data.id,
					status: body.data.status,
					pay_type: body.data.authorization.channel,
					last4: body.data.authorization.last4,
					exp_month: body.data.authorization.exp_month,
					exp_year: body.data.authorization.exp_year,
				};
				console.log(data);
				console.log(body);
				await pool.query(
					`UPDATE payment SET transaction_id = '${body.data.id}', status = '${body.data.status}', pay_type = '${body.data.authorization.channel}', last4 = '${body.data.authorization.last4}', exp_month = '${body.data.authorization.exp_month}', exp_year = '${body.data.authorization.exp_year}' WHERE reference = '${req.query.reference}'`,
					(err, result) => {
						if (err) {
							return res.status(status.error).json({ msg: err });
						}
						console.log({ msg: result });
						// res.status(status.success).json({ msg: "Payment Verified!" });
						if (process.env.redirect_url) {
							res.redirect(process.env.redirect_url);
						} else {
							res.status(status.success).json({ msg: "Payment Verified!" });
						}
					}
				);
			}
		);
	} catch (err) {
		console.log(err);
		res.status(status.bad).json({ error: err });
	}
};

/**
 * Cancel subscription
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const cancelSubscription = async (req, res) => {
	const { planId } = req.body;
	try {
		paystack.subscription.list(async (err, subscriptions) => {
			if (err) {
				console.error(err);
				return res.status(status.bad).json({ error: err });
			}

			if (subscriptions.data.length === 0) {
				console.log(subscriptions);
				return res.status(status.bad).json({ error: "Subscription not found" });
			}
			// console.log(subscriptions.data);
			const subscription = await subscriptions.data.find(
				(sub) => sub.plan.plan_code === planId
			);
			if (subscription) {
				const code = subscription.subscription_code;
				const token = subscription.email_token;
				console.log({ code: code, token: token });
				await paystack.subscription.disable(
					{ code: code, token: token },
					(err, result) => {
						if (err) {
							console.error(err);
							return res.status(status.bad).json({ error: err });
						} else {
							return res.status(status.success).json({ msg: result });
						}
					}
				);
			} else {
				res.status(status.bad).json({ error: "No subscription found" });
			}
		});
	} catch (err) {
		console.error(err);
		return res.status(status.bad).json({ error: err });
	}
};

// list subcription plan
const listSubscription = async (req, res) => {
	try {
		await paystack.subscription.list((err, result) => {
			err && console.log(err);
			res.status(status.success).json({ msg: result });
		});
	} catch (err) {
		console.log(err);
	}
};

// Update subscription plan
const updatePlan = async (req, res) => {
	const userId = req.params.id;
	const { payment_plan, plan_type, email, planId } = req.body;
	try {
		paystack.plan.create(
			{
				name: `${plan_type} Subscription`,
				description: payment_plans[plan_type][payment_plan]["desc"],
				amount: payment_plans[plan_type][payment_plan]["price"],
				interval: plan_type,
			},
			function (err, plan) {
				if (err) {
					console.log(err);
				}
				// Log plan details
				console.log("Plan created", plan);
				paystack.subscription.list(async function (error, subscriptions) {
					if (error) {
						console.error(error);
						return res.status(status.bad).json({ error: err });
					}

					const subscription = await subscriptions.data.find(
						(sub) => sub.plan.plan_code === planId
					);

					console.log(subscription);
					if (subscription) {
						const code = subscription.subscription_code;
						const token = subscription.email_token;
						console.log({ code: code, token: token });
						await paystack.subscription.disable(
							{ code: code, token: token },
							(err, result) => {
								if (err) {
									console.error(err);
									return res.status(status.bad).json({ error: err });
								} else {
									paystack.transaction.initialize(
										{
											email: email,
											amount: payment_plans[plan_type][payment_plan]["price"],
											callback_url: "http://localhost:3000/api/v1/callback",
										},
										async function (err, body) {
											if (err) {
												console.log({ "Initialisation Error": err });
											}
											var authorization_code = body.data.authorization_code;
											var authorization_url = body.data.authorization_url;
											var access_code = body.data.access_code;
											console.log({
												auth_url: authorization_url,
												access_code: access_code,
												auth_code: authorization_code,
												body: body,
											});
											// INSERT THE REQUIRED FIELD INTO THE DATABASE
											let data = {
												plan: payment_plan,
												inter_val: plan_type,
												amount: payment_plans[plan_type][payment_plan]["price"],
												reference: body.data.reference,
												email: email,
											};
											console.log(data);
											let sql = `UPDATE payment SET ? WHERE userId = ${userId}`;
											await pool.query(sql, data, (err, result) => {
												if (err) {
													return res.json({ err: err }) && console.log(err);
												}
												console.log({ msg: result });
											});
											res.status(status.success).json(body);
										}
									);
								}
							}
						);
					} else {
						res.status(status.bad).json({
							error:
								"No subscription found yet, subscribe to any of our plans.",
						});
					}
				});
			}
		);
	} catch (err) {
		res.status(status.bad).json({ error: err });
	}
};

// Check whether user has already subscribed to any payment plans before
const isSubscribed = async (req, res) => {
	const userId = req.params.id;
	// const { planId } = req.body;
	// Check if user Id is already in the payment database
	await pool.query(
		`SELECT * FROM payment WHERE userId = ${userId}`,
		async (err, result) => {
			err && res.status(status.bad).json({ error: err });
			if (result.length > 0) {
				// await paystack.subscription.list((error, subscriptions) => {
				// 	const subscription = subscriptions.data.find(
				// 		(sub) => sub.plan.plan_code === planId
				// 	);
				// 	if (subscription.status === "active") {
				// 		res
				// 			.status(status.success)
				// 			.json({
				// 				msg: "User has active subscription!",
				// 				subscription: true,
				// 			});
				// 	}
				// });
				if (result[0].status === "success") {
					res.status(status.success).json({ msg: result, subscription: true });
				} else {
					res
						.status(402)
						.json({ msg: "Proceed to subscribe...", subscription: false });
				}
			} else {
				res
					.status(status.success)
					.json({ msg: "User has no subscription yet", subscription: false });
			}
		}
	);
};
export {
	initialisePayment,
	callBack,
	createPayment,
	cancelSubscription,
	listSubscription,
	updatePlan,
	isSubscribed,
};
