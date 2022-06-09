const bcrypt = require('bcrypt')

// compare two passwords
const comparePasswords = async (password, accountPassword) => {
  return await bcrypt.compare(password, accountPassword);
};
// salt the password
const saltPassword = async (newPassword) => {
  const salt = await bcrypt.genSalt(11);
  const hashPassword = await bcrypt.hash(newPassword, salt);
  return hashPassword;
};
module.exports = { comparePasswords, saltPassword };


