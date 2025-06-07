const { insertSignup, selectSignups } = require("../models/signups-models");

exports.postSignup = (req, res, next) => {
  const { user_id, event_id } = req.body;

  insertSignup(user_id, event_id)
    .then((signup) => {
      res.status(200).send({ signup });
    })
    .catch(next);
};

exports.getSignups = (req, res, next) => {
  const { event_id } = req.params;
  const creator_id = req.user.id;

  selectSignups(event_id, creator_id)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
