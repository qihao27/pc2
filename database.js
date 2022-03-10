const mysql = require("mysql");
require("dotenv").config();

let connection = mysql.createConnection({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWD,
    database: process.env.DBNAME,
    multipleStatements: true
});

connection.connect((error) => {
    (error) ? console.log(error) : console.log("Connected to MySQL!");
});

module.exports = { connection };
