const db = require("../db/connection");

exports.insertSignup = (user_id, event_id) => {
  return db
    .query(
      "INSERT into signups (user_id, event_id) VALUES ($1, $2) RETURNING *",
      [user_id, event_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
