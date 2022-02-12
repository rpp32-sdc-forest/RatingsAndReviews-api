var mysql = require('mysql')

var connection = mysql.createConnection({
  user: 'root',
  password: 'password',
  database: 'ratings'
})

connection.connect((err) => {
  if (err) {
    throw err
  } else {
    console.log ('connected to mysql!')
  }
})

module.exports = connection



