import mysql from "mysql";

// Create Connection
const pool = mysql.createPool({
	host: "localhost",
	user: "pma",
	database: "hospitalConnect",
});

export default pool;
