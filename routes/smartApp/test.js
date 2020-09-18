const express = require("express");
const { test } = require("../../controllers/smartApp/test");
const router = express.Router();
router.route("/").get(test);
module.exports = router;
