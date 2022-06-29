const express = require("express");
const router = express.Router();

const { createPost } = require("../controllers/post");
const verifyToken = require("../middlewares/verifyToken");

// create post
router.post("/createPost", verifyToken, createPost);


module.exports = router;
