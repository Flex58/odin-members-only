const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db/pool.js");
require("dotenv").config();

module.exports = function () {
  return session({
    store: new pgSession({
      pool: pool,
      createTableIfMissing: true,
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, //30 Days
  });
};
