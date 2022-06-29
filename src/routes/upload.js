const express = require("express");
const router = express.Router();

const { uploadImages } = require("../controllers/upload");
const imageUpload = require("../middlewares/imageUpload");
const verifyToken = require("../middlewares/verifyToken");

// create post
router.post("/uploadImages",  imageUpload,  uploadImages);


module.exports = router;


