const express = require("express");
const path = require("path");
let router = express.Router();

require('dotenv').config();
const { connection } = require("./database");

const { auth, requiresAuth } = require('express-openid-connect');
router.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
  })
);

router.use('/public', express.static(path.join(__dirname, 'public')));

// ------------------- Auth0 -------------------
router.get('/', (request, response) => {
  if (request.oidc.isAuthenticated()) {
    response.redirect("/home");
  } else {
    response.send('Logged out');
  }
});

// GET API with path "/home"
router.get("/home", requiresAuth(), (request, response) => {
  response.send("Welcome!");
});

router.get("/index", requiresAuth(), (request, response) => {
  response.sendFile(path.join(__dirname + '/index.html'));
});

// ------------------- USERS -------------------
// GET all users
router.get("/users/all", requiresAuth(), (request, response) => {
  connection.query("select * from user", (error, result) => {
    if (error) {
      console.log(error);
      response.status(500).send("Something went wrong...");
    } else {
      response.status(200).send(result);
    }
  });
});

// GET user based on uid passed in the request
router.get("/users/by-uid", requiresAuth(), (request, response) => {
  connection.query(`select * from user where uid=${request.query.uid}`, (error, result) => {
    if (error) {
      console.log(error);
      response.status(500).send("Something went wrong...");
    } else {
      (result.length == 0) ? response.status(404).send("user not found") : response.status(200).send(result);
    }
  });
});

// Define a POST API to add a new user to database
router.post("/users/add", requiresAuth(), (request, response) => {
  connection.query(`insert into user (first_name, last_name, email) 
    values ("${request.body.first_name}", "${request.body.last_name}", "${request.body.email}")`, (error, result) => {
    if (error) {
      console.log(error);
      response.status(500).send("Something went wrong...");
    } else {
      response.status(200).send("User added to the database!");
    }
  });
});

// ------------------- ACCOUNTS -------------------

// Define an API to return all accounts
router.get("/accounts/all", requiresAuth(), (request, response) => {
  let accounts = database.get_all_accounts();
  response.send(accounts);
});

// Define an API to return accounts when input account holder
router.get("/accounts/by-accholder", requiresAuth(), (request, response) => {
  let accounts = database.get_accs_by_holder(request.query.accholder);
  response.send(accounts);
});

router.get("/accounts/by-acc-no", requiresAuth(), (request, response) => {
  let accounts = database.get_accs_by_holder(request.query.acc_no);
  response.send(accounts);
}); // still not working

// Define a POST API to add a new account to database
router.post("/accounts/add", requiresAuth(), (request, response) => {
  let accounts = database.add_acc(request.body.acc_no);
  response.send("account added.");
});

// Define a DEL API

router.delete("/accounts/delete", requiresAuth(), (request, response) => {
  let account_to_del = database.del_acc_by_accNo(request.query.acc_no);
  response.send(`Account ${account_to_del} deleted`);
});

// ------------------- TRANSACTIONS -------------------

router.get("/transactions/all", requiresAuth(), (request, response) => {
  let transactions = database.get_all_transactions();
  response.send(transactions);
});

router.get("transactions/by-acc-no", requiresAuth(), (request, response) => {
  let transactions = database.get_transactions_by_acc_no(request.query.acc_no);
  response.send(transactions);
});

module.exports = { router };
