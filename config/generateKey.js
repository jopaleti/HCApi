import crypto from "crypto";
export const api_keyGenerator = () => {
	const randomString = crypto.randomBytes(20).toString("hex");
	const hash = crypto.createHash("sha256").update(randomString).digest("hex");
	const apiKey = hash.slice(0, 32); // Use the first 32 characters of the hash as the API key
	return apiKey;
};
