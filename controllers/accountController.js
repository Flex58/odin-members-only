const passport = require("passport");
const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult, matchedData } = require("express-validator");
require("dotenv").config();

const formValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be an Email address")
    .custom(async (value) => {
      const data = await db.getUserByName(value);
      if (data) {
        throw new Error(`Email already in use`);
      }
    })
    .withMessage("Email already in use"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(
      `Password must be at least 8 characters long, have 1 uppercase character and include at least 1 number`,
    ),
  body("confirm")
    .notEmpty()
    .withMessage("Password doesn't match")
    .custom(async (confirm, { req }) => {
      if (confirm !== req.body.password) {
        throw new Error("Password doesn't match");
      }
    })
    .withMessage("Password doesn't match"),
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First Name is required")
    .matches(/^[\p{L}\p{M}'\- ]+$/u)
    .withMessage("Contains Invalid Characters") //should verify Names in all locales
    .isLength({ max: 100 })
    .withMessage("Last Name must be under 100 characters"),
  body("last_name")
    .trim()
    .optional({ values: "falsy" })
    .matches(/^[\p{L}\p{M}'\- ]+$/u)
    .withMessage("Contains Invalid Characters") //should verify Names in all locales
    .isLength({ max: 100 })
    .withMessage("Last Name must be under 100 characters"),
];

exports.getSignUp = (req, res) => {
  res.render("sign-up");
};

exports.postSignUp = [
  formValidation,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", {
        errors: errors.array(),
        username: req.body.username,
        first: req.body.first_name,
        last: req.body.last_name,
      });
    }
    const data = matchedData(req);
    const hashedPassowrd = await bcrypt.hash(data.password, 10);
    try {
      await db.addUser(
        data.username,
        hashedPassowrd,
        data.first_name,
        data.last_name,
      );
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  },
];

exports.getSignIn = (req, res) => {
  res.render("sign-in", { message: req.session.messages });
};

exports.postSignIn = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/account/sign-in",
  failureMessage: true,
});

exports.getSignOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.getMember = (req, res) => {
  res.render("member");
};

exports.postMember = async (req, res) => {
  const memberPass = process.env.MEMBER_PASSWORD;
  const adminPass = process.env.ADMIN_PASSWORD;
  const pass = req.body.password;

  if (bcrypt.compareSync(pass, memberPass)) {
    await db.setMember(req.user.id);
    res.redirect("/");
  } else if (bcrypt.compareSync(pass, adminPass)) {
    await db.setAdmin(req.user.id);
    res.redirect("/");
  } else {
    res.render("member", { errors: "Member Password incorrect" });
  }
};
