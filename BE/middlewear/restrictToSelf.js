// This middlewear is used to prevents users accessing other users data, regardless of if they are staff or community
// e.g, no staff or community member should be allowed to see user 6 signups, unless they are user 6

//it is interfering with the postgress error handler for sending an incorrect data type
// it causes 403 forbidden to be sent rather than 400 bad request for wrong data type - fixed by creatig another mw to check data type
const restrictToSelf = (req, res, next) => {
  if (req.user.id !== Number(req.params.user_id)) {
    return res.status(403).send({ message: "Forbidden" });
  }
  next();
};

module.exports = restrictToSelf;
