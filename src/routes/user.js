const express = require("express");
const router = express.Router();

const { register, login, activateAccount } = require("../controllers/user");

router.post(`/register`, register);
router.post(`/login`, login);
router.post(`/activateAccount`, activateAccount);

module.exports = router;
