use ratings;

SELECT reviews.product_id,
COUNT(reviews.recommend='false') as F, COUNT(reviews.recommend='true') as T
FROM reviews
WHERE reviews.product_id = 25
GROUP BY reviews.rating
LIMIT 5;