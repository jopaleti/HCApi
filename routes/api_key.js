import express from "express";
const routes = express.Router();

import {
	createApi_key,
	deleteApi_key,
	generateApi_key,
	getAPIKeys,
} from "../controller/api_key.js";
import { isAuth } from "../middleware/isAuth.js";

// Creating routes
routes.get("/create", isAuth, createApi_key);
routes.get("/get/:id", isAuth, getAPIKeys);
routes.post("/generate_key/:id", isAuth, generateApi_key);
routes.delete("/delete/:id", isAuth, deleteApi_key);

export default routes;
