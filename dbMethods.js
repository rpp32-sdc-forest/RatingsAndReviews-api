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
          // console.log('response', response)
          resolve(response)
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
          // console.log('data', JSON.parse(JSON.stringify(data)))
          query1 = JSON.parse(JSON.stringify(data))
        }
      })
    })
    .then((productId) => {
      console.log('productid', productId)
      return new Promise((resolve, reject) => {
        queryString =
  //       'SELECT COUNT(rating) as total, product_id, rating'
  // + ' ' + 'FROM reviews'
  // + ' ' + 'WHERE reviews.product_id = ?'
  // // + ' ' + 'JOIN reviews as rr'
  // // + ' ' + 'ON rr.rev_id = r.rev_id AND rr.rating = r.rating AND rr.recommend="false"'
  // + ' ' + 'GROUP BY rating'
  // + ' ' + 'LIMIT 50'


  "SELECT r.rating, r.product_id, COUNT(IF(r.recommend='false')) as F, COUNT(IF(r.recommend='true')) as T"
  // + " " + "COUNT(CASE WHEN r.recommend='false' then 1 else 0 end) AS f"
  // + ' ' + 'COUNT(case WHEN recommend="true" then 1 else 0 end) as T'
  + " "  + "FROM reviews AS r"
  + " " + "WHERE r.product_id = ? AND r.rating=2"
  // + " " + "GROUP BY r.rating"
  + " " + "LIMIT 50"





//  'SELECT COUNT(r.rating) as total, r.product_id, r.rating, rr.recommend'
//  'SELECT r.rating, rr.date'
//  + ' ' + 'FROM reviews AS r'
//   + ' ' + 'WHERE r.product_id = ?'
//   + ' ' + 'JOIN reviews AS rr'
//   + ' ' + 'ON rr.product_id = ?'
//   // + ' ' + 'GROUP BY rating'
//   + ' ' + 'LIMIT 50'




// MySQL GROUP BY column and COUNT another column conditionally in the same table


  //        'SELECT COUNT(recommend) as recommend, product_id FROM reviews'
  // + ' ' + 'WHERE reviews.product_id = ?'
  // + ' ' + 'AND reviews.recommend="false"'
  // // + ' ' + 'GROUP BY reviews.product_id'
  // + ' ' + 'LIMIT 50'

        queryArgs = [productId]
        db.query(queryString, queryArgs, (err, data) => {
          if (err) {
            console.log('err in get ratings', err)
          } else {
            console.log('data', JSON.parse(JSON.stringify(data)))
            query2 = JSON.parse(JSON.stringify(data))
          }
        })
      })
    })
  },




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
  },

  updateHelpfulness: (reviewId) => {
    //query reviews collection for matching reviewId & update helpfulness
  },

  updateReported: (reviewId) => {
    //query reviews collection for matching reviewId and update reported
  }
}


