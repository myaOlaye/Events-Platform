const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./BE/.env.secrets" });

const authenticate = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ msg: "No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ msg: "Invalid token" });
    } else {
      req.user = decoded;
      next();
    }
  });
};

module.exports = authenticate;
