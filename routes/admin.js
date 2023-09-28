import express from "express";
const routes = express.Router();

import { deleteUser, getAllUsers } from "../controller/admin.js";
import { isAdmin, isAuth } from "../middleware/isAuth.js";

// Authorised admin routes
routes.get("/users", isAuth, isAdmin, getAllUsers);
routes.delete("/delete/:id", isAuth, isAdmin, deleteUser);

export default routes;
