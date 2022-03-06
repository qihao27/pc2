const express = require("express");
const path = require("path");
let router = express.Router();

require("dotenv").config();
const { connection } = require("./database");

const { auth, requiresAuth } = require("express-openid-connect");
const { connect } = require("http2");
const query = require("express/lib/middleware/query");
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

router.use("/public", express.static(path.join(__dirname, "public")));

// ------------------- Auth0 -------------------
router.get("/", (request, response) => {
  if (request.oidc.isAuthenticated()) {
    response.redirect("/index");
  } else {
    response.send("Logged out");
  }
});

// GET API with path "/home"
router.get("/home", requiresAuth(), (request, response) => {
  response.send("Welcome!");
});

router.get("/index", (request, response) => {
  response.sendFile(path.join(__dirname + "/index.html"));
});

// ------------------- USERS -------------------
// GET all users
router.get("/users/all", requiresAuth(), (request, response) => {
  connection.query("select * from users", (error, result) => {
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
  connection.query(
    `select * from users where uid=${request.query.uid}`,
    (error, result) => {
      if (error) {
        console.log(error);
        response.status(500).send("Something went wrong...");
      } else {
        result.length == 0
          ? response.status(404).send("user not found")
          : response.status(200).send(result);
      }
    }
  );
});

// Define a POST API to add a new user to database
router.post("/users/add", requiresAuth(), (request, response) => {
  connection.query(
    `insert into users (first_name, last_name, email) 
    values ("${request.body.first_name}", "${request.body.last_name}", "${request.body.email}")`,
    (error, result) => {
      if (error) {
        console.log(error);
        response.status(500).send("Something went wrong...");
      } else {
        response.status(200).send("User added to the database!");
      }
    }
  );
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

router.get(
  "/transactions/by-account-id",
  requiresAuth(),
  (request, response) => {
    connection.query(
      `select type, amount, date(transaction_date) as transaction_date, account_id from transactions where account_id=${request.query.account_id}`,
      (error, result) => {
        if (error) {
          console.log(error);
          response.status(500).send("Something went wrong...");
        } else {
          result.length == 0
            ? response.status(404).send("user not found")
            : response.status(200).send(result);
        }
      }
    );
  }
);

// POST API for deposits
router.get(
  "/transactions/by-deposit-amt",
  requiresAuth(),
  (request, response) => {
    connection.query(
      `
    INSERT INTO 
        transactions(type, amount, transaction_date, account_id)
    VALUES
         ('080', ${request.query.amount} , '2022-03-06' , 922)
         `,
      (error, result) => {
        if (error) {
          console.log(error);
          response.status(500).send("Something went wrong...");
        } else {
          result.length == 0
            ? response.status(404).send("Please input deposit amount.")
            : response.status(200).send(result);
        }
      }
    );
  }
);

//`INSERT INTO
//         transactions(type, amount, transaction_data, account_id)
//       VALUES
//         (10, ${request.query.amount} , 2022-03-06 , ${request.query.user - id});
//       `, // HC

module.exports = { router };
