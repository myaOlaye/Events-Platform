const usersRouter = require("express").Router();
const authenticate = require("../middlewear/authenticate");
const {
  signup,
  login,
  logout,
  getEventsByUserId,
  getSignUpStatus,
  getCreatedEvents,
  getUserInfo,
} = require("../controllers/users-controllers");
const restrictToSelf = require("../middlewear/restrictToSelf");
const validateIdParams = require("../middlewear/validateIdParams");
const authorise = require("../middlewear/authorise");

usersRouter.post("/signup", signup);
usersRouter.post("/login", login);
usersRouter.post("/logout", logout);
usersRouter.get(
  "/:user_id/events",
  authenticate,
  validateIdParams("user_id"),
  restrictToSelf,
  getEventsByUserId
);
usersRouter.get(
  "/:user_id/events/:event_id/status",
  authenticate,
  validateIdParams("user_id", "event_id"),
  restrictToSelf,
  getSignUpStatus
);
usersRouter.get(
  "/:user_id/created-events",
  authenticate,
  authorise("staff"),
  validateIdParams("user_id"),
  restrictToSelf,
  getCreatedEvents
);
usersRouter.get("/auth/me", authenticate, getUserInfo);
module.exports = usersRouter;
