const cloudinary = require("cloudinary");
const fs = require('fs')
const Post = require("../models/post");
const uploadController = {};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,

  secure: true,
});

// Get current user profile
uploadController.uploadImages = async (req, res) => {
  try {
    const { path } = req.body;
    let files = Object.values(req.files).flat();
    let images = [];
    for (const file of files) {
      const url = await uploadToCloudinary(file, path);
      images.push(url);
      removeTmp(file.tempFilePath);
    }
    return res.json(images);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: e.message});
  }
};

module.exports = uploadController;

const uploadToCloudinary = async (file, path) => {
    return new Promise((resolve) => {
      cloudinary.v2.uploader.upload(
        file.tempFilePath,
        {
          folder: path,
        },
        (err, res) => {
          if (err) {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ message: "Upload image failed." });
          }
          resolve({
            url: res.secure_url,
          });
        }
      );
    });
  };
  
  const removeTmp = (path) => {
    fs.unlink(path, (err) => {
      if (err) throw err;
    });
  };
  