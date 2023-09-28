import express from "express";
import { createImage, fetchImage } from "../controller/image.js";

const imageRouter = express.Router();

imageRouter.get("/image", createImage);
// Get the image of the user
imageRouter.get("/img/:id", fetchImage);

export default imageRouter;
