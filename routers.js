// Import express library
// const { response } = require("express");
const express = require("express");

// Import data.js
const database = require("./data");

// Define router object
let router = express.Router();

// ------------------- USERS -------------------

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

// ------------------- ACCOUNTS -------------------

// Define an API to return all accounts
router.get("/accounts/all", (request, response) => {
  let accounts = database.get_all_accounts();
  response.send(accounts);
});

// Define an API to return accounts when input account holder
router.get("/accounts/by-accholder", (request, response) => {
  let accounts = database.get_accs_by_holder(request.query.accholder);
  response.send(accounts);
});

router.get("/accounts/by-acc-no", (request, response) => {
  let accounts = database.get_accs_by_holder(request.query.acc_no);
  response.send(accounts);
}); // still not working

// Define a POST API to add a new account to database
router.post("/accounts/add", (request, response) => {
  let accounts = database.add_acc(request.body.acc_no);
  response.send("account added.");
});

// Define a DEL API

router.delete("/accounts/delete", (request, response) => {
  let account_to_del = database.del_acc_by_accNo(request.query.acc_no);
  response.send(`Account ${account_to_del} deleted`);
});

// ------------------- TRANSACTIONS -------------------

router.get("/transactions/all", (request, response) => {
  let transactions = database.get_all_transactions();
  response.send(transactions);
});

router.get("transactions/by-acc-no", (request, response) => {
  let transactions = database.get_transactions_by_acc_no(request.query.acc_no);
  response.send(transactions);
});

module.exports = { router };
