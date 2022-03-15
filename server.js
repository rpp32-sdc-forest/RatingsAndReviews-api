const express = require('express')
// const client = require('./init_redis.js')
const {createProxyMiddleware} = require('http-proxy-middleware')
// const {createServer} = require('./server.ts')
//require newRelic -- decorates req / response object
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
// app.use('/ratings', createProxyMiddleware({target: 'http://localhost:5000'}))
const redis = require('redis')
const redisPort = 6379
const client = redis.createClient({
  host: '54.147.168.66',
  port: redisPort,
  legacyMode: true
})
client.connect()
const model = require('./index.js')
const port = 5000
const {getReviews, getCharacteristicReviews, postReview, updateHelpfulness, updateReported} = require('./dbMethods')


client.on('error', (err) => {
  console.log(err)
})
//every get route -- looks up in rem
//app.all --> request.method, req.originalURL to find where it was coming from
//proxy is passing request along
// app.get('*')
app.get('/ratings/reviews/:productId', (req, res) => {
  console.log('req.params', req.params)
  const {productId} = req.params
  client.get(productId, async (err, reviews) => {
    if (err) throw err;
    if (reviews) {
      res.status(200).send({
        reviews: JSON.parse(reviews),
        message: "data retrieved from cache"
      })
    } else {
      getReviews(req.params.productId)
      .then((response) => {
        client.setex(productId, 600, JSON.stringify(response));
        // console.log('ratings response in server', response)
        res.send(response).status(200)
        // res.send(setResponse())
      })
      .catch(err => {
        console.log('err in app.get /ratings', err.message)
        res.sendStatus(500)
      })
    }
  })
})

app.get('/ratings/characteristics/:productId', (req, res) => {
  getCharacteristicReviews(req.params.productId)
  .then((response) => {
    // console.log('char response in server', response)
    // response.characteristics = JSON.parse(response.characteristics)
    // console.log('response.characteristics', response.characteristics)
    //res.json to send as json
      res.send(response).status(200)
    })
    // res.send(response).status(200)
  .catch(err => {
    console.log('err in app.get characteristics', err)
    res.sendStatus(500)
  })
});


app.post('/ratings/reviews', (req, res) => {
  console.log('req.body in server', req.body)
  postReview(req.body)
  // .then(console.log('post resolved'))
  .then(() => {
    res.sendStatus(200)
  })
  .catch(err => {
    console.log('err in app.get characteristics', err)
    res.sendStatus(500)
  })
})

app.put('/ratings/helpful/:reviewId', (req, res) => {
  console.log('req.params', req.params)
  updateHelpfulness(req.params.reviewId)
  .then(() => {
    res.sendStatus(200)
  })
  .catch(err => {
    console.log('err in app.get characteristics', err)
    res.sendStatus(500)
  })
})

app.put('/ratings/report/:reviewId', (req, res) => {
  console.log('req.params', req.params)
  updateReported(req.params.reviewId)
  .then(() => {
    res.sendStatus(200)
  })
  .catch(err => {
    console.log('err in app.get characteristics', err)
    res.sendStatus(500)
  })
})

app.listen(port, () => {
  console.log(`listening on localhost:${port}`)
})

module.exports = app;