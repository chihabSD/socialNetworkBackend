const express = require("express");
const router = express.Router();

const { test } = require("../controllers/user");
/************************* Account ************************************** */
router.get(`/`, test);

module.exports = router;
