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

exports.selectSignups = (event_id, creator_id) => {
  return db
    .query("SELECT * FROM events WHERE id = $1 AND created_by = $2", [
      event_id,
      creator_id,
    ])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 403,
          msg: "Forbidden",
        });
      }
      return db
        .query(
          "SELECT u.* FROM signups s JOIN users u ON  s.user_id = u.id WHERE s.event_id = $1",
          [event_id]
        )
        .then(({ rows }) => {
          return rows;
        });
    });
};
