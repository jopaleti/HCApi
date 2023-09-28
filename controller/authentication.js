import jwt from "jsonwebtoken";

export const Authentication = (req, res, next) => {
	const authorization = req.headers.authorization;
	if (authorization) {
		const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
		// const token = authorization;
		jwt.verify(
			token,
			process.env.JWT_SECRET || "somethingsecret",
			(err, decode) => {
				if (err) {
					res.status(401).send({ message: "Invalid Token" });
				} else {
					res.status(200).send(decode)
                    console.log(decode)
				}
			}
		);
	} else {
		res.status(401).send({ message: "Unauthorized access" });
	}
};