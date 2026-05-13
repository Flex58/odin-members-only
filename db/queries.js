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
