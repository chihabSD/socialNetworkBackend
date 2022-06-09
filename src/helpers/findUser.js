const User = require("../models/user");
const findUser = async (details) => {
  return await User.findOne({ email: details });
};

module.exports = findUser;