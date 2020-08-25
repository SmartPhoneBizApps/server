const express = require("express");
const { messengerNotify } = require("../../utils/messengerNotify.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").post(protect, messengerNotify);

module.exports = router;
