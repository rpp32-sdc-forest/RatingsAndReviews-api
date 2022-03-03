-- DROP DATABASE ratings;
CREATE DATABASE ratings;

USE ratings;

-- DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
rev_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
product_id INT NOT NULL,
rating INT NOT NULL,
date VARCHAR(150),
summary VARCHAR(500),
body VARCHAR(500),
recommend VARCHAR(150),
reported VARCHAR(150),
reviewer_name VARCHAR(150),
reviewer_email VARCHAR(150),
reponse VARCHAR(150),
helpfulness INT NULL
);

-- DROP TABLE IF EXISTS photos;
CREATE TABLE photos (
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
review_id INT,
url VARCHAR(150),
FOREIGN KEY (review_id) REFERENCES reviews(rev_id)
);


-- DROP TABLE IF EXISTS characteristics;
CREATE TABLE characteristics (
char_id INT NOT NULL PRIMARY KEY,
product_id INT,
name VARCHAR(150)
);

-- DROP TABLE IF EXISTS characteristic_reviews;
CREATE TABLE characteristic_reviews (
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
characteristic_id INT NOT NULL,
review_id INT,
value INT,
FOREIGN KEY (characteristic_id) REFERENCES characteristics(char_id),
FOREIGN KEY (review_id) REFERENCES reviews(rev_id)
);


