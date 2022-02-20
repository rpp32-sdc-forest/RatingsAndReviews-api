var mysql = require('mysql')
var {app} = require('./server.js')
var port = 5000
//difference between npm mysql and database


var connection = mysql.createConnection({
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

module.exports = connection



