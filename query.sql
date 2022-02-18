use ratings;

SELECT product_id, rating, COUNT(*) AS total, t, f
FROM reviews
JOIN (
SELECT
SUM(if(recommend= 'true', 1, 0)) as T,
SUM(if(recommend= 'false', 1, 0)) as F
FROM reviews
WHERE reviews.product_id = ?
) WHERE reviews.product_id = ?
GROUP BY rating, product_id, t, f
LIMIT 10;


-- SELECT product_id, rating, count(*), t, f
-- FROM reviews
-- JOIN (
-- SELECT
-- SUM(if(recommend='true'), 1, 0)) as t,
-- SUM(if(recommend='false'), 1, 0)) as f,
-- FROM reviews
-- WHERE product_id = ?
-- ) WHERE product_id = ?
-- GROUP BY product_id, rating, t, f
