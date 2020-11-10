const express = require("express");
const { ocrScanning } = require("../../utils/ocrScanning.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").post(protect, ocrScanning);

module.exports = router;
