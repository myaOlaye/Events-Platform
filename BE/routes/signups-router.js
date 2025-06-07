const signupsRouter = require("express").Router();
const {
  postSignup,
  getSignups,
} = require("../controllers/signups-controllers");
const authenticate = require("../middlewear/authenticate");
const authorise = require("../middlewear/authorise");
const restrictToSelf = require("../middlewear/restrictToSelf");

signupsRouter.post("/", authenticate, restrictToSelf, postSignup);
signupsRouter.get(
  "/event/:event_id",
  authenticate,
  authorise("staff"),
  getSignups
);
module.exports = signupsRouter;
