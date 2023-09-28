/*
Model for saving api key */

export const api_key = `CREATE TABLE api_key(
    id int PRIMARY KEY AUTO_INCREMENT,
    userId int NOT NULL,
    access VARCHAR(255) NOT NULL,
    api_name VARCHAR(255) NOT NULL,
    api_keys VARCHAR(255) NOT NULL)`;
