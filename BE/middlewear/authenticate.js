const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
};

jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
  if (err) {
    return res.status(401).send({ msg: "Invalid token" });
  } else {
    req.user = decoded.user;
    next();
  }
});
