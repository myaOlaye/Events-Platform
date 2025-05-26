const eventsRouter = require("express").Router();
const {
  getEvents,
  createEvent,
  deleteEvent,
  getEvent,
} = require("../controllers/events-controllers");
const authenticate = require("../middlewear/authenticate");
const authorise = require("../middlewear/authorise");
const validateIdParams = require("../middlewear/validateIdParams");
const restrictToSelf = require("../middlewear/restrictToSelf");

eventsRouter
  .get("/", authenticate, getEvents)
  .post("/", authenticate, authorise("staff"), createEvent);

eventsRouter
  .get("/:event_id", authenticate, validateIdParams("event_id"), getEvent)
  .delete("/:event_id", authenticate, authorise("staff"), deleteEvent);

module.exports = eventsRouter;
