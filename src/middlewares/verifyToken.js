const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);
  const secret = process.env.SECRET;
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(401);
    req.user = user;

    next();
  });
};