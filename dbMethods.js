var db = require('./index.js')

module.exports = {

  getReviews: (productId) => {
    console.log('getReviews called')
    console.log(productId)
    return new Promise((resolve, reject) => {
      var queryString = 'SELECT * FROM reviews LEFT JOIN photos ON reviews.rev_id = photos.review_id WHERE product_id = ?'
      var queryArgs = [productId]
      db.query(queryString, queryArgs, (err, data) => {
        if (err) {
          reject (err)
        } else {
          // console.log('data', JSON.parse(JSON.stringify(data)))
          var reviews = JSON.parse(JSON.stringify(data))
          //create object response
          var reviewIds = []
          var response = {
            product: productId,
            page: 0,
            count: null,
            results: []
          }
          // console.log('response', response)
          data.forEach(el => {
            if (!reviewIds.includes(el.rev_id)) {
              reviewIds.push(el.rev_id)

              var review = {}
              review.review_id = el.rev_id;
              review.rating = el.product_id;
              review.summary = el.summary;
              review.recommend = el.recommend;
              review.response = el.response;
              review.report = el.reported;
              review.body = el.body;
              review.date = el.date;
              review.reviewer_name = el.reviewer_name;
              review.review_email = el.reviewer_email;
              review.helpfulness = el.helpfulness;
              review.photos = []
              review.photos.push(el.url)
              response.results.push(review)
            } else {
              for (var revs in response.results) {
                if (el.rev_id === revs.review_id) {
                  revs.photos.push(el.url)
                }
              }
            }
          })
          response.count = reviewIds.length;
          console.log('response', response)
          resolve()
        }
      })
    })
    .catch(err => console.log('error in getReviews'))
  },

  // 'SELECT characteristics.name, characteristics.product_id, characteristic_reviews.value, reviews.rating, reviews.recommend, reviews.product_id as prod_id'
  //     + ' ' + 'FROM characteristics JOIN (characteristic_reviews, reviews)'
  //     + ' ' + 'ON (characteristics.char_id = characteristic_reviews.characteristic_id'
  //     + ' ' + 'AND characteristic_reviews.review_id = reviews.rev_id)'
  //     + ' ' + 'WHERE characteristics.product_id = ?'
  //     + ' ' + 'LIMIT 5';


  getCharacteristicReviews: (productId) => {
    var query1;
    var query2;
    console.log('productid', productId)
    return new Promise((resolve, reject) => {

      var queryString =
      'SELECT characteristics.name, characteristics.product_id, characteristics.char_id, AVG(characteristic_reviews.value) as value'
      // + ' ' + 'reviews.recommend'
      + ' ' + 'FROM characteristics JOIN (characteristic_reviews)'
      + ' ' + 'ON (characteristics.char_id = characteristic_reviews.characteristic_id)'
      // + ' ' + 'JOIN reviews'
      // + ' ' + 'ON (characteristic_reviews.review_id = reviews.rev_id)'
      // + ' ' + 'AND characteristic_reviews.review_id = reviews.rev_id)'
      + ' ' + 'WHERE characteristics.product_id = ?'
      + ' ' + 'GROUP BY characteristics.name, characteristics.char_id'
      + ' ' + 'LIMIT 5';

      // + ' ' +
      // + ' ' + '
      // + ' ' + 'ON '
      // console.log('querystring', queryString)


      var queryArgs = [productId]
      db.query(queryString, queryArgs, (err, data) => {
        if (err) {
          console.log('err in get chars', err)
        } else {
          resolve(productId)
          console.log('data', JSON.parse(JSON.stringify(data)))
          query1 = JSON.parse(JSON.stringify(data))
        }
      })
    })
    .then((productId) => {
      console.log('productid', productId)
      return new Promise((resolve, reject) => {
        queryString =

        `SELECT product_id, rating, COUNT(*) AS total, t, f
        FROM reviews
        JOIN (
        SELECT
        SUM(if(recommend= 'true', 1, 0)) as t,
        SUM(if(recommend= 'false', 1, 0)) as f
        FROM reviews
        WHERE product_id = ?
        ) as r
        WHERE product_id = ?
        GROUP BY rating, product_id, t, f
        LIMIT 10`

        queryArgs = [productId, productId]
        db.query(queryString, queryArgs, (err, data) => {
          if (err) {
            console.log('err in get characteristics 2', err)
          } else {
            console.log('data', JSON.parse(JSON.stringify(data)))
            query2 = JSON.parse(JSON.stringify(data))

            var response = {
              product_id: productId,
              ratings: {},
              recommended: {},
              characteristics: {}
            }
            query1.forEach((char) => {
              console.log('char', char)
              response.characteristics[char.name] = {'id': char.char_id, 'value': char.value}
            })
            query2.forEach((rev) => {
              response.ratings[rev.rating] = rev.total
            })
            response.recommended = {'0': query2[0].t, '1': query2[0].f}
            console.log('response', response)
            resolve()
          }
        })
      })
      // console.log('query 1', query1)
      // console.log('query 2', query2)
    })
  },



//
  // data [
  //   { product_id: 25, rating: 1, recommend: 'false' },
  //   { product_id: 25, rating: 4, recommend: 'false' },
  //   { product_id: 25, rating: 3, recommend: 'true' },
  //   { product_id: 25, rating: 2, recommend: 'true' },


  //   { total: 1, product_id: 25, rating: 3 },
  //   { total: 3, product_id: 25, rating: 2 },
  //   { total: 1, product_id: 25, rating: 5 },
  //   { total: 2, product_id: 25, rating: 4 },

 // 'SELECT rating,'
        // + ' ' + 'sum(case when recommend = "true" then 1 else 0 end) as true'
        // // + ' ' + 'sum(case when recommend="false" then 1 else 0 end) as 0 '
        // + ' ' + 'FROM reviews'
        // + ' ' + 'WHERE product_id = ?'
        // + ' ' + 'GROUP BY rating'
        // + ' ' + 'LIMIT 50'



  postReview: () => {
    console.log('postnewrev called')
    return new Promise((resolve, reject) => {
      var queryString = 'INSERT INTO reviews SET ?'
      var queryArgs = {
        product_id: 11,
        rating: 2,
        summary: 'I love this product',
        body: 'Really well made',
        recommend: true,
        name: 'Meredith',
        email: 'mer.white@practice.com',
        photos: ['url', 'url'],
        characteristics: {"14": 5, "15": 5}
      }
      db.query(queryString, queryArgs, (err, results) => {
        if (err) {
          console.log('error in put', err)
        } else {
          console.log('succes', results.insertedId)
          resolve(results.insertedId)
        }
      })
    })
  },

  updateHelpfulness: (reviewId, helpfulness) => {
    //query reviews collection for matching reviewId & update helpfulness
    //somehow need to get the helpfulness integer?
    return new Promise((resolve, reject) => {
      var queryString = 'UPDATE reviews SET helpfulness = ? WHERE rev_id = ?'
      var queryArgs = reviewId, helpfulness
      db.query(queryString, queryArgs, (err) => {
        if (err) {
          console.log('error in update helpfulness', err)
        } else {
          console.log('success update helpfulness')
          resolve()
        }
      })
    })
  },

  updateReported: (reviewId, reported) => {
    //query reviews collection for matching reviewId and update reported
    //need to get reported true/false
    return new Promise((resolve, reject) => {
      var queryString = 'UPDATE reviews SET reported = ? WHERE rev_id = ?'
      var queryArgs = reviewId, reported
      db.query(queryString, queryArgs, (err) => {
        if (err) {
          console.log('error in update helpfulness', err)
        } else {
          console.log('success update helpfulness')
          resolve()
        }
      })
    })
  }
}


