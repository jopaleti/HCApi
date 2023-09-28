import express from "express";
const routes = express.Router();

import {
	createUser,
	register,
	login,
	forget,
	reset,
	createOtp,
	verifyOtp,
	getUser,
} from "../controller/auth.js";
import { Authentication } from "../controller/authentication.js";
import { isAuth } from "../middleware/isAuth.js";

// Post route
routes.get("/create", createUser);
routes.post("/reset-password/:id/", reset);
routes.get("/create-otp", createOtp);
routes.post("/verifyotp/:id", verifyOtp);
routes.post("/register", register);
routes.post("/login", login);
routes.post("/forget", forget);
routes.get('/authentication/:id', Authentication)
routes.get("/users/:id", getUser);

export default routes;
