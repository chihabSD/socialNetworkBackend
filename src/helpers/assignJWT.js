// const { EXPIRY, SECRET } = require("../config/index");
const jwt = require("jsonwebtoken");
const assigneToken = {};

assigneToken.generateToken = ({ user, expire }) => {
  const secret = process.env.SECRET;
  // const expire = "1d" ;

  const token = jwt.sign({ user }, secret, {
    expiresIn: expire,
  });
  return token;
};

module.exports = assigneToken;