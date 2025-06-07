const restrictToSelf = (req, res, next) => {
  const targetId = req.params.user_id || req.body.user_id;
  if (req.user.id !== Number(targetId)) {
    return res.status(403).send({ msg: "Forbidden" });
  }
  next();
};

module.exports = restrictToSelf;
