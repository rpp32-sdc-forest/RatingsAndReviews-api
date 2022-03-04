const nodemon = require('nodemon')
const axios = require('axios')
const express = require('express')
const app = express()
app.use(express.json())

const port = 8080
app.use(express.urlencoded({extended: true}))

app.get('*', (req, res) => {
  console.log('req', req.originalUrl)
  console.log('req.params in proxy', req.params)
  var path = req.originalUrl
  var url = 'http://localhost:5000' + path
  console.log('url', url)
  let options = {
    method: 'GET',
    url: url
  }
  return axios(options)
  .then(response => {
    console.log('response in proxy get', response.data)
    res.send(response.data).status(200)
  })
  .catch(err => console.log('error in proxy get', err))
})
//loop the original url
//concat that path onto the base url
//make another axios request to be server
//get the response back from BE server
//res.send(response.data)

//local host makes req to proxy server

app.listen(port, () => {
  console.log(`listening on localhost:${port}`)
})