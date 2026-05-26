const controller = require("../controllers/messagesController");

const { Router } = require("express");

const messagesRouter = Router();

messagesRouter.post("/post", controller.postMessage);

module.exports = { messagesRouter };
