const usersRouter = require("express").Router();
const authenticate = require("../middlewear/authenticate");
const { signup, login } = require("../controllers/users-controllers");

usersRouter.post("/signup", signup);
usersRouter.post("/login", login);

module.exports = usersRouter;
