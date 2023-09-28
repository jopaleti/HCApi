export let otpModel = `CREATE TABLE otp(
    userId VARCHAR(255) NOT NULL,
    otp VARCHAR(64) NOT NULL,
    createdAt INT,
    expiresAt INT)`;
