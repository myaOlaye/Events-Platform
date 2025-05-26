const { insertSignup } = require("../models/signups-models");

exports.postSignup = (req, res, next) => {
  const { user_id, event_id } = req.body;

  insertSignup(user_id, event_id)
    .then((signup) => {
      res.status(200).send({ signup });
    })
    .catch(next);
};
