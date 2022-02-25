const newrelic = require('newrelic')
const mysql = require('mysql')
const redis = require('redis')
// const {app} = require('./server.js')
const port = 5000
const redis_port = 6379
const client = redis.createClient(redis_port)
//difference between npm mysql and database


const connection = mysql.createConnection({
  user: 'root',
  password: 'password',
  database: 'ratings'
})

connection.connect((err, result) => {
  if (err) {
    throw err
  } else {
    //message coming from mysql
    // console.log('result', result)
    console.log ('connected to mysql!')
  }
})

// app.listen(port, () => {
//   console.log(`listening on http://localhost:${port}`)
// })

// exports.connection = connection
// exports.client = client

//two separate servers running


module.exports = {db: connection, client: client}