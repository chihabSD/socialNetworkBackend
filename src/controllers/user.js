const User = require("../models/user");

const userController = {};

userController.test = async (req, res, next) => {
  res.send({
    message: " Testing ",
  });
};
module.exports = userController;

userController.register = async (req, res, next) => {
  const { name } = req.body; // extract them from req.body

  console.log(req.body);
  const newUser = new User({
    name,
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
