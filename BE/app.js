const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const apiRouter = require("./routes/api-router");
const {
  customErrorHandler,

  postgressErrorHandler,
} = require("./middlewear/error-handlers");

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Local development environment,
    ],
    credentials: true,
  })
);

// app.options("/*", cors());

app.use(cookieParser());

app.use("/api", apiRouter);

// app.all("*", invalidUrlErrorHandler); come back and figure out why this isnt working

app.use(customErrorHandler);

app.use(postgressErrorHandler);

module.exports = app;
