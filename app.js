const express = require('express');
const app = express();
const mysql = require('mysql');

const {
    HOST,
    PORT,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME
} = process.env;

const connection = mysql.createConnection({
    host     : DB_HOST,
    port     : DB_PORT,
    user     : DB_USERNAME,
    password : DB_PASSWORD,
    database : DB_NAME
});

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);

    connection.query('SELECT * FROM `users`', function (error, results, fields) {
        if (error) throw error;
       
        console.table(results)
      })
});

app.get('/user', function (req, res) {
    // Get all users
})

app.get('/user/:id', function (req, res) {
    // Get user by ID
})

app.post('/user', function (req, res) {
    // Create a new user
})

app.put('/user/:id', function (req, res) {
    // Create a new user
})

app.delete('/user/:id', function (req, res) {
    // delete user by ID
})

app.listen(PORT,()=>{
    console.log(`started: ${HOST}:${PORT}`)
})