const validateIdParams = (...paramKeys) => {
  return (req, res, next) => {
    for (const key of paramKeys) {
      const id = Number(req.params[key]);

      if (isNaN(id)) {
        return res.status(400).send({ msg: `Bad request` });
      }
    }
    next();
  };
};

module.exports = validateIdParams;
