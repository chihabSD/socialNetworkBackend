const Post = require("../models/post");
const postController = {};

const {
  validateEmail,
  findUser,
  validateUsername,
} = require("../helpers/validation");
const { sendVerificationEmail, sendResetCode } = require("../helpers/mailer");
const assigneToken = require("../helpers/assignJWT");
const generateCode = require("../helpers/generateCode");

// Get current user profile
postController.createPost = async (req, res) => {
  try {
    const { user } = req.user;

  } catch (e) {
    console.log(e);
  }
};




module.exports = postController;
