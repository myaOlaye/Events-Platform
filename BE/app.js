const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const apiRouter = require("./routes/api-router");
const {
  customErrorHandler,

  postgressErrorHandler,
} = require("./middlewear/error-handlers");

app.use(express.json());

app.use(cookieParser());

app.use("/api", apiRouter);

// app.all("*", invalidUrlErrorHandler); come back and figure out why this isnt working

app.use(customErrorHandler);

app.use(postgressErrorHandler);

module.exports = app;
