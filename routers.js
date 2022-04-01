const express = require("express");
const path = require("path");
let router = express.Router();

require("dotenv").config();
const { connection } = require("./database");
const { auth, requiresAuth } = require("express-openid-connect");

let currentdate = new Date();
let datetime = "";
datetime += currentdate.getFullYear() + "-";
datetime += currentdate.getMonth() + 1 + "-";
datetime += currentdate.getDate();

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
  let userinfo = JSON.stringify(request.oidc.user);
  let email = userinfo.split('"email":"')[1].split('","')[0];
  connection.query(`insert into accounts (userid) 
      select * from (select id from users where email="${email}") as temp
      where not exists (select userid from accounts
      where userid = (select id from users where email="${email}"))`);
  response.sendFile(path.join(__dirname + "/index.html"));
});

router.get('/profile', requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let name = userinfo.split('"name":"')[1].split('","')[0].split(/(?<=^\S+)\s/);
  let fname, lname;
  if (name.length < 2) {
    fname = name[0];
    lname = "";
  } else {
    fname = name[1];
    lname = name[0];
  }
  let email = userinfo.split('"email":"')[1].split('","')[0];
  response.send("first_name: "+fname+"<br>"+"last_name: "+lname+"<br>"+"email: "+email);
});

// GET transaction history
router.get("/transactions/history", requiresAuth(), (request, response) => {
  let userinfo = JSON.stringify(request.oidc.user);
  let email = userinfo.split('"email":"')[1].split('","')[0];
  connection.query(`select u.id, a.balance, a.account_id, t.transaction_date, t.amount, t.type
      from accounts a left join users u on a.userid = u.id left join transactions t
      on t.account_id = a.account_id where u.email='${email}';
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
  let amount = request.query.amount;
  let aid = request.query.aid;
  connection.query(`INSERT INTO transactions (type, amount, transaction_date, account_id)
      VALUES ('080', ${amount}, '${datetime}', ${aid});
      update accounts set balance = balance + ${amount} where account_id='${aid}'`,
      (error, result) => {
    if (amount == null) { response.status(404).send("Missing input"); }
    else if (error) { response.status(500).send(error); }
    else { response.status(200).send("Top up completed"); }
  });
});

// buy investments
router.get("/transactions/buy", requiresAuth(), (request, response) => {
  let amount = request.query.amount;
  let aid = request.query.aid;
  connection.query(`INSERT INTO transactions (type, amount, transaction_date, account_id)
      VALUES ('010', ${amount}, '${datetime}', ${aid});
      update accounts set balance = balance - ${amount} where account_id='${aid}'`,
      (error, result) => {
    if (amount == null) { response.status(404).send("Missing input"); }
    else if (error) { response.status(500).send(error); }
    else { response.status(200).send("Purchase completed"); }
  });
});

// sell investments
router.get("/transactions/sell", requiresAuth(), (request, response) => {
  let amount = request.query.amount;
  let aid = request.query.aid;
  connection.query(`INSERT INTO transactions (type, amount, transaction_date, account_id)
      VALUES ('020', ${amount}, '${datetime}', ${aid});
      update accounts set balance = balance + ${amount} where account_id='${aid}'`,
      (error, result) => {
    if (amount == null) { response.status(404).send("Missing input"); }
    else if (error) { response.status(500).send(error); }
    else { response.status(200).send("Purchase completed"); }
  });
});

module.exports = { router };
