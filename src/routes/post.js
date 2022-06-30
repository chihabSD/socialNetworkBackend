const express = require("express");
const router = express.Router();

const { createPost, getAllPosts } = require("../controllers/post");
const verifyToken = require("../middlewares/verifyToken");

// create post
router.post("/createPost", verifyToken, createPost);
router.get("/getAllPosts", verifyToken, getAllPosts);


module.exports = router;
