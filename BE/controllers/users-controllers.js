const { insertNewUser } = require("../models/users-models");

exports.signup = (req, res, next) => {
  const { first_name, last_name, email, password, role } = req.body;

  insertNewUser(first_name, last_name, email, password, role)
    .then(({ token, user }) => {
      res
        .status(201)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // true in production
          sameSite: "Strict", // or "Lax" depending on your needs
          maxAge: 3600000, // 1 hour in milliseconds
        })
        .send({ user });
    })
    .catch(next);
};
