import dotenv from "dotenv";
dotenv.config();

export const { PORT, DB_URI, SALT_ROUND, JWT_SECRET } = process.env;
