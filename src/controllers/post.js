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
    console.log(req.body);
    const {text, data} = req.body
    const post = await new Post({user:user._id,text, images:data ? data:[] }).save()
    return res.status(200).json({ msg: "Post created", post });
  } catch (e) {
    console.log(e);
  }
};




module.exports = postController;
