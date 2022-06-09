const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userController = {};

const {saltPassword, comparePasswords} = require('../helpers/passwordsHandler')
const { validateEmail, findUser, validateUsername } = require("../helpers/validation");
const { sendVerificationEmail} = require("../helpers/mailer");
const assigneToken = require("../helpers/assignJWT");


// Register new user
userController.register = async (req, res, next) => {
  const { first_name, last_name, email, password,  bYear, bMonth, bDay, gender } = req.body; // extract them from req.body

  const emailExists = await findUser(email);
  const hashPassword = await saltPassword(password)
 
  const tempUsername = first_name + last_name

  let username = await validateUsername(tempUsername) 
  if (emailExists) {
    return res.status(403).send({ error: "Email is already in use " });
  }


  if(!validateEmail(email)){
    return res.status(400).send({ error: "Invalid email" });
  }
  const newUser = new User({
    first_name, last_name, email, password : hashPassword, username , bYear, bMonth, bDay, gender,
  });

  try {
    const user = await newUser.save();

    const emailVerificationToken = assigneToken.generateToken({ user, expire: "5d" });
    const url = `${process.env.BASE_URL}/${emailVerificationToken}`
    sendVerificationEmail(user.email, user.first_name,url)
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
    const token = assigneToken.generateToken({ user, expire: "5d" });
    user.save();
    return res.status(200).send({success: ' User logged in success',  token });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};


// Activte account
// Login 
userController.activateAccount = async (req, res, next) => {
  const { token } = req.body;

  try {

    // verify if its valid
    const {user} = jwt.verify(token, process.env.SECRET)

    // find user by id
    const check = await findUser(user.email)
    console.log(check);
    if(check.verified){

    return res.status(200).send({ error: ' This account is already activated'});
    }

    check.verified = true;
    await check.save()
    // await User.findByIdAndUpdate(user.verified, { verified:true})
    return res.status(200).send({success: ' Your account is activated'});
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

module.exports = userController;