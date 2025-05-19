const { selectEvents, insertEvent } = require("../models/events-models");

exports.getEvents = (req, res, next) => {
  // eventually will add search query param here
  selectEvents()
    .then((events) => {
      res.status(200).send({ events });
    })
    .catch(next);
};

exports.createEvent = (req, res, next) => {
  const { title, description, location, date, image_url } = req.body;
  const created_by = req.user.id;

  insertEvent(title, description, location, date, created_by, image_url)
    .then((newEvent) => {
      res.status(201).send({ newEvent });
    })
    .catch(next);
};
