const express = require("express");
const path = require("path");
let router = express.Router();

require("dotenv").config();
const { connection } = require("./database");
const { auth, requiresAuth } = require("express-openid-connect");

router.use("/public", express.static(path.join(__dirname, "public")));
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

router.get("/balance", requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let email = userinfo.split('"email":"')[1].split('","')[0];
  connection.query(`select u.id, a.balance from accounts a left join users u on a.userid = u.id
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

router.get("/investment", requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let email = userinfo.split('"email":"')[1].split('","')[0];
  connection.query(`select u.id, a.balance, sum(t.amount) as invest from accounts a left join users u
      on a.userid = u.id left join transactions t on t.account_id = a.account_id
      where u.email='${email}' and t.type=020 group by t.type`, (error, result) => {
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

// GET transaction history
router.get("/transactions/history", requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let email = userinfo.split('"email":"')[1].split('","')[0];
  connection.query(`select u.id, a.balance, t.transaction_date, t.amount, t.type from accounts a
      left join users u on a.userid = u.id left join transactions t on t.account_id = a.account_id
      where u.email='${email}';
      select sum(t.amount) as invest from accounts a left join users u on a.userid = u.id 
      left join transactions t on t.account_id = a.account_id where u.email='${email}'
      and t.type in (010, 020) group by t.type order by t.type`, (error, result) => {
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

// top up to account balance
router.get("/transactions/deposit", requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let email = userinfo.split('"email":"')[1].split('","')[0];
  let currentdate = new Date();
  let datetime = "";
  datetime += currentdate.getFullYear() + "-";
  datetime += currentdate.getMonth() + 1 + "-";
  datetime += currentdate.getDate();

  let amount = request.query.amount;
  connection.query(`INSERT INTO transactions (type, amount, transaction_date, account_id)
      VALUES ('080', ${amount}, '${datetime}', 
      (select a.account_id from users u left join accounts a on a.userid=u.id where u.email='${email}'));
      update accounts a left join users u on a.userid=u.id set a.balance = a.balance + ${amount}
      where u.email='${email}'`, (error, result) => {
    if (amount == null) { response.status(404).send("Missing input"); }
    else if (error) { response.status(500).send(error); }
    else { response.status(200).send("Top up completed"); }
  });
});

// buy investments
router.get("/transactions/buy", requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let email = userinfo.split('"email":"')[1].split('","')[0];
  var currentdate = new Date();
  var datetime = "";
  datetime += currentdate.getFullYear() + "-";
  datetime += currentdate.getMonth() + 1 + "-";
  datetime += currentdate.getDate();

  let amount = request.query.amount;
  connection.query(`INSERT INTO transactions (type, amount, transaction_date, account_id)
      VALUES ('010', ${amount}, '${datetime}',
      (select a.account_id from users u left join accounts a on a.userid=u.id where u.email='${email}'));
      update accounts a left join users u on a.userid=u.id set a.balance = a.balance - ${amount}
      where u.email='${email}'`, (error, result) => {
    if (amount == null) { response.status(404).send("Missing input"); }
    else if (error) { response.status(500).send(error); }
    else { response.status(200).send("Purchase completed"); }
  });
});

// sell investments
router.get("/transactions/sell", requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let email = userinfo.split('"email":"')[1].split('","')[0];
  var currentdate = new Date();
  var datetime = "";
  datetime += currentdate.getFullYear() + "-";
  datetime += currentdate.getMonth() + 1 + "-";
  datetime += currentdate.getDate();

  let amount = request.query.amount;
  connection.query(`INSERT INTO transactions (type, amount, transaction_date, account_id)
      VALUES ('020', ${amount}, '${datetime}',
      (select a.account_id from users u left join accounts a on a.userid=u.id where u.email='${email}'));
      update accounts a left join users u on a.userid=u.id set a.balance = a.balance + ${amount}
      where u.email='${email}'`, (error, result) => {
    if (amount == null) { response.status(404).send("Missing input"); }
    else if (error) { response.status(500).send(error); }
    else { response.status(200).send("Purchase completed"); }
  });
});

module.exports = { router };
