const db = require("../db/queries");

const { body, validationResult, matchedData } = require("express-validator");

const formValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be an Email address")
    .custom(async (req) => {
      const data = await db.getUserByName(req.body.username);
      if (data) {
        throw new Error("Email already in use");
      }
    })
    .withMessage("Email already in use"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isStrongPassword({ minLength: 8, minUppercase: 1, minNumbers: 1 })
    .withMessage(
      `Password must be at least 8 characters long, have 1 uppercase character and include at least 1 number`,
    ),
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

exports.postSignUp = [
  formValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", {
        errors: errors.array(),
        username: req.username,
        first: req.first_name,
        last: req.last_name,
      });
    }
    const data = matchedData(req);
    await db.addUser(data);
    await res.redirect("/");
  },
];
