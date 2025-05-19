const eventsRouter = require("express").Router();
const { getEvents } = require("../controllers/events-controllers");
const authenticate = require("../middlewear/authenticate");

eventsRouter.get("/", authenticate, getEvents);

module.exports = eventsRouter;
