// Import express library
// const { response } = require("express");
const express = require("express");

// Import data.js
const database = require("./data");

// Define router object
let router = express.Router();

//Define an API to return all the users
router.get("/users/all", (request, response) => {
    let users = database.get_all_users();
    response.send(users);
});

// Define an API to get user based on user_id passed in the request
router.get("/users/by-uid", (request, response) => {
    let users = database.get_user_by_user_id(request.query.uid);
    response.send(users);
});

// Define a POST API to add a new user to database
router.post("/users/add", (request, response) => {
  let user = database.add_user(request.body.user);
  response.send("user added.");
});

// Define a GET API with path "/home"
// router.get("path", callback);
router.get("", (request, response) => {
    response.send("Welcome!");
});

// Define a GET API with path "/sum"
router.get("/sum", (request, response) => {
    let sum = parseInt(request.query.a) + parseInt(request.query.b);
    response.send("Sum is: " + sum);
});

// Define a POST API with path "/sum"
router.post("/sum", (request, response) => {
    let sum = request.body.a + request.body.b;
    response.send("Sum is : " + sum);
});

module.exports = { router };
