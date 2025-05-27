const authorise = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).send({ msg: "Forbidden" });
    }
    next();
  };
};

module.exports = authorise;
