const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

const messageValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title can't be empty")
    .isLength({ max: 60 })
    .withMessage("Title cannot exceed 60 characters"),
  body("content")
    .notEmpty()
    .withMessage("Message can't be empty")
    .isLength({ max: 65536 })
    .withMessage("Message too long"),
];

exports.postMessage = [
  messageValidation,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).render("/", {
        errors: errors.array(),
        title: req.body.title,
        content: req.body.content,
      });
    }
    const data = matchedData(req);
    try {
      await db.addMessage(req.user.id, data.title, data.content);
      res.redirect("/");
    } catch (error) {
      return next(error);
    }
  },
];
