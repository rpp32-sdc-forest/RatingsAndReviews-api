use ratings;

SELECT product_id, rating, COUNT(*) AS total, t, f
FROM reviews
JOIN (
SELECT
SUM(if(recommend= 'true', 1, 0)) as T,
SUM(if(recommend= 'false', 1, 0)) as F
FROM reviews
WHERE reviews.product_id = 1000
) as r
WHERE reviews.product_id = 1000
GROUP BY rating, product_id, t, f
LIMIT 10;



SELECT * FROM reviews LEFT JOIN photos
ON reviews.rev_id = photos.review_id
WHERE product_id = 1000 limit 50

  SELECT characteristics.name, characteristics.product_id, characteristics.char_id, AVG(characteristic_reviews.value) as value
  FROM characteristics JOIN (characteristic_reviews)
  ON (characteristics.char_id = characteristic_reviews.characteristic_id)
  WHERE characteristics.product_id = 1000
  GROUP BY characteristics.name, characteristics.char_id;

UPDATE reviews SET helpfulness = IFNULL(helpfulness, 0) + 1 WHERE rev_id = ?

UPDATE reviews SET reported = true WHERE rev_id = ?