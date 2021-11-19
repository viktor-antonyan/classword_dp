const mysql = require('mysql');
const {
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    DB_HOST,
    DB_PORT,
} = process.env;

const connection = mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

module.exports = {connection};