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
