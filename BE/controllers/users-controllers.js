const {
  insertNewUser,
  verifyUser,
  selectEventsById,
  selectSignUp,
  selectCreatedEvents,
} = require("../models/users-models");

exports.signup = (req, res, next) => {
  const { first_name, last_name, email, password, role } = req.body;

  insertNewUser(first_name, last_name, email, password, role)
    .then(({ token, user }) => {
      res
        .status(201)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 3600000,
        })
        .send({ user });
    })
    .catch(next);
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  verifyUser(email, password)
    .then(({ token, userData }) => {
      res
        .status(201)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Strict",
          maxAge: 3600000,
        })
        .send({ userData });
    })
    .catch(next);
};

exports.logout = (req, res, next) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: "Strict",
      secure: process.env.NODE_ENV === "production",
    })
    .status(204)
    .send();
};

exports.getEventsByUserId = (req, res, next) => {
  const { user_id } = req.params;

  selectEventsById(user_id)
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch(next);
};

exports.getSignUpStatus = (req, res, next) => {
  const { user_id, event_id } = req.params;

  selectSignUp(user_id, event_id)
    .then((status) => {
      res.status(200).send({ status });
    })
    .catch(next);
};

exports.getCreatedEvents = (req, res, next) => {
  const { user_id } = req.params;

  selectCreatedEvents(user_id)
    .then((createdEvents) => {
      res.status(200).send({ createdEvents });
    })
    .catch(next);
};

exports.getUserInfo = (req, res, next) => {
  res.status(200).send({ user: req.user });
};
