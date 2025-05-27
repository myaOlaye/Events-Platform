const signupsRouter = require("express").Router();
const { postSignup } = require("../controllers/signups-controllers");
const authenticate = require("../middlewear/authenticate");

const restrictToSelf = require("../middlewear/restrictToSelf");

signupsRouter.post("/", authenticate, restrictToSelf, postSignup);

module.exports = signupsRouter;
