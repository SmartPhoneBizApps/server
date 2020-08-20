const express = require("express");
const { botOptions } = require("../../controllers/smartApp/botOptions");
const router = express.Router();
const { protect } = require("../../middleware/auth");
router.route("/").get(protect, botOptions);
module.exports = router;
