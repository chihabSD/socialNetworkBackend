const User = require("../models/user");
var bcrypt = require("bcrypt");
const userController = {};

const {saltPassword, comparePasswords} = require('../helpers/passwordsHandler')

const findUser = require('../helpers/findUser')

// Register new user
userController.register = async (req, res, next) => {
  const { first_name, last_name, email, password, username, bYear, bMonth, bDay, gender } = req.body; // extract them from req.body

  const emailExists = await findUser(email);
  const hashPassword = await saltPassword(password)
  if (emailExists) {
    return res.status(403).send({ error: "Email is already in use " });
  }

  const newUser = new User({
    first_name, last_name, email, password : hashPassword, username, bYear, bMonth, bDay, gender,
  });

  try {
    const user = await newUser.save();
    return res.send({ user }); // response with the user object
  } catch (e) {
    //customization to the errer
    if (e.code === 11000 && e.name === "MongoError") {
      var error = new Error(`Email address is taken`);
      next(error);
    } else {
      next(e); // this is comming from error handling in the file app.js which handle any error
    }
  }
};

// Login 
userController.login = async (req, res, next) => {
  const { email, password } = req.body;

  let incorrect_email_password = " Incorrect email or password";
  try {

    const user = await findUser(email);
    if (!user) {
      return res.status(403).send({ error: incorrect_email_password });
    }

    // Check if passwords match
    const isPasswordMatch = await comparePasswords(password, user.password) 
    if (!isPasswordMatch) {
      console.log("password in correct");
      return res.status(403).send({ error: incorrect_email_password });
    }

    // If logged in , generate JWT token
    return res.status(200).send({ success: ' User loged in' });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

module.exports = userController;