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
      "http://localhost:5173",
      "https://launchpadeventsplatform.netlify.app",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(cookieParser());

app.use("/api", apiRouter);

app.use(customErrorHandler);

app.use(postgressErrorHandler);

module.exports = app;
