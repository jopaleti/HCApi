import express from "express";
import pool from "./config/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/auth.js";
import router from "./routes/bus.js";
import { default as rideRouter } from "./routes/ride.js";
import { default as payRouter } from "./routes/pay.js";
import { default as apiRouter } from "./routes/api_key.js";
import { default as adminRouter } from "./routes/admin.js";
import path from "path";
import uploadRouter from "./routes/upload.js";
import imageRouter from "./routes/image.js";
// Connect database
pool.getConnection((err) => {
	err ? console.log(err) : console.log("Mysql connected successfully...");
});

// Initialize express
const app = express();

// Middleware Usage
app.use(
	cors({
		origin: "*",
		methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
	})
);
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Create DB
// app.get("/createdb", (req, res) => {
// 	db.query(users, (err, result) => {
// 		err && console.log(err);
// 		console.log(result);
// 		res.json("Database created successfully");
// 	});
// });

app.use("/api/v1", routes);
app.use("/api/v1", router);
app.use("/api/v1", rideRouter);
app.use("/api/v1", payRouter);
app.use("/api/v1/key", apiRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1", imageRouter);

// Static configuration
const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "/public")))
app.use("/uploads", express.static(path.join(__dirname, "/uploads")))


app.listen("3000", () => {
	console.log("Server listening on http://localhost:3000");
});
