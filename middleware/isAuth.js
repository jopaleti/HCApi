import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
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
					req.user = decode;
					next();
				}
			}
		);
	} else {
		res.status(401).send({ message: "Unauthorized access" });
	}
};

export const isAdmin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next();
	} else {
		res.status(401).send({ message: "Invalid Admin Token" });
	}
};
