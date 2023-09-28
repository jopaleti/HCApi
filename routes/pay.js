import express from "express";
const routes = express.Router();

import {
	callBack,
	initialisePayment,
	createPayment,
	cancelSubscription,
	listSubscription,
	updatePlan,
	isSubscribed,
} from "../controller/payment.js";

routes.get("/create-pay", createPayment);
routes.post("/initiate-transaction/:id", initialisePayment);
routes.post("/cancel-subscription", cancelSubscription);
routes.get("/callback", callBack);
routes.get("/list-sub", listSubscription);
routes.put("/upgrade/:id", updatePlan);
routes.get("/get-subscriber/:id", isSubscribed);

export default routes;
