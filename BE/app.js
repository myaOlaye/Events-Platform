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
      "https://684427c3700eac85e2ad52c6--launchpadeventsplatform.netlify.app",
    ],
    credentials: true,
  })
);

// app.options("/*", cors());

app.use(cookieParser());

app.use("/api", apiRouter);

app.use(customErrorHandler);

app.use(postgressErrorHandler);

module.exports = app;
