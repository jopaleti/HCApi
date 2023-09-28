export let image = `CREATE TABLE images (
    id int PRIMARY KEY AUTO_INCREMENT,
    userId int NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    img LONGBLOB,
    content_type VARCHAR(255)
)`;

