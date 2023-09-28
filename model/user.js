// Create Users model
export let users = `CREATE TABLE users (
    id int PRIMARY KEY AUTO_INCREMENT, 
    username VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    verified BOOLEAN DEFAULT FALSE,
    password VARCHAR(255) NOT NULL, 
    confirm_password VARCHAR(255) NOT NULL, 
    profile VARCHAR(255), 
    isAdmin BOOLEAN DEFAULT FALSE, 
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`;
