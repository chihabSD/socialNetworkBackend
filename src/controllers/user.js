const User = require("../models/user");
const Code = require("../models/code");
const Post = require("../models/post");
const jwt = require("jsonwebtoken");
const userController = {};

const {
  saltPassword,
  comparePasswords,
} = require("../helpers/passwordsHandler");
const {
  validateEmail,
  findUser,
  validateUsername,
} = require("../helpers/validation");
const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer");
const assigneToken = require("../helpers/assignJWT");
const generateCode = require("../helpers/generateCode");

// Get current user profile

userController.currentProfile = async (req, res) => {
  try {
    const { user } = req.user;
    const { username } = req.params;

    const option1 = {
      username,
    };
    const option2 = {
      email: user.email,
    };
      // username === "undefined" || username === null ? option2 : option1
    const profile = await User.findOne( {username} ).select("-password");

    if (!profile) {
      return res.status(200).send({ noProfile: true});
    }
    const posts = await Post.find({ user: profile._id }).populate("user");

    return res.status(200).send({ user, posts });
    // res.json({...profile.toObject(),})
  } catch (e) {
    console.log(e);
  }
};

// Register new user
userController.register = async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    password,
    bYear,
    bMonth,
    bDay,
    gender,
  } = req.body; // extract them from req.body

  const emailExists = await findUser(email);
  const hashPassword = await saltPassword(password);

  const tempUsername = first_name + last_name;
  const exmailExists =
    "This email already exists, try with a different email address";
  let username = await validateUsername(tempUsername);
  if (emailExists) {
    return res.status(403).send({ error: exmailExists });
  }

  if (!validateEmail(email)) {
    return res.status(400).send({ error: "Invalid email" });
  }
  const newUser = new User({
    first_name,
    last_name,
    email,
    password: hashPassword,
    username,
    bYear,
    bMonth,
    bDay,
    gender,
  });

  try {
    const user = await newUser.save();

    const emailVerificationToken = assigneToken.generateToken({
      user,
      expire: "1m",
    });
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    return res.send({ msg: " Register sucess ! please activate your email" }); // response with the user object
  } catch (e) {
    //customization to the errer
    if (e.code === 11000 && e.name === "MongoError") {
      var error = new Error(emailExists);
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

    // Check if passwords matches
    const isPasswordMatch = await comparePasswords(password, user.password);
    if (!isPasswordMatch) {
      console.log("password in correct");
      return res.status(403).send({ error: incorrect_email_password });
    }

    // check if account is activated
    // if (!user.verified) {
    //   return res.status(403).send({ error: " Please verify your account, check your email for verification or request new one " });
    // }
    // If logged in , generate JWT token
    const token = assigneToken.generateToken({ user, expire: "5d" });
    user.save();
    return res.status(200).send({ user, token });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

// Activte account
// Login
userController.activateAccount = async (req, res, next) => {
  const { token } = req.body;
  const currentUser = req.user;
  try {
    // check we have a token
    var parts = token.split(".");

    if (parts.length !== 3) {
      return res.status(400).send({ error: " Invalid verification code" });
    }
    // verify if its valid
    const { user } = jwt.verify(token, process.env.SECRET);

    // find user by id
    const check = await findUser(user.email);
    // if(!user){
    //   return res.status(400).send({ msg: " Activation code is broken or invalid " });
    // }
    if (!check) {
      return res.status(400).send({ msg: "This user does not exist anymore" });
    }

    console.log(currentUser.user._id, user._id);
    if (currentUser.user._id !== user._id) {
      return res.status(400).send({
        msg: "You don't have the authorization to complete this operation",
      });
    }
    if (check.verified) {
      return res
        .status(200)
        .send({ msg: " This account is already activated" });
    }

    check.verified = true;
    await check.save();
    // await User.findByIdAndUpdate(user.verified, { verified:true})
    return res.status(200).send({ msg: " Your account is activated" });
  } catch (e) {
    console.log("The error name", e.name);
    if (e.name === "TokenExpiredError") {
      return res
        .status(400)
        .send({ error: " Activation code is broken or invalid " });
    }
    return next(e);
  }
};

// Resend token
userController.resendToken = async (req, res, next) => {
  const currentUser = req.user;
  try {
    const user = await findUser(currentUser.user.email);

    if (user.verified) {
      return res
        .status(400)
        .send({ msg: " This account is already activated" });
    }
    const emailVerificationToken = assigneToken.generateToken({
      user,
      expire: "5m",
    });
    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
    sendVerificationEmail(user.email, user.first_name, url);
    return res.send({ msg: " Please activate your email" }); // response with the user object
    // check we have a token
    // var parts = token.split(".");

    // if (parts.length !== 3) {
    //   return res.status(400).send({ error: " Invalid verification code" });
    // }
    // // verify if its valid
    // const { user } = jwt.verify(token, process.env.SECRET);

    //  // find user by id
    // const check = await findUser(user.email);
    // // if(!user){
    // //   return res.status(400).send({ msg: " Activation code is broken or invalid " });
    // // }
    // if(!check){
    //   return res
    //   .status(400)
    //   .send({ msg: "This user does not exist anymore" });
    // }

    // if(currentUser._id !== check._id){
    //   console.log('unautorized');
    //   return res
    //   .status(400)
    //   .send({ msg: "You don't have the authorization to complete this operation" });
    // }

    // if (check.verified) {
    //   return res
    //     .status(200)
    //     .send({ msg: " This account is already activated" });
    // }

    // check.verified = true;
    // await check.save();
    // // await User.findByIdAndUpdate(user.verified, { verified:true})
    // return res.status(200).send({ msg: " Your account is activated" });
  } catch (e) {
    console.log("The error name", e.name);
    if (e.name === "TokenExpiredError") {
      return res
        .status(400)
        .send({ error: " Activation code is broken or invalid " });
    }
    return next(e);
  }
};

// Search User
userController.searchUser = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).send({
        message: "Email is missing",
      });
    const user = await findUser(email);
    if (!user) {
      return res.status(403).send({ error: " This user does not exist" });
    }

    return res.status(200).send({
      user,
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};
userController.sendResetPasswordCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(403).send({ error: " This user does not exist" });
    }
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);

    const newCode = new Code({
      code,
      user: user._id,
    });
    await newCode.save();
    sendResetCode(user.email, user.first_name, code);
    return res.status(200).send({
      msg: "Email reset code has been sent to your email ",
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

userController.verifyCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const dCode = await Code.findOne({ user: user._id });

    if (!user) {
      return res.status(403).send({ error: " This user does not exist" });
    }

    if (dCode.code !== code) {
      return res.status(403).send({ error: " Verification code is wrong" });
    }

    return res.status(200).send({
      msg: "Email reset code has been sent to your email ",
    });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

userController.forgotPasswordChange = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashPassword = await saltPassword(password);
    await User.findOneAndUpdate(
      { email },
      {
        password: hashPassword,
      }
    );
    return res.status(200).json({ msg: "Your password was changed" });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

module.exports = userController;
