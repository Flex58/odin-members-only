const pool = require("./pool.js");

exports.getUserByName = async (name) => {
  const { rows } = await pool.query("SELECT * FROM users WWHERE username= $1", [
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
    `INSERT INTO users (username = $1, password = $2, 
												first_name = $3, last_name = $4)`,
    [username, password, first, last],
  );
};
