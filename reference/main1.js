let express = require("express");
require("dotenv").config();

let app = express();

let router = express.Router();

// router.get("path", callback);
router.get("/", (request, response) => {
  response.send("My first app deployed to Heroku");
});


// router.get("path", callback);
router.get("/home", (request, response) => {
  response.send("Welcome to Dev Toolkit 2!");
});

// router.post("path", callback);
router.get("/sum", (request, response) => {
  let sum = request.query.a + request.query.b;
  response.send("Sum is: " + sum);
});

app.use(router);

app.listen(process.env.PORT, (errors) => {
  if (errors) {
    console.log(errors);
  } else {
    console.log("Server started on port 3000");
  }
});
