const express = require('express')

const app = express()
var model = require('./index.js')
const port = 5000
const {getReviews, getCharacteristicReviews, postReview, updateHelpfulness, updateReported} = require('./dbMethods')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.post('/characteristics', (req, res) => {
})

app.get('/ratings/:productId', (req, res) => {
  //call dbMethod getReviews to query reviews collection
  // console.log('req.params', req.params)
  getReviews(req.params.productId)
  .then((response) => {
    // console.log('response in server', response)
    res.send(response).status(200)
  })
  .catch(err => {
    console.log('err in app.get /ratings', err)
    res.sendStatus(200)
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

    res.sendStatus(200)
  })
})

app.post('/ratings', (req, res) => {
  console.log('req.body', req.body)
  postReview(req.body)
})

app.put('/helpful/:reviewId', (req, res) => {
  console.log('req.params', req.params)
  updateHelpfulness(req.params.reviewId)
  res.sendStatus(200)
})

app.patch('/report/:reviewId', (req, res) => {
  console.log('req.params', req.params)
  updateReported(req.params.reviewId)
})



app.listen(port, () => {
  console.log(`listening on localhost:${port}`)
})
