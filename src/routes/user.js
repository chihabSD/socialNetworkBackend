const express = require("express");
const router = express.Router();

const { register, login, activateAccount, currentProfile, resendToken } = require("../controllers/user");
const verifyToken = require("../middlewares/verifyToken");

router.post(`/register`, register);
router.post(`/login`, login);


//Profile
router.get("/profile", verifyToken, currentProfile);
router.post(`/activateAccount`, verifyToken,  activateAccount);
router.post(`/resendToken`, verifyToken,  resendToken);


module.exports = router;
