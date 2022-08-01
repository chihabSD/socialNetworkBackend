const express = require("express");
const router = express.Router();

const {
  register,
  login,
  activateAccount,
  currentProfile,
  resendToken,
  searchUser,
  sendResetPasswordCode,
  verifyCode,
  forgotPasswordChange,
  updateProfilePicture,
} = require("../controllers/user");
const verifyToken = require("../middlewares/verifyToken");

router.post(`/register`, register);
router.post(`/login`, login);

//Profile
router.get("/profile/:username", verifyToken, currentProfile);
router.post(`/activateAccount`, verifyToken, activateAccount);
router.post(`/resendToken`, verifyToken, resendToken);
router.post(`/searchUser`, searchUser);
router.post(`/sendCode`, sendResetPasswordCode);
router.post(`/verifyCode`, verifyCode);
router.post(`/changePassword`, forgotPasswordChange);
router.put(`/updateProfilePicture`, updateProfilePicture);

module.exports = router;
