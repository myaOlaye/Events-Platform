exports.invalidUrlErrorHandler = (req, res) => {
  res.status(404).send({ message: "Not found" });
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.message && err.status) {
    res.status(err.status).send({ message: err.message });
  } else next(err);
};

exports.postgressErrorHandler = (err, req, res, next) => {
  console.log(err.code);
  if (err.code === "23505") {
    res.status(409).send({ message: "Conflict" });
  } else if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ message: "Not found" });
  } else next(err);
};
