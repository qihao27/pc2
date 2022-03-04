const mysql = require("mysql");
const dotenv = require("dotenv").config();

let connection = mysql.createConnection({
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASSWD,
    database: process.env.DBNAME
});

connection.connect((error) => {
    (error) ? console.log(error) : console.log("Connected to MySQL!");
});

connection.query("select * from books", (error, result) => {
    (error) ? console.log(error) : console.log(result);
});
