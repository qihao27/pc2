const express = require("express");
const path = require("path");
let router = express.Router();

require("dotenv").config();
const { connection } = require("./database");

const { auth, requiresAuth } = require("express-openid-connect");
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

// ------------------- Default -------------------
router.get("/", (request, response) => {
  request.oidc.isAuthenticated() ? response.redirect("/index") : response.redirect("/login");
});

router.get("/index", (request, response) => {
  response.sendFile(path.join(__dirname + "/index.html"));
});

router.get('/profile', requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let name = userinfo.split('"name":"')[1].split('","')[0];
  let fname = name.split(" ")[0];
  let lname = name.split(" ")[1];
  let email = userinfo.split('"email":"')[1].split('","')[0];
  response.send(fname+" "+lname+" "+email);
});

// GET balance and uid
/*router.get("/balance", requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let email = userinfo.split('"email":"')[1].split('","')[0];
  connection.query(`select u.id, a.balance from accounts a left join users u 
    on a.userid = u.id where u.email='${email}'`, (error, result) => {
      if (error) {
        console.log(error);
        response.status(500).send("Something went wrong...");
      } else {
        result.length == 0
          ? response.status(404).send("user not found")
          : response.status(200).send(result);
      }
    })
});*/

// GET user based on fname/lname/email
router.get("/users/uid", requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let name = userinfo.split('"name":"')[1].split('","')[0];
  let fname = name.split(" ")[0];
  let lname = name.split(" ")[1];
  connection.query(
    `select id from users where fname='${fname}' and lname='${lname}'`,
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

// ------------------- TRANSACTIONS -------------------
// GET transaction history
router.get("/transactions/history", requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let email = userinfo.split('"email":"')[1].split('","')[0];
  connection.query(`select u.id, a.balance, t.transaction_date, t.amount from accounts a
      left join users u on a.userid = u.id left join transactions t on t.account_id = a.account_id
      where u.email='${email}'`, (error, result) => {
    if (error) {
      console.log(error);
      response.status(500).send("Something went wrong...");
    } else {
      result.length == 0
        ? response.status(404).send("user not found")
        : response.status(200).send(result);
    }
  });
});

// POST API for deposits
router.get("/transactions/deposit", requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let email = userinfo.split('"email":"')[1].split('","')[0];
  let currentdate = new Date();
  let datetime = "";
  datetime += currentdate.getFullYear() + "-";
  datetime += currentdate.getMonth() + 1 + "-";
  datetime += currentdate.getDate();

  connection.query(`INSERT INTO transactions (type, amount, transaction_date, account_id)
      VALUES ('080', ${request.query.amount}, '${datetime}', 
      (select a.account_id from users u left join accounts a on a.userid=u.id where u.email='${email}'));
      update accounts a left join users u on a.userid=u.id set a.balance = a.balance + ${request.query.amount}
      where u.email='${email}'`,
      (error, result) => {
    if (error) {
      console.log(error);
      response.status(500).send("Something went wrong...");
    } else {
      result.length == 0
        ? response.status(404).send("Please input deposit amount.")
        : response.status(200).send(result);
    }
  });
});

// POST API for buy
router.get("/transactions/buy", requiresAuth(), (request, response) => {
  var currentdate = new Date();

  var datetime = "";
  datetime += currentdate.getFullYear() + "-";
  datetime += currentdate.getMonth() + 1 + "-";
  datetime += currentdate.getDate();

  let buyAmt = request.query.amount;

  connection.query(
    `INSERT INTO transactions(type, amount, transaction_date, account_id) VALUES ('010', -${buyAmt}, '${datetime}', 922)`,
    (error, result) => {
      if (error) {
        console.log(error);
        response.status(500).send("Something went wrong...");
      } else {
        result.length == 0
          ? response.status(404).send("Please input amount to buy.")
          : response.status(200).send(result);
      }
    }
  );
});

//  API for sell
router.get("/transactions/sell", requiresAuth(), (request, response) => {
  var currentdate = new Date();

  var datetime = "";
  datetime += currentdate.getFullYear() + "-";
  datetime += currentdate.getMonth() + 1 + "-";
  datetime += currentdate.getDate();

  let sellAmt = request.query.amount;

  connection.query(
    `INSERT INTO transactions(type, amount, transaction_date, account_id) VALUES ('010', ${sellAmt}, '${datetime}', 922)`,
    (error, result) => {
      if (error) {
        console.log(error);
        response.status(500).send("Something went wrong...");
      } else {
        result.length == 0
          ? response.status(404).send("Please input amount to sell.")
          : response.status(200).send(result);
      }
    }
  );
});

// API for getting balance from transactions table using SUM query
router.get("/transactions/balance", requiresAuth(), (request, response) => {
  connection.query(
    `SELECT sum(amount) AS balance FROM transactions WHERE account_id=922`,
    (error, result) => {
      if (error) {
        console.log(error);
        response.status(500).send("Something went wrong...");
      } else {
        response.status(200).send(result);
      }
    }
  );
});

// ------------------- USERS -------------------
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
/*router.post("/users/add", requiresAuth(), (request, response) => {
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

Define a POST API to add a new account to database
router.post("/accounts/add", requiresAuth(), (request, response) => {
  let accounts = database.add_acc(request.body.acc_no);
  response.send("account added.");
});

Define a DEL API

router.delete("/accounts/delete", requiresAuth(), (request, response) => {
  let account_to_del = database.del_acc_by_accNo(request.query.acc_no);
  response.send(`Account ${account_to_del} deleted`);
}); */

module.exports = { router };
