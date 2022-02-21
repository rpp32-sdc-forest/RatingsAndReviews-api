const express = require('express')
// const {createServer} = require('./server.ts')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const model = require('./index.js')
const port = 5000
const {getReviews, getCharacteristicReviews, postReview, updateHelpfulness, updateReported} = require('./dbMethods')



app.get('/ratings/:productId', (req, res) => {
  //call dbMethod getReviews to query reviews collection
  // console.log('req.params', req.params)
  getReviews(req.params.productId)
  .then((response) => {
    // console.log('ratings response in server', response)
    res.send(response).status(200)
  })
  .catch(err => {
    console.log('err in app.get /ratings', err)
    res.sendStatus(500)
  })
})

app.get('/characteristics/:productId', (req, res) => {
  getCharacteristicReviews(req.params.productId)
  .then((response) => {
    // console.log('char response in server', response)
    // response.characteristics = JSON.parse(response.characteristics)
    // console.log('response.characteristics', response.characteristics)
    //res.json to send as json
    res.json(response).status(200)
    // res.send(response).status(200)
  })
  .catch(err => {
    console.log('err in app.get characteristics', err)
    res.sendStatus(500)
  })
})

app.post('/ratings', (req, res) => {
  console.log('req.body in server', req.body)
  postReview(req.body)
  // .then(console.log('post resolved'))
  res.sendStatus(200)
  .catch(err => {
    console.log('err in app.get characteristics', err)
    res.sendStatus(500)
  })
})

app.put('/helpful/:reviewId', (req, res) => {
  console.log('req.params', req.params)
  updateHelpfulness(req.params.reviewId)
  res.sendStatus(200)
  .catch(err => {
    console.log('err in app.get characteristics', err)
    res.sendStatus(500)
  })
})

app.put('/report/:reviewId', (req, res) => {
  console.log('req.params', req.params)
  updateReported(req.params.reviewId)
  res.sendStatus(200)
  .catch(err => {
    console.log('err in app.get characteristics', err)
    res.sendStatus(500)
  })
})

app.listen(port, () => {
  console.log(`listening on localhost:${port}`)
})

module.exports = app;