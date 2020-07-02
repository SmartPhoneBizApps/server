const express = require("express");
const { oneDriveUpload } = require("../../utils/oneDriveUpload.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").post(protect, oneDriveUpload);

module.exports = router;
