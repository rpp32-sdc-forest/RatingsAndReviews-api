const newrelic = require('newrelic')
const mysql = require('mysql')


const connection = mysql.createConnection({
  user: 'root2',
  password: 'password',
  database: 'ratings',
  host: '34.194.219.95'

  //host name is ip address of db instance
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