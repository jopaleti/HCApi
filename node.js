// function distance(lat1, lon1, lat2, lon2, unit) {
// 	if (lat1 == lat2 && lon1 == lon2) {
// 		return 0;
// 	} else {
// 		var radlat1 = (Math.PI * lat1) / 180;
// 		var radlat2 = (Math.PI * lat2) / 180;
// 		var theta = lon1 - lon2;
// 		var radtheta = (Math.PI * theta) / 180;
// 		var dist =
// 			Math.sin(radlat1) * Math.sin(radlat2) +
// 			Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
// 		if (dist > 1) {
// 			dist = 1;
// 		}
// 		dist = Math.acos(dist);
// 		dist = (dist * 180) / Math.PI;
// 		dist = dist * 60 * 1.1515;
// 		if (unit == "K") {
// 			dist = dist * 1.609344;
// 		}
// 		if (unit == "N") {
// 			dist = dist * 0.8684;
// 		}
// 		return dist;
// 	}
// }

// console.log(distance(70, 60, 50, 80, "K"));

// function distance(lat1, lon1, lat2, lon2, unit) {
// 	var radlat1 = (Math.PI * lat1) / 180;
// 	var radlat2 = (Math.PI * lat2) / 180;
// 	var theta = lon1 - lon2;
// 	var radtheta = (Math.PI * theta) / 180;
// 	var dist =
// 		Math.sin(radlat1) * Math.sin(radlat2) +
// 		Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
// 	if (dist > 1) {
// 		dist = 1;
// 	}
// 	dist = Math.acos(dist);
// 	dist = (dist * 180) / Math.PI;
// 	dist = dist * 60 * 1.1515;
// 	if (unit == "K") {
// 		dist = dist * 1.609344;
// 	}
// 	if (unit == "N") {
// 		dist = dist * 0.8684;
// 	}
// 	return Math.floor(dist);
// }

// // console.log(
// // 	distance(1.28210155945393, 103.81722480263163, 4.66455174, -74.07867091)
// // );
// var data = [
// 	{
// 		id: "1",
// 		lat: "4.66455174",
// 		lng: "-74.07867091",
// 		name: "Bogot\u00e1",
// 		isAvailable: true,
// 	},
// 	{
// 		id: "2",
// 		lat: "6.24478548",
// 		lng: "-75.57050110",
// 		name: "Medell\u00edn",
// 		isAvailable: true,
// 	},
// 	{
// 		id: "3",
// 		lat: "7.06125013",
// 		lng: "-73.84928550",
// 		name: "Barrancabermeja",
// 		isAvailable: true,
// 	},
// 	{
// 		id: "4",
// 		lat: "7.88475514",
// 		lng: "-72.49432589",
// 		name: "C\u00facuta",
// 		isAvailable: false,
// 	},
// 	{
// 		id: "5",
// 		lat: "3.48835279",
// 		lng: "-76.51532198",
// 		name: "Cali",
// 		isAvailable: true,
// 	},
// 	{
// 		id: "6",
// 		lat: "4.13510880",
// 		lng: "-73.63690401",
// 		name: "Villavicencio",
// 		isAvailable: true,
// 	},
// 	{
// 		id: "7",
// 		lat: "6.55526689",
// 		lng: "-73.13373892",
// 		name: "San Gil",
// 		isAvailable: false,
// 	},
// ];
// var value = [];
// for (var i = 0; i < data.length; i++) {
// 	if (data[i].isAvailable) {
// 		value.push(
// 			parseInt(
// 				distance(
// 					1.28210155945393,
// 					103.81722480263163,
// 					data[i].lat,
// 					data[i].lng,
// 					"K"
// 				)
// 			)
// 		);
// 	}
// }
// console.log(value);
// console.log(value, Math.min(...value));
// console.log(value.indexOf(Math.min(...value)));
// console.log(data.find((item) => item.id > value.indexOf(Math.min(...value))));

var poslat = 1.28210155945393;
var poslng = 103.81722480263163;

// for (var i = 0; i < data.length; i++) {
// 	// if this location is within 0.1KM of the user, add it to the list
// 	if (distance(poslat, poslng, data[i].lat, data[i].lng, "K") <= 0.1) {
// 		html += "<p>" + data[i].location + " - " + data[i].code + "</p>";
// 	}
// }

// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
// 	host: "smtp.mailtrap.io",
// 	port: 2525,
// 	auth: {
// 		user: "37f30d42ab3d4d",
// 		pass: "8b7707842d2b97",
// 	},
// });
// // var transporter = nodemailer.createTransport({
// // 	service: "gmail",
// // 	auth: {
// // 		// type: "OAuth2",
// // 		user: "segunopaleti@gmail.com",
// // 		pass: "segun1234##",
// // 		// clientId:
// // 		// "36936988944-oa8c3mrfbrc804rt1d0hqpurk02e16u0.apps.googleusercontent.com",
// // 		// clientSecret: "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",
// // 		// refreshToken: process.env.OAUTH_REFRESH_TOKEN,
// // 	},
// // });

// var link = "http://localhost:3000/api/v1/users";
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

// import bcrypt, { genSalt } from "bcrypt";
// const salt = bcrypt.genSaltSync(10);
// console.log(bcrypt.hashSync("581483", salt));
// console.log(
// 	bcrypt.compareSync(
// 		"565106",
// 		"$2b$10$.r/oP.EQjt.V8EsOEIUWJOBoEzuGyQas7TQBaZoQWVM/MqFvh1B3S"
// 	)
// );
// $2b$10$XiRWiTqwAt3fw.kgOoKYveYll33e0rue.p.e5m4Yepirs2pmsfw9.

import Paystack from "paystack";

const paystack = Paystack("sk_test_ef2c016439662d6d9274ba3cc804258d31231693");

// Paystack testing api code for accepting payment with card and subscription

// paystack.customer.list(function (error, body) {
// 	console.log(error);
// 	console.log(body);
// });

// async function cardPayment() {
// 	const plan = {
// 		name: "API test code",
// 		description: "Your Plan Description",
// 		amount: amount * 100, // Convert amount to kobo
// 		interval: "monthly", // or "weekly", "annually"
// 		send_invoices: true,
// 		send_sms: true,
// 		currency: "NGN",
// 	};
// }

/**
 * Create Paystack payment processing API
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
// const customer = {
// 	email: "samuelyjiojieifus@gmail.com",
// 	first_name: "Oloijwolade",
// 	last_name: "Babalola",
// 	phone: "09108603111",
// };
// paystack.customer.create(customer).then((res) => {
// 	console.log(res);
// 	const card = {
// 		card: {
// 			number: "5399837841116788", // mastercard
// 			cvv: "324",
// 			expiry_year: "2024",
// 			expiry_month: "08",
// 		},
// 		amount: 300000 * 1000, // 156,000 Naira in kobo
// 	};
// 	paystack.transaction
// 		.initialize(card)
// 		.then((res) => console.log(res))
// 		.catch((err) => console.log(err));
// });
/** 
Create a customer, plan and chard card in paystack
**/

// paystack.customer.create(
// 	{
// 		email: "customer67@gmail.com",
// 		first_name: "John",
// 		last_name: "Doe",
// 		phone: "123456789",
// 	},
// 	function (err, result) {
// 		if (err) {
// 			// Handle error
// 			console.log(err);
// 			// return
// 		}
// 		console.log("customer created", result);
// 		paystack.plan.create(
// 			{
// 				name: "Monthly Subscription",
// 				description: "A monthly subscription plan",
// 				amount: "20000",
// 				interval: "monthly",
// 			},
// 			function (err, plan) {
// 				if (err) {
// 					console.log(err);
// 				}
// 				// Log plan details
// 				console.log("Plan created", plan);

// 				paystack.transaction.initialize(
// 					{
// 						email: "customer67@gmail.com",
// 						amount: "1000",
// 						callback_url: "https://localhost:3000/paystack/callback",
// 					},
// 					async function (err, body) {
// 						if (err) {
// 							console.log({ "Initialisation Error": err });
// 						}
// 						var authorization_code = body.data.authorization_code;
// 						var authorization_url = body.data.authorization_url;
// 						var access_code = body.data.access_code;
// 						console.log({
// 							auth_url: authorization_url,
// 							access_code: access_code,
// 							auth_code: authorization_code,
// 							body: body,
// 						});
// 						await paystack.transaction.charge(
// 							{
// 								authorization_code: authorization_code,
// 								amount: plan.amount,
// 								email: plan.email,
// 								plan: plan.plan_code,
// 								card: {
// 									number: "5399837841116788",
// 									cvv: "324",
// 									expiry_month: "08",
// 									expiry_year: "2024",
// 								},
// 							},
// 							function (err, transaction) {
// 								if (err) {
// 									// Handle error
// 									console.log(err);
// 									console.log("Unable to create transaction");
// 								}
// 								// Log transaction
// 								console.log(transaction);
// 							}
// 						);
// 					}
// 				);
// 				// Charge the customer's card for the first time
// 				// paystack.transaction.initialize(
// 				// 	{
// 				// 		amount: "1000",
// 				// 		email: "customer67@gmail.com",
// 				// 		plan: plan.plan_code,
// 				// 		card: {
// 				// 			number: "5399837841116788",
// 				// 			cvv: "324",
// 				// 			expiry_month: "08",
// 				// 			expiry_year: "2024",
// 				// 		},
// 				// 	},
// 				// 	function (err, transaction) {
// 				// 		if (err) {
// 				// 			// Handle error
// 				// 			console.log(err);
// 				// 			console.log("Unable to create transaction");
// 				// 		}
// 				// 		// Log transaction
// 				// 		console.log(transaction);
// 				// 		console.log('Transaction created!!!')
// 				// 	}
// 				// );
// 			}
// 		);
// 	}
// );

// Javascript code to get user Geolocation information
// const getUserCountryName = () => {
// 	// Check if geolocation API is supported
// 	if ("geolocation" in navigator) {
// 		navigator.geolocation.getCurrentPosition((position) => {
// 			const latitude = position.coords.latitude;
// 			const longitude = position.coords.longitude;
// 			// Logging the coordinate out
// 			console.log({ lat: latitude, long: longitude });
// 			// Make a request to a reverse geocoding service
// 			fetch(
// 				`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}$localityLanguage=en`
// 			)
// 				.then((response) => response.json())
// 				.then((data) => {
// 					console.log("User country: ", data.countryName);
//                     console.log({data: data});
// 				})
// 				.catch((error) => {
// 					console.log("Error: ", error);
// 				});
// 		});
// 	} else {
// 		console.log(
// 			"Geolocation is not supported is not supported by this browser..."
// 		);
// 	}
// };

// getUserCountryName();
