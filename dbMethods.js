const db = require('./index.js')
// const client = require('./init_redis.js')
const Redis = require('ioredis')
const redis = new Redis();
const {shapeReviews, shapeCharacteristics} = require('./helpers/dataShapers')
//ioredis --grab from cache before db if it can

// const {createClient} = require('redis')
//replicate this file dbTestMethods that will query test db

//cluster -- when cache is split/shared amongst different instances, need to replicate actions

module.exports = {

  getReviews: (productId) => {

    // redis.get(productId, (err, reviews) => {
    //   if (err) {
        return new Promise((resolve, reject) => {
          var queryString = 'SELECT * FROM reviews LEFT JOIN photos ON reviews.rev_id = photos.review_id WHERE product_id = ? limit 50'
          var queryArgs = [productId]
          db.query(queryString, queryArgs, (err, data) => {
            if (err) {
              console.log('error in db get reviews')
              reject (new Error('error in GET reviews dbMethod'))
              // throw new Error('error in GET reviews')
            } else {
              // console.log('data from getReviews', JSON.parse(JSON.stringify(data)))
              var response = shapeReviews(productId, data)
              redis.set(productId, response)
              resolve(response)
            }
          })
        })
      },
      // if (reviews) {
      //   return reviews
      // }
  //   })
  // },
    // console.log('getReviews called')
    // console.log(productId)

    //cache hit, don't go into db and
    //cache miss, set cache & get from db


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
      + ' ' + 'GROUP BY characteristics.name, characteristics.char_id';
      var queryArgs = [productId]
      //return db.query get a promise back and chain with .then block -> get date
      db.query(queryString, queryArgs, (err, data) => {
        if (err) {
          console.log('err in get chars', err)
          throw new Error('error in get characteristics review')
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
            reject(err)
          } else {
            // console.log('data', JSON.parse(JSON.stringify(data)))
            query2 = JSON.parse(JSON.stringify(data))
            var response = shapeCharacteristics(query1, query2, productId)
            resolve(response)
          }
        })
      })
      // console.log('query 1', query1)
      // console.log('query 2', query2)
    })
  },


  postReview: (body) => {
    // console.log('review body in dbs', body)
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
          reject(err)
          console.log('error in update reported', err)
        } else {
          console.log('success update reported')
          resolve()
        }
      })
    })
  }
}


