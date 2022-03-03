// import the express library
const express = require("express");

// Use the port number from the .env file
require("dotenv").config();

// import router from routers.js
const { router } = require("./routers");

// define server instance
let app = express();
app.use(express.json());

// tell the app to use router for API mappings
app.use(router);

// start the server at port 3000
let port = process.env.PORT || 3000;
app.listen(process.env.PORT || 3000, (errors) => {
  if (errors) {
    console.log(errors);
  } else {
    console.log(`Server started on port ${port}`);
  }
});
