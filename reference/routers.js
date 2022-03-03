// To import express library
const express = require("express");
const { use } = require("express/lib/application");

// Import data.js
const database = require("./data");

// We need the Auth0 configuration parameters from the .env file
require('dotenv').config();

// define a router object
let router = express.Router();

// Use Auth0's authentication module and set configuration parameters from .env
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

// req.isAuthenticated is provided from the auth router
router.get('/', (request, response) => {
  response.send(request.oidc.isAuthenticated() ? 'Logged in' : 'Logged out')
});

// define an API to return all the current logged in user profile
router.get('/profile', requiresAuth(), (request, response) => {
    response.send(JSON.stringify(request.oidc.user));
});

// define an API to return all the users
router.get("/users/all", requiresAuth(), (request, response) => {
  let users = database.get_all_users();
  response.status(200).send(users);
});

// define an API to get user based on user_id passed in the request.
router.get('/user/by-uid', requiresAuth(), (request, response) => {
    let user = database.get_user_by_user_id(request.query.user_id);
    response.status(200).send(user);
  });


// define an POST API to add a new user to database. 
// User's information is passed request's body section.

// Export the router object for use by other files
module.exports = { router };
