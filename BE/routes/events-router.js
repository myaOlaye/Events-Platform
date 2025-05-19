const eventsRouter = require("express").Router();
const { getEvents, createEvent } = require("../controllers/events-controllers");
const authenticate = require("../middlewear/authenticate");
const authorise = require("../middlewear/authorise");

eventsRouter
  .get("/", authenticate, getEvents)
  .post("/", authenticate, authorise("staff"), createEvent);

module.exports = eventsRouter;
