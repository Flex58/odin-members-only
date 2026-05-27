const controller = require("../controllers/messagesController");

const { Router } = require("express");

const messagesRouter = Router();

messagesRouter.post("/post", controller.postMessage);
messagesRouter.post("/:id/delete", controller.delteMessage);

module.exports = { messagesRouter };
