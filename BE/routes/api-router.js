const apiRouter = require("express").Router();
const eventsRouter = require("./events-router");

apiRouter.get("/", (req, res) => {
  res.status(200).send("All OK from /api");
});

apiRouter.use("/events", eventsRouter);

module.exports = apiRouter;
