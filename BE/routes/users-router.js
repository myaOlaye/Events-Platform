const usersRouter = require("express").Router();
const authenticate = require("../middlewear/authenticate");

const {
  signup,
  login,
  getEventsByUserId,
} = require("../controllers/users-controllers");
const restrictToSelf = require("../middlewear/restrictToSelf");

usersRouter.post("/signup", signup);
usersRouter.post("/login", login);
usersRouter.get(
  "/:user_id/events",
  authenticate,
  restrictToSelf,
  getEventsByUserId
);

module.exports = usersRouter;
