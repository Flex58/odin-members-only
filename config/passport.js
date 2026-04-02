const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const queries = require("./db/queries.js");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      user = queries.getUserByName(username);

      if (!user) {
        return done(null, false, { message: "Incorrect Username" });
      }

      const match = bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect Password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await queries.getUserById(id);

    done(null, user);
  } catch (err) {
    done(err);
  }
});
