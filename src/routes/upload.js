const express = require("express");
const router = express.Router();

const { uploadImages, listImages } = require("../controllers/upload");
const imageUpload = require("../middlewares/imageUpload");
const verifyToken = require("../middlewares/verifyToken");

// create post
router.post("/uploadImages",  imageUpload,  uploadImages);
router.get("/listImages",    listImages);


module.exports = router;


