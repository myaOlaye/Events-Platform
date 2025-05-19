const db = require("../db/connection");

exports.selectEvents = () => {
  return db.query("SELECT * FROM events").then(({ rows }) => {
    return rows;
  });
};
