export const ride = `CREATE TABLE ride (
        id int PRIMARY KEY AUTO_INCREMENT,
        userId int NOT NULL,
        busId int NOT NULL,
        fare VARCHAR(255),
        status VARCHAR(255),
        start_lat VARCHAR(255) NOT NULL,
        start_log VARCHAR(255) NOT NULL,
        end_lat VARCHAR(255) NOT NULL,
        end_log VARCHAR(255) NOT NULL,
        origin_loc VARCHAR(255),
        dest_loc VARCHAR(255))`;
