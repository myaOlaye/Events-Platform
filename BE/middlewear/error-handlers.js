exports.invalidUrlErrorHandler = (req, res) => {
  res.status(404).send({ msg: "Not found" });
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.msg && err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.postgressErrorHandler = (err, req, res, next) => {
  if (err.code === "23505") {
    res.status(409).send({ msg: "Conflict" });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not found" });
  } else next(err);
};
