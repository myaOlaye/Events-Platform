const eventsRouter = require("express").Router();
const { getEvents } = require("../controllers/events-controllers");

eventsRouter.get("/", getEvents);

module.exports = eventsRouter;
