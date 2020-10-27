const express = require("express");
const { emailAttachment } = require("../../utils/emailAttachment.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").post(protect, emailAttachment);

module.exports = router;
