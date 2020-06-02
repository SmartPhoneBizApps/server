const express = require("express");
const { uploadFile } = require("../../utils/fileupload.js");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../../middleware/auth");

router.route("/").post(uploadFile);

module.exports = router;
