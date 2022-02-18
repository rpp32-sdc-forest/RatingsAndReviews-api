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
  console.log('req.params', req.params)
  getReviews(req.params.productId)
  .then((response) => {
    console.log('response in server', response)
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
    console.log('char response in server', response)
    res.send(response).status(200)
  })
  .catch(err => {
    console.log('err in app.get characteristics', err)
    res.sendStatus(200)
  })
})

app.post('/ratings', (req, res) => {
  console.log('req.body', req.body)
  req.body.Chars = req.body.Chars.filter((char) => char.Id !== '')
  postReview(req.body)
})

app.patch('/helpful/:reviewId', (req, res) => {
  console.log('req.body', req.body)
  updateHelpfulness(req.body)
})



app.listen(port, () => {
  console.log(`listening on localhost:${port}`)
})
