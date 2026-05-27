const pool = require("./pool.js");

exports.getUserByName = async (name) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE username= $1", [
    name,
  ]);
  return rows[0];
};

exports.getUserById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0];
};

exports.addUser = async (username, password, first, last = null) => {
  await pool.query(
    `INSERT INTO users (username, password, 
		 first_name, last_name) VALUES ($1, $2, $3, $4)`,
    [username, password, first, last],
  );
};

exports.setMember = async (id) => {
  await pool.query("UPDATE users SET member= true WHERE id= $1", [id]);
};

exports.setAdmin = async (id) => {
  await pool.query("UPDATE users SET admin= true WHERE id= $1", [id]);
};

exports.addMessage = async (id, title, content) => {
  await pool.query(
    `INSERT INTO messages (author, title, content, time)
		 VALUES ($1, $2, $3, CURRENT_TIMESTAMP(0))`,
    [id, title, content],
  );
};

exports.getMessage = async () => {
  const { rows } = await pool.query(`SELECT * FROM messages`);
  return rows;
};

exports.deleteMessage = async (id) => {
  await pool.query("DELETE FROM messages WHERE id = $1", [id]);
};
