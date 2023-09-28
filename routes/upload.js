import multer from "multer";
import express from "express";
// import { isAuth } from "../middleware/isAuth";
import path from "path";
import { uploadImage } from "../controller/upload.js";

const uploadRouter = express.Router();
const storage = multer.diskStorage({
	destination(req, file, cb) {
		cb(null, "uploads/");
	},
	filename(req, file, cb) {
		cb(
			null,
			`${file.filename}_${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

const upload = multer({ storage });

uploadRouter.post("/img/:id", upload.single("image"), uploadImage);
export default uploadRouter;
