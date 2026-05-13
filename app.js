const express = require("express");
const path = require("node:path");
const passport = require("passport");
const session = require("./config/session.js");
require("dotenv").config();

//passport middleware
require("./config/passport.js");

const PORT = 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));

app.use(session());
app.use(passport.session());

//set user as global locals
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  }
  console.log(`listening on PORT ${PORT}`);
});
