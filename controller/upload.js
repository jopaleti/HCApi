import { status } from "../helper/status.js";
import pool from "../config/db.js";
import fs from "fs";
/**
 * Upload image function handler
 * @param {object} req
 * @param {object} res
 * @returns {object} success message
 */
const uploadImage = async (req, res) => {
	const userId = req.params.id;
	console.log(req.file);
	const file = req.file;
	const name = req.body.img_name;
	if (!file) {
		res.status(status.bad).json({ error: "Please upload a file" });
	} else {
		//  console.log(file.buffer.toString("base64"));
		console.log({ body: req.body });
		await pool.query(
			`SELECT * FROM images WHERE userId = ${userId}`,
			async (err, result) => {
				err && res.status(status.bad).json({ error: err });
				if (result.length == 0) {
					await pool.query(
						"INSERT INTO images (userId, name, img, content_type) VALUES (?, ?, ?, ?)",
						[
							userId,
							name,
							fs.readFileSync("uploads/" + file.filename),
							file.mimetype,
						],
						(err, result) => {
							err && res.status(status.bad).json({ error: err });
							res.status(status.success).json({ msg: result });
						}
					);
				} else {
					var data = {
						name: name,
						img: fs.readFileSync("uploads/" + file.filename),
						content_type: file.mimetype,
					};
					pool.query(
						`UPDATE images SET ? WHERE userId = ${userId}`,
						data,
						(err, result) => {
							err && res.status(status.bad).json({ error: err });
							res.status(status.success).json({ msg: result });
						}
					);
				}
			}
		);
		// res.status(status.success).json({msg: req.file})
		// console.log(file.buffer);
	}
};
export { uploadImage };
