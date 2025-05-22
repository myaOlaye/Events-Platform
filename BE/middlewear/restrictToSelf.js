// This middlewear is used to prevents users accessing other users data, regardless of if they are staff or community
// e.g, no staff or community member should be allowed to see user 6 signups, unless they are user 6

const restrictToSelf = (req, res, next) => {
  if (req.user.id !== Number(req.params.user_id)) {
    console.log("in if");
    return res.status(403).send({ message: "Forbidden" });
  }
  next();
};

module.exports = restrictToSelf;
