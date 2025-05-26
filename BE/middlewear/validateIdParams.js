// This middlewear checks that a id is a valid data type (a number), if a string or another data
// type is attempted to be passed it is rejected with `Bad request`
// ...paramKeys and the loop allows it to work for a variety of id types (e.g., user_id, event_id, etc.)

const validateIdParams = (...paramKeys) => {
  return (req, res, next) => {
    for (const key of paramKeys) {
      const id = Number(req.params[key]);

      if (isNaN(id)) {
        return res.status(400).send({ message: `Bad request` });
      }
    }
    next();
  };
};

module.exports = validateIdParams;
