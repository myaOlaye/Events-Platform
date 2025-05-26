const apiRouter = require("express").Router();
const eventsRouter = require("./events-router");
const signupsRouter = require("./signups-router");
const usersRouter = require("./users-router");

apiRouter.get("/", (req, res) => {
  res.status(200).send("All OK from /api");
});

apiRouter.use("/events", eventsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/signups", signupsRouter);

module.exports = apiRouter;
