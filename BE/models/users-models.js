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
