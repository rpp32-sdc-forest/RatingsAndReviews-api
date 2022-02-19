var mysql = require('mysql')
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

module.exports = connection



