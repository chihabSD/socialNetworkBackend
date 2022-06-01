const express = require("express");
const router = express.Router();

const { test, register } = require("../controllers/user");
/************************* Account ************************************** */
router.get(`/`, test);
router.post(`/`, register);

module.exports = router;
