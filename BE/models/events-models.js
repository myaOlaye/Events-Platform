const db = require("../db/connection");

exports.selectEvents = () => {
  return db.query("SELECT * FROM events").then(({ rows }) => {
    return rows;
  });
};

exports.insertEvent = (
  title,
  description,
  location,
  date,
  created_by,
  image_url
) => {
  return db
    .query(
      "INSERT into events (title, description, location, date, created_by, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, description, location, date, created_by, image_url]
    )
    .then(({ rows }) => {
      const newEvent = rows[0];
      return newEvent;
    });
};

exports.selectEvent = (event_id) => {
  return db
    .query("SELECT * FROM events WHERE id=$1", [event_id])
    .then(({ rows }) => {
      if (rows[0]) return rows[0];
      return Promise.reject({ status: 404, msg: "Not found" });
    });
};

exports.removeEvent = (event_id, user_id) => {
  // first check that user trying to delete event created the event
  return db
    .query("SELECT * FROM events where id = $1 AND created_by = $2 ", [
      event_id,
      user_id,
    ])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 403, msg: "Forbidden" });
      }
      return db
        .query(`DELETE FROM signups WHERE event_id = $1`, [event_id])
        .then(() => {
          db.query(`DELETE FROM events where id = $1`, [event_id]);
        });
    });
};
