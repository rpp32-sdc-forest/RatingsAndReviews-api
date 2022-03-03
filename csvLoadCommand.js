LOAD DATA INFILE '/Users/meredithwhite/JavaScript/HackReactor/RPP32/Senior/SDC/RatingsAndReviews-api/csvs/reviews.csv'
INTO TABLE reviews
FIELDS TERMINATED BY ','
IGNORE 1 ROWS;

LOAD DATA INFILE '/Users/meredithwhite/JavaScript/HackReactor/RPP32/Senior/SDC/RatingsAndReviews-api/csvs/reviews_photos.csv'
INTO TABLE photos
FIELDS TERMINATED BY ','
IGNORE 1 ROWS;

LOAD DATA INFILE '/Users/meredithwhite/JavaScript/HackReactor/RPP32/Senior/SDC/RatingsAndReviews-api/csvs/characteristics.csv'
INTO TABLE characteristics
FIELDS TERMINATED BY ','
IGNORE 1 ROWS;

LOAD DATA INFILE '/Users/meredithwhite/JavaScript/HackReactor/RPP32/Senior/SDC/RatingsAndReviews-api/csvs/characteristic_reviews.csv'
INTO TABLE characteristic_reviews
FIELDS TERMINATED BY ','
IGNORE 1 ROWS;

LOAD DATA INFILE 'var/lib/mysql-files/reviews.csv' INTO TABLE reviews FIELDS TERMINATED BY ',' IGNORE 1 ROWS;

LOAD DATA INFILE '/var/lib/mysql-files/reviews_photos.csv' INTO TABLE photos FIELDS TERMINATED BY ',' IGNORE 1 ROWS;

LOAD DATA INFILE '/var/lib/mysql-files/characteristics.csv' INTO TABLE characteristics FIELDS TERMINATED BY ',' IGNORE 1 ROWS;

LOAD DATA INFILE '/var/lib/mysql-files/characteristic_reviews.csv' INTO TABLE characteristic_reviews FIELDS TERMINATED BY ',' IGNORE 1 ROWS;