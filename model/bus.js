export let bus = `CREATE TABLE ambulance (
    id int PRIMARY KEY AUTO_INCREMENT,
    driver VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    phone_number int NOT NULL, 
    vehicle VARCHAR(255) NOT NULL, 
    lat VARCHAR(255) NOT NULL, 
    log VARCHAR(255) NOT NULL, 
    location VARCHAR(255) NOT NULL,
    isAvailable BOOLEAN DEFAULT true)`;
