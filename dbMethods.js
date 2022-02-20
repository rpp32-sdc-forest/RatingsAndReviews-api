var db = require('./index.js')

module.exports = {

  getReviews: (productId) => {
    // console.log('getReviews called')
    // console.log(productId)
    return new Promise((resolve, reject) => {
      var queryString = 'SELECT * FROM reviews LEFT JOIN photos ON reviews.rev_id = photos.review_id WHERE product_id = ? limit 50'
      var queryArgs = [productId]
      db.query(queryString, queryArgs, (err, data) => {
        if (err) {
          console.log('error in db get reviews')
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
              //check first for date
              if(el.date === null) {
                reviews.date = new Date().toString();
              } else {
                reviews.date = el.date
              }
              review.summary = el.summary;
              review.recommend = el.recommend;
              review.response = el.response;
              review.report = el.reported;
              review.body = el.body;
              review.date = el.date;
              review.reviewer_name = el.reviewer_name;
              review.review_email = el.reviewer_email;
              review.helpfulness = el.helpfulness;
                //if it's null just leave mepty array
                //if not null, push to array
              review.photos = []
              if (el.url !== null) {
                review.photos.push(el.url)
              }
              response.results.push(review)
            } else {
              for (var revs in response.results) {
                if (el.rev_id === revs.review_id) {
                  if (el.url !== null) {
                    revs.photos.push(el.url)
                  }
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
    .catch(err => {
      throw(err)
      console.log('error in getReviews')
    })
  },

// promisify db.query so no callbacks
  getCharacteristicReviews: (productId) => {
    var query1;
    var query2;
    // console.log('productid', productId)
    return new Promise((resolve, reject) => {

      var queryString =
      'SELECT characteristics.name, characteristics.product_id, characteristics.char_id, AVG(characteristic_reviews.value) as value'
      + ' ' + 'FROM characteristics JOIN (characteristic_reviews)'
      + ' ' + 'ON (characteristics.char_id = characteristic_reviews.characteristic_id)'
      + ' ' + 'WHERE characteristics.product_id = ?'
      + ' ' + 'GROUP BY characteristics.name, characteristics.char_id'
      + ' ' + 'LIMIT 5';
      var queryArgs = [productId]
      //return db.query get a promise back and chain with .then block -> get date
      db.query(queryString, queryArgs, (err, data) => {
        if (err) {
          console.log('err in get chars', err)
          reject(err)
        } else {
          resolve(productId)
          // console.log('data', JSON.parse(JSON.stringify(data)))
          query1 = JSON.parse(JSON.stringify(data))
        }
      })
    })
    .then((productId) => {
      // console.log('productid', productId)
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
            throw(err)
          } else {
            // console.log('data', JSON.parse(JSON.stringify(data)))
            query2 = JSON.parse(JSON.stringify(data))

            var response = {
              product_id: productId,
              ratings: {},
              recommended: {},
              characteristics: {}
            }
            query1.forEach((char) => {
              var parsedCharName = JSON.parse(char.name)

              response.characteristics[parsedCharName] = {'id': char.char_id, 'value': char.value}
            })
            query2.forEach((rev) => {
              response.ratings[rev.rating] = rev.total
            })
            response.recommended = {'0': query2[0].t, '1': query2[0].f}
            // console.log('response', response)
            resolve(response)
          }
        })
      })
      // console.log('query 1', query1)
      // console.log('query 2', query2)
    })
  },


  postReview: (body) => {
    console.log('review body in dbs', body)
    // console.log('array of chars', Object.entries(body.characteristics))
    var charsArray = Object.entries(body.characteristics)
    body.characteristics = charsArray.filter(([key, value]) => value !== '')
    return new Promise((resolve, reject) => {
      var queryString = 'INSERT INTO reviews SET ?'
      var queryArgs = {
        product_id: body.product_id,
        rating: body.rating,
        summary: body.summary,
        body: body.body,
        recommend: body.recommended === 'true',
        reviewer_name: body.name,
        reviewer_email: body.email,
      }
      db.query(queryString, queryArgs, (err, results) => {
        if (err) {
          reject(err)
          console.log('error in put', err)
        } else {
          // console.log('succes', results.insertId)
          resolve(results.insertId)
        }
      })
    })
    .then((revId) => {
      // console.log('id', revId)
      var photos = body.photos
      var photoPromises = photos.map(url => {
        return new Promise((resolve, reject) => {
          var queryString = 'INSERT INTO photos SET ?'
          var queryArgs = {
            review_id: revId,
            url: url
          }
          db.query(queryString, queryArgs, (err, results) => {
            if (err) {
              console.log('err in insert photos', err)
              reject(err)
            } else {
              // console.log('success photo insert')
              resolve()
            }
          })
        })
      })
      Promise.all(photoPromises)
      .then(() => {
        // console.log('end id', revId)
        var chars = body.characteristics
        // console.log('chars', chars)
          var charPromises = chars.map(char => {
            // console.log('charId', char.Id)
            return new Promise((resolve, reject) => {
              var queryString = 'INSERT INTO characteristic_reviews SET ?'
              var queryArgs = {
                characteristic_id: Number(char[0]),
                review_id: revId,
                value: char[1]
              }
              db.query(queryString, queryArgs, (err, results) => {
                if (err) {
                  console.log('err in insert chars', err)
                  reject(err)
                } else {
                  // console.log('success char insert')
                  resolve()
                }
              })
            })
          })
          Promise.all(charPromises)
          // console.log('all chars insert success'))
      })
    })
  },

  updateHelpfulness: (reviewId) => {
    console.log('reviewId', reviewId)
    return new Promise((resolve, reject) => {
      var queryString = 'UPDATE reviews SET helpfulness = IFNULL(helpfulness, 0) + 1 WHERE rev_id = ?'
      var queryArgs = [reviewId]
      db.query(queryString, queryArgs, (err, result) => {
        if (err) {
          console.log('error in update helpfulness', err)
          reject(err)
        } else {
          console.log('success update helpfulness', result)
          resolve()
        }
      })
    })
  },

  updateReported: (reviewId) => {
    console.log('reviewId', reviewId)

    return new Promise((resolve, reject) => {
      var queryString = 'UPDATE reviews SET reported = true WHERE rev_id = ?'
      var queryArgs = [reviewId]
      db.query(queryString, queryArgs, (err) => {
        if (err) {
          console.log('error in update reported', err)
        } else {
          console.log('success update reported')
          resolve()
        }
      })
    })
  }
}


