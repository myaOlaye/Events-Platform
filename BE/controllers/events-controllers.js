const { selectEvents } = require("../models/events-models");

exports.getEvents = (req, res, next) => {
  // eventually will add search query param here
  selectEvents().then((events) => {
    res.status(200).send({ events }).catch(next);
  });
};
