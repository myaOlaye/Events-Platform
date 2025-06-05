const {
  selectEvents,
  insertEvent,
  removeEvent,
  selectEvent,
} = require("../models/events-models");

exports.getEvents = (req, res, next) => {
  const { search } = req.query;

  selectEvents(search)
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

exports.getEvent = (req, res, next) => {
  const { event_id } = req.params;

  selectEvent(event_id)
    .then((event) => {
      res.status(200).send({ event });
    })
    .catch(next);
};

exports.deleteEvent = (req, res, next) => {
  const { event_id } = req.params;
  const user_id = req.user.id;

  // first check if exists then delete
  const promises = [selectEvent(event_id), removeEvent(event_id, user_id)];

  Promise.all(promises)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
