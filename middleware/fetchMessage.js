const db = require("../db/queries");

exports.fetchMessage = async (req, res, next) => {
  const message = await db.getMessage();
  const formatted = await Promise.all(
    message.map(async (msg) => {
      const author = await db.getUserById(msg.author);
      const date = new Date(msg.time);
      return {
        id: msg.id,
        author: author.first_name,
        title: msg.title,
        content: msg.content,
        time: date,
      };
    }),
  );
  res.locals.messages = formatted;
  next();
};
