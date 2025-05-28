const db = require("../db/connection");
require("dotenv").config({ path: "./BE/.env.secrets" });
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.insertNewUser = (first_name, last_name, email, password, role) => {
  return db
    .query("SELECT * FROM users WHERE email = $1", [email])
    .then(({ rows }) => {
      if (rows.length > 0) {
        return Promise.reject({
          status: 409,
          msg: "An account with this email already exists",
        });
      }

      return bcrypt.hash(password, 10).then((hashedPassword) => {
        return db
          .query(
            "INSERT into users (first_name, last_name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, role",
            [first_name, last_name, email, hashedPassword, role || "community"]
          )
          .then(({ rows }) => {
            user = rows[0];
            const token = jwt.sign(user, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRES_IN,
            });
            return { token, user };
          });
      });
    });
};

exports.verifyUser = (email, password) => {
  return db
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then(({ rows }) => {
      const user = rows[0];
      if (!user) {
        return Promise.reject({
          status: 404,
          msg: "No account with this email exists",
        });
      }

      return bcrypt.compare(password, user.password_hash).then((match) => {
        if (!match) {
          return Promise.reject({
            status: 400,
            msg: "Incorrect Password",
          });
        }

        const { password_hash, created_at, ...userData } = user;
        const token = jwt.sign(userData, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        return { token, userData };
      });
    });
};

exports.selectEventsById = (user_id) => {
  // need to actually add something that only allows a user to authenticate with thier own id? rather than any user being able to see what every other user is signed up for!
  //eg user 6 can currently see what user 1 is signed up for - fix this
  return db
    .query(
      `SELECT e.* FROM signups s JOIN events e ON s.event_id = e.id WHERE s.user_id = $1`,
      [user_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectSignUp = (user_id, event_id) => {
  return db
    .query(`SELECT * FROM signups WHERE user_id = $1 AND event_id = $2`, [
      user_id,
      event_id,
    ])
    .then(({ rows }) => {
      if (rows[0]) {
        return true;
      } else return false;
    });
};

exports.selectCreatedEvents = (user_id) => {
  return db
    .query(`SELECT * FROM events WHERE created_by = $1`, [user_id])
    .then(({ rows }) => {
      return rows;
    });
};
